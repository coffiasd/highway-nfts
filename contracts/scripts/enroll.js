const { utils } = require('@hyperlane-xyz/utils');
var NetworkConfig = require('../../frontend/utils/network_config.json');
async function main() {

    const local = hre.network.config.chainId;
    let localChain;
    let remoteChain;
    NetworkConfig.map(function (item) {
        if (item.id == local) {
            localChain = item;
        }
    });
    for (let index = 0; index < NetworkConfig.length; index++) {
        if (NetworkConfig[index].id != local) {
            remoteChain = NetworkConfig[index];
            console.log(localChain, remoteChain);

            const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
            const nft = NFT.attach(localChain.contract);
            await nft.enrollRemoteRouter(remoteChain.id, utils.addressToBytes32(remoteChain.contract));
            await nft.setDestinationGas([{ "domain": remoteChain.id, "gas": 300000 }]);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
