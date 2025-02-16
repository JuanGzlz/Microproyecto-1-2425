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
        updateScoreTable(); // Actualiza la tabla con los puntajes al cargar el menú
    };

    clearScoresButton.addEventListener("click", () => {
        localStorage.clear(); // Borrar todos los datos de localStorage
        updateScoreTable(); // Actualizar la tabla de puntajes
    });

    function updateScoreTable() { //PENDIENTE REVISAR QUE SE ACTUALICE DE MAYOR A MENOR !!!!!
        const tableBody = document.getElementById('highScores').getElementsByTagName('tbody')[0];
        
        // Crear un array con los puntajes
        let scores = [];
        for (let i = 0; i < localStorage.length; i++) {
            const playerName = localStorage.key(i);
            if (playerName !== "playerName" && playerName !== "currentPlayer") { // Evitar claves de configuración
                const score = parseInt(localStorage.getItem(playerName)) || 0;
                scores.push({ name: playerName, score: score });
            }
        }

        // Ordenar los puntajes de mayor a menor
        scores.sort((a, b) => b.score - a.score);

        // Limpiar la tabla antes de actualizarla
        tableBody.innerHTML = '';

        // Insertar los puntajes ordenados en la tabla
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
        startGame();  
    };


    function startGame() {
        sequence = [];
        playerSequence = [];
        index = 0;
        score = 0;
        document.getElementById("score").textContent = score;
        if (interval) { 
            clearInterval(interval); // Limpiar cualquier intervalo activo
        }

        addColorToSequence();
    }
    
    function addColorToSequence() {
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(randomColor);
        showSequence();
    }
    
    function showSequence() {
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
    }
    
    function highlightButton(color) {
        let button = document.querySelector(`.${color}`);
        button.classList.add('glow'); // Agrega la clase que ilumina el botón
        if (sounds[color]) {
            sounds[color].currentTime = 0; // Reinicia el sonido si se reproduce seguido
            sounds[color].play();
        }
        setTimeout(() => {
            button.classList.remove('glow'); // Quita la clase después de 500ms
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
        console.log("Game Over! Final Score:", finalScore); 

        const popup = document.getElementById("gameOverPopup");
        const finalScoreElement = document.getElementById("finalScore");
        finalScoreElement.textContent = finalScore; // Mostrar el puntaje final en el pop-up
        popup.style.display = "flex"; // Mostrar el pop-up
        document.getElementById("finalScore").textContent = finalScore; // Mostrar el puntaje final en el pop-up

        const username = localStorage.getItem("playerName"); // Obtener el nombre del jugador guardado
        let currentScore = localStorage.getItem(username) || 0;
        currentScore = Math.max(currentScore, finalScore); // Guardar el puntaje más alto
        localStorage.setItem(username, currentScore); // Guardar el puntaje bajo el nombre del jugador

        document.getElementById("restartButton").addEventListener("click", () => {
            popup.style.display = "none"; // Ocultar el pop-up
            startGame(); 
        });

        document.getElementById("goToMenuButton").addEventListener("click", () => {
            window.location.href = "index.html"; // Redirigir al menú
        });
    }

}