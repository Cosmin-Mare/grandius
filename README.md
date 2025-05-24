# Grandius - Bigger

## Description

Grandius is a competitive card game built with Next.js, featuring unique gameplay where players must play cards strictly higher than the one in the center. Win rounds, score points based on card values, and outsmart your opponent to become the ultimate card master!

## Features

- Engaging card game logic
- Scoring system
- Animated splash screen
- Interactive "How to Play" guide
- Dedicated Credits page
- Responsive UI
- Powered by React and Next.js
- Dynamic background powered by WebGL shaders

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Cosmin-Mare/grandius.git
   cd grandius
   ```

2. Install dependencies:
   ```bash
   npm install
   # or yarn install
   ```

### Running the Development Server

To run the game in development mode:

```bash
npm run dev
# or yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Play

- **The Basics:** Play cards higher than your opponent. Win rounds to collect points.
- **Scoring:** Win a round to score points equal to the value of the cards in the center. The player with the highest score after all rounds wins the game.
- **Losing Conditions:** You lose a round if you play a card equal to the center card, cannot play a higher card, or run out of cards before your opponent in the round.
- **Power-ups:** Special cards with unique abilities will be added in future updates.

For more detailed instructions, check the "How to Play" section within the game.

## Technologies Used

- Next.js
- React
- JavaScript
- CSS Modules
- WebGL (for background shader)
- HTML

## Credits

This game was made with love by:

- Cosmin Mare
- Nathan Yin
- Simo

Special thanks to Cool as Hack, the Next.js Team, and the WebGL community.

## Future Enhancements

- Multiplayer mode [In Development]
- More special cards / power-ups:
  - Random - takes both hands and reshuffles them
  - Reverse - it reverses the turn [In Development]
  - Two Turns - you can put 2 cards down
  - Reader - you can read the opposite player's hand (highest card) [In Development]
  - +1 - get center card plus one
  - Fire - you give your opponent 2 seconds to play a card or they lose the round [In Development]
  - Block - block a card rank for the entire match (they cannot play that card) [In Development]
  - Dissolve - dissolve the previous card
  - Blind - you blind your opponent for 1 turn, their cards are flipped, and they must choose one [In Development]
- Improved UI/UX
