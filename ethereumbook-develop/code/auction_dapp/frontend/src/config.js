var DeedRepository = require('./contracts/DeedRepository')
var AuctionRepository = require('./contracts/AuctionRepository')

module.exports = {
    JSONRPC_ENDPOINT: 'http://127.0.0.1:8545',
    JSONRPC_WS_ENDPOINT: 'ws://127.0.0.1:8546', //'ws://52.59.238.144:8546',
    BZZ_ENDPOINT: 'http://127.0.0.1:8500',
    SHH_ENDPOINT: 'ws://127.0.0.1:8546',

    DEEDREPOSITORY_ADDRESS: '0x6BC429e2c0dEAa49618239527CFcBD18947C0A9F',
    AUCTIONREPOSITORY_ADDRESS: '0x6ab44800Eaa9f02E26fF89c59c7C185d74753C2f',

    DEEDREPOSITORY_ABI: DeedRepository.abi,
    AUCTIONREPOSITORY_ABI: AuctionRepository.abi,

    GAS_AMOUNT: 500000,

    //whisper settings
    WHISPER_SHARED_KEY: '0x8bda3abeb454847b515fa9b404cede50b1cc63cfdeddd4999d074284b4c21e15'

}

// web3.eth.sendTransaction({from: web3.eth.accounts[0], to: "0x6f0023D1CFe5A7A56F96e61E0169B775Ac97f90E" , value: web3.utils.toWei(1, 'ether'), gasLimit: 21000, gasPrice: 20000000000})
