const playAgain = document.getElementById("play-again");
const dealer = document.getElementById("dealer-hand");
const player = document.getElementById("player-hand");
const playerAddedHandCard = player.getElementsByClassName("added-hand-card");
const dealerAddedHandCard = dealer.getElementsByClassName("added-hand-card");
const toRemove = Array.from("addedHandCard");
const dealerCard = dealer.querySelectorAll("div");
const playerCard = player.querySelectorAll("div");
const handCard = player.getElementsByClassName("hand-card");

const dealerIndex = 0;
const player1Index = 1;
const player2Index = 2;
const player3Index = 3;
const player4Index = 4;
const player5Index = 5;

const cards = ["A", "2", "3","4","5","6","7","8","9","10","J","Q","K"];
// const cards = ["A", "2", "3","4","5","6","7","8","9","10","J","Q","K"];
const suits = ["D","C","H","S"];
const cardValue = ["11", "2", "3","4","5","6","7","8","9","10","10","10","10"];
// const cardValue = ["11", "2", "3","4","5","6","7","8","9","10","10","10","10"];

let decklist = []

function makeDeck(){
    decklist = []
    for (let j = 0; j < suits.length; j ++){
        for (let i = 0; i < cards.length; i++){
            decklist.push(cards[i]+"-"+suits[j]);
        }
    }
    console.log("Making a new deck");
    console.log(decklist);
}

function shuffleDeck(){
    for (let i = 0; i < decklist.length ; i++){
        let j = Math.floor(Math.random()*decklist.length);
        // Starting from the first card of the deck
        let temp = decklist[i];
        decklist[i] = decklist[j];
        decklist[j] = temp;
    }
    console.log("Shuffling deck");
    console.log(decklist);
}

// Making sure the deck is shuffled at the start
window.addEventListener("load", function(){
    makeDeck();
    shuffleDeck();
});

const playerButton = document.getElementById("player-action");
const dealButton = document.getElementById("deal-button");
const dealButtonContainer = document.getElementById("deal-button-container");
const betContainer = document.getElementById("bet");
const hitButton = document.getElementById("hit-button");
const stickButton = document.getElementById("stick-button");
const resetButton = document.getElementById("reset-button");

const dealerValue = document.getElementsByClassName("dealer-hand-value");
const playerValue = document.getElementsByClassName("player-hand-value");

// This holds all the players' data, from handList, to their total value and display
let playerHand = [];
let dealerHand = [];
let handList = [dealerHand, playerHand];
let handTotalList = [0,0];
let textList = ["",""];

// function addP2(){
//     let player2 = addPlayer2.innerHTML
//     handList.push(player2);
//     handList[2] = [];
// }

function dealAllCards(){
    for (let i = 0; i < 2; i++){
        handList[i].push(decklist.pop());
        handList[i].push(decklist.pop());
    }
}

function dealCards(){
    if(bet.value == 0){
        alert('Please place bet to play');
    }else if(currentBet > currentBalance/3){
        alert('You can lose up to 3x, please pick a bet less than 1/3 of your balance');
        bet.value = "0";
    }else{
        dealButtonContainer.style.display = `none`;
        betContainer.style.display = `none`;
        let cardAudio = new Audio('./SFX/card-deal.mp3');
        cardAudio.play();
        if (playerHand.length < 1){
            dealAllCards();
            for(let i = 0; i < 2; i++){
                playerCard[i].innerHTML = `<img src="Cards/cards/${handList[player1Index][i]}.png" alt=""></img>`
            }
            player.style.animation = 'popUp 1s';
            dealer.style.animation = 'popUp 1s';
            playerButton.style.display = `flex`;
            dealButton.style.display = `none`;
            countTotal(dealerIndex);
            countTotal(player1Index);
        } else{
            alert("Wait for the hand to end before you deal another!")
        }
        updateText();
        initialWinCheck();
    }
}

