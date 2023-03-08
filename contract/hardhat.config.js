require('dotenv').config();
require('@nomiclabs/hardhat-waffle');
require("@nomiclabs/hardhat-etherscan");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_KEY = process.env.API_KEY;

module.exports = {
    solidity: '0.8.12',
    settings: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
    networks: {

        ftmTestnet: {
            url: `https://rpc.testnet.fantom.network`,
            chainId: 4002,
            accounts: [``]
        }
    },
    etherscan: {
        apiKey: {
            ftmTestnet: ``,
        }
    }
};