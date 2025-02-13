const baseUrl = 'http://localhost:3000/subscriptions';

export const MERCHANTS = [
  {
    id: '1',
    name: 'Netflix',
    logo: require('@/../assets/merchant-logos/Netflix.png'),
    url: `${baseUrl}/netflix`,
    description: 'Stream award-winning Netflix originals, movies, TV shows, documentaries, and more.',
    isSubscribed: true,
    minAmount: 'KD 4.99',

  },
  {
    id: '2',
    name: 'OSN',
    logo: require('@/../assets/merchant-logos/Osn.png'),
    url: `${baseUrl}/osn`,
    description: 'Premium entertainment platform offering the latest movies, series, and Arabic content.',
    isSubscribed: false,
    minAmount: 'KD 5.99',

  },
  {
    id: '3',
    name: 'Prime',
    logo: require('@/../assets/merchant-logos/Prime.png'),
    url: `${baseUrl}/prime`,
    description: 'Access Prime Video, free shipping, music, and exclusive deals with Amazon Prime.',
    isSubscribed: false,
    minAmount: 'KD 3.99',

  },
  {
    id: '4',
    name: 'Apple',
    logo: require('@/../assets/merchant-logos/Apple.png'),
    url: `${baseUrl}/apple`,
    description: 'Get Apple Music, Apple TV+, Apple Arcade, and iCloud+ in one subscription.',
    isSubscribed: true,
    minAmount: 'KD 6.99',

  },
  {
    id: '5',
    name: 'HBO',
    logo: require('@/../assets/merchant-logos/Hbo.png'),
    url: `${baseUrl}/hbo`,
    description: 'Watch exclusive HBO Max originals, blockbuster movies, and iconic TV series.',
    isSubscribed: false,
    minAmount: 'KD 5.99',

  },
  {
    id: '6',
    name: 'Hulu',
    logo: require('@/../assets/merchant-logos/Hulu.png'),
    url: `${baseUrl}/hulu`,
    description: 'Stream current hit shows, classic series, and acclaimed Hulu originals.',
    isSubscribed: false,
    minAmount: 'KD 4.99',

  },
  {
    id: '7',
    name: 'Disney+',
    logo: require('@/../assets/merchant-logos/Disney.png'),
    url: `${baseUrl}/disney`,
    description: 'Stream Disney+ Originals, Marvel, Pixar, Star Wars, and National Geographic.',
    isSubscribed: false,
    minAmount: 'KD 4.99',

  },
  {
    id: '8',
    name: 'Paramount+',
    logo: require('@/../assets/merchant-logos/Paramount.png'),
    url: `${baseUrl}/paramount`,
    description: 'Stream Paramount+ Originals, movies, series, and more.',
    isSubscribed: false,
    minAmount: 'KD 4.99',
  }
];


export default MERCHANTS;
