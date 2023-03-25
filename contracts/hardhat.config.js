require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-change-network");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");


// task("account", "returns nonce and balance for specified address on multiple networks")
//   .addParam("address")
//   .setAction(async address => {
//     const web3Goerli = createAlchemyWeb3("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
//     const web3OptGoerli = createAlchemyWeb3("https://goerli.optimism.io");
//     const web3Mumbai = createAlchemyWeb3("https://rpc-mumbai.maticvigil.com");

//     const networkIDArr = ["Ethereum Goerli:", "Optimism Goerli:", "Mumbai:"]
//     const providerArr = [web3Goerli, web3OptGoerli, web3Mumbai];
//     const resultArr = [];

//     for (let i = 0; i < providerArr.length; i++) {
//       const nonce = await providerArr[i].eth.getTransactionCount(address.address, "latest");
//       const balance = await providerArr[i].eth.getBalance(address.address)
//       resultArr.push([networkIDArr[i], nonce, parseFloat(providerArr[i].utils.fromWei(balance, "ether")).toFixed(2) + "ETH"]);
//     }
//     resultArr.unshift(["  |NETWORK|   |NONCE|   |BALANCE|  "])
//     console.log(resultArr);
//   });

module.exports = {
  solidity: "0.8.13",
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/CTbxLYqjt01dKeLpMz35-KOSyAy-WzxN",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3, process.env.PRIVATE_KEY4],
      gas: "auto",
      blockGasLimit: "auto",
      chainId: 80001,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3, process.env.PRIVATE_KEY4],
      gas: "auto",
      chainId: 5,
      blockGasLimit: "auto",
    },
    opgoerli: {
      url: "https://opt-goerli.g.alchemy.com/v2/LamuSp6Ak7t4BDQ2KsJ9SXqIFPPIf0nz",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3, process.env.PRIVATE_KEY4],
      gas: "auto",
      chainId: 420,
      blockGasLimit: "auto",
    },
    polygonZk: {
      url: "https://rpc.public.zkevm-test.net",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3, process.env.PRIVATE_KEY4],
      gas: "auto",
      chainId: 1442,
      blockGasLimit: "auto",
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