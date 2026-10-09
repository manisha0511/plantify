# Plantify — Personal Learning Notes
## Module 07: Full-Stack E-Commerce Architecture with Spring Boot 3, MySQL 8 & Stateless JWT Security

### 1. High-Level Full-Stack Architecture Overview

Plantify is engineered as a decoupled modern full-stack web application:

```
[ Browser: React 19 + Vite ] (Port 5174)
           │
           │ HTTP / REST + JSON
           │ Authorization: Bearer <JWT_TOKEN>
           ▼
[ API Gateway / Spring Security Filter Chain ] (Port 8080)
           │
  ┌────────┼───────────────────────────┐
  ▼        ▼                           ▼
[ Auth ] [ Product / Catalog ]   [ Cart & Order Engine ]
  │        │                           │
  └────────┼───────────────────────────┘
           │
     Spring Data JPA (Hibernate 6)
           │
           ▼
[ MySQL 8.0 Database: plantify_db ] (Port 3306)
```

1. **Frontend Layer:** React 19 single-page application built with Vite, styled with custom CSS variables (forest green `#16302B`, sage `#9CAF88`, burnt amber `#CC5500`), communicating asynchronously via `plantifyApi.js` with automated JWT header injection.
2. **Backend Application Layer:** Java 21 & Spring Boot 3.3.4 running embedded Apache Tomcat, providing stateless RESTful API endpoints at `/api/**`.
3. **Persistence Layer:** MySQL 8.0 with dedicated database user `plantify_user`, managed through Spring Data JPA / Hibernate 6 ORM with automatic schema updates (`ddl-auto: update`) and transactional guarantees (`@Transactional`).

---

### 2. Spring Security 6 & Stateless JWT Authentication

#### A. Why Stateless Authentication for E-Commerce?
Traditional session-based authentication stores user session data in server memory (HTTP Session). In modern cloud environments or multi-instance deployments, this requires sticky sessions or centralized Redis session stores. 

With stateless **JSON Web Tokens (JWT)**:
- The server does not store active session records in RAM.
- When the user signs in with email and password, the server verifies BCrypt hash, signs a tamper-proof cryptographically signed token containing user claims (`sub`, `roles`, `iat`, `exp`), and returns it to the client.
- The client passes this token in the HTTP `Authorization: Bearer <token>` header on subsequent requests.
- The server decodes and validates the signature in microseconds using its private secret key.