function countTotal(playerID){
    let ace_count = 0;
    let handTotal = 0;
    let selectHand = handList[playerID];

    for(let i = 0; i < selectHand.length; i++){
        let value = selectHand[i].split("-");
        let checkValue = value[0];
        if (checkValue == "A"){
            handTotal += 11;
            ace_count += 1;
        } else if (checkValue == "K" || checkValue == "Q" || checkValue == "J"){
            handTotal += 10;
        } else{
            handTotal += parseInt(checkValue);
        }
    }
    // Setting the conditions where Ace value can change
    if(selectHand.length > 2){
        handTotal -= 11*ace_count
    }
    if (ace_count == 1 && selectHand.length === 3 && handTotal <= 11){
        handTotal += 10
    }else if (ace_count == 1 && selectHand.length === 3 && handTotal > 11){
        handTotal += 1
    }else if (ace_count > 0 && selectHand.length >3){
        handTotal += 1*ace_count;
    }
    if(ace_count >1 && selectHand.length > 2){
        handTotal += 1*ace_count
    }

    // Adding or assigning a value to the HandTotal
    handTotalList[playerID] = handTotal;
    textList[playerID] = `Hand Value: ${handTotalList[playerID]}`;
    // dealerValue[0].textContent = `Hand Value: ${handTotalList[dealerIndex]}`;
    if (selectHand.length >= 5 && handTotalList[playerID] < 21){
        textList[playerID] = `You win with 5 cards! (Hand Value: ${handTotalList[playerID]})`;
    } else if (selectHand.length == 5 && handTotalList[playerID] == 21){
        textList[playerID] = `Jesus Christ, you did it. 5 cards 21`;
    } else if (selectHand.length == 5 && handTotalList[playerID] > 21){
        textList[playerID] = `You bombed with with 5 cards! (Hand Value: ${handTotalList[playerID]})`;
    }

    if (selectHand.length < 5 && handTotalList[playerID] > 21){
        textList[playerID] = `You busted! (Hand Value: ${handTotalList[playerID]})`;
    }
    // Forces player to hit below 16
    if (handTotalList[playerID] < 16){
        stickButton.disabled = true;
    } else {
        stickButton.disabled = false;
    }
    // Forces player to stick above 20
    if (handTotalList[playerID] > 2 && handTotalList[playerID] > 20){
        hitButton.disabled = true;
    } else {
        hitButton.disabled = false;
    }
}

// Update text to update when more players join - this is just testing
function updateText(){
    playerValue[0].textContent = textList[player1Index];
    dealerValue[0].textContent = textList[dealerIndex];
}


function initialWinCheck(){
    // This means that no one has drawn yet
    let endEarly = false
    if (handList[player1Index].length == 2){
        for(let i = 0; i < handTotalList.length; i++){
            if(handTotalList[i] == 22){
                textList[i] = "You have Pocket Aces!";
                endEarly = true;
            } else if(handTotalList[i] == 21){
                textList[i] = "You have Blackjack!";
                endEarly = true;
            }
        }
    }
    updateText();
    if (endEarly){
        endGameEarly();
    }
}

function hit(playerID){

    let cardAudio = new Audio('./SFX/card-deal-2.mp3');
    cardAudio.play();
    handList[playerID].push(decklist.pop());
    let newDiv = document.createElement("div");
    newDiv.className = "added-hand-card";
    newDiv.innerHTML = `<img src="Cards/cards/${handList[playerID][handList[playerID].length-1]}.png" alt=""></img>`;

    if (playerID == "1"){
        player.appendChild(newDiv)
    }else{
        dealer.appendChild(newDiv)
    };
    countTotal(playerID);
    updateText();
    if(handList[player1Index].length ==5){
        endGame();
    }
}

const playerAction = document.getElementById("player-action")

function stick(){
    let stick = new Audio("./SFX/stick.mp3");
    stick.play();
    playerAction.style.display = 'none';
    revealDealer();
    dealerTurn();
}

function revealDealer(){
    for(let i = 0; i < 2; i++){
        dealerCard[i].innerHTML = `<img src="Cards/cards/${handList[dealerIndex][i]}.png" alt=""></img>`
    }
    dealerValue[0].style.display = `flex`;
}

// function gameEnd(){

const gameText = document.getElementById("game-text")

async function dealerTurn(){
    gameText.innerHTML = "It's the dealer's turn now!"
        while (handTotalList[dealerIndex] < 17 && handList[dealerIndex].length < 5){
            await new Promise(resolve => setTimeout(resolve, 1500));
            gameText.innerHTML = "Dealer is still thinking";
            updateText();
            hit(dealerIndex);
        }
    endGame();
}

