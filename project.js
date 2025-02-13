const inputNombre = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const errorText = document.getElementById("error");

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

window.onload = function () {
    if (window.location.pathname === '/index.html') {
        startGame();  // Solo llama a startGame si estás en index.html
    }
};

let sequence = [];
let playerSequence = [];
let colors = ['red', 'green', 'blue', 'yellow'];
let index = 0;
let score = 0;

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
        alert("¡Incorrecto! Inténtalo de nuevo.");
        endGame(score);
    return;
    }
    if (playerSequence.length === sequence.length) {
        alert("¡Correcto! Ahora sigue la siguiente secuencia.");
        score++;
        document.getElementById("score").textContent = score;
        playerSequence = [];
        addColorToSequence();
    }
}

function endGame(finalScore) {
    const nombre = inputNombre.value.trim(); 
    const username = localStorage.getItem("playerName");
    let currentScore = localStorage.getItem(username) || 0;
    currentScore = Math.max(currentScore, finalScore); // Guardamos el puntaje más alto
    localStorage.setItem(playerName, currentScore); // Guardamos el puntaje bajo el nombre del jugador
    updateScoreTable();
}


function updateScoreTable() {
    const table = document.getElementById('highScores').getElementsByTagName('tbody')[0];
    
    // Limpiamos la tabla antes de actualizarla
    table.innerHTML = '';
    
    // Recorremos todos los elementos de localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const playerName = localStorage.key(i); // Nombre del jugador (clave)
        const score = localStorage.getItem(playerName); // Puntaje del jugador
        // Creamos una fila en la tabla para cada jugador
        if (playerName !== 'playerName') {  // Evitar que se muestre el nombre de la clave "playerName"
        // Creamos una fila en la tabla para cada jugador
        const newRow = table.insertRow();
        newRow.setAttribute('data-user', playerName);
        newRow.insertCell(0).textContent = playerName;
        newRow.insertCell(1).textContent = score;
    }
    }
}