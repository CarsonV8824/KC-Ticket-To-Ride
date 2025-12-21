import { Player } from "./player.js";
import { Map } from "./graphStruct.js";

export

function main(){
    const GameBoard = document.getElementById("gameboard");
    const ctx = GameBoard.getContext("2d");

    let playerList = [];
    let playerColors = ["blue", "red", "green", "yellow", "black"];
    
    for (let i = 0; i < 5; i++){
        playerList.push(new Player(playerColors[i]));
    }
}
