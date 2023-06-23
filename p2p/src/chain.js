import {Block, BlockHeader} from "./block.js";
import moment from "moment";
import CryptoJS from "crypto-js";
import { Level } from "level";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

let db;

let createDb = (peerId) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    let dir = __dirname + '/db/' + peerId;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        db = new Level(dir);
        storeBlock(getGenesisBlock());
    }
}

let getGenesisBlock = () => {
    let blockHeader = new BlockHeader(1, null, "0x1bc1100000000000000000000000000000000000000000000", moment().unix(), "0x171b7320", '1CAD2B8C');
    return new Block(blockHeader, 0, null);
};

let getLatestBlock = () => blockchain[blockchain.length-1];

let addBlock = (newBlock) => {
    let prevBlock = getLatestBlock();
    if (prevBlock.index < newBlock.index && newBlock.blockHeader.previousBlockHeader === prevBlock.blockHeader.merkleRoot) {
        blockchain.push(newBlock);
        storeBlock(newBlock);
    }
}

let storeBlock = (newBlock) => {
    db.put(newBlock.index, JSON.stringify(newBlock), function (err) {
        if (err) return console.log('Error storing block!', err) // error
        console.log('--- Inserting block index: ' + newBlock.index);
    })
}

let getDbBlock = (index, res) => {
    db.get(index, function (err, value) {
        if (err) return res.send(JSON.stringify(err));
        return(res.send(value));
    });
}

let getBlock = (index) => {
    if (blockchain.length-1 >= index)
        return blockchain[index];
    else
        return null;
}

const blockchain = [getGenesisBlock()];

const generateNextBlock = (txns) => {
    const prevBlock = getLatestBlock();
    const prevMerkleRoot = prevBlock.blockHeader.merkleRoot;
    const nextIndex = prevBlock.index + 1;
    const nextTime = moment().unix();
    const nextMerkleRoot = CryptoJS.SHA256(`${prevMerkleRoot}${nextTime}`).toString();
    console.log('nextMerkleRoot', nextMerkleRoot);
    const blockHeader = new BlockHeader(1, prevMerkleRoot, nextMerkleRoot, nextTime);
    const newBlock = new Block(blockHeader, nextIndex, txns);
    blockchain.push(newBlock);
    storeBlock(newBlock);
    return newBlock;
};


export default {
    addBlock,
    getBlock,
    blockchain,
    getLatestBlock,
    generateNextBlock,
    createDb,
    getDbBlock,
}