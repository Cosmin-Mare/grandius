import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Press_Start_2P } from "next/font/google";
import styles from "@/styles/Home.module.css";
import ShaderCanvas from "@/components/ShaderCanvas";
import GameLogic, { SPECIAL_CARDS } from "@/components/GameLogic";
import { useState, useEffect } from "react";
import Link from "next/link";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPlayPrompt, setShowPlayPrompt] = useState(true);
  const [showQuitPopup, setShowQuitPopup] = useState(false);
  const [matchesWon, setMatchesWon] = useState(0);
  const [matchesLost, setMatchesLost] = useState(0);

  const actuallyStartGame = () => {
    setGameStarted(true);
    setShowPlayPrompt(true);
  };

  const handleStartGame = () => {
    if (isFirstGame) {
      setShowHowToPlay(true);
    } else {
      actuallyStartGame();
    }
  };

  const handleGameStateChange = (newState) => {
    console.log('Game state changed:', newState);
    setGameState(newState);
    if (newState?.gameWinner && newState?.showGameOver) {
      if (newState.gameWinner === 'player') {
        setMatchesWon(prev => prev + 1);
      } else if (newState.gameWinner === 'opponent') {
        setMatchesLost(prev => prev + 1);
      }
    }
    // Update peeked card state
    if (newState?.showPeekedCard) {
      console.log('Setting peeked card:', newState.showPeekedCard);
      setShowPeekedCard(newState.showPeekedCard);
    } else if (newState?.showPeekedCard === null) {
      console.log('Clearing peeked card');
      setShowPeekedCard(null);
    }
  };

  const handleNextMatch = () => {
    setGameState(null);
    setShowPlayPrompt(true);
    setGameStarted(false);
    setTimeout(() => setGameStarted(true), 0);
  };

  const handleCardClick = (cardId) => {
    if (!gameState) return;
    gameState.playCard(cardId);
    setShowPlayPrompt(false);
  };

  const handleEndTurn = () => {
    if (!gameState) return;
    gameState.endTurn();
  };

  return (
    <>
      <div className={styles.shaderContainer}>
        <ShaderCanvas gameState={gameStarted} day={gameState?.currentRound || 0} />
      </div>
      <Head>
        <title>Decimanus</title>
        <meta name="description" content="Bigger." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.page} ${pressStart2P.variable}`}>
        <div className={styles.main}>
          {!gameStarted && (
            <>
              <div className={styles.header}>
                <h1>Grandius <span className={styles.version}>v1.0.0</span></h1>
                <h2>Bigger</h2>
              </div>

              <div className={styles.mainLogoContainer}>
                <img src="/logo.png" alt="Grandius Logo" className={styles.mainLogo} />
              </div>

              <div className={styles.ctas}>
                <button className={styles.primary} onClick={handleStartGame}>Start</button>
                <button className={styles.secondary} onClick={() => setShowHowToPlay(true)}>How to play</button>
                <Link href="/credits" className={styles.secondary}>Credits</Link>
                <button className={styles.secondary} onClick={() => setShowQuitPopup(true)}>Quit</button>
              </div>
              {showQuitPopup && (
                <div className={styles.modalOverlay} onClick={() => setShowQuitPopup(false)}>
                  <div className={styles.modal} onClick={e => e.stopPropagation()}>
                    <h2>Quit?</h2>
                    <div className={styles.modalContent}>
                      <p>It's a web game lmao just close the tab</p>
                    </div>
                    <button className={styles.closeButton} onClick={() => setShowQuitPopup(false)}>Bruh</button>
                  </div>
                </div>
              )}
              {showHowToPlay && (
                <div className={styles.modalOverlay} onClick={handleCloseHowToPlay}>
                  <div className={styles.modal} onClick={e => e.stopPropagation()}>
                    <h2>How to Play</h2>
                    <div className={styles.modalContent}>
                      <p>Ready to become the ultimate card master? Here's the deal:</p>
                      
                      <p>🎮 The Basics:</p>
                      <p>• Play cards higher than your opponent</p>
                      <p>• Win rounds, collect points</p>
                      <p>• Outsmart, outplay, outlast!</p>
                      
                      <p>🏆 Scoring:</p>
                      <p>• 3 rounds per game</p>
                      <p>• Win a round = score points equal to card values</p>
                      <p>• Highest total score wins!</p>
                      
                      <p>⚡ Power-ups:</p>
                      <p>• Special cards with epic abilities</p>
                      <p>• Use them wisely to crush your enemies!</p>
                      
                      <p>💡 Pro Tips:</p>
                      <p>• Watch your opponent's moves</p>
                      <p>• Save your best cards for the perfect moment</p>
                      <p>• Power-ups can turn the tide of battle!</p>
                    </div>
                    <button className={styles.closeButton} onClick={handleCloseHowToPlay}>Let's Play!</button>
                  </div>
                </div>
              )}
            </>
          )}
          {gameStarted && (
            <>
              <div className={styles.matchScorePanel}>
                <div>Matches Won: {matchesWon}</div>
                <div>Matches Lost: {matchesLost}</div>
              </div>
              <GameLogic onGameStateChange={handleGameStateChange} />
              <div className={styles.deck} />
              <div className={styles.gameInfo}>
                <div className={styles.score}>
                  <div>Player: {gameState?.playerScore || 0}</div>
                  <div>Opponent: {gameState?.opponentScore || 0}</div>
                </div>
                <div className={styles.round}>Round: {gameState?.currentRound || 1}</div>
                <div className={styles.turnIndicator}>
                  {gameState?.currentPlayer === 'player' ? "Your turn" : "Opponent's turn"}
                </div>
              </div>
              {!gameState?.gameWinner && (
                <div className={styles.opponentCardsContainer}>
                  {gameState?.opponentCards?.map((card) => (
                    <div key={card.id} className={styles.card}>
                      <Image
                        src="/cards/back.png"
                        alt="Card back"
                        width={60}
                        height={84}
                        className={styles.cardImage}
                      />
                    </div>
                  ))}
                </div>
              )}
              {showPlayPrompt && gameState?.currentPlayer === 'player' && (
                <div className={styles.playPrompt}>
                  {gameState?.centerCard 
                    ? `Play a card higher than ${gameState.centerCard.valueName}`
                    : 'Play any card to start the round'}
                </div>
              )}
              {gameState?.showHigherCardMessage && (
                <div className={styles.higherCardMessage}>
                  Play a Higher Card!
                </div>
              )}
              <div className={styles.centerArea}>
                {gameState?.centerCard && (
                  <div className={styles.centerCard}>
                    <Image
                      src={gameState.centerCard.effect ? `/cards/${gameState.centerCard.id}.png` : `/cards/${gameState.centerCard.suit.charAt(0).toUpperCase()}${gameState.centerCard.valueName}.png`}
                      alt={gameState.centerCard.effect ? gameState.centerCard.id : `${gameState.centerCard.valueName} of ${gameState.centerCard.suit}`}
                      width={70}
                      height={98}
                      className={styles.cardImage}
                    />
                  </div>
                )}
                {gameState?.specialCardPile && gameState.specialCardPile.length > 0 && (
                  <div className={styles.specialCardPile}>
                    <h3>Special Cards</h3>
                    <div className={styles.specialCards}>
                      {gameState.specialCardPile.map((card, index) => (
                        <div key={`${card.id}-${index}`} className={styles.specialCard}>
                          <div className={styles.tooltip}>
                            {SPECIAL_CARDS[card.id]?.tooltip || card.effect}
                          </div>
                          <Image
                            src={`/cards/${card.id}.png`}
                            alt={card.id}
                            width={60}
                            height={84}
                            className={styles.cardImage}
                          />
                          <div className={styles.cardOwner}>
                            {card.player === 'player' ? 'You' : 'Opponent'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.cardsContainer}>
                {gameState?.playerCards?.map((card) => {
                  const isPlayersTurn = gameState.currentPlayer === 'player';
                  const isPlayable = isPlayersTurn && gameState.playableCards?.some(c => c.id === card.id);
                  return (
                    <div 
                      key={card.id} 
                      className={`${styles.card} ${isPlayable ? styles.playable : ''} ${gameState.lastPlayedCard?.id === card.id ? styles.selected : ''}`}
                      onClick={isPlayable ? () => handleCardClick(card.id) : undefined}
                      style={{ pointerEvents: isPlayersTurn ? 'auto' : 'none', opacity: isPlayersTurn ? 1 : 0.5 }}
                    >
                      {card.effect && (
                        <div className={styles.tooltip}>
                          {SPECIAL_CARDS[card.id]?.tooltip || card.effect}
                        </div>
                      )}
                      <Image
                        src={card.effect ? `/cards/${card.id}.png` : `/cards/${card.suit.charAt(0).toUpperCase()}${card.valueName}.png`}
                        alt={card.effect ? card.id : `${card.valueName} of ${card.suit}`}
                        width={60}
                        height={84}
                        className={styles.cardImage}
                        priority={true}
                      />
                    </div>
                  );
                })}
              </div>
              {gameState?.currentPlayer === 'player' && gameState?.roundStarted && (
                <button 
                  onClick={handleEndTurn} 
                  className={styles.endTurnButton}
                  disabled={gameState?.hasPlayedCard}
                >
                  End Turn
                </button>
              )}
              {gameState?.roundWinner && !gameState?.gameWinner && (
                <div className={styles.roundResult}>
                  {gameState.roundWinner === 'player' ? 'You won this round!' : 
                   gameState.roundWinner === 'opponent' ? 'Opponent won this round!' : 
                   'It\'s a tie!'}
                </div>
              )}
              {gameState?.gameWinner && gameState?.showGameOver && (
                <div className={styles.gameResult}>
                  <div>
                    {gameState.gameWinner === 'player' ? 'You won the game!' : 
                     gameState.gameWinner === 'opponent' ? 'Opponent won the game!' : 
                     'The game ended in a tie!'}
                  </div>
                  <div className={styles.matchStats}>
                    Matches Won: {matchesWon} | Matches Lost: {matchesLost}
                  </div>
                  <button 
                    onClick={handleNextMatch} 
                    className={styles.primary}
                    style={{ marginTop: '1rem' }}
                  >
                    Play Again
                  </button>
                </div>
              )}
              {showFireWarning && (
                <div className={styles.fireWarning}>
                  Play a 2 or lose!
                </div>
              )}
              {showPeekedCard && (
                <div className={styles.peekedCard}>
                  <h3>Opponent's Highest Card:</h3>
                  <div className={styles.card}>
                    <Image
                      src={showPeekedCard.effect ? `/cards/${showPeekedCard.id}.png` : `/cards/${showPeekedCard.suit.charAt(0).toUpperCase()}${showPeekedCard.valueName}.png`}
                      alt={showPeekedCard.effect ? showPeekedCard.id : `${showPeekedCard.valueName} of ${showPeekedCard.suit}`}
                      width={60}
                      height={84}
                      className={styles.cardImage}
                    />
                  </div>
                  <button onClick={() => setShowPeekedCard(null)}>Close</button>
                </div>
              )}
              {gameState?.bannedRank && (
                <div className={styles.bannedRank}>
                  {gameState.bannedRank} cards are banned!
                </div>
              )}
            </>
          )}
        </div>
        <footer className={styles.footer}>
          <a href="https://github.com/Cosmin-Mare/grandius" target="_blank" rel="noopener noreferrer">
            Made with love by Cosmin, Nathan and Simo @ Cool as Hack
          </a>
        </footer>
      </main>
    </>
  );
}
