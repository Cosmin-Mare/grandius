import { useState, useEffect } from 'react';

// Debug card data - full deck with all suits and values
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Special card types
export const SPECIAL_CARDS = {
  random: { 
    id: 'random', 
    value: 15, 
    effect: 'reshuffle',
    tooltip: 'Reshuffles both players\' hands'
  },
  twoturns: { 
    id: 'twoturns', 
    value: 17, 
    effect: 'double',
    tooltip: 'Allows playing two cards in one turn'
  },
  plus1: { 
    id: 'plus1', 
    value: 19, 
    effect: 'increment',
    tooltip: 'Adds a copy of the center card with +1 value to your hand'
  },
  disolved: { 
    id: 'disolved', 
    value: 22, 
    effect: 'dissolve',
    tooltip: 'Removes the previous card from play'
  }
};

const DEBUG_CARDS = [
  ...SUITS.flatMap(suit => 
    VALUES.map((value, index) => {
      // Skip the queen of hearts
      if (suit === 'hearts' && value === 'Q') return null;
      return {
        id: `${suit}-${value}`,
        value: index + 2, // 2-14 (Ace is highest)
        suit,
        valueName: value
      };
    })
  ).filter(card => card !== null),
  // Add multiple copies of special cards
  ...Object.values(SPECIAL_CARDS),
  ...Object.values(SPECIAL_CARDS),
  ...Object.values(SPECIAL_CARDS),
  ...Object.values(SPECIAL_CARDS),
  ...Object.values(SPECIAL_CARDS)
];

