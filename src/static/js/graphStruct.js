class Map{

    constructor(){
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
    }

    addVertex(v){
    
    this.AdjList.set(v, []);
    }

    addEdge(v, w){
    
    this.AdjList.get(v).push(w);

    this.AdjList.get(w).push(v);
    }
}

export { Map }; { main };