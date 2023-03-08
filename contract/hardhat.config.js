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
            accounts: [`0x304030045e69a283fbc39a3f1b7b281ede03afdefa6f480a682e8974bc20b547`]
        }
    },
    etherscan: {
        apiKey: {
            ftmTestnet: `S5FUSTGRR4TJU5TIXUXKP2XRABXJZBSP5W`,
        }
    }
};