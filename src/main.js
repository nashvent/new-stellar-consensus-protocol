const fs = require('fs');
const Stellar = require("./protocol/stellar/Stellar");
const StellarDowngrade = require("./protocol/stellar_downgrade/StellarDowngrade");
const {excecuteAndMonitoringProtocol} = require("./helpers/GeneralHelpers");

//  Config testing algorithms
const secondsTest = [20];
const nodesTest = [500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000,17000, 18000, 19000, 20000];

const stellarDowngradeResult = {};

for(let second of secondsTest){
    // console.log("+ seconds", second);
    stellarDowngradeResult[second.toString()] = {};
    for(let nodesSize of nodesTest ){
        // console.log("- nodesSize", nodesSize);
        stellarDowngradeResult[second.toString()][nodesSize.toString()] = excecuteAndMonitoringProtocol(StellarDowngrade, nodesSize, second);
        // console.log(stellarDowngradeResult[second.toString()][nodesSize.toString()]);
    }
}

fs.writeFileSync(`results/stellar_downgrade_${secondsTest.join('-')}.json`, JSON.stringify(stellarDowngradeResult));



const stellarResult = {};

for(let second of secondsTest){
    // console.log("+ seconds", second);
    stellarResult[second.toString()] = {};
    for(let nodesSize of nodesTest ){
        // console.log("- nodesSize", nodesSize);
        stellarResult[second.toString()][nodesSize.toString()] = excecuteAndMonitoringProtocol(Stellar, nodesSize, second);
        // console.log(stellarResult[second.toString()][nodesSize.toString()]);
    }
}

fs.writeFileSync(`results/stellar_${secondsTest.join('-')}.json`, JSON.stringify(stellarResult));