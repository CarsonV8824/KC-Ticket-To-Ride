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
    const Cards = ["white", "green"]
    const OpenPile = [];

    for (let i = 0; i < 5; i++) {
        OpenPile.push(Cards[Math.floor(Math.random() * Cards.length)]);
    }
    
    const playerList = [];

    for (let i = 0; i < playerCount; i++) {
        playerList.push(new Player(playerColors[i]));
    }
    
    console.log(playerList.length);

    for (let i = 0; i < playerList.length; i++) {
        playerList[i].addCard(Cards[Math.floor(Math.random() * Cards.length)]);
        playerList[i].addCard(Cards[Math.floor(Math.random() * Cards.length)]);
        playerList[i].addCard(Cards[Math.floor(Math.random() * Cards.length)]);
        playerList[i].addCard(Cards[Math.floor(Math.random() * Cards.length)]);
    }

    const gameMapInstance = new gameMap();

    let currentPlayerIndex = 0;
    let gameOver = false;
    let lastTime = 0;

    function update(deltaTime) {
        if (gameOver) return;
        const RouteList = document.getElementById("routeList");
        const routes = gameMapInstance.adjList.values()
        if (RouteList) {
            RouteList.innerHTML = "";
            for (const route of routes) {
                const listItem = document.createElement("li");
                listItem.textContent = `Route from ${route.startCity} to ${route.endCity} - Length: ${route.length}, Color: ${route.color}, Claimed by: ${route.claimedBy ? route.claimedBy : "Unclaimed"}`;
                RouteList.appendChild(listItem);
            }   
        }
    }  

    function drawCities() {
        ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);

        ctx.fillStyle = "black";
        ctx.font = "12px Times New Roman";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Kansas City", gameBoard.width / 2, gameBoard.height / 2);

        ctx.fillStyle = "black";
        ctx.font = "12px Times New Roman";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Gladstone", gameBoard.width / 2, gameBoard.height / 2 - 120);
    }

    function gameLoop(timestamp) {
        const deltaTime = (timestamp - lastTime) / 1000; // seconds
        lastTime = timestamp;

        const OpenPileElement = document.getElementById("openPile");
        if (OpenPileElement) {
            OpenPileElement.textContent = `Open Pile: ${OpenPile.join(", ")}`;
        }

        const playerTurnElement = document.getElementById("playerTurn");
        if (playerTurnElement) {
            playerTurnElement.textContent = `Player ${currentPlayerIndex + 1}'s Turn`;
        }

        const playerStatsElement = document.getElementById("playerStats");
        if (playerStatsElement) {
            playerStatsElement.textContent = `Player ${currentPlayerIndex + 1} has ${(playerList[currentPlayerIndex].showCards()).join(", ")}, cards.`;
        }

        const DrawTwoCardsBtn = document.getElementById("drawTwoCards");
        if (DrawTwoCardsBtn ) {
            DrawTwoCardsBtn.onclick = () => {
                playerList[currentPlayerIndex].addCard(Cards[Math.floor(Math.random() * Cards.length)]);
                playerList[currentPlayerIndex].addCard(Cards[Math.floor(Math.random() * Cards.length)]);
                currentPlayerIndex = (currentPlayerIndex + 1) % playerList.length;
            };
        }

        const DrawFromPileBtn = document.getElementById("drawFromPile");
        if (DrawFromPileBtn ) {
            DrawFromPileBtn.onclick = () => {
                playerList[currentPlayerIndex].addCard(Cards[Math.floor(Math.random() * Cards.length)]);
                OpenPile.pop();
                OpenPile.push(Cards[Math.floor(Math.random() * Cards.length)]);
                OpenPileElement.textContent = `Open Pile: ${OpenPile.join(", ")}`;
                currentPlayerIndex = (currentPlayerIndex + 1) % playerList.length;
            };
        }


        update(deltaTime);
        drawCities();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
});