var NetworkConfig = require('../../frontend/utils/network_config.json');

async function main() {
  //mail box address.
  // const MailBox = "0xCC737a94FecaeC165AbCf12dED095BB13F037685";
  // const InterchainGasPaymaster = "0xF90cB82a76492614D07B82a7658917f3aC811Ac1";

  // ploygon zk 
  const MailBox = "0x902008883C61f5e5E391265756473D4ee04Cb10E";
  const InterchainGasPaymaster = "0xE7afAD15477e7E2c4Daa6279f4fff91F7ABdd10E";

  const NFTName = "AwesomeCrossChainNFT";
  const NFTSymbol = "acc";
  const MintAmount = hre.ethers.utils.parseEther("0.0001");
  const ChainId = hre.network.config.chainId;
  let startId;

  NetworkConfig.map(function (item, index) {
    if (item.id == ChainId) {
      startId = index * 1000;
    }
  });
  if (startId == 0) {
    startId = 1;
  }

  console.log(startId, ChainId);
  const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
  const nft = await NFT.deploy(MintAmount, startId);
  await nft.deployed();

  // const NFT = await hre.ethers.getContractFactory("AwesomeCrossChainNFT");
  // const nft = NFT.attach("0xD910482D70B43607bb637ae1B14Eb8ba7866Fade");

  console.log("deployed address:", await nft.address);
  await nft.initialize(MailBox, InterchainGasPaymaster, NFTName, NFTSymbol);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
