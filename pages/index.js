import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Press_Start_2P } from "next/font/google";
import styles from "@/styles/Home.module.css";
import ShaderCanvas from "@/components/ShaderCanvas";
import { useState } from "react";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [playerCards, setPlayerCards] = useState([]);
  const [opponentCards, setOpponentCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [playedCard, setPlayedCard] = useState(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPlayPrompt, setShowPlayPrompt] = useState(true);

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentDay(1);
    setShowPlayPrompt(true);
    // Deal 5 cards to player
    setPlayerCards([
      { id: 1, image: "/cards/RH2_test2.png" },
      { id: 2, image: "/cards/RH2_test2.png" },
      { id: 3, image: "/cards/RH2_test2.png" },
      { id: 4, image: "/cards/RH2_test2.png" },
      { id: 5, image: "/cards/RH2_test2.png" }
    ]);
    // Deal 5 cards to opponent
    setOpponentCards([
      { id: 6, image: "/cards/RH2_test2.png" },
      { id: 7, image: "/cards/RH2_test2.png" },
      { id: 8, image: "/cards/RH2_test2.png" },
      { id: 9, image: "/cards/RH2_test2.png" },
      { id: 10, image: "/cards/RH2_test2.png" }
    ]);
  };

  const handleCardClick = (cardId) => {
    if (selectedCardId === cardId) return; // Don't do anything if clicking the same card
    
    const cardToPlay = playerCards.find(card => card.id === cardId);
    if (cardToPlay) {
      setPlayedCard(cardToPlay);
      setPlayerCards(prev => prev.filter(card => card.id !== cardId));
      setSelectedCardId(cardId);
      setShowPlayPrompt(false);
    }
  };

  return (
    <>
      <div className={styles.shaderContainer}>
        <ShaderCanvas gameState={gameStarted} day={currentDay} />
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
                <h1>Grandius</h1>
                <h2>Bigger</h2>
              </div>
              <div className={styles.ctas}>
                <button className={styles.primary} onClick={handleStartGame}>Start</button>
                <button className={styles.secondary} onClick={() => setShowHowToPlay(true)}>How to play</button>
                <button className={styles.secondary}>Quit</button>
              </div>
              {showHowToPlay && (
                <div className={styles.modalOverlay} onClick={() => setShowHowToPlay(false)}>
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
                    <button className={styles.closeButton} onClick={() => setShowHowToPlay(false)}>Let's Play!</button>
                  </div>
                </div>
              )}
            </>
          )}
          {gameStarted && (
            <>
              <div className={styles.deck} />
              <div className={styles.opponentCardsContainer}>
                {opponentCards.map((card) => (
                  <div key={card.id} className={styles.card}>
                    <img src={card.image} />
                  </div>
                ))}
              </div>
              {showPlayPrompt && <div className={styles.playPrompt}>Play a card</div>}
              <div className={styles.cardsContainer}>
                {playerCards.map((card) => (
                  <div 
                    key={card.id} 
                    className={`${styles.card} ${selectedCardId === card.id ? styles.selected : ''}`}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <img src={card.image} />
                  </div>
                ))}
              </div>
              {playedCard && (
                <div className={styles.playedCardContainer}>
                  <div className={`${styles.card} ${styles.played}`}>
                    <img src={playedCard.image} />
                  </div>
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
