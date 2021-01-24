// https://deckofcardsapi.com/
// Shuffle/GET 6 decks
const blackjack = {};

// TODO:
// Due to time restraints and life obligations, I'm unable to take this project further than where it is
// Things to do would be to add blackjack rule logic, as well as some simple computer AI (if less than 16, hit) that varies slightly from player to player
// https://bicyclecards.com/how-to-play/blackjack/

// INTERACTIONS:
// "DEAL" button, deals the initial round of cards, 2 cards to each player entity, starting with the position clockwise of the dealer
//// Once all cards are in there default location, they animate to spread for visibility

// "HIT" button, draws 1 (one) new card from the current deck and deals it to the Player
//// Respread Player cards once the new card is in Player hand

// "RESHUFFLE" button, clears all cards in play, creating a new deck out of 6 decks (6 * 52 cards)
//// From here, players can re-DEAL

// FIXME:
// Uncaught (in promise) SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data
// The above error gets thrown every now and then. Assumption is it's from one particular type of card, but thinking it's API side.

// CONFIG
blackjack.baseApiUrl = 'https://deckofcardsapi.com/api/deck';
blackjack.cardImagePath = './src/assets/cards';
blackjack.numPlayers = 4;
blackjack.cardSpread = 40; // in px

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
    let cardsToDealContainer = document.querySelector('#cardsToDeal');
    
    cardsToDraw.forEach((card, i) => {
        let cardHtml = `<div class="card" data-card="${card.code}" style="background-image: url('./src/assets/cards/${card.code}.png')"></div>`
        cardsToDealContainer.innerHTML += cardHtml;
    })

    blackjack.animateDeal(cardsToDealContainer.querySelectorAll('#cardsToDeal .card'), dealDirections);
}

