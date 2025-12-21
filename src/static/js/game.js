//import { Player } from "./player.js";
//import { Map } from "./graphStruct.js"; // kept if you need it later

document.addEventListener("DOMContentLoaded", () => {
    // Player count page logic
    const countBtn = document.getElementById("player-count-btn");
    const countInput = document.getElementById("player-count-input");

    if (countBtn && countInput) {
        countBtn.type = "button";
        countBtn.onclick = (event) => {
            event.preventDefault();
            const count = parseInt(countInput.value ?? "", 10);
            if (isNaN(count) || count < 2 || count > 5) {
                alert("Please enter a valid number of players between 2 and 5.");
                return;
            }
            sessionStorage.setItem("playerCount", String(count));
            window.location.href = "/gamepage";
        };
    }
});

// Main game function

function main() {
    const gameBoard = document.getElementById("gameCanvas");
    const ctx = gameBoard.getContext("2d");

    const playerCount = parseInt(sessionStorage.getItem("playerCount") || "2", 10);
    const playerColors = ["blue", "red", "green", "yellow", "black"];
    const playerList = [];

    for (let i = 0; i < playerCount; i++) {
        playerList.push(playerColors[i]);
    }

}

document.addEventListener("DOMContentLoaded", main);