class Map{

    constructor() {
        this.adjList = new Map();
        this.#addEdge("Kansas City", "Gladstoone", {"green":2, "Player":null});
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

}


export { Map };