function endGameEarly(){
    let oldBalance = currentBalance;
    revealDealer();

    // Cases for Aces and Blackjack
    if (handTotalList[player1Index] == 22 && handTotalList[dealerIndex] == 22){
        gameText.innerHTML = "Both of you have Aces, WOW! Its a Draw"
    } else if(handTotalList[player1Index] == 22){
        gameText.innerHTML = "You won 3x with Pocket Aces!"
        currentBalance += currentBet*3
    } else if (handTotalList[dealerIndex] == 22){
        gameText.innerHTML = "Dealer won 3x with Pocket Aces!"
        currentBalance -= currentBet*3
    } else if (handTotalList[player1Index] == 21 && handTotalList[dealerIndex] == 21){
        gameText.innerHTML = "Both of you have BlackJack! Its a Draw"
    } else if (handTotalList[player1Index] == 21){
        gameText.innerHTML = "You won instantly with BlackJack!"
        currentBalance += currentBet*2
    } else if (handTotalList[dealerIndex] == 21){
        gameText.innerHTML = "Dealer instantly won with BJ"
        currentBalance -= currentBet*2
    }

    console.log('Old balance is ' + oldBalance);
    console.log('New balance is ' + currentBalance);
    let netChange = document.getElementById('net-change');
    if (oldBalance < currentBalance){
        let winAudio = new Audio("./SFX/win.mp3");
        winAudio.play();
        netChange.innerHTML = `+${currentBalance-oldBalance}$`;
        netChange.style.animation = 'slideIn 2s ease-in';
        netChange.style.display = `flex`;
        netChange.style.color = `green`;
        setTimeout(() => {
            netChange.style.display = `none`;
            netChange.style.animation = 'none';
            currentBalanceText.textContent = `${currentBalance} $`;
        }, 3000);
    } else if(oldBalance > currentBalance){
        let loseAudio = new Audio("./SFX/lose.mp3");
        const audioContext = new AudioContext();
        const sourceNode = audioContext.createMediaElementSource(loseAudio);
        const gainNode = audioContext.createGain();
        sourceNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.2;
        loseAudio.play();
        netChange.innerHTML = `-${oldBalance-currentBalance}$`;
        netChange.style.animation = 'slideIn 2s ease-in';
        netChange.style.display = `flex`;
        netChange.style.color = `red`;
        currentBalanceText.textContent = `${currentBalance} $`;
        setTimeout(() => {
            netChange.style.display = `none`;
            netChange.style.animation = 'none';
        }, 3000);
    }
    
    buyInBalance.textContent = `Your Balance: ${currentBalance} $`;
    playerAction.style.display = 'none';
    playAgain.style.display = `block`;
        
}


