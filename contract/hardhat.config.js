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
        "mantle-testnet": {
            url: "https://rpc.testnet.mantle.xyz",
            chainId: 5001,
            accounts: [PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: process.env.MUMBAI_POLYGONSCAN,
        customChains: [
            {
                network: "mantle-testnet",
                chainId: 5001,
                urls: {
                    apiURL: "https://explorer.testnet.mantle.xyz/api",
                    browserURL: "https://explorer.testnet.mantle.xyz/"
                }
            }
        ],
    },
};