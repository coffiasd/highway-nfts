//mint token
//transfer token to _recipient
//check origin tokenId exist if it's been burned?
//check remote tokenId exist?
// const {
//     loadFixture,
// } = require("@nomicfoundation/hardhat-network-helpers");
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


describe("AwesomeCrossChainNft", function () {
    //our deployed conrtact address.
    const local = "0x15cdAeA0F60e083D5dA74BCd8A27531aF5eA91Cb";
    //0x15cdAeA0F60e083D5dA74BCd8A27531aF5eA91Cb  opgoerli
    //0xcb6DdAb87576373cd973C5B6A01DEf668BB9Cd69   goerli
    const remote = "0xcb6DdAb87576373cd973C5B6A01DEf668BB9Cd69";
    const localDomain = 420;
    const remoteDomain = 5;
    let nft;
    before(async () => {
        //init nft contract.
        const MailBox = "0xCC737a94FecaeC165AbCf12dED095BB13F037685";
        const InterchainGasPaymaster = "0x8f9C3888bFC8a5B25AED115A82eCbb788b196d2a";
        const NFTName = "AwesomeCrossChainNFT";
        const NFTSymbol = "acc";
        const MintAmount = hre.ethers.utils.parseEther("0.01");
        const ChainId = hre.network.config.chainId;

        const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
        nft = await NFT.deploy(MintAmount, ChainId);
        // nft = await NFT.attach(remote);
        console.log("deployed address:", await nft.address);
        // await nft.initialize(MailBox, InterchainGasPaymaster, NFTName, NFTSymbol);
    });

    //use fixture to run this setup once, snapshot that state
    // async function setupFixture() {
    //     //set some user.
    //     const [localChainMintUser, localChainOtherUser, remoteChainReceiveUser, remoteChainOtherUser] = await ethers.getSigners();

    //     // //get specify user.
    //     // const localChainMintUser = await ethers.getSigners();
    //     console.log(localChainMintUser.address);

    //     // //fund user.
    //     // await ethers.provider.sendTransaction({
    //     //     to: localChainMintUser,
    //     //     value: 10e18,
    //     // });

    //     // const MailBox = "0xCC737a94FecaeC165AbCf12dED095BB13F037685";
    //     // const InterchainGasPaymaster = "0xf857706CE59Cb7AE6df81Bbd0B0a656dB3e6beDA";
    //     // const NFTName = "AwesomeCrossChainNFT";
    //     // const NFTSymbol = "acc";
    //     // const MintAmount = hre.ethers.utils.parseEther("0.01");
    //     // const ChainId = hre.network.config.chainId;

    //     // const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
    //     // // const nft = await NFT.deploy(MintAmount, ChainId);
    //     // const nft = await NFT.attach(CONTRACT_ADDRESS);
    //     // // await nft.deployed();
    //     // console.log("deployed address:", await nft.address);
    //     // await nft.initialize(MailBox, InterchainGasPaymaster, NFTName, NFTSymbol);

    //     return { localChainMintUser, localChainOtherUser, remoteChainReceiveUser, remoteChainOtherUser }
    // }

    // local chain test
    describe("LocalChainTestCase", function () {
        it("Should receive mint NFT && transfer NFT", async function () {
            const TOKEN_ID = 0;
            //load 
            const [localChainMintUser, localChainOtherUser] = await ethers.getSigners();
            console.log(localChainMintUser.address, ethers.utils.parseEther("0.01"));
            //mint NFT
            await nft.connect(localChainMintUser).originMint("cidd0", "config0", { value: ethers.utils.parseEther("0.01") });
            await nft.connect(localChainMintUser).originMint("cidd1", "config1", { value: ethers.utils.parseEther("0.01") });
            console.log(await nft.getTokenListArray(localChainMintUser.address));
            //check balance
            expect(await nft.balanceOf(localChainMintUser.address)).to.equal(2);
            //check owner
            expect(await nft.ownerOf(TOKEN_ID)).to.equal(localChainMintUser.address);
            console.log("name:", await nft.tokenURI(TOKEN_ID));
            //transfer to otherUser
            await nft.connect(localChainMintUser).transferFrom(localChainMintUser.address, localChainOtherUser.address, TOKEN_ID);
            //check balance
            expect(await nft.balanceOf(localChainMintUser.address)).to.equal(1);
            //check owner
            expect(await nft.balanceOf(localChainOtherUser.address)).to.equal(1);
            //check balance
            expect(await nft.balanceOf(localChainOtherUser.address)).to.equal(1);
            console.log(await nft.getTokenListArray(localChainMintUser.address));
            console.log(await nft.getTokenListArray(localChainOtherUser.address));
        });
    });

    // cross chain test case , from op-goerli to goerli.
    describe("CrossChainTestCase", function () {
        it("Should receive transfer NFT", async function () {
            //use op-goerli first.
            // hre.changeNetwork('goerli');
            // const [localChainMintUser, localChainOtherUser, remoteChainReceiveUser, remoteChainOtherUser] = await ethers.getSigners();
            // console.log(localChainMintUser.address, localChainOtherUser.address, remoteChainReceiveUser.address, remoteChainOtherUser.address);

            //local chain mint options.
            // await nft.connect(localChainMintUser).originMint("cid", "config", { value: ethers.utils.parseEther("0.01") });
            //interchainGasPayment 
            // let interchainGasPayment = await nft.connect(localChainMintUser).quoteGasPayment(remoteDomain);
            // console.log(interchainGasPayment);

            //set remote router
            // await nft.connect(localChainMintUser).enrollRemoteRouter(localDomain, utils.addressToBytes32(local));
            //transferRemote
            // const messageId = await nft.connect(localChainMintUser).transferRemote(remoteDomain, utils.addressToBytes32(remoteChainReceiveUser.address), 2, { value: interchainGasPayment });
            // console.log(messageId);
            //core.messageProcess

            //check remote balance
            // expect(await nft.balanceOf(remoteChainReceiveUser.address)).to.equal(2);
        });
    });
});