function endGame(){
    let oldBalance = currentBalance;
    revealDealer();

    if (handList[player1Index].length == 5){
        if (handTotalList[player1Index] < 22){
            gameText.innerHTML = `Congrats, you win 2x with 5 cards!`
            currentBalance += currentBet*2
        }else if(handTotalList[player1Index] == 21){
            gameText.innerHTML = `Congrats, you win 3x with 5 cards!`
            currentBalance += currentBet*3
        } else{
            gameText.innerHTML = `What a noob. Take more lah.`
            currentBalance -= currentBet*2 
        }
    }

    if (handList[dealerIndex].length == 5){
        if (handTotalList[dealerIndex] < 22){
            gameText.innerHTML = `You lost to the dealer, he drew 5 cards!`
            currentBalance -= currentBet*2
        }else if(handTotalList[dealerIndex] == 21){
            gameText.innerHTML = `You lost 3x to dealer's miracle hand!`
            currentBalance -= currentBet*3
        } else{
            gameText.innerHTML = `Dealer got overzealous and bombed.`
            currentBalance += currentBet*2
        }
    }

    if(handList[player1Index].length < 5 && handList[dealerIndex].length < 5){
        if (handTotalList[player1Index] < 22 && handTotalList[dealerIndex] < 22){
            if (handTotalList[player1Index] < handTotalList[dealerIndex]){
                if (handTotalList[dealerIndex] == 21){
                    gameText.innerHTML = "Dealer has 21. Pay up double :(";
                    currentBalance -= currentBet*2;
                }else{
                    gameText.innerHTML = "Sorry, you got rekt by the dealer";
                    currentBalance -= currentBet;
                }
            } else if (handTotalList[player1Index] > handTotalList[dealerIndex]){
                if (handTotalList[player1Index] == 21){
                    gameText.innerHTML = "You got 21! 2x the moolahs";
                    currentBalance += currentBet*2;
                }else{
                    gameText.innerHTML = "Congratulations, you won!";
                    currentBalance += currentBet;
                }
            } else{
                gameText.innerHTML = "You drew with the dealer"
            }
        } else if (handTotalList[player1Index] > 21){
            if (handTotalList[dealerIndex] < 21){
                gameText.innerHTML = `You busted! You lost to dealer`
                currentBalance -= currentBet
            } else if (handTotalList[dealerIndex] > 21){
                gameText.innerHTML = `Both you and the dealer busted. It's a draw`
            } else if (handTotalList[dealerIndex] == 21){
                gameText.innerHTML = "Dealer has 21. Pay up double :(";
                currentBalance -= currentBet*2;
            }
        } else if (handTotalList[dealerIndex] > 21){
            if (handTotalList[player1Index] < 21){
                gameText.innerHTML = `The dealer busted. You win!`
                currentBalance += currentBet
            } else if (handTotalList[player1Index] == 21){
                gameText.innerHTML = "You got 21! 2x the moolahs";
                currentBalance -= currentBet*2;
            }
        }
    }

    console.log('Old balance is ' + oldBalance);
    console.log('New balance is ' + currentBalance);
    let netChange = document.getElementById('net-change');
    if (oldBalance < currentBalance){
        let winAudio = new Audio("./SFX/win.mp3");
        winAudio.play();
        netChange.innerHTML = `+${currentBalance-oldBalance}$`;
        netChange.style.animation = 'slideIn 2s ease-in';
        netChange.style.display = `flex`;
        netChange.style.color = `green`;
        setTimeout(() => {
            netChange.style.display = `none`;
            netChange.style.animation = 'none';
            currentBalanceText.textContent = `${currentBalance} $`;
        }, 3000);
    } else if(oldBalance > currentBalance){
        let loseAudio = new Audio("./SFX/lose.mp3");
        const audioContext = new AudioContext();
        const sourceNode = audioContext.createMediaElementSource(loseAudio);
        const gainNode = audioContext.createGain();
        sourceNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.2;
        loseAudio.play();
        netChange.innerHTML = `-${oldBalance-currentBalance}$`;
        netChange.style.animation = 'slideIn 2s ease-in';
        netChange.style.display = `flex`;
        netChange.style.color = `red`;
        currentBalanceText.textContent = `${currentBalance} $`;
        setTimeout(() => {
            netChange.style.display = `none`;
            netChange.style.animation = 'none';
        }, 3000);
    }
    
    buyInBalance.textContent = `Your Balance: ${currentBalance} $`;
    playerAction.style.display = 'none';
    playAgain.style.display = `block`;
}

function playAgainButton(){
    reset();
    dealCards();
}

const loadingPage = document.getElementById("loading-page")
const mainContainer =  document.getElementById("main-container")

function startGame(){
    let start = new Audio("./SFX/start.mp3");
    start.play();
    loadingPage.style.animation = 'fadeOut 0.5s ease-out'
    setTimeout(() => {
        loadingPage.style.display = 'none';
        mainContainer.style.opacity = '1';
    }, 500);

}

const settings = document.getElementById("coming-soon");

function settingsOpen(){
    settings.style.display = `flex`;
    settings.style.animation = 'fadeIn 0.5s ease-in';
    mainContainer.style.opacity = '0.6';
    loadingPage.style.opacity = '0.6';
}

function settingsClose(){
    settings.style.animation = 'fadeOut 0.5s ease-out';
    setTimeout(() => {
        settings.style.display = 'none';
    }, 400);
    mainContainer.style.opacity = '1';
    loadingPage.style.opacity = '1';
}

const buyIn = document.getElementById("buy-in-main");

function buyInOpen(){
    buyIn.style.display = 'flex';
    buyIn.style.animation = 'fadeIn 0.5s ease-in';
    mainContainer.style.opacity = '0.6';
}

function buyInCancel(){
    buyIn.style.animation = 'fadeOut 0.5s ease-out';
    setTimeout(() => {
        buyIn.style.display = 'none';
    }, 400);
    
    mainContainer.style.opacity = '1';
}

function buyInOkay(){
    let oldBalance = currentBalance
    updateBalance();
    if(currentBalance == oldBalance){
        alert("Your balance has not changed!")
    }else{
        buyIn.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            buyIn.style.display = 'none';
        }, 400);
        mainContainer.style.opacity = '1';
    }
}


let currentBet = 0;
let bet = document.getElementById("bet-size");
let curBet = document.getElementById("cur-bet")

