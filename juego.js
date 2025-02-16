const inputNombre = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const errorText = document.getElementById("error");
const clearScoresButton = document.getElementById("clearScoresButton");
//pruebaaaaa
const sounds = {
    red: new Audio('sounds/red.wav'),
    green: new Audio('sounds/green.wav'),
    blue: new Audio('sounds/blue.mp3'),
    yellow: new Audio('sounds/yellow.mp3')
};

let sequence = [];
let playerSequence = [];
let colors = ['red', 'green', 'blue', 'yellow'];
let index = 0;
let score = 0;
let interval;

document.addEventListener("DOMContentLoaded", disableColorButtons); 


document.getElementById("startGameButton").addEventListener("click", () => {
    document.getElementById("startGameButton").style.display = "none";
    startGame();
});

document.getElementById("restartButton").addEventListener("click", () => {
    document.getElementById("gameOverPopup").style.display = "none"; 
    redirectionGame();
});

function disableColorButtons() {
    document.querySelectorAll('.color-button').forEach(button => {
        button.style.pointerEvents = 'none'; 
    });
}

function enableColorButtons() {
    document.querySelectorAll('.color-button').forEach(button => {
        button.style.pointerEvents = 'auto'; 
    });
}

function startGame() {
    sequence = [];
    playerSequence = [];
    index = 0;
    score = 0;
    document.getElementById("score").textContent = score;
    if (interval) { 
        clearInterval(interval); 
    }
    addColorToSequence();
}

function addColorToSequence() {
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    showSequence();
}

function showSequence() {
    disableColorButtons();
    document.getElementById("gameStatus").textContent = "Simón dice...";
    let i = 0;
    interval = setInterval(() => {
        highlightButton(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById("gameStatus").textContent = "Replica la secuencia.";
                enableColorButtons();
            }, 500);
        }
    }, 1000);
    
}

function highlightButton(color) {
    let button = document.querySelector(`.${color}`);
    button.classList.add('glow'); 
    if (sounds[color]) {
        sounds[color].currentTime = 0; 
        sounds[color].play();
    }
    setTimeout(() => {
        button.classList.remove('glow'); 
    }, 500);
}


function playerMove(color) {
    playerSequence.push(color);
    if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
        endGame(score);
    }
    if (playerSequence.length === sequence.length) {
        score++;
        document.getElementById("score").textContent = score;
        playerSequence = [];
        addColorToSequence();
    }
}

function endGame(finalScore) {
    const popup = document.getElementById("gameOverPopup");
    const finalScoreElement = document.getElementById("finalScore");
    finalScoreElement.textContent = finalScore; 
    popup.style.display = "flex"; 
    document.getElementById("finalScore").textContent = finalScore; 

    const username = localStorage.getItem("playerName"); 
    let currentScore = localStorage.getItem(username) || 0;
    currentScore = Math.max(currentScore, finalScore); 
    localStorage.setItem(username, currentScore); 

    document.getElementById("restartButton").addEventListener("click", () => {
        popup.style.display = "none"; 
        redirectionGame();
    });

    document.getElementById("goToMenuButton").addEventListener("click", () => {
        redirectionMenu();
    });
}

function redirectionGame(){
    const isGitHubPages = window.location.hostname.includes("github.io");
    
    const repoName = "Microproyecto-1-2425";  

    const baseUrl = isGitHubPages
        ? `https://${window.location.hostname}/${repoName}/`
        : "/"; // Para local

    window.location.href = baseUrl + "juego.html";
}

function redirectionMenu(){
    const isGitHubPages = window.location.hostname.includes("github.io");
    const repoName = "Microproyecto-1-2425"; 

    const baseUrl = isGitHubPages
        ? `https://${window.location.hostname}/${repoName}/`
        : "/"; // Para local

    window.location.href = baseUrl + "index.html";
}
