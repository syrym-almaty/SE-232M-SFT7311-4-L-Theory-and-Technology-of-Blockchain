// backend/web3.js
const Web3 = require('web3');
require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  `https://${process.env.NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
);

const web3 = new Web3(provider);

module.exports = web3;