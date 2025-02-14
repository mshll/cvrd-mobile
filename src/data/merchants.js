const baseUrl = 'http://localhost:3000/subscriptions';

export const MERCHANTS = [
  {
    id: 'netflix',
    name: 'Netflix',
    logo: require('@/../assets/merchant-logos/netflix.png'),
    pattern: require('@/../assets/merchant-patterns/netflix.png'),
    url: `${baseUrl}netflix`,
    description: 'Stream award-winning Netflix originals, movies, TV shows, documentaries, and more.',
    minAmount: 'KD 4.99',
    color: '#E50914', // Netflix red
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    logo: require('@/../assets/merchant-logos/disney-plus.png'),
    pattern: require('@/../assets/merchant-patterns/disney-plus.png'),
    url: `${baseUrl}disney`,
    description: 'Stream Disney+ Originals, Marvel, Pixar, Star Wars, and National Geographic.',
    minAmount: 'KD 4.99',
    color: '#0063E5', // Disney+ blue
  },
  {
    id: 'prime-video',
    name: 'Prime Video',
    logo: require('@/../assets/merchant-logos/prime-video.png'),
    pattern: require('@/../assets/merchant-patterns/prime-video.png'),
    url: `${baseUrl}prime`,
    description: 'Access Prime Video, free shipping, music, and exclusive deals with Amazon Prime.',
    minAmount: 'KD 3.99',
    color: '#00A8E1', // Prime blue
  },
  {
    id: 'hbo-max',
    name: 'HBO Max',
    logo: require('@/../assets/merchant-logos/hbo-max.png'),
    pattern: require('@/../assets/merchant-patterns/hbo-max.png'),
    url: `${baseUrl}hbo`,
    description: 'Watch exclusive HBO Max originals, blockbuster movies, and iconic TV series.',
    minAmount: 'KD 5.99',
    color: '#5822B4', // HBO purple
  },
  {
    id: 'apple-tv-plus',
    name: 'Apple TV+',
    logo: require('@/../assets/merchant-logos/apple-tv-plus.png'),
    pattern: require('@/../assets/merchant-patterns/apple-tv-plus.png'),
    url: `${baseUrl}apple`,
    description: 'Get Apple Music, Apple TV+, Apple Arcade, and iCloud+ in one subscription.',
    minAmount: 'KD 6.99',
    color: '#000000', // Apple black
  },
  {
    id: 'hulu',
    name: 'Hulu',
    logo: require('@/../assets/merchant-logos/hulu.png'),
    pattern: require('@/../assets/merchant-patterns/hulu.png'),
    url: `${baseUrl}hulu`,
    description: 'Stream current hit shows, classic series, and acclaimed Hulu originals.',
    minAmount: 'KD 4.99',
    color: '#1CE783', // Hulu green
  },
  {
    id: 'paramount-plus',
    name: 'Paramount+',
    logo: require('@/../assets/merchant-logos/paramount-plus.png'),
    pattern: require('@/../assets/merchant-patterns/paramount-plus.png'),
    url: `${baseUrl}paramount`,
    description: 'Stream Paramount+ Originals, movies, series, and more.',
    minAmount: 'KD 4.99',
    color: '#0064FF', // Paramount blue
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    logo: require('@/../assets/merchant-logos/crunchyroll.png'),
    pattern: require('@/../assets/merchant-patterns/crunchyroll.png'),
    url: `${baseUrl}crunchyroll`,
    description: 'Watch the latest and best anime series and movies.',
    minAmount: 'KD 4.99',
    color: '#F47521', // Crunchyroll orange
  },
  {
    id: 'osn',
    name: 'OSN',
    logo: require('@/../assets/merchant-logos/osn.png'),
    pattern: require('@/../assets/merchant-patterns/osn.png'),
    url: `${baseUrl}osn`,
    description: 'Premium entertainment platform offering the latest movies, series, and Arabic content.',
    minAmount: 'KD 5.99',
    color: '#2B2B2B', // OSN dark gray
  },
];

// Helper functions to get merchant data
export const getMerchantById = (id) => MERCHANTS.find((m) => m.id === id);
export const getMerchantByName = (name) => MERCHANTS.find((m) => m.name === name);

// Lists of supported values
export const MERCHANT_NAMES = MERCHANTS.map((m) => m.name);
export const MERCHANT_IDS = MERCHANTS.map((m) => m.id);

// Asset mappings
export const MERCHANT_LOGOS = Object.fromEntries(MERCHANTS.map((m) => [m.name, m.logo]));

export const MERCHANT_PATTERNS = Object.fromEntries(MERCHANTS.map((m) => [m.name, m.pattern]));

export const MERCHANT_COLORS = Object.fromEntries(MERCHANTS.map((m) => [m.name, m.color]));

// Mini merchant logos to use as card background patterns
export const MERCHANT_BACKGROUNDS = Object.fromEntries(MERCHANTS.map((m) => [m.name, m.pattern]));
