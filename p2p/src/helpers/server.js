import getPort from 'get-port';
export const getPeerAndHttpPort = async () => {
    const peerPort = await getPort();
    const httpPort = '80' + peerPort.toString().slice(-2);
    return {peerPort, httpPort};
}
