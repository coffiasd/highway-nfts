async function run() {
    const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
    const nft = await NFT.attach("0xEe2e98F4991d8864fbE645Ab93C5552996fdaf56");
    // const owner = await nft.ownerOf(1);
    // console.log(owner);
    // console.log(await nft.tokenURI(1));

    console.log(await nft.getTokenListArray("0x52bf58425cAd0B50fFcA8Dbe5447dcE9420a2610"));
}


run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});