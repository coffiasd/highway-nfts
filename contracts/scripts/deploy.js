var NetworkConfig = require('../../frontend/utils/network_config.json');

async function main() {
  //mail box address.
  // const MailBox = "0xCC737a94FecaeC165AbCf12dED095BB13F037685";
  // const InterchainGasPaymaster = "0xF90cB82a76492614D07B82a7658917f3aC811Ac1";

  // scroll alpha 
  // const MailBox = "0x289db3f6324796BA7Adc75Fd5Fd6A62A2e80f820";
  // const InterchainGasPaymaster = "0xaa35BC1F13eE1718141C88eB619911799b08A454";

  //ploygon zk
  const MailBox = "0x5108fc83a99Acd0f0Cd620E021029459a0F60789";
  const InterchainGasPaymaster = "0xca147C4175e815B5dFccD5AE624952982dd5AE1d";

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
