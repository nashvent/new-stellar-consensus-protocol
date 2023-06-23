import getPort from 'get-port';
export const getPeerAndHttpPort = async () => {
    const peerPort = await getPort();
    const httpPort = '80' + peerPort.toString().slice(-2);
    return {peerPort, httpPort};
}


// let initHttpServer = (http_port) => {
//     let app = express();
//     app.use(bodyParser.json());

//     app.get('/blocks', (req, res) => res.json(chain.blockchain));
//     app.get('/getBlock', (req, res) => {
//         let blockIndex = req.query.index;
//         res.send(chain.blockchain[blockIndex]);
//     });
//     app.get('/getStoredBlock', (req, res) => {
//         let blockIndex = req.query.index;
//         chain.getDbBlock(blockIndex, res);
//     });

//     app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
// };