blackjack.animateDeal = (cardsToDeal, dealDirections) => {
    const cardsToDealContainer = document.querySelector('#cardsToDeal');
    const cardHolderContainer = document.querySelector('#cardHolder');

    cardsToDeal.forEach((cardEl, i) => {
        if (dealDirections === 'allFromDealer') {
            // Players - Dealt from left of dealer, CW
            setTimeout(() => {
                // This whole thing needs to be refactored to not rely this sort of static logic
                // Comp1
                if (i % blackjack.numPlayers === 0) {
                    cardEl.style.left = blackjack.players.computer1.boardPos.left;
                    cardEl.style.top = blackjack.players.computer1.boardPos.top;
                    blackjack.players.computer1.cardsInHand++;
                    // TODO: Refactor to apply data-belongs-to value during card HTML creation
                    cardEl.setAttribute('data-belongs-to', 'computer1');
                // Player
                } else if (i % blackjack.numPlayers === 1) {
                    cardEl.style.left = blackjack.players.player.boardPos.left;
                    cardEl.style.top = blackjack.players.player.boardPos.top;
                    blackjack.players.player.cardsInHand++;
                    // TODO: Refactor to apply data-belongs-to value during card HTML creation
                    cardEl.setAttribute('data-belongs-to', 'player');
                // Comp2
                } else if (i % blackjack.numPlayers === 2) {
                    cardEl.style.left = blackjack.players.computer2.boardPos.left;
                    cardEl.style.top = blackjack.players.computer2.boardPos.top;
                    blackjack.players.computer2.cardsInHand++;
                    // TODO: Refactor to apply data-belongs-to value during card HTML creation
                    cardEl.setAttribute('data-belongs-to', 'computer2');
                // Dealer
                } else if (i % blackjack.numPlayers === 3) {
                    cardEl.style.left = blackjack.players.dealer.boardPos.left;
                    cardEl.style.top = blackjack.players.dealer.boardPos.top;
                    blackjack.players.dealer.cardsInHand++;
                    // TODO: Refactor to apply data-belongs-to value during card HTML creation
                    cardEl.setAttribute('data-belongs-to', 'dealer');
                }
            }, i * 200);
            
            // Wait until the deal animations are done, then spread the cards
            // Need different logic for individual card deals
            setTimeout(() => blackjack.spreadCards(), cardsToDeal.length * 300);
        } else {
            cardEl.style.left = blackjack.players[dealDirections].boardPos.left;
            cardEl.style.top = blackjack.players[dealDirections].boardPos.top;
            blackjack.players[dealDirections].cardsInHand++;
            cardEl.setAttribute('data-belongs-to', dealDirections);
            blackjack.spreadCards(dealDirections);
        }

        // Move dealt cards to #cardHolder
        while (cardsToDealContainer.childNodes.length > 0) {
            cardHolderContainer.appendChild(cardsToDealContainer.childNodes[0]);
        }

    })
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

blackjack.spreadCards = (handToSpread) => {
    let cardsToSpread;
    const viewportWidth = window.innerWidth;
    
    // For single card deal respreads
    if (handToSpread) {
        cardsToSpread = document.querySelectorAll(`[data-belongs-to="${handToSpread}"]`);
        // Animate back to default position before doing the spread animation
        cardsToSpread.forEach(card => {
            card.style.left = `${blackjack.players[handToSpread].boardPos.left}`    
        })
        
        setTimeout(() => {
            cardsToSpread.forEach((card, i) => {
                console.log(cardsToSpread)
                const cardLeft = parseInt(getComputedStyle(card).left);

                if (viewportWidth - cardLeft < 300) {
                    card.style.left = `${cardLeft - blackjack.cardSpread * i}px`;
                } else {
                    card.style.left = `${cardLeft + blackjack.cardSpread * i}px`;
                    // I don't know why these weren't being collected into cardsToSpread in DOM order
                    // But they weren't and it was causing the cards to cover each other up
                    // so... z-index additions it is.
                    card.style.zIndex = i;
                    console.log(card.style.left);
                }

            })
        }, 500);
    } else {
        cardsToSpread = document.querySelectorAll('.card');
        // For mass card spreads
        cardsToSpread.forEach((card, i) => {
            const cardLeft = parseInt(getComputedStyle(card).left);
    
            // TODO: Make this useful for when a hand has more than 2 cards
            // Modulo w/ numPlayers/ number of times around board? Figure out the logic.
            if (i >= 4) {
                if (viewportWidth - cardLeft < 300) {
                    card.style.left = `${cardLeft - blackjack.cardSpread}px`;
                } else {
                    card.style.left = `${cardLeft + blackjack.cardSpread}px`;
                }
            }
        })
    }
    
}

blackjack.reshuffle = () => {
    // Remove all cards from the board
    const cardsInPlayContainer = document.getElementById('cardHolder');

    // According to generalist performance, it's faster to check for the first item of a list
    // but faster to REMOVE the last child
    // I found this info via the interwebs and blindly implemented it so... take it with a grain of salt.
    while (cardsInPlayContainer.firstChild) {
        cardsInPlayContainer.removeChild(cardsInPlayContainer.lastChild);
    }

    // This should provide a new value under blackjack.deck.deck_id
    blackjack.deck = blackjack.getDecks(6);
}

// EVENTS //
// TODO: Disable event listeners according to when buttons should be allowed to be clicked
//          Reshuffle and Hit should not be enabled until initial deal
blackjack.events = () => {
    // Initial Deal button, uses deck_id generated at page load
    document.addEventListener('click', e => {
        if (!e.target.matches('[data-deal-btn]')) return;
        
        // Initial draw/deal, 2 cards per player
        // TODO: Make number of players editable
        // FIXME: Beginning of animation is wonky. First card jumps to end spot. Why?
        blackjack.drawCards(blackjack.numPlayers * 2, 'allFromDealer');
    });

    // Deal an individual card to the player entity
    document.addEventListener('click', e => {
        if (!e.target.matches('[data-hit-btn]')) return;

        blackjack.drawCards(1, 'player');
    })

    // Clear cards and get new deck for "Reshuffle"
    document.addEventListener('click', e => {
        if (!e.target.matches('[data-reshuffle-btn')) return;

        blackjack.reshuffle();
    })
}

blackjack.init = () => {
    blackjack.deck = blackjack.getDecks(6);
    blackjack.events();
}

document.addEventListener('DOMContentLoaded', () => {
    blackjack.init();
}, false);