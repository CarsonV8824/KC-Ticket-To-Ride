import { Player } from "./player.js";
import { gameMap, cityCoordinates } from "./graphStruct.js"; 


document.addEventListener("DOMContentLoaded", async () => {
    // Player count page logic
    const countBtn = document.getElementById("player-count-btn");
    const countInput = document.getElementById("player-count-input");

    if (countBtn && countInput) {
        countBtn.onclick = (event) => {
            event.preventDefault();
            const count = parseInt(countInput.value ?? "", 10);
            if (isNaN(count) || count < 2 || count > 5) {
                alert("Please enter a valid number of players between 2 and 5.");
                return;
            }
            
            fetch("/initialize_game", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ player_count: count })
            }).then(() => {
                sessionStorage.setItem("playerCount", String(count));
                window.location.href = "/gamepage";
            }).catch((error) => {
                console.error("Error initializing game:", error);
                alert("Failed to initialize game. Please try again.");
            });
        };
    }

    const ResetBtn = document.getElementById("reset-game-btn");
    if (ResetBtn) {
        ResetBtn.onclick = () => {
            fetch("/reset_game", { method: "POST" })
                .then(() => {
                    sessionStorage.removeItem("playerCount");   
                    window.location.href = "/";
                })
                .catch((error) => {
                    console.error("Error resetting game:", error);
                    alert("Failed to reset game. Please try again.");
                });
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
    
    const AboutBtn = document.getElementById("about-page-btn");
    if (AboutBtn) {
        AboutBtn.onclick = () => {
            window.location.href = "/about";
        };
    }
    
    const FromAboutToGameBtn = document.getElementById("home-page-btn");
    if (FromAboutToGameBtn) {
        FromAboutToGameBtn.onclick = () => {
            console.log("Clicked Home Button from About Page");
            window.location.href = "/gamepage";
        }
    }
    
    const HomeBtn = document.getElementById("back-to-player-count-page");
    if (HomeBtn) {
        HomeBtn.onclick = () => {
            console.log("Clicked Home Button");
            window.location.href = "/";
        };
    }


    const gameBoard = document.getElementById("gameCanvas");
    if (!gameBoard) return; // Exit if not on game page

    gameBoard.width = 800;
    gameBoard.height = 600;

    const ctx = gameBoard.getContext("2d");

    async function fetchGameState() {
        try {
            const response = await fetch("/get_data_from_py");   
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched game state:", data);
                return data;
                // Here you can initialize your game state with the fetched data
            } else {
                console.error("Failed to fetch game state:", response.statusText);
            }  
        } catch (error) {
            console.error("Error fetching game state:", error);
        }
    
    }
    
    
    
    let playerCount;
    let playerColors;
    let Cards;
    let OpenPile;
    let playerList;
    let gameMapInstance;
    
    try {
    const data = await fetchGameState();
    if (data) {
        playerCount = data.player_data.length;
        playerColors = ["blue", "red", "green", "yellow", "black"];
        Cards = ["white", "green", "pink", "black", "red", "blue", "yellow", "orange"];
        OpenPile = data.open_pile;
        playerList = data.player_data.map(playerData => {
            const player = new Player(playerData.color);
            playerData.cards.forEach(card => player.addCard(card));
            player.score = playerData.score || 0; 
            player.trains = playerData.trains || 15;
            player.destinations = playerData.destinations || [];
            return player;
        });
        gameMapInstance = new gameMap();
        data.map_data.forEach(([city, edges]) => {
            edges.forEach(edge => {
                gameMapInstance.buyRoute(city, edge.node, edge.value["Player"]);
            });
        });
    } else {
        throw new Error("No data returned");
    }
} catch (error) {
    playerCount = parseInt(sessionStorage.getItem("playerCount") || "2", 10);
    playerColors = ["blue", "red", "green", "yellow", "black"];
    Cards = ["white", "green", "pink", "black", "red", "blue", "yellow", "orange"];
    OpenPile = [];

    for (let i = 0; i < 5; i++) {
        OpenPile.push(Cards[Math.floor(Math.random() * Cards.length)]);
    }
    
    playerList = [];
    for (let i = 0; i < playerCount; i++) {
        playerList.push(new Player(playerColors[i]));
    }
    
    for (let i = 0; i < playerList.length; i++) {
        playerList[i].addCard(Cards[Math.floor(Math.random() * Cards.length)]);
        playerList[i].addCard(Cards[Math.floor(Math.random() * Cards.length)]);
        playerList[i].addCard(Cards[Math.floor(Math.random() * Cards.length)]);
        playerList[i].addCard(Cards[Math.floor(Math.random() * Cards.length)]);
    }
    
    gameMapInstance = new gameMap();
}
    //setInterval(fetchGameState, 1000);
    let currentPlayerIndex = 0;
    let gameOver = false;
    let lastTime = 0;

        function update() {
            
            if (gameOver) return;
            const routeList = document.getElementById("routeList");
            if (!routeList) return;

            routeList.textContent = "";
            for (const [city, edges] of gameMapInstance.getRoutes()) {
                edges.forEach((edge, index) => {
                    if (index % 2 === 1) return;
                    const li = document.createElement("li");
                    li.textContent = `${city} to ${edge.node}: ${JSON.stringify(edge.value)}`;
                    routeList.appendChild(li);
                    console.log("routes", [gameMapInstance.getRoutes()]);
                    
                });
            }

            

        }
        function drawCities() {
            
            ctx.fillStyle = "black";
            ctx.font = "12px Times New Roman";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (const [city, pos] of Object.entries(cityCoordinates)) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.strokeStyle = "black";
                ctx.stroke();
                ctx.fillStyle = "black";
                ctx.fillText(city, pos.x, pos.y - 15);
            }
        }

        function drawAndUpdateRoutes(routeData) {
            ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
            
            for (const [city, edges] of routeData) {
                const fromPos = cityCoordinates[city];
                edges.forEach(edge => {
                    const toPos = cityCoordinates[edge.node];
                    // Avoid drawing the same route twice
                    if (city > edge.node) return;

                    // Calculate midpoint
                    const midX = (fromPos.x + toPos.x) / 2;
                    const midY = (fromPos.y + toPos.y) / 2;

                    // Calculate angle and length
                    const dx = toPos.x - fromPos.x;
                    const dy = toPos.y - fromPos.y;
                    const length = Math.sqrt(dx * dx + dy * dy) - 16;
                    const angle = Math.atan2(dy, dx);

                    // Set color
                    ctx.save();
                    ctx.translate(midX, midY);
                    ctx.rotate(angle);
                    ctx.fillStyle = edge.value["Player"] || "gray";
                    // Draw rectangle centered at midpoint, width = length, height = 12
                    ctx.fillRect(-length / 2, -6, length, 12);
                    ctx.restore();
                });
            }
            drawCities();
        }

        function gameLoop(timestamp) {
            const deltaTime = (timestamp - lastTime) / 1000; // seconds
            lastTime = timestamp;

            const PlayerPointsElement = document.getElementById("playerPoints");
            if (PlayerPointsElement) {
                PlayerPointsElement.textContent = `Points: ${playerList[currentPlayerIndex].score}`;
            }

            const OpenPileElement = document.getElementById("openPile");
            if (OpenPileElement) {
                OpenPileElement.textContent = `Open Pile: ${OpenPile.join(", ")}`;
            }

            const playerTurnElement = document.getElementById("playerTurn");
            if (playerTurnElement) {
                playerTurnElement.textContent = `${playerList[currentPlayerIndex].color}'s Turn`;
            }

            const playerStatsElement = document.getElementById("playerStats");
            if (playerStatsElement) {
                playerStatsElement.textContent = `${playerList[currentPlayerIndex].color} has ${(playerList[currentPlayerIndex].showCards()).join(", ")}, cards.`;
            }

            const playerTrainsElement = document.getElementById("playerTrains");
            if (playerTrainsElement) {
                playerTrainsElement.textContent = `${playerList[currentPlayerIndex].color} has ${playerList[currentPlayerIndex].trains} trains left.`;
            }

            const playerDestinationsElement = document.getElementById("playerDestinations");
            if (playerDestinationsElement) {
                playerDestinationsElement.textContent = "Destinations: " + playerList[currentPlayerIndex].destinations.join(", ");
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

            const BuyRouteBtn = document.getElementById("claimRouteBtn");
            
            if (BuyRouteBtn ) {
                BuyRouteBtn.onclick = () => {
                    
                    const selectedRoute = document.getElementById("claimRoute")?.value;
                    const [city1, city2] = selectedRoute.split("-to-");
                    
                    const PlayerCards = playerList[currentPlayerIndex].showCards();
                    const routeCost = gameMapInstance.getRouteCost(city1, city2);
                    let canBuy = true;
                    for (const color in routeCost) {
                        if (color !== "Player" && PlayerCards.filter(card => card === color).length < routeCost[color]) {
                            canBuy = false;
                            break;
                        }
                    }
                    if (canBuy && routeCost["Player"] === null) {
                        gameMapInstance.buyRoute(city1, city2, playerList[currentPlayerIndex].color);
                        for (const color in routeCost) {
                            if (color !== "Player") {
                                for (let i = 0; i < routeCost[color]; i++) {
                                    playerList[currentPlayerIndex].removeCard(color);
                                }
                            }
                        }
                        
                        
                        playerList[currentPlayerIndex].score += gameMapInstance.getRoutePoints(city1, city2);
                        playerList[currentPlayerIndex].subtractTrains(gameMapInstance.getRouteLength(city1, city2));
                        console.log("Updated Score:", playerList[currentPlayerIndex].score);
                        console.log("Updated Trains:", playerList[currentPlayerIndex].trains);
                        currentPlayerIndex = (currentPlayerIndex + 1) % playerList.length;
                    } 
                    else {
                        alert("You do not have enough cards to buy this route or you are not allowed to buy this route.");
                    }
                    
                };
            }

            update(deltaTime);
            drawAndUpdateRoutes(gameMapInstance.getRoutes());
            requestAnimationFrame(gameLoop);

            if (OpenPile.length < 4) {
                OpenPile.push(Cards[Math.floor(Math.random() * Cards.length)]);
            }
            
            for (const player of playerList) {
                if (player.trains <= 2) {
                    window.location.href = "/gameover";
                    const GameStats = document.getElementById("finalScores");
                    if (GameStats) {
                        GameStats.textContent = "Final Scores:\n" + playerList.map(p => `${p.color}: ${p.score} points`).join("\n");
                    }
                    gameOver = true;
                    break;
                }
            }

            
        }
        requestAnimationFrame(gameLoop);
        
        
        async function saveGameState() {
            try {
                const response = await fetch("/get_data_from_js", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        player_data: playerList.map(player => ({
                            color: player.color,
                            cards: player.showCards(),
                            score: player.score,
                            trains: player.trains,
                            destinations: player.destinations
                        })),
                        map_data: Array.from(gameMapInstance.getRoutes().entries()),
                        open_pile: OpenPile
                    })
                });
                
                if (!response.ok) {
                    console.error("Failed to save game state:", response.statusText);
                }
            } catch (error) {
                console.error("Error saving game state:", error);
            }
            
        }
        setInterval(saveGameState, 1000);

});