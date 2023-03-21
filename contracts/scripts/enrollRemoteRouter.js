const { utils } = require('@hyperlane-xyz/utils');

// enrollRemoteRouter(localDomain, utils.addressToBytes32(local));
async function main() {
    //mail box address.
    const MailBox = "0xCC737a94FecaeC165AbCf12dED095BB13F037685";
    const InterchainGasPaymaster = "0xF90cB82a76492614D07B82a7658917f3aC811Ac1";
    const NFTName = "AwesomeCrossChainNFT";
    const NFTSymbol = "acc";
    // const MintAmount = hre.ethers.utils.parseEther("0.01");
    // const ChainId = hre.network.config.chainId;

    // const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
    // const nft = await NFT.deploy(MintAmount, ChainId);
    // await nft.deployed();

    //0x15cdAeA0F60e083D5dA74BCd8A27531aF5eA91Cb  opgoerli
    //0xF80C331aA92308ef58C9D55D49355AC3052130AD   goerli
    const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
    const nft = NFT.attach("0xF80C331aA92308ef58C9D55D49355AC3052130AD");

    // console.log("deployed address:", await nft.address);
    // await nft.initialize(MailBox, InterchainGasPaymaster, NFTName, NFTSymbol);
    // const remoteChainID = 420;
    // const remoteChainContractAddress = "0x902008883C61f5e5E391265756473D4ee04Cb10E";

    const remoteChainID = 80001;
    const remoteChainContractAddress = "0x1ae545931422BB868595d64b6d3e862b94d46Cc1";

    // //set remote router
    // console.log(remoteChainID, utils.addressToBytes32(remoteChainContractAddress));
    await nft.enrollRemoteRouter(remoteChainID, utils.addressToBytes32(remoteChainContractAddress));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
