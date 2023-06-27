
export const MessageType = {
    // Miners
    REQUEST_BLOCK: 'requestBlock',
    RECEIVE_NEXT_BLOCK: 'receiveNextBlock',
    RECEIVE_NEW_BLOCK: 'receiveNewBlock',
    REQUEST_ALL_REGISTER_MINERS: 'requestAllRegisterMiners',
    REGISTER_MINER: 'registerMiner',

    // Client
    CREATE_TRANSACTION: 'createTransaction',
    RECEIVE_TRANSACTION: 'receiveTransaction',
};

export class Peer {
    constructor(id){
        this.id = id;
    }
    
    writeMessageToPeers = (peers, type, data) => {
        for (let id in peers) {
            console.log('-------- writeMessageToPeers start -------- ');
            console.log('type: ' + type + ', to: ' + id);
            console.log('-------- writeMessageToPeers end ----------- ');
            this.sendMessage(peers[id], id, type, data);
        }
    }

    writeMessageToPeerToId = (peers, toId, type, data) => {
        for (let id in peers) {
            if (id === toId) {
                console.log('-------- writeMessageToPeerToId start -------- ');
                console.log('type: ' + type + ', to: ' + toId);
                console.log('-------- writeMessageToPeerToId end ----------- ');
                this.sendMessage(peers[id], id, type, data);
            }
        }
    }

    sendMessage = (peer, id, type, data) => {
        peer.conn.write(JSON.stringify(
            {
                to: id,
                from: this.peerId,
                type: type,
                data: data
            }
        ));
    };
}
