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
        } 
    },
    // East
    computer1: {
        boardPos: {
            left: 'calc(100vw - (100px * 1.5 + 35px)',
            top: 'calc(50% - (153px * 1.5 / 2)'
        } 
    },
    // West
    computer2: {
        boardPos: {
            left: 'calc(0vw + (5px)',
            top: 'calc(50% - (153px * 1.5 / 2)'
        }
    },
    // North
    dealer: {
        boardPos: {
            left: 'calc(50% - (100px * 1.5)',
            top: 'calc(0vh + (5px))'
        }
    }
}

blackjack.deck = {};

// blackjack.firstDeal = () => {
//     const cardsToDeal = blackjack.drawCards(blackjack.numPlayers * 2);

//     cardsToDeal.forEach((card, i) => {
//         console.log(i);
//     })
// }

// dealDirections:
//// 'fromDealer' - Will distribute 1 card to each player, starting computer1, until no more drawn cards remain
//// '${playerId} - Distributes drawn card(s) to 1 player until no more drawn cards remain ['computer1', 'player', 'computer2', 'dealer']
blackjack.dealCards = (cardsToDraw, dealDirections) => {
    let cardHolder = document.querySelector('#cardHolder');

    if (dealDirections === 'fromDealer') {
        cardsToDraw.forEach((card, i) => {
            let cardHtml = `<div class="card" data-card="${card.code}" style="background-image: url('./src/assets/cards/${card.code}.png')"></div>`
            cardHolder.innerHTML += cardHtml;
        })
    }

    blackjack.animateDeal(cardHolder.querySelectorAll('.card'));
}

blackjack.animateDeal = (cardsToDeal) => {

    cardsToDeal.forEach((cardEl, i) => {

        // Players - Dealt from left of dealer, CW
        // Comp1: Cards 1, 5 [0][4]
        // Player: Cards 2, 6 [1][5]
        // Comp2: Cards 3, 7 [2][6]
        // Dealer: Cards 4, 8 [3][7]
        setTimeout(() => {
            // Comp1
            if ([0, 4].includes(i)) {
                cardEl.style.left = blackjack.players.computer1.boardPos.left;
                cardEl.style.top = blackjack.players.computer1.boardPos.top;
            // Player
            } else if ([1, 5].includes(i)) {
                cardEl.style.left = blackjack.players.player.boardPos.left;
                cardEl.style.top = blackjack.players.player.boardPos.top;
            // Comp2
            } else if ([2, 6].includes(i)) {
                cardEl.style.left = blackjack.players.computer2.boardPos.left;
                cardEl.style.top = blackjack.players.computer2.boardPos.top;
            // Dealer
            } else if ([3, 7].includes(i)) {
                cardEl.style.left = blackjack.players.dealer.boardPos.left;
                cardEl.style.top = blackjack.players.dealer.boardPos.top;
            }
        }, i * 500);
    })
}

blackjack.drawCards = async cardCount => {
    await fetch(`${blackjack.baseApiUrl}/${blackjack.deck.deck_id}/draw/?count=${cardCount}`, {
        method: 'GET',
        dataType: 'json'
    })
    .then(res => res.json())
    .then(data => blackjack.cardsDrawn = data.cards)
    .then(data => {
        blackjack.dealCards(data, 'fromDealer');
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

// HELPERS //
blackjack.delayLoop = (fn, delay) => {
    return (x, i) => {
        setTimeout(() => {
            fn(x);
        }, i * delay);
    }
}

blackjack.init = () => {
    blackjack.deck = blackjack.getDecks(6);
}

document.addEventListener('click', (e) => {
    if (!e.target.matches('[data-deal-btn]')) return;
    
    // Initial draw/deal, 2 cards per player
    // TODO: Make number of players editable
    blackjack.drawCards(blackjack.numPlayers * 2, 'fromDealer');
});

document.addEventListener('DOMContentLoaded', () => {
    blackjack.init();
}, false);