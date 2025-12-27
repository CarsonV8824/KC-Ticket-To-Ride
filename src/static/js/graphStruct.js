class gameMap{

    constructor() {
        this.adjList = new Map();
        this.#addEdge("Kansas City", "Gladstone", {"green":2, "Player":null});
        this.#addEdge("Kansas City", "Raytown", {"white":2, "Player":null});
    }

    #addVertex(vertex) {
        if (!this.adjList.has(vertex)) {
            this.adjList.set(vertex, []);
        }
    }

    #addEdge(v1, v2, value) {
        
        this.#addVertex(v1);
        this.#addVertex(v2);

        this.adjList.get(v1).push({ node: v2, value: value });
        this.adjList.get(v2).push({ node: v1, value: value }); 
    }

    getEdge(city1, city2){
        return this.adjList.get(city1).find(edge => edge.node === city2);
    }

    getRoutes() {
        return this.adjList;
    }

    buyRoute(city1, city2, playerColor){
        const edge1 = this.getEdge(city1, city2);
        const edge2 = this.getEdge(city2, city1);
        if (edge1 && edge2) {
            edge1.value["Player"] = playerColor;
            edge2.value["Player"] = playerColor;
        }
    }

    getRouteCost(city1, city2){
        const edge = this.getEdge(city1, city2);
        
        return edge.value;
        
    }
}


export { gameMap };