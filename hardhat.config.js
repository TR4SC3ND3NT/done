require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");

module.exports = {
  zksolc: {
    version: "1.5.3",
    settings: { optimizer: { enabled: true } },
  },
  defaultNetwork: "xsollaZkTestnet",
  networks: {
    xsollaZkTestnet: {
      url: "https://zkrpc-sepolia.xsollazk.com",
      ethNetwork: "sepolia",
      zksync: true,
      timeout: 120000,
    },
  },
  solidity: { version: "0.8.24" },
};
