module.exports = {
    generateUUID: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    
    shuffleArray: (array) => {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    },

    excecuteAndMonitoringProtocol(protocol, nodesCount, seconds){        
        let begin=Date.now();
        let coin = new protocol(nodesCount);
        const miliseconds = seconds*1000;
        while(Date.now() - begin < (miliseconds)){
            coin.addNewBlock("data1"); 
        }
        const blockCount = coin.blockchain.chain.length;
        
        const consensusTime = (coin.consensusTime.reduce((a,b)=>a+b,0) / coin.consensusTime.length) / 1000;
        const transactionsTime = (coin.transactionsTime.reduce((a,b)=>a+b,0) / coin.transactionsTime.length) / 1000;

        return {
            spb: seconds / (blockCount),
            blocks: blockCount,
            consensusTime: consensusTime,
            transactionsTime: transactionsTime,
        }
    }
}