import { useState, useEffect } from 'react';
import { getUserCards } from '@/api/cards';

const CARD_TYPE_MAP = {
  MERCHANT_LOCKED: 'merchant',
  BURNER: 'burner',
  LOCATION_LOCKED: 'location',
  CATEGORY_LOCKED: 'category',
};

export function useCardStats() {
  const [stats, setStats] = useState({
    total: 0,
    merchant: 0,
    burner: 0,
    location: 0,
    category: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCardStats() {
      try {
        setLoading(true);
        const cards = await getUserCards();
        const cardStats = cards.reduce(
          (acc, card) => {
            acc.total++;
            const type = CARD_TYPE_MAP[card.cardType] || card.cardType.toLowerCase();
            if (acc[type] !== undefined) {
              acc[type]++;
            }
            return acc;
          },
          {
            total: 0,
            merchant: 0,
            burner: 0,
            location: 0,
            category: 0,
          }
        );

        setStats(cardStats);
      } catch (error) {
        console.error('Error fetching card stats:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCardStats();
  }, []);

  return { stats, loading, error };
}
