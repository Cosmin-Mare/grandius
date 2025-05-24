import { shuffleDeck, buildDeck } from "./deck";

export function dealCards (deck, player){
    const hand = []

    for (let i = 0; i < 5; i++){
        const card = deck.pop();
        if (card){
            hand.push(card);
        }
    }
    return hand;
}