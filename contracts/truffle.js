'use strict';
var HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: '8545',
      network_id: '*' // Match any network id
    },
    tomotestnet: {
      provider: () =>
        new HDWalletProvider(process.env.MNENOMIC, 'https://testnet.tomochain.com', 0, 1, true),
      network_id: '89',
      gas: 3000000,
      gasPrice: 20000000000000,
      gasLimit: 1000000
    },
    tomomainnet: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNENOMIC,
          'https://rpc.tomochain.com',
          0,
          1,
          true,
          "m/44'/889'/0'/0/"
        ),
      network_id: '88',
      gas: 2000000,
      gasPrice: 10000000000000
    },
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8555, // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01 // <-- Use this low gas price
    }
  }
};
