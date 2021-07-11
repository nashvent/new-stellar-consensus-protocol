const fs = require('fs');
const Stellar = require("./protocol/stellar/Stellar");
const StellarDowngrade = require("./protocol/stellar_downgrade/StellarDowngrade");
const {excecuteAndMonitoringProtocol} = require("./helpers/GeneralHelpers");
// const testData = [
//     {
//         to: "001",
//         from: "004",
//         value: 20,
//     },
//     {
//         to: "004",
//         from: "002",
//         value: 18,
//     },
//     {
//         to: "002",
//         from: "003",
//         value: 26,
//     }
// ]

// //let coin = new Ripple(1000);
// let coin = new Stellar(1000);
// for(let data of testData){
//     coin.addNewBlock(JSON.stringify(data));
// }
// console.log(coin.toString());


//  Test config
const secondsTest = [60, 120, 180];
const nodesTest = [1000, 2000, 3000, 4000, 5000];


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

fs.writeFileSync('results/stellar_downgrade_result_minuts.json', JSON.stringify(stellarDowngradeResult));