export default function GameLogic({ onGameStateChange }) {
  const [playerCards, setPlayerCards] = useState([]);
  const [opponentCards, setOpponentCards] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [centerCard, setCenterCard] = useState(null);
  const [lastPlayedCard, setLastPlayedCard] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('player');
  const [roundWinner, setRoundWinner] = useState(null);
  const [gameWinner, setGameWinner] = useState(null);
  const [roundCards, setRoundCards] = useState([]);
  const [roundStarted, setRoundStarted] = useState(false);
  const [hasPlayedCard, setHasPlayedCard] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showHigherCardMessage, setShowHigherCardMessage] = useState(false);
  const [isOpponentFirstCard, setIsOpponentFirstCard] = useState(true);
  // New state for special card effects
  const [canPlayTwoCards, setCanPlayTwoCards] = useState(false);
  const [cardsPlayedThisTurn, setCardsPlayedThisTurn] = useState(0);
  // New state for special cards
  const [specialCardPile, setSpecialCardPile] = useState([]);

  // Initialize game
  const startGame = () => {
    console.log('Starting game...');
    // Shuffle and deal cards
    const shuffledCards = [...DEBUG_CARDS].sort(() => Math.random() - 0.5);
    console.log('Shuffled cards:', shuffledCards);
    setPlayerCards(shuffledCards.slice(0, 5));
    setOpponentCards(shuffledCards.slice(5, 10));
    setCurrentRound(1);
    setPlayerScore(0);
    setOpponentScore(0);
    setCenterCard(null);
    setLastPlayedCard(null);
    setCurrentPlayer('player');
    setRoundWinner(null);
    setGameWinner(null);
    setRoundCards([]);
    setRoundStarted(false);
    setHasPlayedCard(false);
    setShowGameOver(false);
    setShowHigherCardMessage(false);
    setIsOpponentFirstCard(true);
    setCanPlayTwoCards(false);
    setCardsPlayedThisTurn(0);
    setSpecialCardPile([]);
  };

  // Start game when component mounts
  useEffect(() => {
    console.log('GameLogic component mounted');
    startGame();
  }, []);

  // Handle special card effects
  const handleSpecialCardEffect = (card, player) => {
    switch (card.effect) {
      case 'reshuffle':
        // Reshuffle both hands
        const allCards = [...playerCards, ...opponentCards];
        const shuffled = [...allCards].sort(() => Math.random() - 0.5);
        // Don't include the special card in the reshuffle
        const filteredShuffled = shuffled.filter(c => !c.effect);
        setPlayerCards(filteredShuffled.slice(0, playerCards.length));
        setOpponentCards(filteredShuffled.slice(playerCards.length));
        break;

      case 'double':
        // Allow playing two cards
        setCanPlayTwoCards(true);
        setCardsPlayedThisTurn(0);
        break;

      case 'increment':
        // Add 1 to center card value and give it to the player
        if (centerCard) {
          let newValue;
          let newValueName;
          
          // Special case: if it's an Ace, wrap to 2
          if (centerCard.valueName === 'A') {
            newValue = 2;
            newValueName = '2';
          } else {
            // Otherwise increment normally
            newValue = centerCard.value + 1;
            newValueName = VALUES[VALUES.indexOf(centerCard.valueName) + 1];
          }

          const incrementedCard = { 
            ...centerCard, 
            value: newValue,
            valueName: newValueName,
            id: `${centerCard.suit}-${newValueName}-plus1`
          };
          setPlayerCards(prev => [...prev, incrementedCard]);
        }
        break;

      case 'dissolve':
        // Remove the previous card
        if (centerCard) {
          setCenterCard(null);
          setLastPlayedCard(null);
          // Clear round cards to prevent affecting future plays
          setRoundCards([]);
        }
        break;
    }
  };

  // Modified playCard function to handle special cards
  const playCard = (cardId) => {
    if (currentPlayer !== 'player') return;

    const cardToPlay = playerCards.find(card => card.id === cardId);
    if (!cardToPlay) return;

    // Handle special cards differently
    if (cardToPlay.effect) {
      // Remove card from player's hand
      setPlayerCards(prev => prev.filter(card => card.id !== cardId));
      // Add to special card pile
      setSpecialCardPile(prev => [...prev, { ...cardToPlay, player: 'player' }]);
      // Handle special card effect
      handleSpecialCardEffect(cardToPlay, 'player');
      // Don't change turn state for special cards
      setRoundStarted(true);
      setHasPlayedCard(true);
      return;
    }

    // Regular card logic
    if (centerCard && cardToPlay.value < centerCard.value) {
      console.log('Card value too low to play');
      return;
    }

    if (centerCard && cardToPlay.value === centerCard.value) {
      endRound('opponent');
      return;
    }

    // Remove card from player's hand
    setPlayerCards(prev => prev.filter(card => card.id !== cardId));
    setCenterCard(cardToPlay);
    setLastPlayedCard(cardToPlay);
    setRoundCards(prev => [...prev, { card: cardToPlay, player: 'player' }]);

    // Update turn state
    if (canPlayTwoCards && cardsPlayedThisTurn < 1) {
      setCardsPlayedThisTurn(prev => prev + 1);
    } else {
      setCurrentPlayer('opponent');
      setRoundStarted(true);
      setHasPlayedCard(true);
      setCanPlayTwoCards(false);
      setCardsPlayedThisTurn(0);
    }

    // Check if player has no more cards
    if (playerCards.length === 1) {
      if (roundCards.some(card => card.player === 'opponent')) {
        endRound('player');
      }
    }
  };

  // Modified opponent's turn logic to handle special cards
  useEffect(() => {
    if (currentPlayer === 'opponent' && !gameWinner) {
      // First check if there are any special cards that can be played
      const specialCards = opponentCards.filter(card => card.effect);
      const regularCards = opponentCards.filter(card => !card.effect);
      
      // If there are special cards, consider playing them
      if (specialCards.length > 0) {
        // 70% chance to play a special card if available
        if (Math.random() < 0.7) {
          const specialCardToPlay = specialCards[Math.floor(Math.random() * specialCards.length)];
          setTimeout(() => {
            setOpponentCards(prev => prev.filter(card => card.id !== specialCardToPlay.id));
            setSpecialCardPile(prev => [...prev, { ...specialCardToPlay, player: 'opponent' }]);
            handleSpecialCardEffect(specialCardToPlay, 'opponent');
            // Don't change turn state for special cards
            setHasPlayedCard(false);
            setRoundStarted(true);
          }, 1000);
          return;
        }
      }

      // If not playing a special card, proceed with regular card logic
      const playableCards = regularCards.filter(card => 
        !centerCard || card.value > centerCard.value
      );

      if (playableCards.length === 0) {
        endRound('player');
        return;
      }

      // Play the lowest possible card that can beat the center card
      const cardToPlay = playableCards.reduce((lowest, current) => 
        current.value < lowest.value ? current : lowest
      );

      setTimeout(() => {
        setOpponentCards(prev => prev.filter(card => card.id !== cardToPlay.id));
        setCenterCard(cardToPlay);
        setLastPlayedCard(cardToPlay);
        setRoundCards(prev => [...prev, { card: cardToPlay, player: 'opponent' }]);

        setCurrentPlayer('player');
        setHasPlayedCard(false);
        setRoundStarted(true);

        if (isOpponentFirstCard) {
          setShowHigherCardMessage(true);
          setIsOpponentFirstCard(false);
          setTimeout(() => {
            setShowHigherCardMessage(false);
          }, 2000);
        }

        if (opponentCards.length === 1) {
          if (roundCards.some(card => card.player === 'player')) {
            endRound('opponent');
          }
        }
      }, 1000);
    }
  }, [currentPlayer, centerCard, opponentCards, gameWinner, isOpponentFirstCard]);

  // Handle end turn
  const endTurn = () => {
    if (currentPlayer !== 'player' || !roundStarted) return;
    
    if (!hasPlayedCard) {
      endRound('opponent');
    }
  };

  // Get playable cards
  const getPlayableCards = () => {
    if (!roundStarted) return playerCards;
    return playerCards.filter(card => {
      // Special cards can always be played
      if (card.effect) return true;
      // Regular cards must be higher than center card
      return !centerCard || card.value > centerCard.value;
    });
  };

  // End the current round
  const endRound = (winner) => {
    console.log('Round ended, winner:', winner);
    setRoundWinner(winner);
    
    // Update scores
    if (winner === 'player') {
      setPlayerScore(prev => prev + 1);
    } else {
      setOpponentScore(prev => prev + 1);
    }

    // Check if game is over
    if (playerCards.length === 0 || opponentCards.length === 0) {
      // Wait for round result to be shown before showing game over
      setTimeout(() => {
        determineGameWinner();
      }, 2000);
    } else {
      // Start new round
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setCenterCard(null);
        setLastPlayedCard(null);
        setCurrentPlayer(winner);
        setRoundWinner(null);
        setRoundCards([]);
        setRoundStarted(false);
        setHasPlayedCard(false);
      }, 2000);
    }
  };

  // Determine game winner
  const determineGameWinner = () => {
    console.log('Determining game winner:', { playerScore, opponentScore });
    // Wait for the last round's score to be updated
    setTimeout(() => {
      const finalPlayerScore = playerScore;
      const finalOpponentScore = opponentScore;
      console.log('Final scores:', { finalPlayerScore, finalOpponentScore });
      
      if (finalPlayerScore > finalOpponentScore) {
        setGameWinner('player');
      } else if (finalOpponentScore > finalPlayerScore) {
        setGameWinner('opponent');
      } else {
        setGameWinner('tie');
      }
      setShowGameOver(true);
    }, 100); // Small delay to ensure scores are updated
  };

  // Effect to notify parent component of game state changes
  useEffect(() => {
    onGameStateChange({
      playerCards,
      opponentCards,
      currentRound,
      playerScore,
      opponentScore,
      centerCard,
      lastPlayedCard,
      currentPlayer,
      roundWinner,
      gameWinner,
      roundCards,
      roundStarted,
      hasPlayedCard,
      showGameOver,
      showHigherCardMessage,
      playableCards: getPlayableCards(),
      playCard,
      endTurn,
      specialCardPile
    });
  }, [
    playerCards,
    opponentCards,
    currentRound,
    playerScore,
    opponentScore,
    centerCard,
    lastPlayedCard,
    currentPlayer,
    roundWinner,
    gameWinner,
    roundCards,
    roundStarted,
    hasPlayedCard,
    showGameOver,
    showHigherCardMessage,
    specialCardPile
  ]);

  return null; // This component doesn't render anything directly
}
