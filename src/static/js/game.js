import { Player } from "./player.js";
import { gameMap } from "./graphStruct.js"; 

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

    // Back to player count page button logic
    const backBtn = document.getElementById("back-to-player-count-page");
    if (backBtn) {
        backBtn.onclick = () => {
            window.location.href = "/";
        };
    }
    
    // Main game function - only run if canvas exists
    const gameBoard = document.getElementById("gameCanvas");
    if (!gameBoard) return; // Exit if not on game page

    gameBoard.width = 800;
    gameBoard.height = 600;

    const ctx = gameBoard.getContext("2d");


    const playerCount = parseInt(sessionStorage.getItem("playerCount") || "2", 10);
    const playerColors = ["blue", "red", "green", "yellow", "black"];
    const playerList = [];

    for (let i = 0; i < playerCount; i++) {
        playerList.push(new Player(playerColors[i]));
    }
    
    console.log(playerList.length);

    const gameMapInstance = new gameMap();

    let currentPlayerIndex = 0;
    let gameOver = false;
    let lastTime = 0;

    function update(deltaTime) {
        if (gameOver) return;
        // Update game state
    }

    function draw() {
        ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);

        ctx.fillStyle = "blue";
        ctx.fillRect(100, 100, 50, 50);
    }

    function gameLoop(timestamp) {
        const deltaTime = (timestamp - lastTime) / 1000; // seconds
        lastTime = timestamp;

        update(deltaTime);
        draw();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
});