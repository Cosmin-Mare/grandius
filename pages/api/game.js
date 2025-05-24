
import { dealCards } from "./dealCards";
import { buildDeck, shuffleDeck } from "./deck";



export default function game (req, res){
    if (req.method === "POST") {
        const { player } = req.body;
    
        if (!player) {
          return res.status(400).json({ error: "Missing player" });
        }
    
        const deck = shuffleDeck(buildDeck());
        const hand = dealCards(deck, player);
        
        return res.status(200).json({ hand });
      } else {
        res.status(405).json({ error: "Method not allowed" });
      }
}