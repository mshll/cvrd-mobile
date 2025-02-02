const generateCardNumber = () => {
  return Array(16)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join('');
};

const generateCVV = () => {
  return Array(3)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join('');
};

export const cards = [
  // Location Cards
  {
    id: '1',
    card_type: 'Location',
    expiry_date: '2025-12-31',
    spending_limit: 300,
    remaining_limit: 225,
    duration_limit: 'weekly',
    created_at: '2024-01-15T10:00:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: false,
    is_paused: false,
    is_closed: false,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'The Avenues Mall',
    card_color: 'red',
    card_icon: '🏬',
    list_of_transactions: [],
    merchant_name: null,
    category_name: null,
    longitude: 47.9285,
    latitude: 29.3032,
    radius: 0.3,
  },
  {
    id: '2',
    card_type: 'Location',
    expiry_date: '2025-12-31',
    spending_limit: 100,
    remaining_limit: 100,
    duration_limit: 'daily',
    created_at: '2024-02-20T16:45:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: true,
    is_paused: true,
    is_closed: false,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'Kuwait University',
    card_color: 'green',
    card_icon: '🎓',
    list_of_transactions: [],
    merchant_name: null,
    category_name: null,
    longitude: 47.9717,
    latitude: 29.3217,
    radius: 0.5,
  },
  {
    id: '3',
    card_type: 'Location',
    expiry_date: '2025-12-31',
    spending_limit: 150,
    remaining_limit: 150,
    duration_limit: 'weekly',
    created_at: '2024-03-01T09:00:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: false,
    is_paused: false,
    is_closed: false,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'Marina Mall',
    card_color: 'blue',
    card_icon: '🛍️',
    list_of_transactions: [],
    merchant_name: null,
    category_name: null,
    longitude: 48.1024,
    latitude: 29.3897,
    radius: 0.2,
  },

  // Merchant Cards
  {
    id: '4',
    card_type: 'Merchant',
    expiry_date: '2025-12-31',
    spending_limit: 60,
    remaining_limit: 60,
    duration_limit: 'monthly',
    created_at: '2024-02-01T08:30:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: true,
    is_paused: false,
    is_closed: false,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'Starbucks Card',
    card_color: 'green',
    card_icon: '☕',
    list_of_transactions: [],
    merchant_name: 'Starbucks',
    category_name: null,
    longitude: null,
    latitude: null,
    radius: null,
  },
  {
    id: '5',
    card_type: 'Merchant',
    expiry_date: '2025-12-31',
    spending_limit: 45,
    remaining_limit: 30,
    duration_limit: 'monthly',
    created_at: '2024-02-05T14:20:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: false,
    is_paused: false,
    is_closed: false,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'Subway Lunch',
    card_color: 'blue',
    card_icon: '🥪',
    list_of_transactions: [],
    merchant_name: 'Subway',
    category_name: null,
    longitude: null,
    latitude: null,
    radius: null,
  },
  {
    id: '6',
    card_type: 'Merchant',
    expiry_date: '2025-12-31',
    spending_limit: 90,
    remaining_limit: 0,
    duration_limit: 'monthly',
    created_at: '2024-01-15T11:30:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: false,
    is_paused: true,
    is_closed: false,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'Amazon Shopping',
    card_color: 'red',
    card_icon: '🛒',
    list_of_transactions: [],
    merchant_name: 'Amazon',
    category_name: null,
    longitude: null,
    latitude: null,
    radius: null,
  },

  // Category Cards
  {
    id: '7',
    card_type: 'Category',
    expiry_date: '2025-12-31',
    spending_limit: 500,
    remaining_limit: 350,
    duration_limit: 'monthly',
    created_at: '2024-02-10T14:15:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: false,
    is_paused: false,
    is_closed: false,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'Groceries',
    card_color: 'blue',
    card_icon: '🛒',
    list_of_transactions: [],
    merchant_name: null,
    category_name: 'Groceries',
    longitude: null,
    latitude: null,
    radius: null,
  },
  {
    id: '8',
    card_type: 'Category',
    expiry_date: '2025-12-31',
    spending_limit: 200,
    remaining_limit: 150,
    duration_limit: 'monthly',
    created_at: '2024-02-12T16:20:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: true,
    is_paused: false,
    is_closed: false,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'Entertainment',
    card_color: 'yellow',
    card_icon: '🎬',
    list_of_transactions: [],
    merchant_name: null,
    category_name: 'Entertainment',
    longitude: null,
    latitude: null,
    radius: null,
  },
  {
    id: '9',
    card_type: 'Category',
    expiry_date: '2024-12-31',
    spending_limit: 1000,
    remaining_limit: 0,
    duration_limit: 'monthly',
    created_at: '2024-01-01T00:00:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: false,
    is_paused: false,
    is_closed: true,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'Travel',
    card_color: 'green',
    card_icon: '✈️',
    list_of_transactions: [],
    merchant_name: null,
    category_name: 'Travel',
    longitude: null,
    latitude: null,
    radius: null,
  },

  // Burner Cards
  {
    id: '10',
    card_type: 'Burner',
    expiry_date: '2024-04-01',
    spending_limit: 100,
    remaining_limit: 100,
    duration_limit: 'total',
    created_at: '2024-03-01T09:00:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: false,
    is_paused: false,
    is_closed: false,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'Online Purchase',
    card_color: 'yellow',
    card_icon: '🔥',
    list_of_transactions: [],
    merchant_name: null,
    category_name: null,
    longitude: null,
    latitude: null,
    radius: null,
  },
  {
    id: '11',
    card_type: 'Burner',
    expiry_date: '2024-03-15',
    spending_limit: 50,
    remaining_limit: 0,
    duration_limit: 'total',
    created_at: '2024-03-01T10:00:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: false,
    is_paused: false,
    is_closed: true,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'Software License',
    card_color: 'green',
    card_icon: '💻',
    list_of_transactions: [],
    merchant_name: null,
    category_name: null,
    longitude: null,
    latitude: null,
    radius: null,
  },
  {
    id: '12',
    card_type: 'Burner',
    expiry_date: '2024-04-30',
    spending_limit: 75,
    remaining_limit: 75,
    duration_limit: 'total',
    created_at: '2024-03-02T15:30:00Z',
    user_id: 'user123',
    bank_account_number: '987654321',
    is_shared: true,
    is_paused: true,
    is_closed: false,
    card_number: generateCardNumber(),
    cvv: generateCVV(),
    card_name: 'Conference Ticket',
    card_color: 'blue',
    card_icon: '🎟️',
    list_of_transactions: [],
    merchant_name: null,
    category_name: null,
    longitude: null,
    latitude: null,
    radius: null,
  },
];

export default cards;
