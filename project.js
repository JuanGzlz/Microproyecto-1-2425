const inputNombre = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const errorText = document.getElementById("error");

if (window.location.pathname === '/menu.html') {
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
        window.location.href = "index.html"; 
    });

    window.onload = function() {
        updateScoreTable(); // Actualiza la tabla con los puntajes al cargar el menú
    };

    clearScoresButton.addEventListener("click", () => {
        localStorage.clear(); // Borrar todos los datos de localStorage
        updateScoreTable(); // Actualizar la tabla de puntajes
    });

    function updateScoreTable() {
        const tableBody = document.getElementById('highScores').getElementsByTagName('tbody')[0];
        
        //tableBody.innerHTML = ''; // Limpiar la tabla antes de actualizarla
        
        for (let i = 0; i < localStorage.length; i++) {
            const playerName = localStorage.key(i);
            if (playerName !== "playerName" && playerName !== "currentPlayer") { // Evitar claves de configuración
                const score = localStorage.getItem(playerName);
                const newRow = tableBody.insertRow();
                newRow.insertCell(0).textContent = playerName;
                newRow.insertCell(1).textContent = score;
            }
        }
    }
}

let sequence = [];
let playerSequence = [];
let colors = ['red', 'green', 'blue', 'yellow'];
let index = 0;
let score = 0;


if (window.location.pathname === '/index.html') {
    window.onload = function () {
        startGame();  
    };

    function startGame() {
        sequence = [];
        playerSequence = [];
        index = 0;
        addColorToSequence();
    }
    
    function addColorToSequence() {
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(randomColor);
        showSequence();
    }
    
    function showSequence() {
        let i = 0;
        const interval = setInterval(() => {
            highlightButton(sequence[i]);
            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
            }
        }, 1000);
    }
    
    function highlightButton(color) {
        let button = document.querySelector(`.${color}`);
        button.style.opacity = '0.5';
        setTimeout(() => {
            button.style.opacity = '1';
        }, 500);
    }
    
    function playerMove(color) {
        playerSequence.push(color);
        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            endGame(score);
            return;
        }
        if (playerSequence.length === sequence.length) {
            score++;
            document.getElementById("score").textContent = score;
            playerSequence = [];
            addColorToSequence();
        }
    }
    
    function endGame(finalScore) {
        const username = localStorage.getItem("playerName"); // Obtener el nombre del jugador guardado
        let currentScore = localStorage.getItem(username) || 0;
        currentScore = Math.max(currentScore, finalScore); // Guardar el puntaje más alto
        localStorage.setItem(username, currentScore); // Guardar el puntaje bajo el nombre del jugador
        window.location.href = "menu.html";
    }
}