/**
 * PLANTIFY CURATED CATALOG (100 Botanical Specimens across 10 Categories)
 * 
 * VERIFIED BOTANICAL IMAGERY:
 * Every specimen in this catalog is paired with an authentic scientific photograph
 * sourced from verified botanical taxonomy observation archives (iNaturalist Open Data).
 * Unrelated food, restaurant, or non-botanical images are strictly excluded.
 * 
 * DISCLAIMER & DATA TRANSPARENCY:
 * This catalog contains curated sample/demo e-commerce inventory. Ratings and
 * review counts are realistic demo metrics for design validation.
 * Live taxonomy and observation data is retrieved separately via the iNaturalist API.
 */

export const SAMPLE_PLANTS = [
  {
    "id": 1,
    "name": "Peace Lily",
    "scientificName": "Spathiphyllum wallisii",
    "category": "Flowering Plants",
    "categorySlug": "flowering-plants",
    "tags": [
      "flowering",
      "indoor",
      "air-purifying",
      "white-bloom"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/212419198/medium.jpeg",
    "shortDescription": "Elegant pure-white blooms rising gracefully above deep glossy green foliage.",
    "light": "Medium Light",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 32,
    "originalPrice": 38,
    "rating": 4.8,
    "reviewCount": 142,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Bestseller",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 2,
    "name": "Moth Orchid",
    "scientificName": "Phalaenopsis aphrodite",
    "category": "Flowering Plants",
    "categorySlug": "flowering-plants",
    "tags": [
      "flowering",
      "indoor",
      "exotic",
      "long-blooming"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/368194406/medium.jpeg",
    "shortDescription": "Long-lasting sculptural butterfly blossoms that stay vibrant for months.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 44,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 88,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 3,
    "name": "Flamingo Flower",
    "scientificName": "Anthurium andraeanum",
    "category": "Flowering Plants",
    "categorySlug": "flowering-plants",
    "tags": [
      "flowering",
      "indoor",
      "tropical",
      "red-bloom"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/29292719/medium.jpg",
    "shortDescription": "Lacquered heart-shaped scarlet spathes that bloom year-round in humid spaces.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 38.5,
    "originalPrice": 46,
    "rating": 4.6,
    "reviewCount": 65,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Popular",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 4,
    "name": "Tropical Hibiscus",
    "scientificName": "Hibiscus rosa-sinensis",
    "category": "Flowering Plants",
    "categorySlug": "flowering-plants",
    "tags": [
      "flowering",
      "outdoor",
      "pollinator-friendly",
      "vibrant"
    ],
    "image": "https://static.inaturalist.org/photos/115046668/medium.jpeg",
    "shortDescription": "Show-stopping dinner-plate blooms adored by hummingbirds and butterflies.",
    "light": "Full Sun",
    "water": "Twice weekly",
    "environment": "Outdoor",
    "difficulty": "Moderate",
    "price": 28,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 110,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Sun Loving",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 5,
    "name": "Arabian Jasmine",
    "scientificName": "Jasminum sambac",
    "category": "Flowering Plants",
    "categorySlug": "flowering-plants",
    "tags": [
      "flowering",
      "both",
      "fragrant",
      "aromatic"
    ],
    "image": "https://static.inaturalist.org/photos/77617055/medium.jpg",
    "shortDescription": "Intensely fragrant starry white blossoms traditionally used in soothing teas.",
    "light": "Bright Indirect",
    "water": "Twice weekly",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 34,
    "originalPrice": 40,
    "rating": 4.9,
    "reviewCount": 195,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Fragrant",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 6,
    "name": "African Violet",
    "scientificName": "Saintpaulia ionantha",
    "category": "Flowering Plants",
    "categorySlug": "flowering-plants",
    "tags": [
      "flowering",
      "indoor",
      "compact",
      "velvety"
    ],
    "image": "https://static.inaturalist.org/photos/58683953/medium.jpeg",
    "shortDescription": "Velvety fuzzy rosettes crowned with cluster after cluster of royal violet flowers.",
    "light": "Medium Light",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 18.5,
    "originalPrice": null,
    "rating": 4.5,
    "reviewCount": 74,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Compact",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 7,
    "name": "Cape Jasmine Gardenia",
    "scientificName": "Gardenia jasminoides",
    "category": "Flowering Plants",
    "categorySlug": "flowering-plants",
    "tags": [
      "flowering",
      "both",
      "fragrant",
      "luxury"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/72076739/medium.jpg",
    "shortDescription": "Lustrous emerald foliage paired with intoxicating creamy-white blossoms.",
    "light": "Full Sun",
    "water": "Twice weekly",
    "environment": "Both",
    "difficulty": "Expert",
    "price": 48,
    "originalPrice": 58,
    "rating": 4.6,
    "reviewCount": 52,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Connoisseur",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 8,
    "name": "Polka Dot Begonia",
    "scientificName": "Begonia maculata",
    "category": "Flowering Plants",
    "categorySlug": "flowering-plants",
    "tags": [
      "flowering",
      "indoor",
      "patterned",
      "angel-wing"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/176033720/medium.jpeg",
    "shortDescription": "Silver polka-dotted angel wing leaves with crimson undersides and delicate blush blooms.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 36,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 160,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Statement",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 9,
    "name": "Royal Amaryllis",
    "scientificName": "Hippeastrum hybrid",
    "category": "Flowering Plants",
    "categorySlug": "flowering-plants",
    "tags": [
      "flowering",
      "indoor",
      "bulb",
      "winter-blooming"
    ],
    "image": "https://static.inaturalist.org/photos/112789549/medium.jpg",
    "shortDescription": "Colossal trumpet-shaped blooms that provide radiant indoor color throughout winter.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 29,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 43,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Seasonal Star",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 10,
    "name": "Bird of Paradise (Orange)",
    "scientificName": "Strelitzia reginae",
    "category": "Flowering Plants",
    "categorySlug": "flowering-plants",
    "tags": [
      "flowering",
      "both",
      "architectural",
      "tropical"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/375256909/medium.jpg",
    "shortDescription": "Exotic crane-shaped neon orange and cobalt blooms commanding attention in bright spaces.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 62,
    "originalPrice": 75,
    "rating": 4.9,
    "reviewCount": 220,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Architectural",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 11,
    "name": "Monstera Deliciosa",
    "scientificName": "Monstera deliciosa",
    "category": "Leafy Plants",
    "categorySlug": "leafy-plants",
    "tags": [
      "leafy",
      "indoor",
      "climbing",
      "fenestrated"
    ],
    "image": "https://static.inaturalist.org/photos/10534833/medium.jpeg",
    "shortDescription": "The undisputed icon of interior botanical design with deep perforated Swiss-cheese leaves.",
    "light": "Bright Indirect",
    "water": "Every 1–2 weeks",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 48,
    "originalPrice": 58,
    "rating": 4.9,
    "reviewCount": 310,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Bestseller",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 12,
    "name": "Fiddle Leaf Fig",
    "scientificName": "Ficus lyrata",
    "category": "Leafy Plants",
    "categorySlug": "leafy-plants",
    "tags": [
      "leafy",
      "indoor",
      "tree",
      "architectural"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/542743857/medium.jpg",
    "shortDescription": "Massive violin-shaped leathery leaves that bring architectural grandeur to living spaces.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 65,
    "originalPrice": 78,
    "rating": 4.7,
    "reviewCount": 245,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Designer Pick",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 13,
    "name": "Calathea Orbifolia",
    "scientificName": "Goeppertia orbifolia",
    "category": "Leafy Plants",
    "categorySlug": "leafy-plants",
    "tags": [
      "leafy",
      "indoor",
      "pet-safe",
      "patterned"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/88418370/medium.jpeg",
    "shortDescription": "Broad silver-striped circular leaves that fold upright in evening prayer.",
    "light": "Medium Light",
    "water": "Twice weekly",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 36.5,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 115,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 14,
    "name": "Alocasia Polly",
    "scientificName": "Alocasia amazonica",
    "category": "Leafy Plants",
    "categorySlug": "leafy-plants",
    "tags": [
      "leafy",
      "indoor",
      "sculptural",
      "dark-foliage"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/7471383/medium.jpg",
    "shortDescription": "Dramatic arrow-shaped shield foliage highlighted with contrasting silver ribs.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 34,
    "originalPrice": 42,
    "rating": 4.6,
    "reviewCount": 78,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Dramatic",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 15,
    "name": "Dumb Cane Camille",
    "scientificName": "Dieffenbachia seguine",
    "category": "Leafy Plants",
    "categorySlug": "leafy-plants",
    "tags": [
      "leafy",
      "indoor",
      "variegated",
      "easy-care"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/325214430/medium.jpg",
    "shortDescription": "Creamy chartreuse leaf centers framed by crisp dark emerald borders.",
    "light": "Medium Light",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 26,
    "originalPrice": null,
    "rating": 4.6,
    "reviewCount": 92,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Easy Care",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 16,
    "name": "Chinese Evergreen Silver Bay",
    "scientificName": "Aglaonema commutatum",
    "category": "Leafy Plants",
    "categorySlug": "leafy-plants",
    "tags": [
      "leafy",
      "indoor",
      "low-light",
      "resilient"
    ],
    "image": "https://static.inaturalist.org/photos/36264101/medium.jpg",
    "shortDescription": "Silvery pewter centered foliage engineered to thrive even in low-light office corners.",
    "light": "Low Light",
    "water": "Every 2-3 weeks",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 35,
    "originalPrice": null,
    "rating": 4.9,
    "reviewCount": 180,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Low Light Hero",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 17,
    "name": "Philodendron Birkin",
    "scientificName": "Philodendron birkin",
    "category": "Leafy Plants",
    "categorySlug": "leafy-plants",
    "tags": [
      "leafy",
      "indoor",
      "striped",
      "compact"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/127883167/medium.jpeg",
    "shortDescription": "Pinstriped glossy leaves sporting delicate creamy white variegation.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 31,
    "originalPrice": 38,
    "rating": 4.7,
    "reviewCount": 104,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Pinstriped",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 18,
    "name": "Dwarf Umbrella Tree",
    "scientificName": "Schefflera arboricola",
    "category": "Leafy Plants",
    "categorySlug": "leafy-plants",
    "tags": [
      "leafy",
      "both",
      "canopy",
      "fast-growing"
    ],
    "image": "https://static.inaturalist.org/photos/223193851/medium.jpg",
    "shortDescription": "Whimsical spokes of palmately compound leaves forming an umbrella-like canopy.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 29.5,
    "originalPrice": null,
    "rating": 4.6,
    "reviewCount": 88,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Fast Grower",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 19,
    "name": "Burgundy Rubber Tree",
    "scientificName": "Ficus elastica Burgundy",
    "category": "Leafy Plants",
    "categorySlug": "leafy-plants",
    "tags": [
      "leafy",
      "indoor",
      "broad-leaf",
      "deep-color"
    ],
    "image": "https://static.inaturalist.org/photos/56915457/medium.jpeg",
    "shortDescription": "Stout, lustrous dark burgundy foliage that adds a mood-setting contrast to modern spaces.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 42,
    "originalPrice": 50,
    "rating": 4.8,
    "reviewCount": 165,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Air Purifying",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 20,
    "name": "Cast Iron Plant",
    "scientificName": "Aspidistra elatior",
    "category": "Leafy Plants",
    "categorySlug": "leafy-plants",
    "tags": [
      "leafy",
      "both",
      "indestructible",
      "low-light"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/226154035/medium.jpeg",
    "shortDescription": "Unfazed by deep shade, poor soil, and irregular watering; truly ironclad durability.",
    "light": "Low Light",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Very Easy",
    "price": 39,
    "originalPrice": null,
    "rating": 4.9,
    "reviewCount": 130,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Indestructible",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 21,
    "name": "Snake Plant Laurentii",
    "scientificName": "Dracaena trifasciata",
    "category": "Indoor Plants",
    "categorySlug": "indoor-plants",
    "tags": [
      "indoor",
      "air-purifying",
      "succulent-like",
      "bedroom"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/488135905/medium.jpeg",
    "shortDescription": "Upright architectural sword blades edged with bright gold, giving off night-time oxygen.",
    "light": "Low Light",
    "water": "Every 2-3 weeks",
    "environment": "Indoor",
    "difficulty": "Very Easy",
    "price": 29,
    "originalPrice": null,
    "rating": 4.9,
    "reviewCount": 380,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "NASA Purifier",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 22,
    "name": "ZZ Plant",
    "scientificName": "Zamioculcas zamiifolia",
    "category": "Indoor Plants",
    "categorySlug": "indoor-plants",
    "tags": [
      "indoor",
      "glossy",
      "drought-tolerant",
      "low-light"
    ],
    "image": "https://static.inaturalist.org/photos/172462450/medium.jpeg",
    "shortDescription": "Waxy deep emerald leaflets storing reserves in tuberous underground rhizomes.",
    "light": "Low Light",
    "water": "Every 2-3 weeks",
    "environment": "Indoor",
    "difficulty": "Very Easy",
    "price": 36,
    "originalPrice": 42,
    "rating": 4.9,
    "reviewCount": 290,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Foolproof",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 23,
    "name": "Golden Pothos",
    "scientificName": "Epipremnum aureum",
    "category": "Indoor Plants",
    "categorySlug": "indoor-plants",
    "tags": [
      "indoor",
      "vine",
      "hanging",
      "beginner-friendly"
    ],
    "image": "https://static.inaturalist.org/photos/100110119/medium.jpg",
    "shortDescription": "Fast-trailing heart-shaped leaves marbled with sunlight gold; forgiving of neglect.",
    "light": "Medium Light",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 22,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 340,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Top Starter",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 24,
    "name": "Spider Plant Variegated",
    "scientificName": "Chlorophytum comosum",
    "category": "Indoor Plants",
    "categorySlug": "indoor-plants",
    "tags": [
      "indoor",
      "pet-safe",
      "hanging",
      "air-purifying"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/362493860/medium.jpeg",
    "shortDescription": "Cascades of ribbon-like striped leaves that produce delightful miniature baby plantlets.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 24,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 215,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 25,
    "name": "Parlor Palm",
    "scientificName": "Chamaedorea elegans",
    "category": "Indoor Plants",
    "categorySlug": "indoor-plants",
    "tags": [
      "indoor",
      "palm",
      "pet-safe",
      "victorian"
    ],
    "image": "https://static.inaturalist.org/photos/4936356/medium.jpg",
    "shortDescription": "Classic Victorian table palm with delicate feathery fronds, verified 100% pet-safe.",
    "light": "Medium Light",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 28.5,
    "originalPrice": 35,
    "rating": 4.7,
    "reviewCount": 140,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 26,
    "name": "Dragon Tree Marginata",
    "scientificName": "Dracaena marginata",
    "category": "Indoor Plants",
    "categorySlug": "indoor-plants",
    "tags": [
      "indoor",
      "architectural",
      "slender",
      "red-edge"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/85543245/medium.jpg",
    "shortDescription": "Graceful woody canes crowned with bursts of ribbon foliage trimmed in crimson.",
    "light": "Bright Indirect",
    "water": "Every 2-3 weeks",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 34,
    "originalPrice": null,
    "rating": 4.6,
    "reviewCount": 98,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Architectural",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 27,
    "name": "Calathea Medallion",
    "scientificName": "Goeppertia veitchiana",
    "category": "Indoor Plants",
    "categorySlug": "indoor-plants",
    "tags": [
      "indoor",
      "prayer-plant",
      "patterned",
      "purple-underside"
    ],
    "image": "https://static.inaturalist.org/photos/457053365/medium.jpeg",
    "shortDescription": "Ornate medallion patterns on deep green foliage with luxurious plum undersides.",
    "light": "Medium Light",
    "water": "Twice weekly",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 33,
    "originalPrice": 40,
    "rating": 4.6,
    "reviewCount": 82,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 28,
    "name": "Baby Rubber Plant",
    "scientificName": "Peperomia obtusifolia",
    "category": "Indoor Plants",
    "categorySlug": "indoor-plants",
    "tags": [
      "indoor",
      "succulent-like",
      "pet-safe",
      "compact"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/455196616/medium.jpeg",
    "shortDescription": "Compact spoon-shaped waxy green leaves that store water like a succulent.",
    "light": "Bright Indirect",
    "water": "Every 1–2 weeks",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 20,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 112,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Desktop Size",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 29,
    "name": "Braided Money Tree",
    "scientificName": "Pachira aquatica",
    "category": "Indoor Plants",
    "categorySlug": "indoor-plants",
    "tags": [
      "indoor",
      "braided-stem",
      "feng-shui",
      "tree"
    ],
    "image": "https://static.inaturalist.org/photos/41385494/medium.jpeg",
    "shortDescription": "Traditional symbol of prosperity and good fortune with hand-braided woody trunks.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 52,
    "originalPrice": 62,
    "rating": 4.8,
    "reviewCount": 230,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Good Luck",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 30,
    "name": "Aluminum Plant",
    "scientificName": "Pilea cadierei",
    "category": "Indoor Plants",
    "categorySlug": "indoor-plants",
    "tags": [
      "indoor",
      "metallic",
      "compact",
      "striking"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/724205/medium.jpg",
    "shortDescription": "Quilted foliage painted with iridescent metallic silver brush splashes.",
    "light": "Medium Light",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 19,
    "originalPrice": null,
    "rating": 4.5,
    "reviewCount": 56,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 31,
    "name": "Areca Palm",
    "scientificName": "Dypsis lutescens",
    "category": "Outdoor Plants",
    "categorySlug": "outdoor-plants",
    "tags": [
      "outdoor",
      "palm",
      "patio",
      "privacy-screen"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/35293993/medium.jpeg",
    "shortDescription": "Graceful golden cane fronds providing airy tropical shade on sunny patios and porches.",
    "light": "Full Sun",
    "water": "Twice weekly",
    "environment": "Outdoor",
    "difficulty": "Easy",
    "price": 58,
    "originalPrice": 70,
    "rating": 4.8,
    "reviewCount": 175,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Patio Hero",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 32,
    "name": "Purple Bougainvillea",
    "scientificName": "Bougainvillea spectabilis",
    "category": "Outdoor Plants",
    "categorySlug": "outdoor-plants",
    "tags": [
      "outdoor",
      "climber",
      "sun-loving",
      "drought-tolerant"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/282403493/medium.jpg",
    "shortDescription": "Explosive sheets of magenta paper bracts thriving in blazing outdoor sunlight.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Outdoor",
    "difficulty": "Easy",
    "price": 34,
    "originalPrice": null,
    "rating": 4.9,
    "reviewCount": 210,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Sun Loving",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 33,
    "name": "English Lavender",
    "scientificName": "Lavandula angustifolia",
    "category": "Outdoor Plants",
    "categorySlug": "outdoor-plants",
    "tags": [
      "outdoor",
      "aromatic",
      "pollinator-friendly",
      "herbal"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/157057/medium.jpg",
    "shortDescription": "Silvery aromatic subshrub with soothing purple spikes that attract bees and butterflies.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Outdoor",
    "difficulty": "Moderate",
    "price": 24.5,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 190,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Aromatic",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 34,
    "name": "English Boxwood Shrub",
    "scientificName": "Buxus sempervirens",
    "category": "Outdoor Plants",
    "categorySlug": "outdoor-plants",
    "tags": [
      "outdoor",
      "hedge",
      "evergreen",
      "formal"
    ],
    "image": "https://static.inaturalist.org/photos/43384449/medium.jpeg",
    "shortDescription": "Timeless formal evergreen shrub easily sculpted into classic topiary spheres and hedges.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Outdoor",
    "difficulty": "Easy",
    "price": 38,
    "originalPrice": 45,
    "rating": 4.7,
    "reviewCount": 85,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Evergreen",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 35,
    "name": "French Hydrangea",
    "scientificName": "Hydrangea macrophylla",
    "category": "Outdoor Plants",
    "categorySlug": "outdoor-plants",
    "tags": [
      "outdoor",
      "blooms",
      "shade-tolerant",
      "garden"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/45518546/medium.jpg",
    "shortDescription": "Giant mophead blossoms shifting in pastel blues and pinks based on soil acidity.",
    "light": "Bright Indirect",
    "water": "Twice weekly",
    "environment": "Outdoor",
    "difficulty": "Moderate",
    "price": 42,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 140,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Garden Favorite",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 36,
    "name": "Japanese Bloodgood Maple",
    "scientificName": "Acer palmatum Bloodgood",
    "category": "Outdoor Plants",
    "categorySlug": "outdoor-plants",
    "tags": [
      "outdoor",
      "tree",
      "autumn-color",
      "sculptural"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/27342760/medium.jpeg",
    "shortDescription": "Deep crimson palmate foliage that ignites with brilliant scarlet hues in autumn.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Outdoor",
    "difficulty": "Moderate",
    "price": 75,
    "originalPrice": 90,
    "rating": 4.9,
    "reviewCount": 160,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Premium Garden",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 37,
    "name": "Hybrid Tea Rose (Classic Red)",
    "scientificName": "Rosa hybrida",
    "category": "Outdoor Plants",
    "categorySlug": "outdoor-plants",
    "tags": [
      "outdoor",
      "flowering",
      "fragrant",
      "romantic"
    ],
    "image": "https://static.inaturalist.org/photos/221996/medium.JPG",
    "shortDescription": "Long-stemmed velvet crimson blossoms possessing an enchanting sweet heirloom scent.",
    "light": "Full Sun",
    "water": "Twice weekly",
    "environment": "Outdoor",
    "difficulty": "Moderate",
    "price": 36,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 125,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Classic Bloom",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 38,
    "name": "Rainbow Coleus",
    "scientificName": "Coleus scutellarioides",
    "category": "Outdoor Plants",
    "categorySlug": "outdoor-plants",
    "tags": [
      "outdoor",
      "colorful",
      "shade-lover",
      "foliage"
    ],
    "image": "https://static.inaturalist.org/photos/174181538/medium.jpg",
    "shortDescription": "Electrifying kaleidoscopic foliage blending chartreuse, magenta, and deep burgundy.",
    "light": "Medium Light",
    "water": "Twice weekly",
    "environment": "Outdoor",
    "difficulty": "Easy",
    "price": 18,
    "originalPrice": null,
    "rating": 4.6,
    "reviewCount": 65,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Vibrant",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 39,
    "name": "Croton Petra",
    "scientificName": "Codiaeum variegatum",
    "category": "Outdoor Plants",
    "categorySlug": "outdoor-plants",
    "tags": [
      "outdoor",
      "tropical",
      "bold-color",
      "patio"
    ],
    "image": "https://static.inaturalist.org/photos/12281315/medium.jpg",
    "shortDescription": "Thick leathery leaves painted with fiery veins of amber, sunset red, and canary yellow.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 29,
    "originalPrice": 35,
    "rating": 4.6,
    "reviewCount": 88,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Fiery Foliage",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 40,
    "name": "Giant White Bird of Paradise",
    "scientificName": "Strelitzia nicolai",
    "category": "Outdoor Plants",
    "categorySlug": "outdoor-plants",
    "tags": [
      "outdoor",
      "banana-leaf",
      "giant",
      "patio"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/295952594/medium.jpeg",
    "shortDescription": "Massive towering fan leaves creating an instant tropical resort vibe in warm courtyards.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Outdoor",
    "difficulty": "Easy",
    "price": 68,
    "originalPrice": 85,
    "rating": 4.8,
    "reviewCount": 150,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Showstopper",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 41,
    "name": "Echeveria Elegans",
    "scientificName": "Echeveria elegans",
    "category": "Succulents",
    "categorySlug": "succulents",
    "tags": [
      "succulent",
      "geometric",
      "drought-hardy",
      "rosette"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/9087424/medium.jpeg",
    "shortDescription": "Flawless pale blue-grey rosettes with translucent leaf margins resembling sculpted stone.",
    "light": "Direct Sunlight",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Very Easy",
    "price": 15,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 190,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Top Succulent",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 42,
    "name": "Jade Plant (Money Tree)",
    "scientificName": "Crassula ovata",
    "category": "Succulents",
    "categorySlug": "succulents",
    "tags": [
      "succulent",
      "longevity",
      "woody",
      "indoor"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/39359845/medium.jpeg",
    "shortDescription": "Fleshy tear-shaped leaves on miniature gnarled woody branches symbolizing enduring wealth.",
    "light": "Bright Indirect",
    "water": "Every 2-3 weeks",
    "environment": "Indoor",
    "difficulty": "Very Easy",
    "price": 26,
    "originalPrice": 32,
    "rating": 4.9,
    "reviewCount": 260,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Generational",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 43,
    "name": "Zebra Haworthia",
    "scientificName": "Haworthiopsis fasciata",
    "category": "Succulents",
    "categorySlug": "succulents",
    "tags": [
      "succulent",
      "striped",
      "compact",
      "pet-safe"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/15511588/medium.jpg",
    "shortDescription": "Pointed dark green rosettes embossed with prominent white horizontal zebra ridges.",
    "light": "Bright Indirect",
    "water": "Every 2-3 weeks",
    "environment": "Indoor",
    "difficulty": "Very Easy",
    "price": 18,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 145,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 44,
    "name": "String of Pearls",
    "scientificName": "Senecio rowleyanus",
    "category": "Succulents",
    "categorySlug": "succulents",
    "tags": [
      "succulent",
      "trailing",
      "hanging",
      "unique"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/16031262/medium.jpg",
    "shortDescription": "Cascades of spherical green bead-like succulent peas that spill gracefully over pots.",
    "light": "Bright Indirect",
    "water": "Every 2-3 weeks",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 24,
    "originalPrice": 30,
    "rating": 4.7,
    "reviewCount": 180,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Collector",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 45,
    "name": "Burro's Tail",
    "scientificName": "Sedum morganianum",
    "category": "Succulents",
    "categorySlug": "succulents",
    "tags": [
      "succulent",
      "trailing",
      "hanging",
      "drought-hardy"
    ],
    "image": "https://static.inaturalist.org/photos/35170913/medium.jpeg",
    "shortDescription": "Heavy trailing plaits of plump, blue-green teardrop leaves cascading up to three feet.",
    "light": "Direct Sunlight",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 28,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 135,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 46,
    "name": "Medicinal Aloe Vera",
    "scientificName": "Aloe barbadensis miller",
    "category": "Succulents",
    "categorySlug": "succulents",
    "tags": [
      "succulent",
      "medicinal",
      "gel-rich",
      "first-aid"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/3235627/medium.JPG",
    "shortDescription": "Plump soothing spears filled with healing, nutrient-dense natural aloe gel.",
    "light": "Bright Indirect",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Very Easy",
    "price": 22,
    "originalPrice": null,
    "rating": 4.9,
    "reviewCount": 310,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "First Aid Plant",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 47,
    "name": "Panda Plant",
    "scientificName": "Kalanchoe tomentosa",
    "category": "Succulents",
    "categorySlug": "succulents",
    "tags": [
      "succulent",
      "fuzzy",
      "brown-dots",
      "soft"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/110757052/medium.jpeg",
    "shortDescription": "Ultra-soft velvety grey-green leaves playfully rimmed with cocoa-brown stitched dots.",
    "light": "Bright Indirect",
    "water": "Every 2-3 weeks",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 19.5,
    "originalPrice": null,
    "rating": 4.6,
    "reviewCount": 78,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Velvety",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 48,
    "name": "Hens and Chicks",
    "scientificName": "Sempervivum tectorum",
    "category": "Succulents",
    "categorySlug": "succulents",
    "tags": [
      "succulent",
      "outdoor",
      "frost-hardy",
      "cluster"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/306412481/medium.jpeg",
    "shortDescription": "Rugged frost-resistant rosettes multiplying into tight geometric carpet clusters.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Outdoor",
    "difficulty": "Very Easy",
    "price": 16,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 94,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Frost Hardy",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 49,
    "name": "Ghost Plant",
    "scientificName": "Graptopetalum paraguayense",
    "category": "Succulents",
    "categorySlug": "succulents",
    "tags": [
      "succulent",
      "trailing",
      "pastel",
      "iridescent"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/118138316/medium.jpg",
    "shortDescription": "Opalescent silver-lavender rosettes that gently blush pale pink under bright sunlight.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 17.5,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 68,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 50,
    "name": "Black Rose Tree Aeonium",
    "scientificName": "Aeonium arboreum Zwartkop",
    "category": "Succulents",
    "categorySlug": "succulents",
    "tags": [
      "succulent",
      "black-foliage",
      "dramatic",
      "sculptural"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/51965756/medium.jpg",
    "shortDescription": "Near-black rosettes resting atop branching stems like dark floral sculptures.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 32,
    "originalPrice": 38,
    "rating": 4.9,
    "reviewCount": 140,
    "badge": {
      "text": "Dramatic Rare",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 51,
    "name": "Golden Barrel Cactus",
    "scientificName": "Echinocactus grusonii",
    "category": "Cactus",
    "categorySlug": "cactus",
    "tags": [
      "cactus",
      "desert",
      "globe",
      "golden-spines"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/1700273/medium.jpg",
    "shortDescription": "Globular ribbed body completely cloaked in glowing golden yellow radial spines.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Very Easy",
    "price": 38,
    "originalPrice": 46,
    "rating": 4.9,
    "reviewCount": 185,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Desert Icon",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 52,
    "name": "Saguaro Cactus (Miniature)",
    "scientificName": "Carnegiea gigantea",
    "category": "Cactus",
    "categorySlug": "cactus",
    "tags": [
      "cactus",
      "desert",
      "iconic",
      "slow-grower"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/77029090/medium.jpg",
    "shortDescription": "Authentic seedling of the legendary Sonoran desert monarch; grows gracefully for decades.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 45,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 92,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Heirloom",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 53,
    "name": "Bunny Ears Cactus",
    "scientificName": "Opuntia microdasys",
    "category": "Cactus",
    "categorySlug": "cactus",
    "tags": [
      "cactus",
      "playful",
      "pad-cactus",
      "white-polka"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/11888385/medium.jpg",
    "shortDescription": "Playful bunny-ear pads studded with velvety golden-white glochid tufts.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 21,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 160,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Popular",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 54,
    "name": "Moon Cactus (Vivid Ruby)",
    "scientificName": "Gymnocalycium mihanovichii",
    "category": "Cactus",
    "categorySlug": "cactus",
    "tags": [
      "cactus",
      "grafted",
      "neon-color",
      "desktop"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/65364188/medium.jpeg",
    "shortDescription": "Brilliant ruby-red mutant orb grafted onto an emerald columnar rootstock.",
    "light": "Bright Indirect",
    "water": "Every 2-3 weeks",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 18,
    "originalPrice": null,
    "rating": 4.6,
    "reviewCount": 120,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Vivid Neon",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 55,
    "name": "Christmas Cactus",
    "scientificName": "Schlumbergera bridgesii",
    "category": "Cactus",
    "categorySlug": "cactus",
    "tags": [
      "cactus",
      "flowering",
      "spineless",
      "holiday"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/257014573/medium.jpg",
    "shortDescription": "Gentle spineless woodland cactus that erupts with fuchsia blooms every holiday season.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 27,
    "originalPrice": 32,
    "rating": 4.9,
    "reviewCount": 240,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 56,
    "name": "Old Man of the Andes",
    "scientificName": "Oreocereus celsianus",
    "category": "Cactus",
    "categorySlug": "cactus",
    "tags": [
      "cactus",
      "hairy",
      "mountain",
      "collector"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/10436564/medium.jpg",
    "shortDescription": "High-altitude columnar cactus wrapped in dense coats of silky white wool.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 36,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 74,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Collector",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 57,
    "name": "Fishbone Ric Rac Cactus",
    "scientificName": "Disocactus anguliger",
    "category": "Cactus",
    "categorySlug": "cactus",
    "tags": [
      "cactus",
      "zigzag",
      "hanging",
      "spineless"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/78978149/medium.jpg",
    "shortDescription": "Fascinating ric-rac zigzag stems that trail smoothly over hanging baskets without thorns.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 33,
    "originalPrice": 40,
    "rating": 4.8,
    "reviewCount": 110,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 58,
    "name": "Blue Columnar Cactus",
    "scientificName": "Pilosocereus pachycladus",
    "category": "Cactus",
    "categorySlug": "cactus",
    "tags": [
      "cactus",
      "blue-stem",
      "columnar",
      "architectural"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/66803533/medium.jpg",
    "shortDescription": "Striking turquoise-blue ribbed columns lined with contrasting golden needle clusters.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 46,
    "originalPrice": 55,
    "rating": 4.9,
    "reviewCount": 130,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Azure Blue",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 59,
    "name": "Fairy Castle Cactus",
    "scientificName": "Acanthocereus tetragonus",
    "category": "Cactus",
    "categorySlug": "cactus",
    "tags": [
      "cactus",
      "turreted",
      "whimsical",
      "desktop"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/4853738/medium.jpeg",
    "shortDescription": "Numerous vertical ribbed green spires that cluster together like medieval castle turrets.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Very Easy",
    "price": 24,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 95,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Sculptural",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 60,
    "name": "Bishop's Cap Star Cactus",
    "scientificName": "Astrophytum myriostigma",
    "category": "Cactus",
    "categorySlug": "cactus",
    "tags": [
      "cactus",
      "spineless",
      "geometric",
      "five-ribbed"
    ],
    "image": "https://static.inaturalist.org/photos/74623719/medium.jpg",
    "shortDescription": "Perfect five-ribbed spineless star-shaped dome dusted with thousands of tiny white flecks.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 39,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 82,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Collector Star",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 61,
    "name": "Genovese Sweet Basil",
    "scientificName": "Ocimum basilicum",
    "category": "Herbs & Medicinal Plants",
    "categorySlug": "herbs-medicinal",
    "tags": [
      "herbs",
      "culinary",
      "fragrant",
      "kitchen"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/154769884/medium.jpg",
    "shortDescription": "Tender aromatic emerald leaves indispensable for fresh pesto and authentic sauces.",
    "light": "Full Sun",
    "water": "Twice weekly",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 14.5,
    "originalPrice": null,
    "rating": 4.9,
    "reviewCount": 310,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Kitchen Essential",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 62,
    "name": "Tuscan Rosemary",
    "scientificName": "Salvia rosmarinus",
    "category": "Herbs & Medicinal Plants",
    "categorySlug": "herbs-medicinal",
    "tags": [
      "herbs",
      "woody",
      "aromatic",
      "drought-hardy"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/195669585/medium.jpeg",
    "shortDescription": "Piny resinous evergreen needles that perfume roasted dishes and kitchen gardens.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 18,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 220,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Hardy Evergreen",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 63,
    "name": "English Garden Thyme",
    "scientificName": "Thymus vulgaris",
    "category": "Herbs & Medicinal Plants",
    "categorySlug": "herbs-medicinal",
    "tags": [
      "herbs",
      "culinary",
      "low-water",
      "medicinal"
    ],
    "image": "https://static.inaturalist.org/photos/28120667/medium.jpg",
    "shortDescription": "Dense mats of tiny aromatic leaves loaded with antiseptic thymol compounds.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 15,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 145,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Medicinal",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 64,
    "name": "Moroccan Spearmint",
    "scientificName": "Mentha spicata",
    "category": "Herbs & Medicinal Plants",
    "categorySlug": "herbs-medicinal",
    "tags": [
      "herbs",
      "refreshing",
      "tea",
      "fast-grower"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/1186004/medium.jpg",
    "shortDescription": "Vigorous crisp spearmint that infuses teas, chilled beverages, and savory salads.",
    "light": "Bright Indirect",
    "water": "Twice weekly",
    "environment": "Both",
    "difficulty": "Very Easy",
    "price": 14,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 280,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Tea Favorite",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 65,
    "name": "Peppermint Herbal Pot",
    "scientificName": "Mentha x piperita",
    "category": "Herbs & Medicinal Plants",
    "categorySlug": "herbs-medicinal",
    "tags": [
      "herbs",
      "menthol",
      "digestive",
      "refreshing"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/226081574/medium.jpg",
    "shortDescription": "High-menthol serrated leaves famous for digestive wellness infusions and cooling aromatherapy.",
    "light": "Bright Indirect",
    "water": "Twice weekly",
    "environment": "Both",
    "difficulty": "Very Easy",
    "price": 14,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 195,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Aromatherapy",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 66,
    "name": "Culinary Garden Sage",
    "scientificName": "Salvia officinalis",
    "category": "Herbs & Medicinal Plants",
    "categorySlug": "herbs-medicinal",
    "tags": [
      "herbs",
      "velvet-leaf",
      "savory",
      "perennial"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/289195364/medium.jpg",
    "shortDescription": "Textured soft grey-green velvet leaves prized for autumnal savory butter sauces.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 17,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 110,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Heirloom Herb",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 67,
    "name": "Greek Mountain Oregano",
    "scientificName": "Origanum vulgare hirtum",
    "category": "Herbs & Medicinal Plants",
    "categorySlug": "herbs-medicinal",
    "tags": [
      "herbs",
      "robust-flavor",
      "pizza-herb",
      "mediterranean"
    ],
    "image": "https://static.inaturalist.org/photos/139218138/medium.jpg",
    "shortDescription": "Pungent zesty Mediterranean staple that releases peppery oils when crushed.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 15.5,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 140,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Authentic Greek",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 68,
    "name": "West Indian Lemongrass",
    "scientificName": "Cymbopogon citratus",
    "category": "Herbs & Medicinal Plants",
    "categorySlug": "herbs-medicinal",
    "tags": [
      "herbs",
      "citrus",
      "pest-repelling",
      "asian-cuisine"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/61513592/medium.jpg",
    "shortDescription": "Stately citrus-scented stalks that naturally deter mosquitoes and season soups.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 21,
    "originalPrice": null,
    "rating": 4.9,
    "reviewCount": 175,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Mosquito Repel",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 69,
    "name": "Sacred Tulsi (Holy Basil)",
    "scientificName": "Ocimum tenuiflorum",
    "category": "Herbs & Medicinal Plants",
    "categorySlug": "herbs-medicinal",
    "tags": [
      "herbs",
      "ayurvedic",
      "sacred",
      "adaptogen"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/129609853/medium.jpeg",
    "shortDescription": "Venerated Ayurvedic adaptogen known for stress-relieving herbal infusions.",
    "light": "Full Sun",
    "water": "Twice weekly",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 19,
    "originalPrice": null,
    "rating": 4.9,
    "reviewCount": 235,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Ayurvedic",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 70,
    "name": "German Chamomile",
    "scientificName": "Matricaria chamomilla",
    "category": "Herbs & Medicinal Plants",
    "categorySlug": "herbs-medicinal",
    "tags": [
      "herbs",
      "sleep-aid",
      "daisy-flower",
      "tea"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/528185258/medium.jpg",
    "shortDescription": "Dainty apple-scented daisy heads traditionally dried for calming evening slumber teas.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 16,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 105,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Sleep Aid",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 71,
    "name": "Meyer Lemon Tree (Patio Dwarf)",
    "scientificName": "Citrus x meyeri",
    "category": "Fruit Plants",
    "categorySlug": "fruit-plants",
    "tags": [
      "fruit",
      "citrus",
      "sweet-lemon",
      "patio-container"
    ],
    "image": "https://static.inaturalist.org/photos/58699945/medium.jpg",
    "shortDescription": "Sweet, thin-skinned culinary lemons produced abundantly on compact container trees.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 68,
    "originalPrice": 82,
    "rating": 4.9,
    "reviewCount": 290,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Container Fruit",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 72,
    "name": "Calamondin Mini Orange Tree",
    "scientificName": "Citrus x microcarpa",
    "category": "Fruit Plants",
    "categorySlug": "fruit-plants",
    "tags": [
      "fruit",
      "citrus",
      "ornamental",
      "indoor-fruiting"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/105875876/medium.jpeg",
    "shortDescription": "Intensely fragrant blossom flushes followed by decorative tart marmalade oranges.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 62,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 170,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Fragrant Citrus",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 73,
    "name": "Dwarf Cavendish Banana",
    "scientificName": "Musa acuminata",
    "category": "Fruit Plants",
    "categorySlug": "fruit-plants",
    "tags": [
      "fruit",
      "tropical",
      "large-leaf",
      "indoor-patio"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/3004694/medium.jpg",
    "shortDescription": "Paddle-shaped tropical leaves producing sweet baby bananas under strong sunny exposure.",
    "light": "Full Sun",
    "water": "Twice weekly",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 49,
    "originalPrice": 60,
    "rating": 4.7,
    "reviewCount": 135,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 74,
    "name": "Brown Turkey Fig Tree",
    "scientificName": "Ficus carica Brown Turkey",
    "category": "Fruit Plants",
    "categorySlug": "fruit-plants",
    "tags": [
      "fruit",
      "sweet-fig",
      "hardy",
      "patio"
    ],
    "image": "https://static.inaturalist.org/photos/106941726/medium.jpeg",
    "shortDescription": "Heavy harvests of honey-sweet purple-brown figs with rich ruby interior flesh.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 54,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 145,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Sweet Harvest",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 75,
    "name": "Dwarf Pomegranate Nana",
    "scientificName": "Punica granatum Nana",
    "category": "Fruit Plants",
    "categorySlug": "fruit-plants",
    "tags": [
      "fruit",
      "dwarf",
      "coral-blossom",
      "bonsai-candidate"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/176257719/medium.jpeg",
    "shortDescription": "Charming dwarf bush bearing fiery orange flowers followed by real miniature pomegranates.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 42,
    "originalPrice": 50,
    "rating": 4.7,
    "reviewCount": 88,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 76,
    "name": "Nagami Kumquat Tree",
    "scientificName": "Citrus japonica",
    "category": "Fruit Plants",
    "categorySlug": "fruit-plants",
    "tags": [
      "fruit",
      "citrus",
      "eat-the-skin",
      "cold-hardy"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/78189/medium.jpg",
    "shortDescription": "Bite-sized oblong citrus where the peel is delightfully sweet and the center pleasantly tart.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 64,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 95,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Edible Peel",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 77,
    "name": "Top Hat Patio Blueberry",
    "scientificName": "Vaccinium corymbosum Top Hat",
    "category": "Fruit Plants",
    "categorySlug": "fruit-plants",
    "tags": [
      "fruit",
      "berries",
      "superfood",
      "compact"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/56288/medium.jpg",
    "shortDescription": "Self-fertile miniature rounded blueberry bush loaded with sweet antioxidant-rich berries.",
    "light": "Full Sun",
    "water": "Twice weekly",
    "environment": "Outdoor",
    "difficulty": "Moderate",
    "price": 36,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 110,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Superfood",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 78,
    "name": "Arbequina Fruiting Olive Tree",
    "scientificName": "Olea europaea Arbequina",
    "category": "Fruit Plants",
    "categorySlug": "fruit-plants",
    "tags": [
      "fruit",
      "mediterranean",
      "silvery-leaf",
      "artisan"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/138510430/medium.jpeg",
    "shortDescription": "Shimmering silvery willow foliage producing rich aromatic olives in containers.",
    "light": "Full Sun",
    "water": "Every 2-3 weeks",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 58,
    "originalPrice": 72,
    "rating": 4.9,
    "reviewCount": 220,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Artisan Olive",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 79,
    "name": "Hawaiian Dwarf Guava",
    "scientificName": "Psidium guajava Nana",
    "category": "Fruit Plants",
    "categorySlug": "fruit-plants",
    "tags": [
      "fruit",
      "tropical",
      "sweet-aroma",
      "exotic"
    ],
    "image": "https://static.inaturalist.org/photos/104601736/medium.jpg",
    "shortDescription": "Compact tropical shrub producing highly aromatic pink-fleshed tropical guavas.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 44,
    "originalPrice": null,
    "rating": 4.6,
    "reviewCount": 65,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Tropical",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 80,
    "name": "Everbearing Sweet Strawberry",
    "scientificName": "Fragaria x ananassa",
    "category": "Fruit Plants",
    "categorySlug": "fruit-plants",
    "tags": [
      "fruit",
      "sweet-berry",
      "hanging-pot",
      "easy"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/74966564/medium.jpg",
    "shortDescription": "Continuous harvest of juicy red berries cascading from hanging planters all season.",
    "light": "Full Sun",
    "water": "Twice weekly",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 18,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 275,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Continuous Berry",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 81,
    "name": "English Ivy Glacier",
    "scientificName": "Hedera helix Glacier",
    "category": "Hanging & Trailing Plants",
    "categorySlug": "hanging-trailing",
    "tags": [
      "hanging",
      "trailing",
      "white-variegated",
      "fast-climber"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/63122305/medium.jpg",
    "shortDescription": "Trailing curtain of triangular foliage with crisp frosted-white margins.",
    "light": "Medium Light",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 22,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 160,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Air Purifier",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 82,
    "name": "String of Hearts",
    "scientificName": "Ceropegia woodii",
    "category": "Hanging & Trailing Plants",
    "categorySlug": "hanging-trailing",
    "tags": [
      "hanging",
      "trailing",
      "heart-leaf",
      "romantic"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/1353883/medium.jpg",
    "shortDescription": "Dainty marbled heart-shaped succulent leaves strung like gems along delicate purple thread vines.",
    "light": "Bright Indirect",
    "water": "Every 2-3 weeks",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 32,
    "originalPrice": 38,
    "rating": 4.9,
    "reviewCount": 245,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 83,
    "name": "Silver Inch Plant (Tradescantia)",
    "scientificName": "Tradescantia zebrina",
    "category": "Hanging & Trailing Plants",
    "categorySlug": "hanging-trailing",
    "tags": [
      "hanging",
      "trailing",
      "purple-silver",
      "fast-grower"
    ],
    "image": "https://static.inaturalist.org/photos/100258841/medium.jpeg",
    "shortDescription": "Fast-trailing metallic foliage shimmering with silver longitudinal stripes and rich purple reverse.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Very Easy",
    "price": 20,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 210,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Fast Trail",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 84,
    "name": "String of Nickels",
    "scientificName": "Dischidia nummularia",
    "category": "Hanging & Trailing Plants",
    "categorySlug": "hanging-trailing",
    "tags": [
      "hanging",
      "epiphyte",
      "coin-leaf",
      "rare"
    ],
    "image": "https://static.inaturalist.org/photos/445467889/medium.jpeg",
    "shortDescription": "Cascades of plump flattened coin-like silvery-green leaves trailing down hanging driftwood.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 38,
    "originalPrice": 45,
    "rating": 4.7,
    "reviewCount": 75,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 85,
    "name": "Marble Queen Pothos",
    "scientificName": "Epipremnum aureum Marble Queen",
    "category": "Hanging & Trailing Plants",
    "categorySlug": "hanging-trailing",
    "tags": [
      "hanging",
      "trailing",
      "snow-marble",
      "foolproof"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/426177945/medium.jpeg",
    "shortDescription": "Heavily frosted cream-and-emerald marbled trailing vine that purifies room air effortlessly.",
    "light": "Medium Light",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Very Easy",
    "price": 26,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 190,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Popular",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 86,
    "name": "Heartleaf Philodendron",
    "scientificName": "Philodendron hederaceum",
    "category": "Hanging & Trailing Plants",
    "categorySlug": "hanging-trailing",
    "tags": [
      "hanging",
      "trailing",
      "heart-leaf",
      "sweetheart"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/335616661/medium.jpg",
    "shortDescription": "Lush sweetheart vine that drapes down bookshelves and gracefully tolerates dry indoor air.",
    "light": "Low Light",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Very Easy",
    "price": 21,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 220,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Low Light Star",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 87,
    "name": "Boston Sword Fern",
    "scientificName": "Nephrolepis exaltata",
    "category": "Hanging & Trailing Plants",
    "categorySlug": "hanging-trailing",
    "tags": [
      "hanging",
      "fern",
      "feathery",
      "humid-lover"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/19251591/medium.jpg",
    "shortDescription": "Arching fountains of delicate ruffled emerald fronds perfect for humid bathrooms.",
    "light": "Medium Light",
    "water": "Twice weekly",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 28,
    "originalPrice": 34,
    "rating": 4.7,
    "reviewCount": 170,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 88,
    "name": "String of Turtles",
    "scientificName": "Peperomia prostrata",
    "category": "Hanging & Trailing Plants",
    "categorySlug": "hanging-trailing",
    "tags": [
      "hanging",
      "succulent",
      "turtle-shell",
      "cute"
    ],
    "image": "https://static.inaturalist.org/photos/115001619/medium.jpg",
    "shortDescription": "Miniature trailing succulent leaves exhibiting the exact intricate patterns of tiny turtle carapaces.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 34,
    "originalPrice": 42,
    "rating": 4.8,
    "reviewCount": 130,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 89,
    "name": "Creeping Fig (Ficus Pumila)",
    "scientificName": "Ficus pumila",
    "category": "Hanging & Trailing Plants",
    "categorySlug": "hanging-trailing",
    "tags": [
      "hanging",
      "wall-creeper",
      "dense",
      "trailing"
    ],
    "image": "https://static.inaturalist.org/photos/59250812/medium.jpg",
    "shortDescription": "Tiny crinkled heart-shaped leaves forming lush trailing curtains or living green wall carpets.",
    "light": "Medium Light",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Easy",
    "price": 20,
    "originalPrice": null,
    "rating": 4.6,
    "reviewCount": 88,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Living Wall",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 90,
    "name": "Neon Pothos",
    "scientificName": "Epipremnum aureum Neon",
    "category": "Hanging & Trailing Plants",
    "categorySlug": "hanging-trailing",
    "tags": [
      "hanging",
      "chartreuse",
      "bright-color",
      "easy"
    ],
    "image": "https://static.inaturalist.org/photos/110106354/medium.jpg",
    "shortDescription": "Electrifying bright chartreuse-lime foliage that injects instant luminosity into shaded nooks.",
    "light": "Medium Light",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Very Easy",
    "price": 24,
    "originalPrice": null,
    "rating": 4.9,
    "reviewCount": 205,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Neon Glow",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 91,
    "name": "Ginseng Ficus Bonsai",
    "scientificName": "Ficus retusa",
    "category": "Bonsai & Rare Plants",
    "categorySlug": "bonsai-rare",
    "tags": [
      "bonsai",
      "sculptural",
      "beginner-bonsai",
      "exposed-root"
    ],
    "image": "https://static.inaturalist.org/photos/107519755/medium.jpeg",
    "shortDescription": "Exposed aerial banyan roots crowned with a sculpted umbrella of lustrous oval leaves.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Easy",
    "price": 58,
    "originalPrice": 70,
    "rating": 4.9,
    "reviewCount": 215,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Starter Bonsai",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 92,
    "name": "Japanese Juniper Bonsai",
    "scientificName": "Juniperus procumbens Nana",
    "category": "Bonsai & Rare Plants",
    "categorySlug": "bonsai-rare",
    "tags": [
      "bonsai",
      "traditional",
      "conifer",
      "zen"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/222457266/medium.jpg",
    "shortDescription": "The quintessence of Zen artistry, with swept evergreen needle pads mimicking weathered mountain giants.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Outdoor",
    "difficulty": "Moderate",
    "price": 72,
    "originalPrice": 85,
    "rating": 4.8,
    "reviewCount": 160,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Zen Classic",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 93,
    "name": "Chinese Elm Bonsai",
    "scientificName": "Ulmus parvifolia",
    "category": "Bonsai & Rare Plants",
    "categorySlug": "bonsai-rare",
    "tags": [
      "bonsai",
      "deciduous",
      "graceful-s-curve",
      "durable"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/231455411/medium.jpeg",
    "shortDescription": "Graceful S-curved trunk supporting delicate serrated miniature elm leaves; highly forgiving.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Both",
    "difficulty": "Moderate",
    "price": 64,
    "originalPrice": null,
    "rating": 4.8,
    "reviewCount": 110,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Pet Safe",
      "variant": "sage"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 94,
    "name": "Japanese Black Pine Bonsai",
    "scientificName": "Pinus thunbergii",
    "category": "Bonsai & Rare Plants",
    "categorySlug": "bonsai-rare",
    "tags": [
      "bonsai",
      "masculine",
      "rugged-bark",
      "masterwork"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/7609527/medium.jpeg",
    "shortDescription": "Revered in Japan as the symbol of fortitude, featuring thick fissured bark and sharp dark needles.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Outdoor",
    "difficulty": "Expert",
    "price": 98,
    "originalPrice": 120,
    "rating": 4.9,
    "reviewCount": 84,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Masterwork",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 95,
    "name": "Monstera Albo Variegata (Half Moon)",
    "scientificName": "Monstera deliciosa Albo Borsigiana",
    "category": "Bonsai & Rare Plants",
    "categorySlug": "bonsai-rare",
    "tags": [
      "rare",
      "variegated",
      "half-moon",
      "collector-grail"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/23676736/medium.jpeg",
    "shortDescription": "Holy grail of botanical collectors, boasting chimera sectors of stark pure-white marble variegation.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 135,
    "originalPrice": 160,
    "rating": 5,
    "reviewCount": 95,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Rare Grail",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 96,
    "name": "Philodendron Pink Princess",
    "scientificName": "Philodendron erubescens Pink Princess",
    "category": "Bonsai & Rare Plants",
    "categorySlug": "bonsai-rare",
    "tags": [
      "rare",
      "pink-variegation",
      "burgundy",
      "collector"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/201260269/medium.jpeg",
    "shortDescription": "Deep glossy burgundy-bronze leaves marbled with shocking splashes of bubblegum pink.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 78,
    "originalPrice": 95,
    "rating": 4.9,
    "reviewCount": 145,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Pink Princess",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 97,
    "name": "Anthurium Clarinervium",
    "scientificName": "Anthurium clarinervium",
    "category": "Bonsai & Rare Plants",
    "categorySlug": "bonsai-rare",
    "tags": [
      "rare",
      "cardboard-leaf",
      "white-veins",
      "velvet"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/173605683/medium.jpg",
    "shortDescription": "Thick leathery cardboard foliage in dark suede green traced with brilliant luminescent white veins.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 68,
    "originalPrice": 80,
    "rating": 4.9,
    "reviewCount": 110,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Velvet Veins",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 98,
    "name": "Alocasia Frydek Variegata",
    "scientificName": "Alocasia micholitziana Variegata",
    "category": "Bonsai & Rare Plants",
    "categorySlug": "bonsai-rare",
    "tags": [
      "rare",
      "green-velvet",
      "variegated",
      "collector"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/170559857/medium.jpeg",
    "shortDescription": "Emerald velvet shield foliage splashed with marbled sectors of mint and pure white.",
    "light": "Bright Indirect",
    "water": "Weekly soak",
    "environment": "Indoor",
    "difficulty": "Expert",
    "price": 88,
    "originalPrice": 110,
    "rating": 4.9,
    "reviewCount": 65,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Rare Velvet",
      "variant": "amber"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 99,
    "name": "Stephania Erecta Caudex",
    "scientificName": "Stephania erecta",
    "category": "Bonsai & Rare Plants",
    "categorySlug": "bonsai-rare",
    "tags": [
      "rare",
      "caudex",
      "coin-leaf",
      "oddity"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/186997486/medium.jpg",
    "shortDescription": "Curious wooden potato-like caudex that erupts with slender vines bearing perfect parasol-round leaves.",
    "light": "Bright Indirect",
    "water": "Every 2-3 weeks",
    "environment": "Indoor",
    "difficulty": "Moderate",
    "price": 49,
    "originalPrice": null,
    "rating": 4.7,
    "reviewCount": 52,
    "petFriendly": false,
    "inStock": true,
    "badge": {
      "text": "Caudex Oddity",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  },
  {
    "id": 100,
    "name": "Maidenhair Ginkgo Bonsai",
    "scientificName": "Ginkgo biloba",
    "category": "Bonsai & Rare Plants",
    "categorySlug": "bonsai-rare",
    "tags": [
      "bonsai",
      "living-fossil",
      "golden-autumn",
      "fan-leaf"
    ],
    "image": "https://inaturalist-open-data.s3.amazonaws.com/photos/397250612/medium.jpeg",
    "shortDescription": "Prehistoric living fossil bonsai featuring iconic fan leaves that turn luminous butter-gold in autumn.",
    "light": "Full Sun",
    "water": "Weekly soak",
    "environment": "Outdoor",
    "difficulty": "Moderate",
    "price": 85,
    "originalPrice": 100,
    "rating": 4.9,
    "reviewCount": 120,
    "petFriendly": true,
    "inStock": true,
    "badge": {
      "text": "Living Fossil",
      "variant": "forest"
    },
    "source": "Curated Catalog (Demo Data)"
  }
];
