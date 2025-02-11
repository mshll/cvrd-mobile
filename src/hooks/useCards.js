import { useMemo } from 'react';
import { useCardsQuery } from './useCardsQuery';

export function useCards() {
  const { data: cards = [], isLoading, error, refetch } = useCardsQuery();

  // Log the current state
  // console.log('🎴 useCards state:', {
  //   cardsCount: cards?.length || 0,
  //   isLoading,
  //   hasError: !!error,
  // });

  const cardsByType = useMemo(() => {
    const groupedCards = cards.reduce((acc, card) => {
      // Extract the type without _LOCKED suffix
      const type = card.cardType.replace('_LOCKED', '');
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(card);
      return acc;
    }, {});

    // Log the grouped cards
    // console.log(
    //   '📊 Cards by type:',
    //   Object.keys(groupedCards).reduce((acc, type) => {
    //     acc[type] = groupedCards[type].length;
    //     return acc;
    //   }, {})
    // );

    return groupedCards;
  }, [cards]);

  const getCardById = (id) => {
    if (!id || !cards) return null;
    const card = cards.find((card) => card.id === id);

    // Log card lookup result
    //console.log('🔍 Looking up card:', { id, found: !!card });

    return card || null;
  };

  const getCardDisplayData = (card) => {
    if (!card) return null;

    // Log the card data for debugging
    //console.log('🃏 Processing card:', card);

    return {
      id: card.id,
      type: card.cardType.replace('_LOCKED', ''),
      backgroundColor: card.cardColor,
      lastFourDigits: card.cardNumber?.slice(-4) || '••••',
      label: card.cardName || 'Unnamed Card',
      emoji: card.cardIcon || '💳',
      isPaused: card.paused || false,
      isClosed: card.closed || false,
      isPinned: card.pinned || false,
    };
  };

  const getAllCardsDisplay = () => cards.map(getCardDisplayData).filter(Boolean);

    // New search function
    const searchCards = (query) => {
      const lowerCaseQuery = query.toLowerCase();
      return getAllCardsDisplay().filter((card) => {
        return (
          card.label.toLowerCase().includes(lowerCaseQuery) ||
          card.type.toLowerCase().includes(lowerCaseQuery) ||
          card.lastFourDigits.includes(lowerCaseQuery)
        );
      });
    };

  return {
    cards,
    isLoading,
    error,
    refetch,
    cardsByType,
    getCardById,
    getCardDisplayData,
    getAllCardsDisplay,
    searchCards, // Add the search function to the returned object
  };
}
