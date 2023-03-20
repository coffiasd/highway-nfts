require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-change-network");

module.exports = {
  solidity: "0.8.13",
  networks: {
    mumbai: {
      url: process.env.TESTNET_RPC,
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3, process.env.PRIVATE_KEY4],
      gas: 0,
      chainId: 80001,
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/rhnU3EgZ0CP--Cv4Nh8NEhL_HJV6edRa",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3, process.env.PRIVATE_KEY4],
      gas: "auto",
      chainId: 5,
      blockGasLimit: "auto",
      // deploy: {
      //   AwesomeCrossChainNFT: {
      //     address: "0xf80c331aa92308ef58c9d55d49355ac3052130ad",
      //     from: "0x52bf58425cAd0B50fFcA8Dbe5447dcE9420a2610"
      //   },
      // },
    },
    opgoerli: {
      url: "https://opt-goerli.g.alchemy.com/v2/LamuSp6Ak7t4BDQ2KsJ9SXqIFPPIf0nz",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3, process.env.PRIVATE_KEY4],
      gas: "auto",
      chainId: 420,
      blockGasLimit: "auto",
      deploy: {
        AwesomeCrossChainNFT: {
          address: "0xf80c331aa92308ef58c9d55d49355ac3052130ad",
          from: "0x52bf58425cAd0B50fFcA8Dbe5447dcE9420a2610"
        },
      },
    },
    localhost: {
      gas: "auto",
      chainId: 31337,
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  }
};