#### B. The Filter Chain Architecture (`SecurityConfig.java`)
In Spring Security 6, XML configuration and `WebSecurityConfigurerAdapter` are deprecated. Security is configured declaratively using `@Bean SecurityFilterChain`:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable()) // Disabled for stateless REST APIs using JWT
        .sessionManagement(session -> 
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .authorizeHttpRequests(auth -> auth
            // Public read access to catalog
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories/**").permitAll()
            
            // Protected customer endpoints
            .requestMatchers("/api/cart/**", "/api/orders/**", "/api/wishlist/**").hasAnyRole("CUSTOMER", "ADMIN")
            
            // Administrative console
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
```

#### C. Password Hashing with BCrypt
Passwords are never stored in plain text. Spring's `BCryptPasswordEncoder(12)` incorporates a random cryptographic salt and 12 work rounds, rendering rainbow table and brute-force attacks computationally infeasible.

---

### 3. JPA Entities & Hibernate 6 Gotchas

#### A. Database Normalization & Foreign Key Relationships
1. **User (`users`)**: Stores credentials, role (`CUSTOMER` or `ADMIN`), active status, timestamps.
2. **Address (`addresses`)**: One-to-many relationship with user. Marked with `isDefault` flag for one-click checkout.
3. **Category (`categories`)**: Botanical classifications with slug, icon, and banner image.
4. **Product (`products`)**: 100 verified specimens with pricing, botanical specs (light, water, environment, difficulty), stock quantity, and active flag.
5. **Cart & CartItem (`carts`, `cart_items`)**: Transient shopping state with unique constraint on `(cart_id, product_id)`.
6. **Order & OrderItem (`orders`, `order_items`)**: Immutable financial and transactional records.

#### B. The Hibernate 6 Floating-Point Precision Trap
In older Hibernate versions, annotating a `Double` column with `@Column(precision = 3, scale = 2)` was accepted. In **Hibernate 6 (Spring Boot 3)**, this throws an immediate fatal startup error:
```
IllegalArgumentException: scale has no meaning for SQL floating point types
```
**Fix:** For floating-point types (`Double`, `Float`), use plain `@Column(name = "rating")`. Use `BigDecimal` with `@Column(precision = 10, scale = 2)` strictly for monetary fields (`price`, `totalAmount`, `shippingAmount`).

#### C. Open Session in View (`open-in-view: true`) & Lazy Loading
When rendering DTOs containing related entities (e.g. `product.getCategory().getName()`), accessing un-fetched lazy collections outside an active transaction throws `LazyInitializationException`. We configured:
```yaml
spring:
  jpa:
    open-in-view: true
```
And mapped frequently accessed relationships like `Product.category` with `FetchType.EAGER` to guarantee smooth, deterministic JSON serialization.

---

### 4. Critical E-Commerce Business Rules

#### Rule 1: Never Trust Client-Side Prices
A malicious user can alter JavaScript variables or modify HTTP payload prices to `₹1.00`.
- **Backend Guard:** When placing an order (`POST /api/orders`) or adding to cart, the client sends only the `productId` and `quantity`.
- The server retrieves the verified price directly from `ProductRepository`, recalculates `unitPrice * quantity`, computes shipping rules (`subtotal >= ₹500 ? FREE : ₹40`), and sets the final immutable ledger total.

#### Rule 2: Transactional Stock Reservation (`@Transactional`)
When two users order the last plant simultaneously:
```java
@Transactional
public OrderResponse createOrder(Long userId, CreateOrderRequest req) {
    for (CartItem item : cart.getItems()) {
        Product product = item.getProduct();
        if (product.getStockQuantity() < item.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock for " + product.getName());
        }
        // Atomic decrement
        product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
        productRepository.save(product);
    }
    ...
}
```
If any item fails stock verification or the database connection drops during order creation, Spring automatically rolls back all table updates, preventing inventory corruption.

#### Rule 3: Immutable Historical Snapshots
If a product's price or description changes next month, or a user edits their street address, past orders must **not** change.
- `OrderItem` stores frozen copies of `productName`, `productImage`, and `unitPrice`.
- `Order` stores a frozen text snapshot of `deliveryAddressSnapshot` and `customerPhone`.

#### Rule 4: Restoring Inventory on Order Cancellation
When a customer or admin cancels an order before shipment (`PENDING` or `PROCESSING`):
1. The status transitions to `CANCELLED`.
2. All reserved quantities in `order.getItems()` are added back to their respective `product.stockQuantity`.
3. If an order has already transitioned to `SHIPPED` or `DELIVERED`, cancellation is rejected with `BadRequestException`.

---

### 5. Frontend & Backend Seamless Integration

#### A. Centralized API Client (`plantifyApi.js`)
Instead of scattered `fetch` calls across components, all communication flows through a unified service with automatic token injection:

```javascript
// Automatically attach JWT from localStorage
const token = localStorage.getItem('plantify_token');
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

#### B. React Context Authentication (`AuthContext.jsx`)
Maintains global authentication state across the application:
- `user`: Authenticated user profile (`id`, `fullName`, `email`, `role`).
- `token`: Cryptographic JWT string stored in `localStorage`.
- `login(email, password)`: Submits credentials, stores token, updates user profile.
- `logout()`: Clears token and state, redirects to catalog.
- `isAdmin`: Computed boolean flag (`role === 'ADMIN'`).
- Automatic guest cart merge upon login.

#### C. Role-Based View Rendering
- When signed in as a regular customer, the user menu provides **My Profile**, **Saved Addresses**, and **Order History** with live tracking badges and cancellation buttons.
- When signed in as an administrator (`admin@plantify.com`), a dedicated golden **⚡ ADMIN** badge appears in the navbar, providing access to real-time sales revenue, inventory counts, product catalog CRUD, and one-click order status dispatch transitions.

---

### 6. Credentials & Environment Security

| Component | Setting / Variable | Development Value | Production Recommendation |
| :--- | :--- | :--- | :--- |
| **Backend Port** | `SERVER_PORT` | `8080` | `8080` behind NGINX / Cloudflare |
| **Frontend Port** | `VITE_PORT` | `5174` | `443` (HTTPS) |
| **Database Host** | `DB_URL` | `jdbc:mysql://localhost:3306/plantify_db` | AWS RDS / Managed MySQL |
| **Database User** | `DB_USERNAME` | `plantify_user` | Least-privilege managed IAM user |
| **Database Pass** | `DB_PASSWORD` | `plantify_pass_2026` | Vault / AWS Secrets Manager |
| **JWT Secret** | `JWT_SECRET` | 256-bit Hex Key | Environment Variable, 512-bit |
| **JWT Expiration**| `JWT_EXPIRATION`| 86400000 ms (24 hours) | 1 hour + Refresh Token rotation |
| **Default Admin** | `admin@plantify.com` | `Admin@Plantify2026!` | Reset password on first boot |
