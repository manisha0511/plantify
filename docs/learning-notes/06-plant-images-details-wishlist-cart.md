# Plantify — Personal Learning Notes
## Module 06: Botanical Image Auditing, Dedicated Details View, Wishlist & Cart Persistence

### 1. Botanical Image Quality Control & The Defensive Image Pipeline

#### A. Why Unrelated Images Occur in Mock Datasets
In rapid prototype development, placeholder image URLs copied without visual inspection can point to completely unrelated subjects (e.g., Unsplash photo IDs that actually depict hamburgers, dumplings, cottages, or bears).
* **The Audit Process:** We downloaded and inspected each unique image URL in the catalog.
* **The Resolution:** All 100 plant entries in `src/data/plants.js` and all 10 category tiles in `src/data/categories.js` were mapped to verified botanical specimens queried directly from the open **iNaturalist Open Data** archives and verified botanical captures.

#### B. The Infinite Loop Trap in Image Error Handling
A common bug in React occurs when an `onError` handler replaces a broken `src` with another URL that also fails to load:
```javascript
// DANGEROUS: If fallback.jpg is broken or blocked, this fires infinitely!
<img src={url} onError={(e) => { e.currentTarget.src = 'fallback.jpg'; }} />
```

**The Enterprise Solution (Defensive Fallback with Circuit Breaker):**
```javascript
<img
  src={plant.image}
  alt={plant.name}
  onError={(e) => {
    // Check if the fallback was already attempted on this image element
    if (e.currentTarget.dataset.fallbackTried) return;
    e.currentTarget.dataset.fallbackTried = 'true';
    e.currentTarget.src = '/botanical-placeholder.svg';
  }}
/>
```
1. `data-fallback-tried="true"` ensures the browser will never attempt to reload the fallback if the fallback itself ever failed.
2. `/botanical-placeholder.svg` is an inline vector SVG stored in the local `public/` directory, requiring zero network connection and rendering crisply at any DPI.

---

### 2. Client-Side Hash Routing Without Bloat

Instead of installing external routing libraries before needing complex nested routes, we can achieve responsive view navigation and full browser history support (Back/Forward buttons, bookmarking) using standard browser hash routing:

```javascript
// Listen to URL hash changes: #/plant/12, #/cart, #/wishlist, #/
useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash;
    if (hash.startsWith('#/plant/')) {
      const id = hash.replace('#/plant/', '');
      const found = plants.find((p) => String(p.id) === String(id));
      if (found) {
        setSelectedDetailPlant(found);
        setActiveView('details');
        window.scrollTo(0, 0);
        return;
      }
    } else if (hash === '#/cart') {
      setActiveView('cart');
      window.scrollTo(0, 0);
    } else if (hash === '#/wishlist') {
      setActiveView('wishlist');
      window.scrollTo(0, 0);
    } else {
      setActiveView('catalog');
    }
  };

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
  return () => window.removeEventListener('hashchange', handleHashChange);
}, [plants]);
```

**Advantages:**
1. Zero extra npm dependencies (`0 kB` added to bundle).
2. Deep linking works out of the box (e.g. sharing `#/plant/11` directly opens the Monstera Deliciosa page).
3. Browser Back and Forward buttons work seamlessly.

---

### 3. State Persistence with `localStorage`

To ensure users do not lose their cart items or wishlist favorites when refreshing the browser or navigating views, we synchronize React state with the browser's `localStorage` API.

#### A. Lazy Initializer Pattern
Never read `localStorage` inside the component render body—it causes unnecessary disk I/O on every render. Pass an initializer function to `useState`:
```javascript
// Reads from localStorage only once on mount!
const [cartItems, setCartItems] = useState(() => {
  try {
    const saved = localStorage.getItem('plantify_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('Failed to parse cart from storage:', error);
    return [];
  }
});
```

#### B. Reactive Synchronization
Sync state to storage in an effect:
```javascript
useEffect(() => {
  try {
    localStorage.setItem('plantify_cart', JSON.stringify(cartItems));
  } catch (error) {
    console.warn('Failed to save cart to storage:', error);
  }
}, [cartItems]);
```

---

### 4. E-Commerce Cart & Wishlist Logic

#### A. Quantity Merging
When adding a plant that already exists in the cart, we increment its `quantity` instead of pushing duplicate lines:
```javascript
const handleAddToCart = (plant, quantity = 1) => {
  setCartItems((prev) => {
    const existingIndex = prev.findIndex((item) => String(item.plant.id) === String(plant.id));
    if (existingIndex >= 0) {
      const updated = [...prev];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
      };
      return updated;
    }
    return [...prev, { plant, quantity }];
  });
};
```

#### B. Subtotal & Shipping Threshold Calculation
```javascript
const subtotal = cartItems.reduce((sum, item) => sum + (item.plant.price * item.quantity), 0);
// Free shipping for orders $50 or more
const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 5.00;
const total = subtotal + shipping;
```

---

### 5. Ethical Transparency in E-Commerce Prototypes
* **Simulation Notice:** Catalog prices, orders, and review scores are explicitly labeled as prototype simulation metrics for UI validation.
* **No False Claims:** Checkout simulation makes it clear to users and evaluators that no payment processing is active and no real deliveries are scheduled.
