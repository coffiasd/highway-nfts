const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
require("hardhat-change-network");
const {
    Chains,
    chainMetadata,
    InterchainGasCalculator,
    MultiProvider
} = require("@hyperlane-xyz/sdk");
const { utils } = require('@hyperlane-xyz/utils');

async function run() {
    const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
    const nft = await NFT.attach("0x1ae545931422BB868595d64b6d3e862b94d46Cc1");
    const owner = await nft.ownerOf(0);
    console.log(owner);
    console.log(await nft.tokenURI(0));

    console.log(await nft.getTokenListArray("0xcc737a94fecaec165abcf12ded095bb13f037685"));
}


run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});