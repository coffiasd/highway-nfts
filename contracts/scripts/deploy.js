async function main() {
  //mail box address.
  const MailBox = "0xCC737a94FecaeC165AbCf12dED095BB13F037685";
  const InterchainGasPaymaster = "0xF90cB82a76492614D07B82a7658917f3aC811Ac1";
  const NFTName = "AwesomeCrossChainNFT";
  const NFTSymbol = "acc";
  const MintAmount = hre.ethers.utils.parseEther("0.0001");
  const ChainId = hre.network.config.chainId;

  const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
  const nft = await NFT.deploy(MintAmount, ChainId);
  await nft.deployed();

  //0xEe2e98F4991d8864fbE645Ab93C5552996fdaf56  opgoerli
  //0xF023b1f74D17470BD7eC020A65376AdF3D62E8fe   mumbai
  // const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
  // const nft = NFT.attach("0x68E099fAa7683BE97E3DCf75B3B572AB5918FAd0");

  console.log("deployed address:", await nft.address);
  await nft.initialize(MailBox, InterchainGasPaymaster, NFTName, NFTSymbol);

  //set remote router
  // await nft.enrollRemoteRouter(localDomain, utils.addressToBytes32(local));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
