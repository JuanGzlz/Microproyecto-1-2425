const inputNombre = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const errorText = document.getElementById("error");
const clearScoresButton = document.getElementById("clearScoresButton");

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

    redirection();
});

function redirection(){
    const isGitHubPages = window.location.hostname.includes("github.io");
    
    const repoName = "Microproyecto-1-2425"; //cambioo

    const baseUrl = isGitHubPages
        ? `https://${window.location.hostname}/${repoName}/`
        : "/"; // Para local

    window.location.href = baseUrl + "juego.html";
}

document.addEventListener("DOMContentLoaded", updateScoreTable);

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


