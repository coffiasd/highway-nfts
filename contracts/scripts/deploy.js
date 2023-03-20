async function main() {
  //mail box address.
  const MailBox = "0xCC737a94FecaeC165AbCf12dED095BB13F037685";
  const InterchainGasPaymaster = "0xF90cB82a76492614D07B82a7658917f3aC811Ac1";
  const NFTName = "AwesomeCrossChainNFT";
  const NFTSymbol = "acc";
  const MintAmount = hre.ethers.utils.parseEther("0.01");
  const ChainId = hre.network.config.chainId;

  const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
  const nft = await NFT.deploy(MintAmount, ChainId);
  // await nft.deployed();

  //0x15cdAeA0F60e083D5dA74BCd8A27531aF5eA91Cb  opgoerli
  //0xF80C331aA92308ef58C9D55D49355AC3052130AD   goerli
  // const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
  // const nft = NFT.attach("0xEaB08b7987fAfB772b578236c9CAd4202DD11542");

  console.log("deployed address:", await nft.address);
  await nft.initialize(MailBox, InterchainGasPaymaster, NFTName, NFTSymbol);

  //set remote router
  // await nft.enrollRemoteRouter(localDomain, utils.addressToBytes32(local));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
