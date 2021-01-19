// https://deckofcardsapi.com/
// Shuffle/GET 6 decks
const blackjack = {};

// CONFIG
blackjack.baseApiUrl = 'https://deckofcardsapi.com/api/deck';
blackjack.cardImagePath = './src/assets/cards';
blackjack.numPlayers = 4;
blackjack.cardSpread = '30px';

blackjack.players = {
    // South
    player: {
        boardPos: {
            left: 'calc(50% - (100px * 1.5)',
            top: 'calc(100vh - (153px * 1.5) - 35px'
        },
        cardsInHand: 0
    },
    // East
    computer1: {
        boardPos: {
            left: 'calc(100vw - (100px * 1.5 + 35px)',
            top: 'calc(50% - (153px * 1.5 / 2)'
        },
        cardsInHand: 0
    },
    // West
    computer2: {
        boardPos: {
            left: 'calc(0vw + (5px)',
            top: 'calc(50% - (153px * 1.5 / 2)'
        },
        cardsInHand: 0
    },
    // North
    dealer: {
        boardPos: {
            left: 'calc(50% - (100px * 1.5)',
            top: 'calc(0vh + (5px))'
        },
        cardsInHand: 0
    }
}

blackjack.deck = {};

// dealDirections:
//// 'allFromDealer' - Will distribute 1 card to each player, starting computer1, until no more drawn cards remain
//// '${playerId} - Distributes drawn card(s) to 1 player until no more drawn cards remain ['computer1', 'player', 'computer2', 'dealer']
blackjack.dealCards = (cardsToDraw, dealDirections) => {
    let cardHolder = document.querySelector('#cardHolder');
    
    cardsToDraw.forEach((card, i) => {
        let cardHtml = `<div class="card" data-card="${card.code}" style="background-image: url('./src/assets/cards/${card.code}.png')"></div>`
        cardHolder.innerHTML += cardHtml;
    })

    blackjack.animateDeal(cardHolder.querySelectorAll('.card'), dealDirections);
}

blackjack.animateDeal = (cardsToDeal, dealDirections) => {
    if (dealDirections === 'allFromDealer') {
    
        cardsToDeal.forEach((cardEl, i) => {
            // Players - Dealt from left of dealer, CW
            setTimeout(() => {
                // Comp1
                if (i % blackjack.numPlayers === 0) {
                    cardEl.style.left = blackjack.players.computer1.boardPos.left;
                    cardEl.style.top = blackjack.players.computer1.boardPos.top;
                    blackjack.players.computer1.cardsInHand++;
                // Player
                } else if (i % blackjack.numPlayers === 1) {
                    cardEl.style.left = blackjack.players.player.boardPos.left;
                    cardEl.style.top = blackjack.players.player.boardPos.top;
                    blackjack.players.player.cardsInHand++;
                // Comp2
                } else if (i % blackjack.numPlayers === 2) {
                    cardEl.style.left = blackjack.players.computer2.boardPos.left;
                    cardEl.style.top = blackjack.players.computer2.boardPos.top;
                    blackjack.players.computer2.cardsInHand++;
                // Dealer
                } else if (i % blackjack.numPlayers === 3) {
                    cardEl.style.left = blackjack.players.dealer.boardPos.left;
                    cardEl.style.top = blackjack.players.dealer.boardPos.top;
                    blackjack.players.dealer.cardsInHand++;
                }
            }, i * 200);
        })
    }
}

blackjack.drawCards = async (cardCount, dealDirections) => {
    await fetch(`${blackjack.baseApiUrl}/${blackjack.deck.deck_id}/draw/?count=${cardCount}`, {
        method: 'GET',
        dataType: 'json'
    })
    .then(res => res.json())
    .then(data => blackjack.cardsDrawn = data.cards)
    .then(data => {
        blackjack.dealCards(data, dealDirections);
    })
}

blackjack.getDecks = async (numDecks) => {
    // Get the Request
    await fetch(`${blackjack.baseApiUrl}/new/shuffle/?deck_count=${numDecks}`, {
        method: 'GET',
        dataType: 'json'
    })
    // Gets the .json Promise
    .then(res => res.json())
    // Stores the response data in the blackjack object
    .then(data => blackjack.deck = data);
}

// EVENTS //
// Initial Deal button, uses deck_id generated at page load
document.addEventListener('click', (e) => {
    if (!e.target.matches('[data-deal-btn]')) return;
    
    // Initial draw/deal, 2 cards per player
    // TODO: Make number of players editable
    // FIXME: Beginning of animation is wonky. First card jumps to end spot. Why?
    blackjack.drawCards(blackjack.numPlayers * 2, 'allFromDealer');
});

blackjack.init = () => {
    blackjack.deck = blackjack.getDecks(6);
}


document.addEventListener('DOMContentLoaded', () => {
    blackjack.init();
}, false);