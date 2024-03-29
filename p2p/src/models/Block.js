import CryptoJS from "crypto-js";

export class Block {
    constructor(index, data, previousHash = ""){
        this.index = index;
        this.date = new Date();
        this.data = data; //JSON.stringify(data);
        this.previousHash = previousHash;
        this.hash = this.createHash();
        this.nonce = 0;
    }

    createHash(){
        return CryptoJS.SHA256(
            this.index + 
            this.date +
            this.data + 
            this.previousHash + 
            this.nonce
        ).toString();
    }

    mine(difficulty){
        while(!this.hash.startsWith(difficulty)){
            this.nonce++;
            this.hash = this.createHash();
        }
    }
}