function updateBet(){
    currentBet = parseInt(bet.value);
    if(currentBalance == 0){
        alert('Please buy-in first before placing a bet!');
        bet.value = "";
    }
    curBet.innerHTML = `<p>Current Bet: ${bet.value} $ </p>`
}

function add10bet(){
    chipAudio.currentTime = 0;
    chipAudio.play();
    let curBet = parseInt(bet.value);
    let newBet = curBet + 10;
    if(isNaN(newBet)){
        newBet = 10;
    } 
    bet.value = newBet;
    updateBet()
}

function add50bet(){
    chipAudio.currentTime = 0;
    chipAudio.play();
    let curBet = parseInt(bet.value);
    let newBet = curBet + 50;
    if(isNaN(newBet)){
        newBet = 50;
    } 
    bet.value = newBet;
    updateBet()
}

function add100bet(){
    chipAudio.currentTime = 0;
    chipAudio.play();
    let curBet = parseInt(bet.value);
    let newBet = curBet + 100;
    if(isNaN(newBet)){
        newBet = 100;
    } 
    bet.value = newBet;
    updateBet()
}

function add500bet(){
    chipAudio.currentTime = 0;
    chipAudio.play();
    let curBet = parseInt(bet.value);
    let newBet = curBet + 500;
    if(isNaN(newBet)){
        newBet = 500;
    } 
    bet.value = newBet;
    updateBet()
}

let currentBalance = 0;
let currentBalanceText = document.getElementById("player-balance");
let buyInBalance = document.getElementById("buy-in-balance");
let buyInInput = document.getElementById("buy-in-input");
// buyInInput.value = "0";
let chipAudio = new Audio("./Chips/chip-sound.mp3");

function updateBalance(){
    let topUp = parseInt(buyInInput.value);
    if (isNaN(topUp)){
        alert("Please input a valid number")
    }else{
        currentBalance += parseInt(buyInInput.value);
        currentBalanceText.textContent = `${currentBalance} $`;
        buyInBalance.textContent = `Your Balance: ${currentBalance} $`;
    }
    buyInInput.value = 0;
}

function add10(){
    chipAudio.currentTime = 0;
    chipAudio.play();
    let currentValue = parseInt(buyInInput.value);
    let newValue = currentValue + 10;
    if(isNaN(newValue)){
        newValue = 10;
    } 
    buyInInput.value = newValue;
}

function add50(){
    chipAudio.currentTime = 0;
    chipAudio.play();
    let currentValue = parseInt(buyInInput.value);
    let newValue = currentValue + 50;
    if(isNaN(newValue)){
        newValue = 50;
    } 
    buyInInput.value = newValue;
}

function add100(){
    chipAudio.currentTime = 0;
    chipAudio.play();
    let currentValue = parseInt(buyInInput.value);
    let newValue = currentValue + 100;
    if(isNaN(newValue)){
        newValue = 100;
    } 
    buyInInput.value = newValue;
}

function add500(){
    chipAudio.currentTime = 0;
    chipAudio.play();
    let currentValue = parseInt(buyInInput.value);
    let newValue = currentValue + 500;
    if(isNaN(newValue)){
        newValue = 500;
    } 
    buyInInput.value = newValue;
}

function reset(){
    playerHand = [];
    dealerHand = [];
    handList = [dealerHand, playerHand];
    handTotalList = [0,0];
    makeDeck();
    shuffleDeck();
    try{
        while (playerAddedHandCard){
            player.removeChild(playerAddedHandCard[0]);
        }
    }catch(err){
    };
    try{
        while (dealerAddedHandCard){
            dealer.removeChild(dealerAddedHandCard[0]);
        }
    }catch(err){
    };
    for(let i = 0; i < 2; i++){
        dealerCard[i].innerHTML = `<img src="Cards/cards/BACK.png" alt=""></img>`
        playerCard[i].innerHTML = `<img src="Cards/cards/BACK.png" alt=""></img>`
    };
    dealButton.style.display = `block`;
    playerAction.style.display = `none`;
    playerValue[0].textContent = ``;
    dealerValue[0].textContent = ``;
    dealerValue[0].style.display = `none`;
    gameText.innerHTML = ``;
    player.style.animation = 'none';
    dealer.style.animation = 'none';
    playAgain.style.display = `none`;
    dealButtonContainer.style.display = `flex`;
    betContainer.style.display = `flex`;
    // handCard[0].innerHTML = `<img src="Cards/cards/BACK.png" alt=""></img>`
}

