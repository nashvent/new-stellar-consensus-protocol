const Block = require("./Block");

class Blockchain {
    constructor(difficulty = null){
        this.chain = [this.createFirstBlock("Genesis info")];
        this.difficulty = difficulty;
    }

    createFirstBlock(genesis){
        return new Block(0, genesis);
    }

    getLastBlock(){
        return this.chain[this.chain.length -1];
    }

    createBlock(data){
        const prevBlock = this.getLastBlock();
        const block = new Block(prevBlock.index+1, data, prevBlock.hash);
        if(this.difficulty !== null){
            block.mine(this.difficulty);
        }
        //console.log("Success! hash:"+ block.hash + " nonce:" + block.nonce);
        return block;
    }

    addBlock(block){
        const lastBlock = this.getLastBlock();
        if(block.previousHash === lastBlock.hash){
            this.chain.push(block);
            return true;
        }
        return false;
    }

    isValid(){
        for(let i = 1; i < this.chain.length; i++){
            let prevBlock = this.chain[i-1];
            let currBlock = this.chain[i];            
            if(currBlock.previousHash != prevBlock.hash)
                return false;
            if(currBlock.createHash() != currBlock.hash)
                return false;
        }
        return true;
    }

    toString(){
        return JSON.stringify(this, null, 2);
    }
}


module.exports = Blockchain; 


    // executeConsensus(){
    //     console.log("Execute default consensus");
    //     if(this.applicants.length>0){
    //         this.chain.push(this.applicants[0]);
    //         this.applicants.length = 0;
    //         console.log("consensus is successful!");
    //         return true;
    //     }
    //     console.log("nothing to consensus!");
    //     return false;
    // }
