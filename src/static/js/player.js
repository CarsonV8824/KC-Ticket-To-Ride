class Player {

    constructor(color){
        this.cards = [];
        this.color = color;
    }

    addCard(card){
        this.cards.push(card);
    }

    showCards(){
        return this.cards;
    }

    getCertainCards(cardType){
        certainCards = [];
        for (let i=0; i < this.cards.length(); i++){
            if (this.cards[i] == cardType){
                certainCards.push(this.cards[i])
            }
        }
        return certainCards;
    }

}

export { Player }; { main };