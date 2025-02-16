const baseUrl = 'https://cvrd-dashboard.vercel.app/stores';

export const STORES = [
  {
    id: 'h-and-m',
    name: 'H&M',
    logo: require('@/../assets/store-logos/h-and-m.png'),
    url: `${baseUrl}/h-and-m`,
    description: 'Fashion and quality clothing at the best price',
    discountCode: 'HM2024',
    discountAmount: '20% OFF',
    validUntil: '2024-03-31',

  },
  {
    id: 'xcite',
    name: 'X-cite by Alghanim Electronics',
    logo: require('@/../assets/store-logos/xcite.png'),
    url: `${baseUrl}/xcite`,
    description: "Kuwait's largest electronics retailer",
    discountCode: 'XCITE15',
    discountAmount: '15% OFF',
    validUntil: '2024-03-31',

  },
  {
    id: 'home-centre',
    name: 'Home Centre',
    logo: require('@/../assets/store-logos/home-center.png'),
    url: `${baseUrl}/home-centre`,
    description: 'Complete home furnishing solutions',
    discountCode: 'HOME25',
    discountAmount: '25% OFF',
    validUntil: '2024-04-01',

  },
  {
    id: 'decathlon',
    name: 'Decathlon',
    logo: require('@/../assets/store-logos/decathlon.png'),
    url: `${baseUrl}/decathlon`,
    description: 'Sports equipment and athletic wear for all',
    discountCode: 'DEC30',
    discountAmount: '30% OFF',
    validUntil: '2024-03-20',

  },
  {
    id: 'boots',
    name: 'Boots',
    logo: require('@/../assets/store-logos/boots.png'),
    url: `${baseUrl}/boots`,
    description: 'Your trusted beauty and wellness destination',
    discountCode: 'BOOTS10',
    discountAmount: '10% OFF',
    validUntil: '2024-04-15',

  },
  {
    id: 'sultan-center',
    name: 'Sultan Center',
    logo: require('@/../assets/store-logos/sultan.png'),
    url: `${baseUrl}/sultan-center`,
    description: 'Premium supermarket with quality products',
    discountCode: 'SULTAN20',
    discountAmount: '20% OFF',
    validUntil: '2024-03-25',

  },
  {
    id: 'human-pancreas',
    name: 'Human Pancreas',
    logo: require('@/../assets/store-logos/human-pancreas.png'),
    url: `${baseUrl}/human-pancreas`,
    description: 'Best cookies and baked goods in the world',
    discountCode: 'PANCREAS25',
    discountAmount: '25% OFF',
    validUntil: '2024-04-30',
  },
];
