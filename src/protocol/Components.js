
 class Node {   
    
    block = null; // generate in the network
    constructor(id){
        this.id = id; // stellar: public key        
    }

    setBlock(block){
        this.block = block;
    }
    
    getBlock(){
        return this.block;
    }

    validateNodes(nodes){
        const segmentGroup = {};
        for(let node of nodes){
            const data = node.block.data;
            const parseData = JSON.stringify(data); 
            
            if(!segmentGroup[parseData]) {
                segmentGroup[parseData] = [];
            }
            segmentGroup[parseData].push(node);
        }     
        let keyOfBigger = Object.keys(segmentGroup)[0]; 
        for(let segmentKey in segmentGroup){
            if( segmentGroup[keyOfBigger].length < segmentGroup[segmentKey].length ){
                keyOfBigger = segmentKey;
            }
        }
        return segmentGroup[keyOfBigger][0]; // return NODE 
    }    
}

module.exports = {
    StellarNode : Node,
};