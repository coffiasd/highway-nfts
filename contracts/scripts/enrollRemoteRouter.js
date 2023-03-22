const { utils } = require('@hyperlane-xyz/utils');
var NetworkConfig = require('../../frontend/utils/network_config.json');
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

    //0xC6326463e731Ff598236Ce97F29A6bD12b99409B  opgoerli
    //0xF023b1f74D17470BD7eC020A65376AdF3D62E8fe   mumbai
    const local = "420";
    const remote = "80001";
    let localChain;
    let remoteChain;
    // console.log(NetworkConfig);
    NetworkConfig.map(function (item) {
        if (item.id == local) {
            localChain = item;
        }
        if (item.id == remote) {
            remoteChain = item;
        }
    });
    console.log(localChain, remoteChain);
    const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
    const nft = NFT.attach(localChain.contract);

    // console.log("deployed address:", await nft.address);
    // await nft.initialize(MailBox, InterchainGasPaymaster, NFTName, NFTSymbol);

    // const remoteChainID = 420;
    // const remoteChainContractAddress = "0xC6326463e731Ff598236Ce97F29A6bD12b99409B";

    // const remoteChainID = 80001;
    // const remoteChainContractAddress = "0xF023b1f74D17470BD7eC020A65376AdF3D62E8fe";

    // //set remote router
    // console.log(remoteChainID, utils.addressToBytes32(remoteChainContractAddress));
    await nft.enrollRemoteRouter(remoteChain.id, utils.addressToBytes32(remoteChain.contract));
    await nft.setDestinationGas([{ "domain": remoteChain.id, "gas": 300000 }]);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
