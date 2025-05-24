// Sound utility for managing game sounds
let cardSound = null;

// Initialize sound only on client side
if (typeof window !== 'undefined') {
  cardSound = new Audio('/card-sounds-35956.mp3');
  // Set default volume to 30%
  cardSound.volume = 0.3;
}

// Function to play sound with varying pitch
export const playCardSound = (pitch = 1.0) => {
  // Only play sound on client side
  if (typeof window === 'undefined' || !cardSound) return;

  // Clone the audio to allow multiple simultaneous plays
  const sound = cardSound.cloneNode();
  sound.playbackRate = pitch;
  sound.volume = 0.3; // Set volume to 30%
  sound.play().catch(error => {
    console.log('Error playing sound:', error);
  });
};

// Predefined pitch variations for different actions
export const SOUND_PITCHES = {
  CARD_PLAY: 1.0,
  CARD_PLAY_HIGH: 1.2,
  CARD_PLAY_LOW: 0.8,
  ROUND_WIN: 1.4,
  ROUND_LOSE: 0.7,
  GAME_WIN: 1.6,
  GAME_LOSE: 0.6,
  SPECIAL_CARD: 1.3
}; 