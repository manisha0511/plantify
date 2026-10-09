import { SAMPLE_PLANTS } from '../data/plants.js';
import { SAMPLE_CATEGORIES, PLANT_CATEGORIES } from '../data/categories.js';

/**
 * Plantify Data & API Service Layer
 * 
 * ARCHITECTURAL PURPOSE:
 * Integrates live external botanical APIs with client-side caching,
 * data normalization, and seamless error fallback.
 * 
 * Supported Providers:
 * 1. iNaturalist API (Primary: Open, CORS-enabled, No API key required)
 * 2. Perenual API (Optional: Requires VITE_PERENUAL_API_KEY in .env)
 * 3. Curated Nursery Catalog (Offline / Network Fallback)
 */

// In-memory cache to prevent redundant network requests
const memoryCache = new Map();

/**
 * Capitalizes the first letter of each word in a string
 */
function capitalizeWords(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Normalizes an iNaturalist Taxon object into the standardized Plantify schema.
 */
function normalizeINaturalistTaxon(taxon) {
  const commonName = taxon.preferred_common_name
    ? capitalizeWords(taxon.preferred_common_name)
    : capitalizeWords(taxon.name);

  // Use medium photo or fallback to reliable botanical stock image
  const photoUrl = taxon.default_photo?.medium_url
    || taxon.default_photo?.url
    || '/botanical-placeholder.svg';

  // Calculate deterministic price & ratings for e-commerce simulation
  const basePrice = 28 + ((taxon.id % 40) * 1.25);
  const price = Math.round(basePrice * 100) / 100;
  const originalPrice = (taxon.id % 3 === 0) ? Math.round((price * 1.25) * 100) / 100 : null;
  const rating = Number((4.5 + ((taxon.id % 5) * 0.1)).toFixed(1));
  const reviewCount = Math.max(15, Math.min(320, ((taxon.observations_count || 50) % 180) + 20));

  // Infer botanical care from family or taxonomy
  const isSucculent = /succulent|aloe|cactus|crassula|sedum|sansevieria/i.test(taxon.name);
  const isFern = /fern|pteridium|athyrium|polystichum|adiantum/i.test(commonName);

  let light = 'Bright Indirect';
  let water = 'Every 1–2 weeks';
  let difficulty = 'Easy';

  if (isSucculent) {
    light = 'Direct Sunlight';
    water = 'Every 2–3 weeks';
    difficulty = 'Very Easy';
  } else if (isFern) {
    light = 'Medium to Low Light';
    water = 'Twice weekly';
    difficulty = 'Moderate';
  }

  return {
    id: `inat-${taxon.id}`,
    apiId: taxon.id,
    name: commonName,
    scientificName: taxon.name,
    price,
    originalPrice,
    rating,
    reviewCount,
    category: isSucculent ? 'Drought Hardy' : (isFern ? 'Low-Light Sanctuaries' : 'Botanical Species'),
    categorySlug: isSucculent ? 'drought-hardy' : (isFern ? 'low-light' : 'all'),
    badge: { text: 'Live API Species', variant: 'forest' },
    image: photoUrl,
    difficulty,
    light,
    water,
    petFriendly: Boolean(taxon.id % 2 !== 0),
    inStock: true,
    isFeatured: true,
    source: 'iNaturalist Live API',
    wikipediaUrl: taxon.wikipedia_url || null,
    observationsCount: taxon.observations_count || 0,
    shortDescription: `Verified live botanical species documented with ${taxon.observations_count || 0} observations on the global biodiversity network.`
  };
}

/**
 * Normalizes a Perenual Species item into the standardized Plantify schema.
 */
function normalizePerenualPlant(item) {
  const commonName = item.common_name
    ? capitalizeWords(item.common_name)
    : (Array.isArray(item.scientific_name) ? item.scientific_name[0] : 'Botanical Specimen');

  const scientific = Array.isArray(item.scientific_name)
    ? item.scientific_name.join(', ')
    : (item.scientific_name || '');

  const imageUrl = item.default_image?.medium_url
    || item.default_image?.regular_url
    || '/botanical-placeholder.svg';

  return {
    id: `perenual-${item.id}`,
    apiId: item.id,
    name: commonName,
    scientificName: scientific,
    price: 34.00 + (item.id % 25),
    originalPrice: null,
    rating: 4.8,
    reviewCount: 42,
    category: item.cycle || 'Indoor Plant',
    categorySlug: 'perenual',
    badge: { text: 'Perenual Live API', variant: 'sage' },
    image: imageUrl,
    difficulty: 'Moderate',
    light: Array.isArray(item.sunlight) ? item.sunlight.join(', ') : (item.sunlight || 'Medium Light'),
    water: item.watering || 'Average',
    petFriendly: !item.poisonous,
    inStock: true,
    isFeatured: true,
    source: 'Perenual Live API',
    shortDescription: `Species from Perenual botanical database. Cycle: ${item.cycle || 'Perennial'}.`
  };
}

export const plantService = {
  /**
   * Fetches plants using the live iNaturalist API or configured provider.
   * Includes in-memory caching and automatic fallback.
   * 
   * @param {Object} [options]
   * @param {string} [options.query=''] Search term
   * @param {number} [options.limit=8] Number of results
   * @param {boolean} [options.simulateError=false] For testing error UI
   * @returns {Promise<{ plants: Array, source: string, error?: string }>}
   */
  async getPlants({ query = '', limit = 8, simulateError = false } = {}) {
    if (simulateError) {
      throw new Error('Simulated network failure: Unable to establish connection to botanical gateway.');
    }

    const perenualKey = import.meta.env.VITE_PERENUAL_API_KEY;
    const cacheKey = `plants_${query}_${limit}`;

    // Return cached response if available
    if (memoryCache.has(cacheKey)) {
      return memoryCache.get(cacheKey);
    }

    // 1. Try Perenual if a key is provided
    if (perenualKey && perenualKey.trim() !== '') {
      try {
        const url = `https://perenual.com/api/species-list?key=${encodeURIComponent(perenualKey)}&q=${encodeURIComponent(query)}&page=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Perenual API returned HTTP status ${res.status}`);
        const data = await res.json();
        
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          const normalized = data.data.slice(0, limit).map(normalizePerenualPlant);
          const result = { plants: normalized, source: 'Perenual Live API' };
          memoryCache.set(cacheKey, result);
          return result;
        }
      } catch (err) {
        console.warn('Perenual API request failed, falling back to iNaturalist:', err.message);
      }
    }

    // 2. Query Live iNaturalist API (Open, CORS-enabled, No secret required)
    try {
      const searchTerm = query.trim() || 'Monstera';
      const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(searchTerm)}&iconic_taxa=Plantae&rank=species&per_page=${limit}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`iNaturalist API returned HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();

      if (json && Array.isArray(json.results) && json.results.length > 0) {
        const normalized = json.results.map(normalizeINaturalistTaxon);
        const result = { plants: normalized, source: 'iNaturalist Live API' };
        memoryCache.set(cacheKey, result);
        return result;
      } else {
        // Empty search results
        const emptyResult = { plants: [], source: 'iNaturalist Live API' };
        return emptyResult;
      }
    } catch (networkError) {
      console.warn('Live API request failed or blocked, utilizing curated fallback:', networkError.message);
      
      // Fallback to local curated catalog
      const fallbackPlants = query
        ? SAMPLE_PLANTS.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) || 
            p.scientificName.toLowerCase().includes(query.toLowerCase())
          )
        : SAMPLE_PLANTS;

      return {
        plants: fallbackPlants.map(p => ({ ...p, source: 'Curated Fallback Catalog' })),
        source: 'Curated Fallback Catalog (Network Offline)',
        error: networkError.message
      };
    }
  },

  /**
   * Fetches full curated catalog of 100 plants
   */
  async getCuratedPlants({ delay = 50 } = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...SAMPLE_PLANTS]);
      }, delay);
    });
  },

  /**
   * Fetches default curated catalog (used for initial homepage showcase)
   */
  async getFeaturedPlants({ delay = 50 } = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(SAMPLE_PLANTS.slice(0, 12));
      }, delay);
    });
  },

  /**
   * Fetches categories with dynamically calculated real plant counts
   */
  async getCategories() {
    const counts = SAMPLE_PLANTS.reduce((acc, plant) => {
      if (plant.categorySlug) {
        acc[plant.categorySlug] = (acc[plant.categorySlug] || 0) + 1;
      }
      return acc;
    }, {});

    const categoriesWithCounts = PLANT_CATEGORIES.map((cat) => ({
      ...cat,
      plantCount: counts[cat.slug] || 0,
    }));

    return Promise.resolve(categoriesWithCounts);
  },

  /**
   * Fetches a plant by its unique ID
   */
  async getPlantById(id) {
    const found = SAMPLE_PLANTS.find((p) => String(p.id) === String(id));
    return Promise.resolve(found || null);
  },
};
