export const DUMMY_TRANSACTIONS = [
  {
    id: '1',
    name: 'Entertainment',
    cardId: 1,
    amount: 20,
    date: '2024-03-10T14:35:00',
    status: 'Settled',
    merchantName: 'Netflix',
    merchantCategory: 'Entertainment',
  },
  {
    id: '2',
    name: 'Streaming',
    cardId: 2,
    amount: 15,
    date: '2024-03-08T14:34:00',
    status: 'Declined',
    merchantName: 'Spotify',
    merchantCategory: 'Entertainment',
  },
  {
    id: '3',
    name: 'Shopping',
    cardId: 3,
    amount: 150,
    date: '2024-02-28T11:20:00',
    status: 'Settled',
    merchantName: 'Amazon',
    merchantCategory: 'Shopping',
  },
  {
    id: '4',
    name: 'Coffee Shop',
    cardId: 4,
    amount: 8,
    date: '2024-02-15T09:45:00',
    status: 'Settled',
    merchantName: 'Starbucks',
    merchantCategory: 'Food & Drink',
  },
  {
    id: '5',
    name: 'Travel Booking',
    cardId: 5,
    amount: 500,
    date: '2024-01-20T16:30:00',
    status: 'Settled',
    merchantName: 'Booking.com',
    merchantCategory: 'Travel',
  },
  {
    id: '6',
    name: 'Restaurant',
    cardId: 6,
    amount: 45,
    date: '2024-01-15T20:15:00',
    status: 'Declined',
    merchantName: 'Local Restaurant',
    merchantCategory: 'Food & Drink',
  },
].concat(
  // Additional random transactions for March
  Array(4)
    .fill(null)
    .map((_, index) => ({
      id: String(index + 7),
      name: `Transaction ${index + 1}`,
      cardId: (index % 3) + 1, // Rotate between first 3 cards
      amount: 12 + index,
      date: `2024-03-${5 - index}T${14 - index}:35:00`,
      status: index % 3 === 0 ? 'Declined' : 'Settled',
      merchantName: `Merchant ${index + 1}`,
      merchantCategory: ['Entertainment', 'Shopping', 'Food & Drink', 'Travel'][index % 4],
    }))
);
