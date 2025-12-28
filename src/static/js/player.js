class Player {

    constructor(color){
        this.cards = [];
        this.color = color;
        this.score = 0;
    }

    addCard(card){
        this.cards.push(card);
    }

    showCards(){
        return this.cards;
    }

    getCertainCards(cardType){
        let certainCards = [];
        for (let i=0; i < this.cards.length; i++){
            if (this.cards[i] === cardType){
                certainCards.push(this.cards[i])
            }
        }
        return certainCards;
    }

    removeCard(card) {
        const index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1);
        }
    }

}

export { Player };