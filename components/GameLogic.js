import { useState, useEffect } from 'react';

// Debug card data - full deck with all suits and values
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const DEBUG_CARDS = SUITS.flatMap(suit => 
  VALUES.map((value, index) => ({
    id: `${suit}-${value}`,
    value: index + 2, // 2-14 (Ace is highest)
    suit,
    valueName: value
  }))
);

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
  };

  // Start game when component mounts
  useEffect(() => {
    console.log('GameLogic component mounted');
    startGame();
  }, []);

  // Handle player playing a card
  const playCard = (cardId) => {
    if (currentPlayer !== 'player') return;

    const cardToPlay = playerCards.find(card => card.id === cardId);
    if (!cardToPlay) return;

    // Check if the card can be played (must be strictly higher than center card)
    if (centerCard && cardToPlay.value < centerCard.value) {
      console.log('Card value too low to play');
      return;
    }

    // If card value is equal to center card, player loses the round
    if (centerCard && cardToPlay.value === centerCard.value) {
      endRound('opponent');
      return;
    }

    // Remove card from player's hand
    setPlayerCards(prev => prev.filter(card => card.id !== cardId));
    setCenterCard(cardToPlay);
    setLastPlayedCard(cardToPlay);
    setRoundCards(prev => [...prev, { card: cardToPlay, player: 'player' }]);
    setCurrentPlayer('opponent');
    setRoundStarted(true);
    setHasPlayedCard(true);

    // Check if player has no more cards
    if (playerCards.length === 1) {
      // Only end the round if the opponent has played a card
      if (roundCards.some(card => card.player === 'opponent')) {
        endRound('player');
      }
    }
  };

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
    return playerCards.filter(card => !centerCard || card.value > centerCard.value);
  };

  // Opponent's turn
  useEffect(() => {
    if (currentPlayer === 'opponent' && !gameWinner) {
      const playableCards = opponentCards.filter(card => 
        !centerCard || card.value > centerCard.value
      );

      if (playableCards.length === 0) {
        // Opponent can't play any card
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

        // Check if opponent has no more cards
        if (opponentCards.length === 1) {
          // Only end the round if the player has played a card
          if (roundCards.some(card => card.player === 'player')) {
            endRound('opponent');
          }
        }
      }, 1000);
    }
  }, [currentPlayer, centerCard, opponentCards, gameWinner]);

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
    console.log('Game state updated:', {
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
      playableCards: getPlayableCards()
    });
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
      playableCards: getPlayableCards(),
      playCard,
      endTurn
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
    showGameOver
  ]);

  return null; // This component doesn't render anything directly
}
