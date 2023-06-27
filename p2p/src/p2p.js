import crypto from 'crypto';
import Swarm from 'discovery-swarm';
import defaults from 'dat-swarm-defaults';
import express from "express";
import bodyParser from "body-parser";
import { getPeerAndHttpPort } from "./helpers/server.js";
import { Blockchain } from './models/Blockchain.js';
import { MessageType } from './helpers/messages.js';
import { Peer } from './helpers/messages.js';
const CHANNEL_ID = 'blockchain_consensus';

const peers = {};
let connSeq = 0;

let registeredMiners = [];

const myPeer = new Peer(crypto.randomBytes(32)); 
console.log('My PeerId: ' + myPeer.id.toString('hex'));

const blockchain = new Blockchain()

let initHttpServer = (http_port) => {
    let app = express();
    app.use(bodyParser.json());

    app.get('/', (req, res) => res.json({
        peerId: myPeer.id.toString('hex'),
        blocks: blockchain.chain,
    }));
    app.listen(http_port, () => console.log(`Listening on http://localhost:${http_port}`));
};

const config = defaults({
    id: myPeer.id,
});

const swarm = Swarm(config);
   
(async () => {
    const { peerPort, httpPort } = await getPeerAndHttpPort();
    initHttpServer(httpPort);

    swarm.listen(peerPort);
    console.log('Listening port: ' + peerPort);

    swarm.join(CHANNEL_ID);

    swarm.on('connection', (conn, info) => {
        const seq = connSeq;
        const peerId = info.id.toString('hex');
       
        console.log(`Connected #${seq} to peer: ${peerId}`);
        if (info.initiator) {
            try {
                conn.setKeepAlive(true, 600);
            } catch (exception) {
                console.log('exception', exception);
            }
        }

        conn.on('data', data => {
            let message = JSON.parse(data);
            console.log('----------- Received Message start -------------');
            console.log(
                'from: ' + peerId.toString('hex'),
                'to: ' + peerId.toString(message.to),
                'my: ' + myPeer.id.toString('hex'),
                'type: ' + JSON.stringify(message.type)
            );
            console.log('----------- Received Message end -------------');

            switch (message.type) {
                case MessageType.REQUEST_BLOCK:
                    console.log('-----------REQUEST_BLOCK-------------');
                    let requestedIndex = (JSON.parse(JSON.stringify(message.data))).index;
                    let requestedBlock = blockchain.getBlock(requestedIndex);
                    if (requestedBlock)
                        myPeer.writeMessageToPeerToId(peers, peerId.toString('hex'), MessageType.RECEIVE_NEXT_BLOCK, requestedBlock);
                    else
                        console.log('No block found @ index: ' + requestedIndex);
                    console.log('-----------REQUEST_BLOCK-------------');
                    break;

                case MessageType.RECEIVE_NEXT_BLOCK:
                    console.log('-----------RECEIVE_NEXT_BLOCK-------------');
                    blockchain.addBlock(JSON.parse(JSON.stringify(message.data)));
                    console.log(JSON.stringify(blockchain));
                    let nextBlockIndex = blockchain.getLatestBlock().index + 1;
                    console.log('-- request next block @ index: ' + nextBlockIndex);
                    myPeer.writeMessageToPeers(peers, MessageType.REQUEST_BLOCK, {index: nextBlockIndex});
                    console.log('-----------RECEIVE_NEXT_BLOCK-------------');
                    break;

                case MessageType.RECEIVE_NEW_BLOCK:
                    // consensus 
                    if ( message.to === myPeer.id.toString('hex') && message.from !== myPeer.id.toString('hex')) {
                        console.log('-----------RECEIVE_NEW_BLOCK------------- ' + message.to);
                        blockchain.addBlock(JSON.parse(JSON.stringify(message.data)));
                        console.log(JSON.stringify(blockchain));
                        console.log('-----------RECEIVE_NEW_BLOCK------------- ' + message.to);
                    }
                    break;

                case MessageType.REQUEST_ALL_REGISTER_MINERS:
                    console.log('-----------REQUEST_ALL_REGISTER_MINERS------------- ' + message.to);
                    myPeer.writeMessageToPeers(peers, MessageType.REGISTER_MINER, registeredMiners);
                    registeredMiners = JSON.parse(JSON.stringify(message.data));
                    console.log('-----------REQUEST_ALL_REGISTER_MINERS------------- ' + message.to);
                    break;

                case MessageType.REGISTER_MINER:
                    console.log('-----------REGISTER_MINER------------- ' + message.to);
                    let miners = JSON.stringify(message.data);
                    registeredMiners = JSON.parse(miners);
                    console.log(registeredMiners);
                    console.log('-----------REGISTER_MINER------------- ' + message.to);
                    break;
            }
        });

        conn.on('close', () => {
           console.log(`Connection ${seq} closed, peerId: ${peerId}`);
            if (peers[peerId].seq === seq) {
                delete peers[peerId];
                console.log('--- registeredMiners before: ' + JSON.stringify(registeredMiners));
                let index = registeredMiners.indexOf(peerId);
                if (index > -1)
                    registeredMiners.splice(index, 1);
                console.log('--- registeredMiners end: ' + JSON.stringify(registeredMiners));
            }
        });

        if (!peers[peerId]) {
            peers[peerId] = {}
        }
        peers[peerId].conn = conn;
        peers[peerId].seq = seq;
        connSeq++
    })
})();


setTimeout(function(){
    myPeer.writeMessageToPeers(peers, MessageType.REQUEST_ALL_REGISTER_MINERS, null);
}, 5000);

setTimeout(function(){
    myPeer.writeMessageToPeers(peers, MessageType.REQUEST_BLOCK, {index: blockchain.getLastBlock().index+1});
}, 5000);

setTimeout(function(){
    registeredMiners.push(myPeer.id.toString('hex'));
    console.log('----------Register my miner --------------');
    console.log(registeredMiners);
    myPeer.writeMessageToPeers(peers, MessageType.REGISTER_MINER, registeredMiners);
    console.log('---------- Register my miner --------------');
}, 7000);


// const job = new CronJob('*/10 * * * * *', function() {
//     // let index = 0;

//     // if (lastBlockMinedBy) {
//     //     let newIndex = registeredMiners.indexOf(lastBlockMinedBy); 
//     //     index = ( newIndex+1 > registeredMiners.length-1) ? 0 : newIndex + 1;
//     // }

//     // lastBlockMinedBy = registeredMiners[index];
//     // console.log('-- REQUESTING NEW BLOCK FROM: ' + registeredMiners[index] + ', index: ' + index);
//     // console.log(JSON.stringify(registeredMiners));
//     // if (registeredMiners[index] === myPeerId.toString('hex')) {
//     //     console.log('-----------create next block -----------------');
        
//     //     console.log('-----------create next block -----------------');
//     // }
//     console.log('-----------generating a new block-----------');
//     let newBlock = blockchain.createBlock(`dummy data generated by: ${myPeerId.toString('hex')}`);
//     console.log(JSON.stringify(newBlock));
//     writeMessageToPeers(peers, MessageType.RECEIVE_NEW_BLOCK, newBlock);
//     console.log(JSON.stringify(blockchain));
// });
// job.start();