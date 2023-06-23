import {Block} from "./Block.js";

export class Blockchain {
    constructor(difficulty = null){
        this.chain = [this.getGenesisBlock()];
        this.difficulty = difficulty;
    }

    getGenesisBlock(){
        const genesisBlock = new Block(0, "Genesis block data");
        genesisBlock.hash = "0x1bc1100000000000000000000000000000000000000000000";
        return genesisBlock;
    }

    getLastBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        const lastBlock = this.getLastBlock();
        if(lastBlock.index < newBlock.index && newBlock.previousHash === lastBlock.hash){
            this.chain.push(newBlock);
            return true;
        }
        return false;
    }

    createBlock(data){
        const prevBlock = this.getLastBlock();
        const block = new Block(prevBlock.index+1, data, prevBlock.hash);
        // if(this.difficulty !== null){
        //     block.mine(this.difficulty);
        // }
        // //console.log("Success! hash:"+ block.hash + " nonce:" + block.nonce);
        return block;
    }

    getBlock = (index) => {
        if (this.chain.length-1 >= index)
            return this.chain[index];
        else
            return null;
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
