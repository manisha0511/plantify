# Plantify — Personal Learning Notes
## Module 05: Large Catalog Management, Multi-Criteria Filtering & E-Commerce UX

### 1. Architectural Concepts Explained

#### A. The Declarative Filtering Pipeline
In modern React, filtering a large dataset is implemented declaratively as a pure pipeline:
```javascript
Raw Data (100 Plants) ──► Filter Pipeline ──► Sort Pipeline ──► Paginated Slice ──► UI Cards
```

1. **Declarative vs. Imperative:** Instead of manually adding or removing DOM nodes or mutating array elements, we compute derived state from existing state variables (`plants`, `selectedCategory`, `selectedLight`, etc.):
   ```javascript
   const filteredPlants = plants.filter((plant) => {
     // Check search term match
     // Check category match
     // Check environment match
     // Check sunlight, water, difficulty, and price matches
     // Check boolean flag (petFriendly)
     return isMatch;
   });
   ```
2. **Immutability Principle:** Filtering does **not** modify the original `plants` array in memory. `Array.prototype.filter()` returns a new array reference containing only the elements that satisfy the compound predicate.

---

#### B. Sorting Mechanics & Pitfalls in JavaScript
1. **The In-Place Mutation Trap:**
   `Array.prototype.sort()` sorts elements *in place*, mutating the original array! In React, mutating state directly leads to subtle rendering bugs.
   **Solution:** Always create a shallow copy first using array spread:
   ```javascript
   // Safe: preserves the filteredPlants array reference
   const sortedPlants = [...filteredPlants].sort((a, b) => {
     if (sortBy === 'price-asc') return a.price - b.price;
     if (sortBy === 'price-desc') return b.price - a.price;
     if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
     return 0; // default order
   });
   ```
2. **String Sorting with `localeCompare`:**
   Never use subtraction `a.name - b.name` for strings (which results in `NaN`). Always use `a.name.localeCompare(b.name)` for accurate alphabetical sorting that respects accented characters and capitalization.

---

#### C. Slicing & Pagination ("Load More" Pattern)
1. **Windowing / Slicing:**
   Instead of overwhelming the DOM with all 100 elements at once, we use `slice(0, visibleCount)` to render an initial batch of 12 items.
2. **Dynamic Load More:**
   When the user clicks "Load More Plants", `setVisibleCount((prev) => prev + 12)` expands the slice window without page reloads.
3. **Reactive Filter Reset:**
   When the user applies a new filter or changes the sorting order, an effect hook resets `visibleCount` to 12 so the user always begins at the top of their newly filtered selection:
   ```javascript
   useEffect(() => {
     setVisibleCount(12);
   }, [selectedCategory, selectedEnvironment, selectedLight, selectedWater, selectedDifficulty, selectedPriceRange, petFriendlyOnly, searchQuery, sortBy]);
   ```

---

### 2. Accessible Modal Dialog Architecture (`Modal.jsx`)

Modals are often built poorly in web apps. An enterprise-grade accessible modal must satisfy three strict requirements:

1. **Accessibility Semantics (ARIA):**
   * `role="dialog"` tells assistive technologies that an interactive overlay has taken focus.
   * `aria-modal="true"` informs screen readers that background content is temporarily inert.
   * `aria-labelledby="modal-dialog-title"` programmatically ties the modal heading to the dialog.

2. **Body Scroll Lock:**
   When a modal opens, background scrolling must be frozen to prevent confusing dual-scroll behavior:
   ```javascript
   useEffect(() => {
     if (isOpen) {
       document.body.style.overflow = 'hidden';
     }
     return () => {
       document.body.style.overflow = 'unset';
     };
   }, [isOpen]);
   ```

3. **Keyboard Dismissal & Event Propagation Isolation:**
   * Listening to the `Escape` key allows users to dismiss modals comfortably without hunting for an ✕ button.
   * Clicking the darkened overlay dismisses the modal, but clicks *inside* the modal dialog content must call `e.stopPropagation()` so the click doesn't bubble up and unintentionally close the dialog.

---

### 3. E-Commerce UI/UX Architecture: Myntra-Inspired Browsing

| Feature | Desktop Implementation | Mobile / Tablet Implementation (`<= 768px`) |
| :--- | :--- | :--- |
| **10 Category Visual Tiles** | Responsive CSS Grid (`repeat(auto-fill, minmax(105px, 1fr))`) | Horizontal touch-scrollable row (`overflow-x: auto; flex-wrap: nowrap;`) with circular avatar thumbnails |
| **Filter Navigation** | Sticky Left Sidebar (`position: sticky; top: 90px`) keeping filters accessible during long catalog scrolling | Responsive stacked container above the product grid |
| **Active Filter Chips** | Interactive tags with one-click `✕` dismiss and `Clear All` reset button | Compact inline pill tags with touch-friendly dismissal |
| **Catalog Toolbar** | Result counter + sorting dropdown inline | Flexibly wrapped toolbar controls |
| **Quick View Dialog** | Side-by-side 2-column layout (Large product imagery + complete botanical specs) | Single-column stacked modal dialog with automatic vertical scroll |

---

### 4. Data Transparency & Professional Engineering Ethics

* **Demo Metrics Transparency:** In learning projects and portfolio applications, demo inventory metrics (such as customer ratings, review counts, and dummy prices) must be clearly labeled as demo data. Deceptive claims such as "Verified Real Purchase" or artificial customer reviews violate engineering ethics.
* **Dual-Provider Architecture:** In Plantify, users can switch at any time between:
  1. **🌱 Curated Nursery Catalog (100 Specimens):** Rich e-commerce browsing with photos, tags, care specs, and shopping filters.
  2. **🌐 Live iNaturalist API:** Direct connection to the worldwide open biodiversity network querying real-world field observations.
