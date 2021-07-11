const Blockchain = require("../../models/Blockchain");
const { StellarNode } = require("./Components");
const { generateUUID } = require("../../helpers/GeneralHelpers");

const MIN_WITNESSES_SIZE = 10;

class StellarDowngrade {
  nodes = [];
  blockchain = null;
  quorumSlices = []; // [  [node, node], [node, node] ]
  validators = []; // [node, node, node]

  threshold = 100; // Fixed value

  // TEST
  consensusTime = []; // Miliseconds
  transactionsTime = []; // Miliseconds

  classifiedNodes = {};

  constructor(quantityOfNodes) {
    this.createNodes(quantityOfNodes);
    this.blockchain = new Blockchain();
  }

  createNodes(quantity) {
    this.nodes = [];
    for (let counter = 0; counter < quantity; counter++) {
      const uuid = generateUUID();
      let witnesses_count = 0;
      if(witnesses_count < MIN_WITNESSES_SIZE){
        this.nodes.push(new StellarNode(uuid, 100)); // create default witness
        witnesses_count += 1;
      }
      else{
        this.nodes.push(new StellarNode(uuid));
      }
    }
  }

  nodeClassifier() {
    for (let i = 0; i < nodes.length; i += quorumSize) {
      const quorumSlice = nodes.slice(i, i + quorumSize);
      this.quorumSlices.push(quorumSlice);
    }
    
  }

  addNewBlock(data) {
    // TIME
    let begin = Date.now();
    // END TIME

    // All nodes create your block
    for (let node of this.nodes) {
      const block = this.blockchain.createBlock(data);
      node.setBlock(block);
    }
    const electedNode = this.excecuteConsensus();

    if (this.blockchain.addBlock(electedNode.block)) {
      // TIME
      this.transactionsTime.push(Date.now() - begin);
      // END TIME

      return true;
    } else {
      return false;
    }
  }

  excecuteConsensus() {
    // TIME
    let begin = Date.now();
    // END TIME

    this.nodeClassifier();
    let electedNodes = [];
    for (let i = 0; i < this.validators.length; i += 1) {
      // console.log("this.quorumSlices", this.quorumSlices);
      const electedNode = this.validators[i].validateNodes(
        this.quorumSlices[i]
      );
      // console.log("electedNode", electedNode);
      electedNodes.push(electedNode);
    }

    const validator = electedNodes[0];
    const finalQuorum = electedNodes.slice(1, electedNodes.length);
    const validatedNode = validator.validateNodes(finalQuorum);

    // TIME
    this.consensusTime.push(Date.now() - begin);
    // END TIME

    return validatedNode;
  }

  toString() {
    return this.blockchain.toString();
  }
}

module.exports = StellarDowngrade;
