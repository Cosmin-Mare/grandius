

center = []
const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];



export function  addToCenter(card){
    center.push(card);
}


export function previousCard(){
    return center[center.lenght - 1];
}



export function higher (card1, card2){
    return rankOrder.indexOf(card1.rank) > rankOrder.indexOf(card2.rank);
}
