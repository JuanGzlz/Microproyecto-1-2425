const inputNombre = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const errorText = document.getElementById("error");
const clearScoresButton = document.getElementById("clearScoresButton");
const sounds = {
    red: new Audio('sounds/red.wav'),
    green: new Audio('sounds/green.wav'),
    blue: new Audio('sounds/blue.mp3'),
    yellow: new Audio('sounds/yellow.mp3')
};

if (window.location.pathname === '/index.html') {
    inputNombre.addEventListener("input", () => {
        const nombre = inputNombre.value.trim(); 
        if (nombre.length >= 3 && nombre.length <= 10) {
            startButton.disabled = false;
            errorText.style.display = "none"; 
        } else {
            startButton.disabled = true;
            errorText.style.display = "block"; 
        }
    }); 
    
    startButton.addEventListener("click", () => {
        const nombre = inputNombre.value.trim(); 
        localStorage.setItem("playerName", nombre);
        window.location.href = "juego.html"; 
    });

    window.onload = function() {
        updateScoreTable(); 
    };

    clearScoresButton.addEventListener("click", () => {
        localStorage.clear(); 
        updateScoreTable(); 
    });

    function updateScoreTable() { 
        const tableBody = document.getElementById('highScores').getElementsByTagName('tbody')[0];
        
        let scores = [];
        for (let i = 0; i < localStorage.length; i++) {
            const playerName = localStorage.key(i);
            if (playerName !== "playerName" && playerName !== "currentPlayer") { // Evitar claves de configuración
                const score = parseInt(localStorage.getItem(playerName)) || 0;
                scores.push({ name: playerName, score: score });
            }
        }

        scores.sort((a, b) => b.score - a.score);
        tableBody.innerHTML = '';

        scores.forEach(entry => {
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = entry.name;
            newRow.insertCell(1).textContent = entry.score;
        });
    }
}

let sequence = [];
let playerSequence = [];
let colors = ['red', 'green', 'blue', 'yellow'];
let index = 0;
let score = 0;

if (window.location.pathname === '/juego.html') {

    let interval;

    window.onload = function () {
        disableColorButtons(); 
    };

    document.getElementById("startGameButton").addEventListener("click", () => {
        document.getElementById("startGameButton").style.display = "none";
        startGame();
    });

    document.getElementById("restartButton").addEventListener("click", () => {
        document.getElementById("gameOverPopup").style.display = "none"; 
        window.location.href = "juego.html"; 
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
                }, 500);
            }
        }, 1000);
        enableColorButtons();
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
            window.location.href = "juego.html"; 
        });

        document.getElementById("goToMenuButton").addEventListener("click", () => {
            window.location.href = "index.html"; 
        });
    }
}
