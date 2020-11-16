const gameState = {
    difficulty: 'normal',
    level: 1,
    maxLevel: 10,
    score: 0,
    roundLenght: 6
}

function activateTile(tile) {
    tile.classList.add("active");
}

const gameBody = document.getElementById("game-body");
const scoreCounter = document.getElementById("score");
const timer = document.getElementById("timer");
const restartBtn = document.getElementById("restart-btn");
const difficultiesWrapper = document.getElementById("difficulties-wrapper");
let selectionIsAllowed = true;

let activeTilesCount = 0;

restartBtn.addEventListener("click", (e) => {
    restartGame();
});

difficultiesWrapper.addEventListener("click", (e) => {

    if (e.target.classList.contains("diff-btn")) {
        startNewGame(e.target.dataset.difficulty);
    }
});

gameBody.addEventListener("click", (e) => {
    const eTargetClassList = e.target.classList;
    if (eTargetClassList.contains("game-tile-wrapper") && !eTargetClassList.contains("active") && selectionIsAllowed) {
        activateTile(e.target);
        activeTilesCount++;
    }
});

const nRows = 5;
const nColumns = 5;


function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let laserRows = [];
let laserColumns = [];

function generateLaserPositions(targetArray, nPositions) {
    let numberPen = [];
    for (i = 0; i < nPositions; i++) {
        let randomNumber = getRandomArbitrary(0, 6);
        while (numberPen.includes(randomNumber)) {
            randomNumber = getRandomArbitrary(0, 6);
        }
        numberPen.push(randomNumber);
        let position = [randomNumber, getRandomArbitrary(-1, 2)]
        targetArray.push(position);
    }
}

function anullateLaserPositions() {
    laserRows = [];
    laserColumns = [];
}

const gameColumns = [].slice.call(document.getElementsByClassName("game-column"));
const gameRows = [].slice.call(document.getElementsByClassName("game-row"));
const gameTiles = [].slice.call(document.getElementsByClassName("game-tile-wrapper"));

function assignLaserClass(position, elementArray) {
    elementArray[position[0]].classList.add(position[1] ? "laser-top" : "laser-bottom");
}

function toggleLasers() {
    gameBody.classList.contains('lasers-visible') ? gameBody.classList.remove('lasers-visible') : gameBody.classList.add('lasers-visible');
}

function waitNSeconds(seconds) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    });
}

function clearClasses() {
    gameRows.forEach(row => row.classList.remove('laser-top', 'laser-bottom'));
    gameColumns.forEach(column => column.classList.remove('laser-top', 'laser-bottom'));
    gameTiles.forEach(column => column.classList.remove('active'));
}

function countFaults() {
    let nFaults = 0;
    laserRows.forEach(laserRow => { console.log(laserRow); nFaults += countActiveTilesinLaserRow(gameRows[laserRow[0]])});
    laserColumns.forEach(laserColumn => { nFaults += countActiveTilesinLaserColumn(laserColumn)});
    console.log("faults " + nFaults);
    gameState.score = gameState.score + (activeTilesCount - (nFaults * 2));
}

function countActiveTilesinLaserRow(row) {
    console.log(row);
   const faults = row.getElementsByClassName('active').length;
   return faults;
}

function countActiveTilesinLaserColumn(column) {
    let faults = 0;
    gameRows.forEach(row => {
        if(!row.classList.contains('laser-bottom') && !row.classList.contains('laser-top') && row.getElementsByClassName('game-tile-wrapper')[column[0]].classList.contains('active')) {
            faults++;
        }
    })
    return faults;
 }



function calculateScore() {
    countFaults();
}

function animateTimer(){
    timer.animate([
        // keyframes
        { width: '100%'}, {
            width: 0
        }
      ], { 
        // timing options
        duration: gameState.roundLenght * 1000,
        iterations: 1
      });
}

let roundLaserCount = [3,3,3,3,4,4,4,4,5,5];


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

shuffleArray(roundLaserCount);

function initiateNewRound() {
    clearClasses();
    anullateLaserPositions();
    generateLaserPositions(laserRows, roundLaserCount[gameState.level - 1]);
    generateLaserPositions(laserColumns, roundLaserCount[gameState.level - 1]);
    laserColumns.forEach(column => assignLaserClass(column, gameColumns));
    laserRows.forEach(row => assignLaserClass(row, gameRows));
    selectionIsAllowed = true;
    activeTilesCount = 0;
    if (gameState.level <= gameState.maxLevel) {
        gameState.level++;
        gameRound();
    } else {
        anullateLaserPositions();
        clearClasses();
        gameBodyWrapper.classList.add("game-over");
    }
}

async function gameRound() {
    animateTimer();
    await waitNSeconds(gameState.roundLenght);
    toggleLasers();
    calculateScore();
    scoreCounter.textContent = gameState.score;
    selectionIsAllowed = false;
    await waitNSeconds(4);
    toggleLasers();
    initiateNewRound();
}

function restartGame() {
    gameState.level = 1;
    gameState.score = 0;
    scoreCounter.textContent = 0;
    gameBodyWrapper.classList.remove("game-over");
    initiateNewRound();
}

function startNewGame(difficulty) {
    gameBodyWrapper.classList.remove("new-game");
    switch(difficulty) {
        case "easy":
            gameState.roundLenght = 8;
            break;
        case "normal":
            gameState.roundLenght = 6;
            break;
        case "hard":
            gameState.roundLenght = 4;
            break;

    }
    initiateNewRound();
}