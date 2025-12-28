class gameMap{

    constructor() {
        this.adjList = new Map();
        this.#addEdge("Kansas City", "Gladstone", {"green":2, "Player":null});
        this.#addEdge("Kansas City", "Raytown", {"white":2, "Player":null});
        this.#addEdge("Kansas City", "Independence", {"pink":1, "Player":null});
        this.#addEdge("Gladstone", "Liberty", {"black":1, "Player":null});
        this.#addEdge("Raytown", "Independence", {"red":1, "Player":null});
        this.#addEdge("Liberty", "Independence", {"blue":2, "Player":null});
        this.#addEdge("Liberty", "Excelsior Springs", {"yellow":3, "Player":null});
        this.#addEdge("Independence", "Blue Springs", {"orange":2, "Player":null});
        this.#addEdge("Excelsior Springs", "Kearney", {"white":2, "Player":null});
        this.#addEdge("Blue Springs", "Lee's Summit", {"green":1, "Player":null});
        this.#addEdge("Kearney", "Smithville", {"pink":1, "Player":null});
        this.#addEdge("Lee's Summit", "Grain Valley", {"black":2, "Player":null});
        this.#addEdge("Smithville", "Plattsburg", {"red":2, "Player":null});
        this.#addEdge("Grain Valley", "Oak Grove", {"blue":1, "Player":null});
        this.#addEdge("Plattsburg", "Hamilton", {"yellow":1, "Player":null});
        this.#addEdge("Oak Grove", "Harrisonville", {"orange":3, "Player":null});
        this.#addEdge("Lee's Summit", "Lone Jack", {"white":1, "Player":null});
        this.#addEdge("Lone Jack", "Harrisonville", {"pink":2, "Player":null});
        this.#addEdge("Kansas City", "Overland Park", {"black":2, "Player":null});
        this.#addEdge("Overland Park", "Shawnee", {"red":1, "Player":null});
        this.#addEdge("Shawnee", "Lenexa", {"blue":2, "Player":null});
        this.#addEdge("Lenexa", "Olathe", {"green":1, "Player":null});
        this.#addEdge("Olathe", "Harrisonville", {"yellow":4, "Player":null});
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

    getRoutePoints(city1, city2){
        const edge = this.getEdge(city1, city2);
        const costValues = Object.values(edge.value);
        let points = 0;

        if (costValues.includes(1)) {
            points = 1;
        } else if (costValues.includes(2)) {
            points = 2;
        } else if (costValues.includes(3)) {
            points = 4;
        } else if (costValues.includes(4)) {
            points = 7;
        } else if (costValues.includes(5)) {
            points = 10;
        } else if (costValues.includes(6)) {
            points = 15;
        }  
        return points;
    }
}


export { gameMap };

export const cityCoordinates = {
    "Kansas City":        { x: 400, y: 300 }, // Center
    "Gladstone":          { x: 400, y: 220 }, // North of KC
    "Liberty":            { x: 470, y: 180 }, // NE of KC
    "Excelsior Springs":  { x: 540, y: 120 }, // Further NE
    "Kearney":            { x: 570, y: 80 },  // North of Excelsior Springs
    "Smithville":         { x: 500, y: 60 },  // NW of Kearney
    "Plattsburg":         { x: 600, y: 40 },  // NE of Smithville
    "Hamilton":           { x: 700, y: 60 },  // Further NE
    "Independence":       { x: 520, y: 320 }, // East of KC
    "Blue Springs":       { x: 600, y: 340 }, // Further east
    "Lee's Summit":       { x: 650, y: 420 }, // SE of KC
    "Grain Valley":       { x: 720, y: 400 }, // East of Lee's Summit
    "Oak Grove":          { x: 770, y: 420 }, // Further east
    "Raytown":            { x: 480, y: 370 }, // SE of KC, closer than Lee's Summit
    "Lone Jack":          { x: 700, y: 500 }, // SE, further out
    "Harrisonville":      { x: 600, y: 550 }, // South of Lone Jack
    "Overland Park":      { x: 320, y: 420 }, // SW of KC
    "Olathe":             { x: 250, y: 500 }, // Further SW
    "Shawnee":            { x: 280, y: 350 }, // West of KC
    "Lenexa":             { x: 200, y: 400 }  // SW of Shawnee
};
