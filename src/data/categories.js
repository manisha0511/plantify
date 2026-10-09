/**
 * 10 SHOPPING CATEGORIES (Verified Botanical Collections)
 * 
 * Each category includes an authentic representative botanical photograph,
 * icon glyph, and description. Unrelated food/animal imagery is strictly excluded.
 */

export const PLANT_CATEGORIES = [
  {
    id: 1,
    name: 'Flowering Plants',
    slug: 'flowering-plants',
    description: 'Vibrant blossoms that bring natural fragrances and lively colors indoors and outdoors.',
    icon: '🌸',
    image: 'https://inaturalist-open-data.s3.amazonaws.com/photos/212419198/medium.jpeg',
  },
  {
    id: 2,
    name: 'Leafy Plants',
    slug: 'leafy-plants',
    description: 'Lush tropical foliage and architectural broad leaves that transform indoor aesthetics.',
    icon: '🌿',
    image: 'https://static.inaturalist.org/photos/10534833/medium.jpeg',
  },
  {
    id: 3,
    name: 'Indoor Plants',
    slug: 'indoor-plants',
    description: 'Hardy species naturally adapted to moderate light and indoor air circulation.',
    icon: '🪴',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Outdoor Plants',
    slug: 'outdoor-plants',
    description: 'Sun-loving landscape shrubs, perennial bushes, and patio garden showpieces.',
    icon: '🌳',
    image: 'https://inaturalist-open-data.s3.amazonaws.com/photos/157057/medium.jpg',
  },
  {
    id: 5,
    name: 'Succulents',
    slug: 'succulents',
    description: 'Water-storing fleshy geometric specimens that thrive with minimal watering.',
    icon: '🌵',
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 6,
    name: 'Cactus',
    slug: 'cactus',
    description: 'Architectural desert icons celebrated for sculpted spines and remarkable resilience.',
    icon: '🏜️',
    image: 'https://images.unsplash.com/photo-1519336056116-bc0f1771dec8?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 7,
    name: 'Herbs & Medicinal Plants',
    slug: 'herbs-medicinal',
    description: 'Aromatic kitchen herbs and traditional healing botanicals for fresh daily harvesting.',
    icon: '🌱',
    image: 'https://inaturalist-open-data.s3.amazonaws.com/photos/154769884/medium.jpg',
  },
  {
    id: 8,
    name: 'Fruit Plants',
    slug: 'fruit-plants',
    description: 'Potted citrus, dwarf trees, and berry shrubs for container harvesting on balconies and patios.',
    icon: '🍋',
    image: 'https://static.inaturalist.org/photos/58699945/medium.jpg',
  },
  {
    id: 9,
    name: 'Hanging & Trailing Plants',
    slug: 'hanging-trailing',
    description: 'Cascading vines and creeping runners that drape gracefully from planters and shelves.',
    icon: '🍃',
    image: 'https://inaturalist-open-data.s3.amazonaws.com/photos/63122305/medium.jpg',
  },
  {
    id: 10,
    name: 'Bonsai & Rare Plants',
    slug: 'bonsai-rare',
    description: 'Living sculptural art forms and coveted variegated specimens for botanical connoisseurs.',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=400&q=80',
  },
];

// Retain alias for backwards compatibility
export const SAMPLE_CATEGORIES = PLANT_CATEGORIES;
