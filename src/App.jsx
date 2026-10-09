import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PlantCard from './components/PlantCard.jsx';
import Button from './components/Button.jsx';
import Badge from './components/Badge.jsx';
import Rating from './components/Rating.jsx';
import Modal from './components/Modal.jsx';
import PlantDetailsView from './components/PlantDetailsView.jsx';
import WishlistView from './components/WishlistView.jsx';
import CartView from './components/CartView.jsx';
import AccountView from './components/AccountView.jsx';
import AdminView from './components/AdminView.jsx';
import AIAssistant from './pages/AIAssistant.jsx';
import MyPlants from './pages/account/MyPlants.jsx';
import AuthModal from './components/AuthModal.jsx';
import ForFarmersSection from './components/ForFarmersSection.jsx';
import AboutSection from './components/AboutSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import PlantImage from './components/PlantImage.jsx';
import { plantService } from './services/plantService.js';
import plantifyApi from './services/plantifyApi.js';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { isAuthenticated, openLoginModal } = useAuth();

  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Real API & Data Source state
  const [dataSource, setDataSource] = useState('Curated 100-Specimen Catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProvider, setActiveProvider] = useState('curated'); // 'curated' | 'api'
  
  // Data loading & error states
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Active View Routing: 'catalog' | 'details' | 'cart' | 'wishlist'
  const [activeView, setActiveView] = useState('catalog');
  const [activeSection, setActiveSection] = useState('home');
  const [selectedDetailPlant, setSelectedDetailPlant] = useState(null);
  const [selectedAiPlant, setSelectedAiPlant] = useState(null);
  const [aiAssistantTab, setAiAssistantTab] = useState('chat');

  // Myntra-inspired Catalog Filtering & Sorting State
  const [selectedEnvironment, setSelectedEnvironment] = useState('all'); // 'all' | 'Indoor' | 'Outdoor'
  const [selectedLight, setSelectedLight] = useState('all'); // 'all' | 'low' | 'medium' | 'bright' | 'sun'
  const [selectedWater, setSelectedWater] = useState('all'); // 'all' | 'low' | 'moderate' | 'high'
  const [selectedDifficulty, setSelectedDifficulty] = useState('all'); // 'all' | 'easy' | 'moderate' | 'expert'
  const [selectedPriceRange, setSelectedPriceRange] = useState('all'); // 'all' | 'under-30' | '30-60' | 'over-60'
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest' | 'rating-desc'

  // Pagination / Load More state
  const [visibleCount, setVisibleCount] = useState(12);

  // Quick View Modal state
  const [quickViewPlant, setQuickViewPlant] = useState(null);

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('plantify_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted in localStorage)
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('plantify_wishlist');
      return saved ? JSON.parse(saved) : [1, 11]; // default sample favorites
    } catch {
      return [1, 11];
    }
  });

  const [notification, setNotification] = useState(null);

  // Persist Cart to localStorage ONLY for guest sessions
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem('plantify_cart', JSON.stringify(cartItems));
      } catch (e) {
        console.warn('Unable to persist cart to localStorage', e);
      }
    }
  }, [cartItems, isAuthenticated]);

  // Persist Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('plantify_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('Unable to persist wishlist to localStorage', e);
    }
  }, [wishlistIds]);

  // Total counts for Navbar badges
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlistIds.length;

  // Fetch data via Spring Boot REST API with fallback to plantService
  const loadData = async (query = '', shouldSimulateError = false, forceCurated = false) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (forceCurated || activeProvider === 'curated') {
        // Attempt fetch from Spring Boot REST API first
        try {
          const [apiPlants, apiCategories] = await Promise.all([
            plantifyApi.getProducts(),
            plantifyApi.getCategories(),
          ]);
          if (apiPlants && apiPlants.length > 0) {
            setPlants(apiPlants);
            if (apiCategories && apiCategories.length > 0) {
              setCategories(apiCategories);
            }
            setDataSource('Spring Boot 3 MySQL API (Port 8080)');
            setIsLoading(false);
            return;
          }
        } catch (apiErr) {
          console.warn('Backend API connection fallback to local catalog:', apiErr.message);
        }

        const [fetchedPlants, fetchedCategories] = await Promise.all([
          plantService.getCuratedPlants(),
          plantService.getCategories(),
        ]);
        setPlants(fetchedPlants);
        setCategories(fetchedCategories);
        setDataSource('Curated 100-Specimen Catalog');
      } else {
        const [apiResult, fetchedCategories] = await Promise.all([
          plantService.getPlants({ query, limit: 30, simulateError: shouldSimulateError }),
          plantService.getCategories(),
        ]);
        setPlants(apiResult.plants);
        setCategories(fetchedCategories);
        setDataSource(apiResult.source);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to connect to botanical catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeProvider]);

  // Helper to synchronize local cart state with authoritative backend CartDTO
  const syncCartFromDto = (backendCart) => {
    if (!backendCart || !backendCart.items || backendCart.items.length === 0) {
      setCartItems([]);
      return;
    }
    const mapped = backendCart.items.map((it) => {
      const matchedPlant = plants.find((p) => p.id === it.productId);
      return {
        backendItemId: it.id,
        quantity: it.quantity,
        inStock: it.inStock,
        plant: matchedPlant || {
          id: it.productId,
          name: it.productName,
          slug: it.productSlug,
          image: it.productImage,
          price: it.unitPrice,
          stockQuantity: it.maxStock,
        },
      };
    });
    setCartItems(mapped);
  };

  // Synchronize authenticated user wishlist & cart with Spring Boot backend
  useEffect(() => {
    if (isAuthenticated) {
      // 1. Wishlist Sync
      plantifyApi.getWishlist().then((items) => {
        if (items && items.length > 0) {
          setWishlistIds(items.map((it) => it.productId));
        }
      }).catch(console.warn);

      // 2. Cart Sync
      const syncCart = async () => {
        try {
          // If there were genuine guest items saved in localStorage, safely merge them
          const savedGuestCart = localStorage.getItem('plantify_cart');
          let guestItems = [];
          try {
            guestItems = savedGuestCart ? JSON.parse(savedGuestCart) : [];
          } catch {}

          if (guestItems.length > 0) {
            const payload = guestItems
              .map((it) => ({
                productId: it.plant?.id || it.productId,
                quantity: it.quantity,
              }))
              .filter((it) => it.productId && it.quantity > 0);

            if (payload.length > 0) {
              await plantifyApi.mergeGuestCart(payload);
            }
            localStorage.removeItem('plantify_cart');
          }

          // Fetch authoritative persisted cart from MySQL
          const backendCart = await plantifyApi.getCart();
          syncCartFromDto(backendCart);
        } catch (err) {
          console.warn('Error syncing backend cart:', err);
        }
      };

      syncCart();
    } else {
      // When unauthenticated/logged out, isolate sessions:
      // Load only genuine guest items from localStorage, preventing user cart leaks
      try {
        const savedGuestCart = localStorage.getItem('plantify_cart');
        setCartItems(savedGuestCart ? JSON.parse(savedGuestCart) : []);
      } catch {
        setCartItems([]);
      }
    }
  }, [isAuthenticated, plants.length]);

  // Sync active view with window.location.hash for back/forward browser support
  // Sync active view with window.location.hash for back/forward browser support and direct links
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash || '';
      const cleanHash = rawHash.replace(/^#\/?/, '');

      if (rawHash.startsWith('#/plant/')) {
        const id = rawHash.replace('#/plant/', '');
        const found = plants.find((p) => String(p.id) === String(id));
        if (found) {
          setSelectedDetailPlant(found);
          setActiveView('details');
          window.scrollTo(0, 0);
          return;
        }
      } else if (cleanHash === 'cart') {
        setActiveView('cart');
        window.scrollTo(0, 0);
        return;
      } else if (cleanHash === 'wishlist') {
        setActiveView('wishlist');
        window.scrollTo(0, 0);
        return;
      } else if (cleanHash === 'my-plants') {
        if (!isAuthenticated) {
          openLoginModal();
        } else {
          setActiveView('my-plants');
          window.scrollTo(0, 0);
        }
        return;
      } else if (cleanHash === 'account') {
        setActiveView('account');
        window.scrollTo(0, 0);
        return;
      } else if (cleanHash === 'admin') {
        setActiveView('admin');
        window.scrollTo(0, 0);
        return;
      } else if (cleanHash === 'plant-health') {
        setAiAssistantTab('diagnosis');
        setActiveView('ai-assistant');
        window.scrollTo(0, 0);
        return;
      } else if (cleanHash === 'ai-assistant') {
        setAiAssistantTab('chat');
        setActiveView('ai-assistant');
        window.scrollTo(0, 0);
        return;
      } else {
        // Any anchor on catalog page: #for-farmers, #about, #contact, #ai-assistant, #plants, #home
        setActiveView('catalog');

        let targetId = null;
        if (cleanHash === 'for-farmers') {
          targetId = 'for-farmers';
          setActiveSection('for-farmers');
        } else if (cleanHash === 'about') {
          targetId = 'about';
          setActiveSection('about');
        } else if (cleanHash === 'contact') {
          targetId = 'contact';
          setActiveSection('contact');
        } else if (cleanHash === 'ai-assistant') {
          targetId = 'ai-assistant';
          setActiveSection('ai-assistant');
        } else if (cleanHash === 'plants') {
          targetId = 'plants';
          setActiveSection('plants');
        } else {
          setActiveSection('home');
          if (cleanHash === 'home') targetId = 'home';
        }

        if (targetId) {
          let attempts = 0;
          const maxAttempts = 15;
          const tryScroll = () => {
            const el = document.getElementById(targetId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'home') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (attempts < maxAttempts) {
              attempts++;
              setTimeout(tryScroll, 60);
            }
          };
          setTimeout(tryScroll, 40);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Execute immediately on mount or hash change without waiting for catalog loading
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [plants]);

  // Initialize filters & search from URL search parameters on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('search');
      const cat = params.get('category');
      const env = params.get('env') || params.get('environment');
      const light = params.get('light');
      const water = params.get('water');
      const diff = params.get('difficulty');
      const price = params.get('price');
      const sort = params.get('sort') || params.get('sortBy');
      const pet = params.get('petFriendly');
      const inStock = params.get('inStock');

      if (q) setSearchQuery(q);
      if (cat) setSelectedCategory(cat);
      if (env) setSelectedEnvironment(env);
      if (light) setSelectedLight(light);
      if (water) setSelectedWater(water);
      if (diff) setSelectedDifficulty(diff);
      if (price) setSelectedPriceRange(price);
      if (sort) setSortBy(sort);
      if (pet === 'true') setPetFriendlyOnly(true);
      if (inStock === 'true') setInStockOnly(true);
    } catch (e) {
      console.warn('Unable to parse URL parameters', e);
    }
  }, []);

  // Synchronize active filters & search to browser URL search parameters
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedEnvironment && selectedEnvironment !== 'all') params.set('environment', selectedEnvironment);
      if (selectedLight && selectedLight !== 'all') params.set('light', selectedLight);
      if (selectedWater && selectedWater !== 'all') params.set('water', selectedWater);
      if (selectedDifficulty && selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
      if (selectedPriceRange && selectedPriceRange !== 'all') params.set('price', selectedPriceRange);
      if (sortBy && sortBy !== 'featured') params.set('sort', sortBy);
      if (petFriendlyOnly) params.set('petFriendly', 'true');
      if (inStockOnly) params.set('inStock', 'true');

      const qs = params.toString() ? `?${params.toString()}` : '';
      const newUrl = `${window.location.pathname}${qs}${window.location.hash || ''}`;
      window.history.replaceState(null, '', newUrl);
    } catch (e) {
      console.warn('Unable to sync URL search parameters', e);
    }
  }, [
    searchQuery,
    selectedCategory,
    selectedEnvironment,
    selectedLight,
    selectedWater,
    selectedDifficulty,
    selectedPriceRange,
    sortBy,
    petFriendlyOnly,
    inStockOnly,
  ]);

  // Reset pagination to 12 whenever filters or sorting change
  useEffect(() => {
    setVisibleCount(12);
  }, [
    selectedCategory,
    selectedEnvironment,
    selectedLight,
    selectedWater,
    selectedDifficulty,
    selectedPriceRange,
    petFriendlyOnly,
    inStockOnly,
    searchQuery,
    sortBy,
  ]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // View Navigation Handlers
  const handleSelectPlant = (plant) => {
    setSelectedDetailPlant(plant);
    setActiveView('details');
    window.location.hash = `#/plant/${plant.id}`;
    window.scrollTo(0, 0);
  };

  const handleOpenCart = () => {
    setActiveView('cart');
    window.location.hash = '#/cart';
    window.scrollTo(0, 0);
  };

  const handleOpenWishlist = () => {
    setActiveView('wishlist');
    window.location.hash = '#/wishlist';
    window.scrollTo(0, 0);
  };

  const handleBackToCatalog = () => {
    setActiveView('catalog');
    window.location.hash = '#/';
  };

  const handleAskAiAboutPlant = (plant) => {
    setSelectedAiPlant(plant);
    setAiAssistantTab('chat');
    setActiveView('ai-assistant');
    window.location.hash = '#/ai-assistant';
    window.scrollTo(0, 0);
  };

  // Cart Operations
  const handleAddToCart = async (plant, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const cartDto = await plantifyApi.addToCart(plant.id, quantity);
        syncCartFromDto(cartDto);
        showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}"${plant.name}" to cart!`);
      } catch (err) {
        showToast(`Could not add to cart: ${err.message}`);
      }
    } else {
      setCartItems((prev) => {
        const idx = prev.findIndex((item) => String(item.plant.id) === String(plant.id));
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + quantity,
          };
          return updated;
        }
        return [...prev, { plant, quantity }];
      });
      showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}"${plant.name}" to cart!`);
    }
  };

  const handleUpdateCartQuantity = async (plantId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(plantId);
      return;
    }
    const currentItem = cartItems.find((item) => String(item.plant.id) === String(plantId));

    if (isAuthenticated) {
      const backendId = currentItem?.backendItemId;
      if (backendId) {
        try {
          const cartDto = await plantifyApi.updateCartItem(backendId, newQty);
          syncCartFromDto(cartDto);
        } catch (err) {
          showToast(`Could not update quantity: ${err.message}`);
        }
      } else {
        try {
          const cartDto = await plantifyApi.getCart();
          const found = cartDto?.items?.find((it) => String(it.productId) === String(plantId));
          if (found) {
            const updated = await plantifyApi.updateCartItem(found.id, newQty);
            syncCartFromDto(updated);
          }
        } catch (err) {
          showToast(`Could not update quantity: ${err.message}`);
        }
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          String(item.plant.id) === String(plantId)
            ? { ...item, quantity: newQty }
            : item
        )
      );
    }
  };

  const handleRemoveFromCart = async (plantId) => {
    const currentItem = cartItems.find((item) => String(item.plant.id) === String(plantId));

    if (isAuthenticated) {
      const backendId = currentItem?.backendItemId;
      if (backendId) {
        try {
          const cartDto = await plantifyApi.removeCartItem(backendId);
          syncCartFromDto(cartDto);
          showToast('Item removed from cart');
        } catch (err) {
          showToast(`Could not remove item: ${err.message}`);
        }
      } else {
        try {
          const cartDto = await plantifyApi.getCart();
          const found = cartDto?.items?.find((it) => String(it.productId) === String(plantId));
          if (found) {
            const updated = await plantifyApi.removeCartItem(found.id);
            syncCartFromDto(updated);
          } else {
            setCartItems((prev) => prev.filter((item) => String(item.plant.id) !== String(plantId)));
          }
          showToast('Item removed from cart');
        } catch (err) {
          showToast(`Could not remove item: ${err.message}`);
        }
      }
    } else {
      setCartItems((prev) => prev.filter((item) => String(item.plant.id) !== String(plantId)));
      showToast('Item removed from cart');
    }
  };

  const handleClearCart = async () => {
    if (isAuthenticated) {
      try {
        await plantifyApi.clearCart();
        setCartItems([]);
        showToast('Cart cleared');
      } catch (err) {
        showToast(`Could not clear cart: ${err.message}`);
      }
    } else {
      setCartItems([]);
      showToast('Cart cleared');
    }
  };

  // Wishlist Operations
  const handleToggleWishlist = (plant) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(plant.id);
      if (exists) {
        showToast(`Removed "${plant.name}" from wishlist`);
        if (isAuthenticated) {
          plantifyApi.removeFromWishlist(plant.id).catch(console.warn);
        }
        return prev.filter((id) => id !== plant.id);
      } else {
        showToast(`Saved "${plant.name}" to wishlist`);
        if (isAuthenticated) {
          plantifyApi.addToWishlist(plant.id).catch(console.warn);
        }
        return [...prev, plant.id];
      }
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (activeView !== 'catalog') {
      setActiveView('catalog');
      window.location.hash = '#/';
    }
    if (activeProvider === 'api') {
      loadData(query, false, false);
    }
  };

  // Reset all filters, search query, category, and sorting
  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedEnvironment('all');
    setSelectedLight('all');
    setSelectedWater('all');
    setSelectedDifficulty('all');
    setSelectedPriceRange('all');
    setPetFriendlyOnly(false);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
    if (activeProvider === 'api') {
      loadData('', false, false);
    }
  };

  // Dynamic Filtering Pipeline
  const filteredPlants = plants.filter((plant) => {
    // 1. Text Search Query (Searches common name, botanical name, category, description, and tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = plant.name?.toLowerCase().includes(q);
      const matchScientific = plant.scientificName?.toLowerCase().includes(q);
      const matchCategory = (plant.category || plant.categoryName || '')?.toLowerCase().includes(q);
      const matchTags = Array.isArray(plant.tags) && plant.tags.some((t) => t.toLowerCase().includes(q));
      const matchDesc = plant.description?.toLowerCase().includes(q);
      if (!matchName && !matchScientific && !matchCategory && !matchTags && !matchDesc) {
        return false;
      }
    }

    // 2. Category Filter
    if (selectedCategory !== 'all' && plant.categorySlug !== selectedCategory) {
      return false;
    }

    // 3. Environment Filter
    if (selectedEnvironment !== 'all') {
      if (selectedEnvironment === 'Indoor' && plant.environment !== 'Indoor' && plant.environment !== 'Both') {
        return false;
      }
      if (selectedEnvironment === 'Outdoor' && plant.environment !== 'Outdoor' && plant.environment !== 'Both') {
        return false;
      }
    }

    // 4. Sunlight Filter
    if (selectedLight !== 'all') {
      const pLight = (plant.light || '').toLowerCase();
      if (selectedLight === 'low' && !pLight.includes('low')) return false;
      if (selectedLight === 'medium' && !pLight.includes('medium')) return false;
      if (selectedLight === 'bright' && !pLight.includes('bright')) return false;
      if (selectedLight === 'sun' && !pLight.includes('sun') && !pLight.includes('direct')) return false;
    }

    // 5. Water Need Filter
    if (selectedWater !== 'all') {
      const pWater = (plant.water || '').toLowerCase();
      if (selectedWater === 'low' && !pWater.includes('1–2') && !pWater.includes('2-3') && !pWater.includes('2–3')) return false;
      if (selectedWater === 'moderate' && (!pWater.includes('weekly') || pWater.includes('twice'))) return false;
      if (selectedWater === 'high' && !pWater.includes('twice')) return false;
    }

    // 6. Care Difficulty Filter
    if (selectedDifficulty !== 'all') {
      const pDiff = (plant.difficulty || '').toLowerCase();
      if (selectedDifficulty === 'easy' && !pDiff.includes('easy')) return false;
      if (selectedDifficulty === 'moderate' && !pDiff.includes('moderate')) return false;
      if (selectedDifficulty === 'expert' && !pDiff.includes('expert')) return false;
    }

    // 7. Price Range Filter
    if (selectedPriceRange !== 'all') {
      const price = plant.price || 0;
      if (selectedPriceRange === 'under-30' && price >= 30) return false;
      if (selectedPriceRange === '30-60' && (price < 30 || price > 60)) return false;
      if (selectedPriceRange === 'over-60' && price <= 60) return false;
    }

    // 8. Pet-Friendly Filter
    if (petFriendlyOnly && !plant.petFriendly) {
      return false;
    }

    // 9. Availability / In-Stock Filter
    if (inStockOnly) {
      if (plant.inStock === false || (plant.stockQuantity !== undefined && plant.stockQuantity <= 0)) {
        return false;
      }
    }

    return true;
  });

  // Sorting Pipeline
  const sortedPlants = [...filteredPlants].sort((a, b) => {
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
    if (sortBy === 'newest') {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return (b.id || 0) - (a.id || 0);
    }
    return (a.id || 0) - (b.id || 0); // 'featured'
  });

  // Pagination Slice
  const paginatedPlants = sortedPlants.slice(0, visibleCount);

  // Active Filter Chips
  const activeFilters = [];
  if (selectedCategory !== 'all') {
    const cat = categories.find((c) => c.slug === selectedCategory);
    activeFilters.push({
      id: 'cat',
      label: cat ? cat.name : selectedCategory,
      clear: () => setSelectedCategory('all'),
    });
  }
  if (selectedEnvironment !== 'all') {
    activeFilters.push({
      id: 'env',
      label: `${selectedEnvironment} Plants`,
      clear: () => setSelectedEnvironment('all'),
    });
  }
  if (selectedLight !== 'all') {
    const lightMap = {
      low: 'Low Light',
      medium: 'Medium Light',
      bright: 'Bright Indirect',
      sun: 'Full Sun',
    };
    activeFilters.push({
      id: 'light',
      label: lightMap[selectedLight] || selectedLight,
      clear: () => setSelectedLight('all'),
    });
  }
  if (selectedWater !== 'all') {
    const waterMap = {
      low: 'Low Water',
      moderate: 'Moderate Water',
      high: 'High Water',
    };
    activeFilters.push({
      id: 'water',
      label: waterMap[selectedWater] || selectedWater,
      clear: () => setSelectedWater('all'),
    });
  }
  if (selectedDifficulty !== 'all') {
    const diffMap = {
      easy: 'Easy Care',
      moderate: 'Moderate Care',
      expert: 'Expert Care',
    };
    activeFilters.push({
      id: 'diff',
      label: diffMap[selectedDifficulty] || selectedDifficulty,
      clear: () => setSelectedDifficulty('all'),
    });
  }
  if (selectedPriceRange !== 'all') {
    const priceMap = {
      'under-30': 'Under $30',
      '30-60': '$30 to $60',
      'over-60': 'Over $60',
    };
    activeFilters.push({
      id: 'price',
      label: priceMap[selectedPriceRange] || selectedPriceRange,
      clear: () => setSelectedPriceRange('all'),
    });
  }
  if (inStockOnly) {
    activeFilters.push({
      id: 'stock',
      label: '✓ In Stock Only',
      clear: () => setInStockOnly(false),
    });
  }
  if (petFriendlyOnly) {
    activeFilters.push({
      id: 'pet',
      label: '🐾 Pet Safe Only',
      clear: () => setPetFriendlyOnly(false),
    });
  }
  if (searchQuery.trim()) {
    activeFilters.push({
      id: 'search',
      label: `"${searchQuery.trim()}"`,
      clear: () => {
        setSearchQuery('');
        if (activeProvider === 'api') {
          loadData('', false, false);
        }
      },
    });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1100,
          backgroundColor: 'var(--color-forest)',
          color: 'var(--color-white)',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lift)',
          fontSize: 'var(--text-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid var(--color-sage-soft)',
        }}>
          <span>🌿</span>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Global Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={totalWishlistCount}
        activeNav={activeView === 'catalog' ? activeSection : activeView}
        onSearchSubmit={handleSearch}
        onOpenCart={handleOpenCart}
        onOpenWishlist={handleOpenWishlist}
        onNavigate={(view) => {
          if (view === 'catalog') {
            handleBackToCatalog();
          } else if (view === 'my-plants') {
            if (!isAuthenticated) {
              openLoginModal();
            } else {
              setActiveView('my-plants');
              window.location.hash = '#/my-plants';
              window.scrollTo(0, 0);
            }
          } else if (view === 'account') {
            setActiveView('account');
            window.location.hash = '#/account';
            window.scrollTo(0, 0);
          } else if (view === 'admin') {
            setActiveView('admin');
            window.location.hash = '#/admin';
            window.scrollTo(0, 0);
          } else if (view === 'plant-health') {
            setSelectedAiPlant(null);
            setAiAssistantTab('diagnosis');
            setActiveView('ai-assistant');
            window.location.hash = '#/plant-health';
            window.scrollTo(0, 0);
          } else if (view === 'ai-assistant') {
            setSelectedAiPlant(null);
            setAiAssistantTab('chat');
            setActiveView('ai-assistant');
            window.location.hash = '#/ai-assistant';
            window.scrollTo(0, 0);
          } else if (view === 'for-farmers' || view === 'about' || view === 'contact' || view === 'plants') {
            setActiveView('catalog');
            setActiveSection(view);
            window.location.hash = `#${view}`;
            setTimeout(() => {
              const el = document.getElementById(view);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 60);
          }
        }}
      />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>

        {/* VIEW 1: Dedicated Plant Details View */}
        {activeView === 'details' && selectedDetailPlant && (
          <PlantDetailsView
            plant={selectedDetailPlant}
            onBack={handleBackToCatalog}
            onAddToCart={handleAddToCart}
            isWishlisted={wishlistIds.includes(selectedDetailPlant.id)}
            onToggleWishlist={handleToggleWishlist}
            onSelectPlant={handleSelectPlant}
            onAskAi={handleAskAiAboutPlant}
            onDiagnoseHealth={(p) => {
              setSelectedAiPlant(p);
              setAiAssistantTab('diagnosis');
              setActiveView('ai-assistant');
              window.location.hash = '#/plant-health';
              window.scrollTo(0, 0);
            }}
            onAddToMyPlants={(p) => {
              if (!isAuthenticated) {
                openLoginModal();
              } else {
                setActiveView('my-plants');
                window.location.hash = '#/my-plants';
                window.scrollTo(0, 0);
              }
            }}
            relatedPlants={plants.filter(
              (p) => p.categorySlug === selectedDetailPlant.categorySlug && p.id !== selectedDetailPlant.id
            )}
            wishlistIds={wishlistIds}
          />
        )}

        {/* VIEW 2: Dedicated Wishlist View */}
        {activeView === 'wishlist' && (
          <WishlistView
            wishlistIds={wishlistIds}
            plants={plants}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectPlant={handleSelectPlant}
            onBack={handleBackToCatalog}
          />
        )}

        {/* VIEW 3: Dedicated Cart View */}
        {activeView === 'cart' && (
          <CartView
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onBack={handleBackToCatalog}
            onSelectPlant={handleSelectPlant}
            onNavigate={(view) => {
              if (view === 'account') {
                setActiveView('account');
                window.location.hash = '#/account';
                window.scrollTo(0, 0);
              } else if (view === 'catalog') {
                handleBackToCatalog();
              }
            }}
          />
        )}

        {/* VIEW 4: Dedicated Customer Account View */}
        {activeView === 'account' && (
          <AccountView
            onNavigateHome={handleBackToCatalog}
            onOpenCart={handleOpenCart}
            catalogPlants={plants}
            onAskAi={handleAskAiAboutPlant}
          />
        )}

        {/* VIEW 5: Dedicated Admin Console View */}
        {activeView === 'admin' && (
          <AdminView
            onNavigateHome={handleBackToCatalog}
          />
        )}

        {/* VIEW 6: Dedicated AI Plant-Care Assistant View */}
        {activeView === 'ai-assistant' && (
          <AIAssistant
            plants={plants}
            initialPlant={selectedAiPlant}
            initialTab={aiAssistantTab}
            onBack={handleBackToCatalog}
          />
        )}

        {/* VIEW 7: Dedicated My Plants & Personalized Care Recommendations View */}
        {activeView === 'my-plants' && (
          <MyPlants
            catalogPlants={plants}
            onNavigateCatalog={handleBackToCatalog}
            onAskAi={handleAskAiAboutPlant}
          />
        )}

        {/* VIEW 7: Full Homepage & Marketplace Catalog (Default) */}
        {activeView === 'catalog' && (
          <>
            {/* 2. Hero Section */}
            <section id="home" style={{
              padding: 'var(--space-3xl) 0',
              backgroundColor: 'var(--color-off-white)',
              borderBottom: '1px solid var(--color-concrete-light)',
            }}>
              <div className="container hero-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1.15fr 0.85fr',
                gap: 'var(--space-3xl)',
                alignItems: 'center',
              }}>
                
                {/* Hero Copy */}
                <div>
                  <div style={{ marginBottom: 'var(--space-md)' }}>
                    <Badge variant="amber">
                      🌱 Botanical Living Meets AI Care
                    </Badge>
                  </div>

                  <h1 style={{
                    fontSize: 'var(--text-4xl)',
                    fontWeight: 700,
                    color: 'var(--color-forest)',
                    marginBottom: 'var(--space-md)',
                    lineHeight: 1.15,
                  }}>
                    Breathe Serenity into Every Space.
                  </h1>

                  <p style={{
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-charcoal-muted)',
                    lineHeight: 1.65,
                    marginBottom: 'var(--space-xl)',
                    maxWidth: '560px',
                  }}>
                    Explore 100 verified nursery botanical house plants across 10 collections—paired with our intelligent AI Plant Assistant for lifelong thriving greenery.
                  </p>

                  <div className="flex-wrap-gap" style={{ marginBottom: 'var(--space-xl)' }}>
                    <a href="#plants">
                      <Button variant="accent" size="lg">
                        Shop 100 Plants
                      </Button>
                    </a>
                    <a href="#categories">
                      <Button variant="secondary" size="lg">
                        Browse Collections
                      </Button>
                    </a>
                  </div>

                  {/* Micro-Trust Stat Bar */}
                  <div style={{
                    display: 'flex',
                    gap: 'var(--space-xl)',
                    paddingTop: 'var(--space-md)',
                    borderTop: '1px solid var(--color-concrete-light)',
                  }}>
                    <div>
                      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-forest)' }}>
                        100
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)' }}>
                        Verified Species
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-forest)' }}>
                        10
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)' }}>
                        Botanical Categories
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-forest)' }}>
                        100%
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)' }}>
                        Authentic Imagery
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Visual Card */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    backgroundColor: 'var(--color-white)',
                    borderRadius: 'var(--radius-2xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lift)',
                    border: '1px solid var(--color-concrete-light)',
                    position: 'relative',
                  }}>
                    <img
                      src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=80"
                      alt="Lush green botanical interior plant"
                      style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallbackTried) return;
                        e.currentTarget.dataset.fallbackTried = 'true';
                        e.currentTarget.src = '/botanical-placeholder.svg';
                      }}
                    />

                    {/* Floating Real-Time Care Badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      right: '20px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-md)',
                      border: '1px solid var(--color-concrete-light)',
                    }}>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-forest)' }}>
                          Monstera Deliciosa
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
                          Hydration: Optimal • Next Water: in 4 days
                        </div>
                      </div>
                      <Badge variant="amber">AI Monitored</Badge>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 3. Benefit Highlights Bar */}
            <section style={{
              backgroundColor: 'var(--color-white)',
              padding: 'var(--space-2xl) 0',
              borderBottom: '1px solid var(--color-concrete-light)',
            }}>
              <div className="container">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 'var(--space-xl)',
                }}>
                  
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-sage-pale)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}>
                      🛡️
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-forest)', marginBottom: '4px' }}>
                        Certified Nursery Stock
                      </h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)' }}>
                        Inspected and certified 100% free of root rot and common pests.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-sage-pale)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}>
                      🤖
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-forest)', marginBottom: '4px' }}>
                        AI Health Intelligence
                      </h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)' }}>
                        One-tap leaf disease advisory &amp; automated watering calendars.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-sage-pale)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}>
                      📦
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-forest)', marginBottom: '4px' }}>
                        Eco-Conscious Packaging
                      </h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)' }}>
                        100% biodegradable corrugated boxes engineered for zero transit stress.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-sage-pale)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}>
                      🪴
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-forest)', marginBottom: '4px' }}>
                        30-Day Thrive Guarantee
                      </h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)' }}>
                        If your botanical fails to thrive within 30 days, we replace it free.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* 4. Plant Categories Showcase (10 Visual Tiles) */}
            <section id="categories" style={{ padding: 'var(--space-3xl) 0' }}>
              <div className="container">
                <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-2xl) auto' }}>
                  <Badge variant="sage" style={{ marginBottom: 'var(--space-xs)' }}>
                    Shop by Collection
                  </Badge>
                  <h2 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-forest)', marginBottom: 'var(--space-xs)' }}>
                    10 Botanical Categories
                  </h2>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-charcoal-muted)' }}>
                    Explore authentic botanical specimens categorized for home decor, wellness, and garden sanctuaries.
                  </p>
                </div>

                {/* Horizontal Scroll on Mobile, Responsive Grid on Desktop */}
                <div className="category-scroll-wrapper">
                  <div className="category-tiles-container">
                    
                    {/* "All Plants" Tile */}
                    <div
                      role="button"
                      tabIndex={0}
                      className={`category-tile ${selectedCategory === 'all' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory('all');
                        document.getElementById('plants')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedCategory('all');
                          document.getElementById('plants')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <div className="category-tile-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                        🌿
                      </div>
                      <div className="category-tile-title">All Plants</div>
                      <div className="category-tile-count">{plants.length} Plants</div>
                    </div>

                    {/* 10 Visual Category Tiles */}
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        role="button"
                        tabIndex={0}
                        className={`category-tile ${selectedCategory === cat.slug ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(selectedCategory === cat.slug ? 'all' : cat.slug);
                          document.getElementById('plants')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedCategory(selectedCategory === cat.slug ? 'all' : cat.slug);
                            document.getElementById('plants')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        <div className="category-tile-avatar">
                          <PlantImage
                            src={cat.image}
                            alt={cat.name}
                            className="category-tile-img"
                          />
                        </div>
                        <div className="category-tile-title">{cat.name}</div>
                        <div className="category-tile-count">
                          {cat.plantCount} {cat.plantCount === 1 ? 'Plant' : 'Plants'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Complete Marketplace Catalog Grid (Myntra-Style Filters & Sorting) */}
            <section id="plants" style={{
              padding: 'var(--space-3xl) 0',
              backgroundColor: 'var(--color-white)',
              borderTop: '1px solid var(--color-concrete-light)',
              borderBottom: '1px solid var(--color-concrete-light)',
            }}>
              <div className="container">
                
                {/* Header with Source Badge, Provider Switcher & Search Bar */}
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                  
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                    marginBottom: 'var(--space-md)',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-xs)' }}>
                        <Badge variant="forest">
                          {activeProvider === 'curated' ? '🌱 Curated Botanical Stock' : '🌐 Live iNaturalist API'}
                        </Badge>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)' }}>
                          Source: <strong>{dataSource}</strong>
                        </span>
                      </div>
                      <h2 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-forest)' }}>
                        Botanical Plant Marketplace
                      </h2>
                    </div>

                    {/* Provider Switcher Controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'var(--color-off-white)',
                      padding: '4px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-concrete-light)',
                      gap: '4px',
                    }}>
                      <button
                        type="button"
                        className={`btn btn--sm ${activeProvider === 'curated' ? 'btn--primary' : 'btn--outline'}`}
                        style={{ border: 'none', minHeight: '34px' }}
                        onClick={() => {
                          setActiveProvider('curated');
                          setSearchQuery('');
                        }}
                      >
                        🌱 Curated Stock (100)
                      </button>
                      <button
                        type="button"
                        className={`btn btn--sm ${activeProvider === 'api' ? 'btn--primary' : 'btn--outline'}`}
                        style={{ border: 'none', minHeight: '34px' }}
                        onClick={() => {
                          setActiveProvider('api');
                          setSearchQuery('');
                        }}
                      >
                        🌐 Live API Mode
                      </button>
                    </div>
                  </div>

                  {/* In-Catalog Live Search Bar */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--space-sm)',
                    backgroundColor: 'var(--color-off-white)',
                    padding: 'var(--space-md)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-concrete-light)',
                  }}>
                    <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Search by name, scientific name, or tags (e.g. Monstera, Ficus, Bonsai, Lavender)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSearch(searchQuery);
                        }}
                        style={{
                          width: '100%',
                          padding: searchQuery ? '0.65rem 2.4rem 0.65rem 1rem' : '0.65rem 1rem',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--color-concrete-light)',
                          backgroundColor: 'var(--color-white)',
                          color: 'var(--color-charcoal)',
                          fontSize: 'var(--text-sm)',
                        }}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            if (activeProvider === 'api') {
                              loadData('', false, false);
                            }
                          }}
                          aria-label="Clear search input"
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-charcoal-light)',
                            fontSize: '16px',
                            cursor: 'pointer',
                            padding: '4px',
                            lineHeight: 1,
                          }}
                          title="Clear search"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => handleSearch(searchQuery)}
                    >
                      Search Plants
                    </Button>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          if (activeProvider === 'api') {
                            loadData('', false, false);
                          }
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>

                </div>

                {/* Mobile Filter Toggle Drawer Button */}
                <div className="mobile-filter-toggle-row" style={{ display: 'none', marginBottom: 'var(--space-md)' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  >
                    <span>⚙️ {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters & Refine'}</span>
                    {activeFilters.length > 0 && <Badge variant="amber">{activeFilters.length}</Badge>}
                  </Button>
                </div>

                {/* Myntra-Inspired 2-Column Layout: Sidebar Filters + Products Grid */}
                <div className="catalog-layout">
                  
                  {/* Left Column: Filter Sidebar */}
                  <aside className={`filter-sidebar ${isMobileFiltersOpen ? 'mobile-open' : ''}`} aria-label="Catalog Filters">
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--space-md)',
                      paddingBottom: 'var(--space-sm)',
                      borderBottom: '1px solid var(--color-concrete-light)',
                    }}>
                      <h3 style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 700,
                        color: 'var(--color-forest)',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        <span>Filters</span>
                        {activeFilters.length > 0 && (
                          <Badge variant="amber">{activeFilters.length}</Badge>
                        )}
                      </h3>
                      {activeFilters.length > 0 && (
                        <button
                          type="button"
                          onClick={resetAllFilters}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-amber)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: 0,
                            textDecoration: 'underline',
                          }}
                        >
                          Reset All
                        </button>
                      )}
                    </div>

                    {/* Filter Group 1: Category */}
                    <div className="filter-group">
                      <div className="filter-title">
                        <span>Category</span>
                      </div>
                      <label className="filter-option">
                        <input
                          type="radio"
                          name="filter-cat"
                          checked={selectedCategory === 'all'}
                          onChange={() => setSelectedCategory('all')}
                        />
                        <span>All Categories</span>
                        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--color-charcoal-light)' }}>
                          ({plants.length})
                        </span>
                      </label>
                      {categories.map((c) => {
                        const count = plants.filter((p) => p.categorySlug === c.slug).length || c.plantCount || c.productCount || 0;
                        return (
                          <label key={c.id} className="filter-option">
                            <input
                              type="radio"
                              name="filter-cat"
                              checked={selectedCategory === c.slug}
                              onChange={() => setSelectedCategory(c.slug)}
                            />
                            <span>{c.name}</span>
                            <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--color-charcoal-light)' }}>
                              ({count})
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    {/* Filter Group 2: Availability / In-Stock */}
                    <div className="filter-group">
                      <div className="filter-title">
                        <span>Availability</span>
                      </div>
                      <label className="filter-option">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                        />
                        <span>✓ In Stock Only</span>
                        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--color-charcoal-light)' }}>
                          ({plants.filter((p) => p.inStock !== false && (p.stockQuantity === undefined || p.stockQuantity > 0)).length})
                        </span>
                      </label>
                    </div>

                    {/* Filter Group 3: Environment */}
                    <div className="filter-group">
                      <div className="filter-title">
                        <span>Environment</span>
                      </div>
                      {[
                        { label: 'All Environments', value: 'all' },
                        { label: 'Indoor Living', value: 'Indoor' },
                        { label: 'Outdoor Gardens', value: 'Outdoor' },
                      ].map((opt) => (
                        <label key={opt.value} className="filter-option">
                          <input
                            type="radio"
                            name="filter-env"
                            checked={selectedEnvironment === opt.value}
                            onChange={() => setSelectedEnvironment(opt.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Filter Group 4: Sunlight Requirement */}
                    <div className="filter-group">
                      <div className="filter-title">
                        <span>Sunlight</span>
                      </div>
                      {[
                        { label: 'All Light Levels', value: 'all' },
                        { label: 'Low Light', value: 'low' },
                        { label: 'Medium Light', value: 'medium' },
                        { label: 'Bright Indirect', value: 'bright' },
                        { label: 'Full / Direct Sun', value: 'sun' },
                      ].map((opt) => (
                        <label key={opt.value} className="filter-option">
                          <input
                            type="radio"
                            name="filter-light"
                            checked={selectedLight === opt.value}
                            onChange={() => setSelectedLight(opt.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Filter Group 5: Water Schedule */}
                    <div className="filter-group">
                      <div className="filter-title">
                        <span>Water Schedule</span>
                      </div>
                      {[
                        { label: 'All Schedules', value: 'all' },
                        { label: 'Low (Every 1–3 weeks)', value: 'low' },
                        { label: 'Moderate (Weekly)', value: 'moderate' },
                        { label: 'High (Twice weekly)', value: 'high' },
                      ].map((opt) => (
                        <label key={opt.value} className="filter-option">
                          <input
                            type="radio"
                            name="filter-water"
                            checked={selectedWater === opt.value}
                            onChange={() => setSelectedWater(opt.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Filter Group 6: Care Difficulty */}
                    <div className="filter-group">
                      <div className="filter-title">
                        <span>Care Difficulty</span>
                      </div>
                      {[
                        { label: 'All Levels', value: 'all' },
                        { label: 'Beginner / Easy', value: 'easy' },
                        { label: 'Moderate', value: 'moderate' },
                        { label: 'Expert', value: 'expert' },
                      ].map((opt) => (
                        <label key={opt.value} className="filter-option">
                          <input
                            type="radio"
                            name="filter-diff"
                            checked={selectedDifficulty === opt.value}
                            onChange={() => setSelectedDifficulty(opt.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Filter Group 7: Price Range */}
                    <div className="filter-group">
                      <div className="filter-title">
                        <span>Price Range</span>
                      </div>
                      {[
                        { label: 'All Prices', value: 'all' },
                        { label: 'Under $30', value: 'under-30' },
                        { label: '$30 to $60', value: '30-60' },
                        { label: 'Over $60', value: 'over-60' },
                      ].map((opt) => (
                        <label key={opt.value} className="filter-option">
                          <input
                            type="radio"
                            name="filter-price"
                            checked={selectedPriceRange === opt.value}
                            onChange={() => setSelectedPriceRange(opt.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Filter Group 8: Pet Safety */}
                    <div className="filter-group">
                      <div className="filter-title">
                        <span>Pet Safety</span>
                      </div>
                      <label className="filter-option">
                        <input
                          type="checkbox"
                          checked={petFriendlyOnly}
                          onChange={(e) => setPetFriendlyOnly(e.target.checked)}
                        />
                        <span>🐾 Pet-Friendly Only</span>
                        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--color-charcoal-light)' }}>
                          ({plants.filter((p) => p.petFriendly).length})
                        </span>
                      </label>
                    </div>
                  </aside>

                  {/* Right Column: Products Content Area */}
                  <div>
                    
                    {/* Catalog Toolbar: Counts & Sorting */}
                    <div className="catalog-toolbar">
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-forest)' }}>
                          Showing {Math.min(visibleCount, sortedPlants.length)} of {sortedPlants.length} plants
                          {selectedCategory !== 'all' && (
                            <span style={{ fontWeight: 400, color: 'var(--color-charcoal-light)', marginLeft: '4px' }}>
                              in {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sort Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label htmlFor="sort-plants" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)', fontWeight: 600 }}>
                          Sort:
                        </label>
                        <select
                          id="sort-plants"
                          className="sort-select"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          aria-label="Sort plant catalog"
                        >
                          <option value="featured">Featured / Recommended</option>
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                          <option value="name-asc">Name: A to Z</option>
                          <option value="name-desc">Name: Z to A</option>
                          <option value="newest">Newest Arrivals</option>
                          <option value="rating-desc">Customer Rating: High to Low</option>
                        </select>
                      </div>
                    </div>

                    {/* Active Filter Chips */}
                    {activeFilters.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        alignItems: 'center',
                        marginBottom: 'var(--space-lg)',
                      }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)', fontWeight: 600 }}>
                          Active Filters:
                        </span>
                        {activeFilters.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={f.clear}
                            style={{
                              backgroundColor: 'var(--color-amber-pale)',
                              color: 'var(--color-amber-text)',
                              border: '1px solid var(--color-amber-border)',
                              borderRadius: 'var(--radius-full)',
                              padding: '3px 10px',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'background-color var(--transition-fast)',
                            }}
                            title="Click to remove filter"
                          >
                            <span>{f.label}</span>
                            <span style={{ fontSize: '11px', color: 'var(--color-amber)' }}>✕</span>
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={resetAllFilters}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-amber)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: '2px 6px',
                            textDecoration: 'underline',
                          }}
                        >
                          Clear All
                        </button>
                      </div>
                    )}

                    {/* State Handling: Loading, Error, Empty, or Product Grid */}
                    {isLoading ? (
                      <div style={{
                        textAlign: 'center',
                        padding: 'var(--space-3xl) 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--space-md)',
                      }}>
                        <span className="spinner" style={{ width: '36px', height: '36px', borderWidth: '3px' }} aria-hidden="true" />
                        <p style={{ color: 'var(--color-charcoal-muted)' }}>
                          Connecting to botanical catalog &amp; loading specimens...
                        </p>
                      </div>
                    ) : errorMessage ? (
                      <div style={{
                        textAlign: 'center',
                        padding: 'var(--space-2xl)',
                        backgroundColor: 'var(--color-amber-pale)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid #ECCDBB',
                        maxWidth: '540px',
                        margin: '0 auto',
                      }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
                        <h3 style={{ color: 'var(--color-forest)', marginBottom: '8px' }}>
                          Catalog Unreachable
                        </h3>
                        <p style={{ color: 'var(--color-charcoal)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-md)' }}>
                          {errorMessage}
                        </p>
                        <Button variant="accent" size="sm" onClick={() => loadData()}>
                          Try Again
                        </Button>
                      </div>
                    ) : sortedPlants.length === 0 ? (
                      <div style={{
                        textAlign: 'center',
                        padding: 'var(--space-3xl) var(--space-lg)',
                        backgroundColor: 'var(--color-off-white)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-concrete-light)',
                        maxWidth: '620px',
                        margin: '0 auto',
                      }}>
                        <div style={{ fontSize: '42px', marginBottom: '12px' }}>🪴</div>
                        <h3 style={{ color: 'var(--color-forest)', marginBottom: '8px', fontSize: 'var(--text-xl)' }}>
                          No matching botanical specimens found
                        </h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-muted)', marginBottom: 'var(--space-lg)', lineHeight: 1.5 }}>
                          {searchQuery
                            ? `No specimens match "${searchQuery.trim()}" with the currently applied filters.`
                            : 'No botanical specimens match all the chosen filter criteria together.'}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <Button variant="primary" size="sm" onClick={resetAllFilters}>
                            Clear All Filters &amp; Search
                          </Button>
                          {searchQuery && (
                            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                              Clear Search Only
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                          gap: 'var(--space-xl)',
                        }}>
                          {paginatedPlants.map((plant) => (
                            <PlantCard
                              key={plant.id}
                              plant={plant}
                              isWishlisted={wishlistIds.includes(plant.id)}
                              onAddToCart={(p) => handleAddToCart(p, 1)}
                              onToggleWishlist={handleToggleWishlist}
                              onSelectPlant={handleSelectPlant}
                              onQuickView={(p) => setQuickViewPlant(p)}
                            />
                          ))}
                        </div>

                        {/* Pagination: Load More Plants */}
                        {paginatedPlants.length < sortedPlants.length && (
                          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
                            <Button
                              variant="secondary"
                              size="lg"
                              onClick={() => setVisibleCount((prev) => prev + 12)}
                            >
                              Load More Plants ({sortedPlants.length - paginatedPlants.length} remaining)
                            </Button>
                          </div>
                        )}

                        {sortedPlants.length > 12 && paginatedPlants.length >= sortedPlants.length && (
                          <div style={{
                            textAlign: 'center',
                            marginTop: 'var(--space-2xl)',
                            color: 'var(--color-charcoal-muted)',
                            fontSize: 'var(--text-sm)',
                          }}>
                            🌿 You've explored all {sortedPlants.length} plants in this selection.
                          </div>
                        )}
                      </>
                    )}

                    {/* Transparency Notice & Resilient Network Inspection Trigger */}
                    <div style={{
                      marginTop: 'var(--space-3xl)',
                      padding: 'var(--space-lg)',
                      backgroundColor: 'var(--color-off-white)',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--color-concrete-light)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 'var(--space-md)',
                    }}>
                      <div style={{ maxWidth: '650px' }}>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '2px' }}>
                          🌱 Botanical Data Transparency Notice
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)', margin: 0, lineHeight: 1.5 }}>
                          {activeProvider === 'curated'
                            ? 'Displaying 100 verified botanical specimens across 10 collections. Ratings and review tallies are demo metrics for shopping interface design validation. Switch to Live API Mode to query real-world global biodiversity observations.'
                            : 'Displaying live taxonomy observations directly from the open iNaturalist network. Images and scientific classifications are sourced from global field observers.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        onClick={() => loadData('', true)}
                        title="Simulates network outage to demonstrate resilient error UI boundary"
                      >
                        Simulate Network Error
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* 6. AI Plant Assistant Spotlight Section */}
            <section id="ai-assistant" style={{ padding: 'var(--space-3xl) 0' }}>
              <div className="container">
                <div className="ai-spotlight-section">
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--space-2xl)',
                    alignItems: 'center',
                  }}>
                    
                    {/* AI Feature Info */}
                    <div>
                      <Badge variant="sage" style={{ marginBottom: 'var(--space-md)' }}>
                        ✨ AI Multimodal Diagnosis
                      </Badge>

                      <h2 style={{
                        fontSize: 'var(--text-3xl)',
                        color: 'var(--color-white)',
                        marginBottom: 'var(--space-md)',
                        lineHeight: 1.2,
                      }}>
                        Meet Your Personal AI Botanist.
                      </h2>

                      <p style={{
                        fontSize: 'var(--text-base)',
                        color: '#D1DDD6',
                        lineHeight: 1.6,
                        marginBottom: 'var(--space-xl)',
                      }}>
                        Yellowing leaves? Drooping stems? Simply upload a leaf photograph. Our AI Plant Assistant evaluates visual stress indicators, factors in your local humidity and season, and recommends tailored recovery steps.
                      </p>

                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        marginBottom: 'var(--space-xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        fontSize: 'var(--text-sm)',
                        color: '#E5EDE8',
                      }}>
                        <li style={{ display: 'flex', gap: '10px' }}>
                          <span style={{ color: 'var(--color-sage-soft)', fontWeight: 700 }}>✓</span>
                          <span><strong>Visual Symptom Analysis:</strong> Real-time assessment of chlorosis, scorching, and fungal patterns.</span>
                        </li>
                        <li style={{ display: 'flex', gap: '10px' }}>
                          <span style={{ color: 'var(--color-sage-soft)', fontWeight: 700 }}>✓</span>
                          <span><strong>Dynamic Care Calendars:</strong> Automated watering &amp; nutrient schedules adapted to your indoor climate.</span>
                        </li>
                        <li style={{ display: 'flex', gap: '10px' }}>
                          <span style={{ color: 'var(--color-sage-soft)', fontWeight: 700 }}>✓</span>
                          <span><strong>Scientific Integrity:</strong> All recommendations follow evidence-based botanical principles.</span>
                        </li>
                      </ul>

                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Button
                          variant="accent"
                          size="lg"
                          onClick={() => {
                            setSelectedAiPlant(null);
                            setAiAssistantTab('diagnosis');
                            setActiveView('ai-assistant');
                            window.location.hash = '#/plant-health';
                            window.scrollTo(0, 0);
                          }}
                        >
                          🔬 Diagnose Leaf Photo Now →
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#FFFFFF' }}
                          onClick={() => {
                            setSelectedAiPlant(null);
                            setAiAssistantTab('chat');
                            setActiveView('ai-assistant');
                            window.location.hash = '#/ai-assistant';
                            window.scrollTo(0, 0);
                          }}
                        >
                          💬 Chat with AI Botanist
                        </Button>
                      </div>
                    </div>

                    {/* AI Diagnostic Preview Card Mockup */}
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      color: 'var(--color-charcoal)',
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--space-xl)',
                      boxShadow: 'var(--shadow-lift)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>🔬</span>
                          <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-forest)' }}>
                            Live Diagnosis Simulation
                          </strong>
                        </div>
                        <Badge variant="amber">94% Confidence</Badge>
                      </div>

                      {/* Mock Analysis Output */}
                      <div style={{
                        backgroundColor: 'var(--color-off-white)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-md)',
                        marginBottom: 'var(--space-md)',
                        border: '1px solid var(--color-concrete-light)',
                      }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)', marginBottom: '4px' }}>
                          DETECTED OBSERVATION
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-forest)' }}>
                          Marginal Leaf Tip Desiccation (Under-Hydration)
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                          Crispy brown margins detected on lower foliage. Root system indicates low ambient humidity and extended interval between deep soaks.
                        </p>
                      </div>

                      <div style={{
                        backgroundColor: 'var(--color-sage-pale)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-md)',
                        marginBottom: 'var(--space-md)',
                      }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-forest)', fontWeight: 600, marginBottom: '4px' }}>
                          RECOMMENDED IMMEDIATE ACTION:
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal)' }}>
                          1. Submerge root ball in lukewarm water for 15 minutes.<br />
                          2. Elevate ambient humidity above 55%.
                        </div>
                      </div>

                      {/* Mandatory Botanical Disclaimer */}
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--color-charcoal-light)',
                        lineHeight: 1.4,
                        borderTop: '1px solid var(--color-concrete-light)',
                        paddingTop: '8px',
                      }}>
                        ⚠️ <em>Botanical Advisory Disclaimer:</em> AI assessment provides educational guidance and does not replace confirmed laboratory phytosanitary diagnosis.
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* 7. For Farmers & Commercial Agriculture Section */}
            <ForFarmersSection
              onNavigateToCatalog={() => {
                const el = document.getElementById('plants');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onNavigateToContact={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 8. About Plantify Section */}
            <AboutSection
              onNavigateToCatalog={() => {
                const el = document.getElementById('plants');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 9. Contact Specialists Section */}
            <ContactSection />
          </>
        )}

      </main>

      {/* 7. Quick View Modal Dialog */}
      {quickViewPlant && (
        <Modal
          isOpen={Boolean(quickViewPlant)}
          onClose={() => setQuickViewPlant(null)}
          title={quickViewPlant.name}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-xl)',
            alignItems: 'start',
          }}>
            {/* Plant Image & Source Badge */}
            <div>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                backgroundColor: '#F0F3EC',
                border: '1px solid var(--color-concrete-light)',
                aspectRatio: '1 / 1',
              }}>
                <PlantImage
                  src={quickViewPlant.image}
                  alt={quickViewPlant.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {quickViewPlant.badge && (
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <Badge variant={quickViewPlant.badge.variant || 'forest'}>
                      {quickViewPlant.badge.text}
                    </Badge>
                  </div>
                )}
              </div>
              <div style={{
                marginTop: '10px',
                padding: '8px 12px',
                backgroundColor: 'var(--color-off-white)',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                color: 'var(--color-charcoal-light)',
                textAlign: 'center',
                border: '1px solid var(--color-concrete-light)',
              }}>
                ℹ️ {quickViewPlant.source || 'Curated Demo Inventory'}
              </div>
            </div>

            {/* Details & Specifications */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-charcoal-light)', fontWeight: 600 }}>
                  {quickViewPlant.category}
                </span>
                <span style={{ fontSize: '11px', color: quickViewPlant.petFriendly ? '#2E7D32' : 'var(--color-amber)', fontWeight: 600 }}>
                  {quickViewPlant.petFriendly ? '🐾 Pet-Safe' : '⚠️ Pet Caution'}
                </span>
              </div>

              <h3 style={{ fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-serif)', color: 'var(--color-forest)', margin: '0 0 4px 0' }}>
                {quickViewPlant.name}
              </h3>
              
              <p style={{ fontSize: 'var(--text-xs)', fontStyle: 'italic', color: 'var(--color-charcoal-muted)', margin: '0 0 var(--space-md) 0' }}>
                {quickViewPlant.scientificName}
              </p>

              {/* Price & Rating */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: 'var(--space-md)' }}>
                <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-forest)' }}>
                  ${quickViewPlant.price.toFixed(2)}
                </span>
                {quickViewPlant.originalPrice && (
                  <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-concrete)', textDecoration: 'line-through' }}>
                    ${quickViewPlant.originalPrice.toFixed(2)}
                  </span>
                )}
                <div style={{ marginLeft: 'auto' }}>
                  <Rating value={quickViewPlant.rating} reviewCount={quickViewPlant.reviewCount} />
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)', lineHeight: 1.6, marginBottom: 'var(--space-lg)' }}>
                {quickViewPlant.shortDescription}
              </p>

              {/* Botanical Care Specs Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                backgroundColor: 'var(--color-off-white)',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-xl)',
                border: '1px solid var(--color-concrete-light)',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-charcoal-light)', textTransform: 'uppercase', fontWeight: 600 }}>
                    ☀️ Sunlight
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-forest)', fontWeight: 600 }}>
                    {quickViewPlant.light || 'Medium Light'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-charcoal-light)', textTransform: 'uppercase', fontWeight: 600 }}>
                    💧 Water Schedule
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-forest)', fontWeight: 600 }}>
                    {quickViewPlant.water || 'Weekly'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-charcoal-light)', textTransform: 'uppercase', fontWeight: 600 }}>
                    🏡 Environment
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-forest)', fontWeight: 600 }}>
                    {quickViewPlant.environment || 'Indoor'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-charcoal-light)', textTransform: 'uppercase', fontWeight: 600 }}>
                    🎯 Care Level
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-forest)', fontWeight: 600 }}>
                    {quickViewPlant.difficulty || 'Easy'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="accent"
                  size="md"
                  style={{ flex: 1 }}
                  onClick={() => {
                    handleAddToCart(quickViewPlant, 1);
                    setQuickViewPlant(null);
                  }}
                >
                  Add to Cart • ${quickViewPlant.price.toFixed(2)}
                </Button>
                <Button
                  variant={wishlistIds.includes(quickViewPlant.id) ? 'accent' : 'outline'}
                  size="md"
                  onClick={() => {
                    handleToggleWishlist(quickViewPlant);
                  }}
                >
                  {wishlistIds.includes(quickViewPlant.id) ? '♥ Saved' : '♡ Wishlist'}
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    const p = quickViewPlant;
                    setQuickViewPlant(null);
                    handleSelectPlant(p);
                  }}
                >
                  View Full Page →
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 8. Global Footer */}
      <Footer onNavigate={(section) => {
        setActiveView('catalog');
        window.location.hash = `#${section}`;
        setTimeout(() => {
          const el = document.getElementById(section);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }} />

      {/* 9. Global Authentication Modal */}
      <AuthModal />

    </div>
  );
}
