const { Wallet, Provider, ContractFactory } = require("zksync-ethers");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
require("dotenv/config");

module.exports = async function (hre) {
  const provider = new Provider("https://zkrpc-sepolia.xsollazk.com");
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  const deployer = new Deployer(hre, wallet);

  console.log("Deploying from:", wallet.address);

  const itemFactory = await deployer.deploy(await deployer.loadArtifact("ItemFactory"));
  console.log("ItemFactory:", await itemFactory.getAddress());

  const recipeManager = await deployer.deploy(await deployer.loadArtifact("RecipeManager"));
  console.log("RecipeManager:", await recipeManager.getAddress());

  const craftingHub = await deployer.deploy(
    await deployer.loadArtifact("CraftingHub"),
    [await itemFactory.getAddress(), await recipeManager.getAddress()]
  );
  console.log("CraftingHub:", await craftingHub.getAddress());

  console.log("\n=== COPY THESE ===");
  console.log(await itemFactory.getAddress());
  console.log(await recipeManager.getAddress());
  console.log(await craftingHub.getAddress());
};
