import { useMemo, useState } from 'react';
import { cards as initialCards } from '@/data/cards';

export function useCards() {
  const [cards, setCards] = useState(initialCards);

  const cardsByType = useMemo(() => {
    return cards.reduce((acc, card) => {
      if (!acc[card.card_type]) {
        acc[card.card_type] = [];
      }
      acc[card.card_type].push(card);
      return acc;
    }, {});
  }, [cards]);

  const getCardById = (id) => cards.find((card) => card.id === id);

  const getCardDisplayData = (card) => ({
    id: card.id,
    type: card.card_type,
    backgroundColor: card.card_color,
    lastFourDigits: card.card_number.slice(-4),
    label: card.card_name,
    emoji: card.card_icon,
    isPaused: card.is_paused,
    isClosed: card.is_closed,
  });

  const getAllCardsDisplay = () => cards.map(getCardDisplayData);

  const updateCard = (cardId, updatedData) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              ...updatedData,
            }
          : card
      )
    );
  };

  return {
    cards,
    cardsByType,
    getCardById,
    getCardDisplayData,
    getAllCardsDisplay,
    updateCard,
  };
}
