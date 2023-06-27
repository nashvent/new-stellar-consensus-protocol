import crypto from 'crypto';
import Swarm from 'discovery-swarm';
import defaults from 'dat-swarm-defaults';
import {CronJob} from 'cron';  
import express from "express";
import bodyParser from "body-parser";
import { getPeerAndHttpPort } from "./helpers/server.js";
import { Blockchain } from './models/Blockchain.js';

const CHANNEL_ID = 'blockchain_consensus';

const peers = {};

const myPeerId = crypto.randomBytes(32);
const config = defaults({
    id: myPeerId,
});

const swarm = Swarm(config);

let MessageType = {
    CREATE_TRANSACTION: 'createTransaction',
    RECEIVE_TRANSACTION: 'receiveTransaction',
};

(async () => {
    const { peerPort, httpPort } = await getPeerAndHttpPort();
    // initHttpServer(httpPort);
    swarm.listen(peerPort);
    console.log('Listening port: ' + peerPort);

    swarm.join(CHANNEL_ID);

    swarm.on('connection', (conn, info) => {
        const seq = connSeq;
        const peerId = info.id.toString('hex');
        peers[peerId].conn = conn;
        peers[peerId].seq = seq;
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
                'my: ' + myPeerId.toString('hex'),
                'type: ' + JSON.stringify(message.type)
            );
            console.log('----------- Received Message end -------------');
        });

        conn.on('close', () => {
           console.log(`Connection ${seq} closed, peerId: ${peerId}`);
            if (peers[peerId].seq === seq) {
                delete peers[peerId];
                // console.log('--- registeredMiners before: ' + JSON.stringify(registeredMiners));
                // let index = registeredMiners.indexOf(peerId);
                // if (index > -1)
                //     registeredMiners.splice(index, 1);
                // console.log('--- registeredMiners end: ' + JSON.stringify(registeredMiners));
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