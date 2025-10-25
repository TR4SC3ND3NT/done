const hre = require("hardhat");
const { Wallet, Provider } = require("zksync-ethers");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
require("dotenv/config");

async function main() {
  const provider = new Provider("https://zkrpc-sepolia.xsollazk.com");
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  const deployer = new Deployer(hre, wallet);

  const ITEM_FACTORY = "0xF8EEfcaf97c3FdD6D685881C1F7B48F41EBa8711";

  console.log("📦 Deploying RecipeManager...");
  const recipeManager = await deployer.deploy(await deployer.loadArtifact("RecipeManager"));
  const recipeManagerAddress = await recipeManager.getAddress();
  console.log("✅ RecipeManager:", recipeManagerAddress);

  console.log("\n📦 Deploying CraftingHub...");
  const craftingHub = await deployer.deploy(
    await deployer.loadArtifact("CraftingHub"),
    [ITEM_FACTORY, recipeManagerAddress]
  );
  console.log("✅ CraftingHub:", await craftingHub.getAddress());

  console.log("\n🎮 Minting NFTs...");
  const itemFactory = await hre.ethers.getContractAt("ItemFactory", ITEM_FACTORY, wallet);
  
  await (await itemFactory.mint(wallet.address, "Dragon Sword", "Fantasy Quest", "Rare", 100, "ipfs://sword")).wait();
  await (await itemFactory.mint(wallet.address, "Fire Gem", "Crystal Mines", "Epic", 75, "ipfs://gem")).wait();
  await (await itemFactory.mint(wallet.address, "Energy Cell", "Cyber Arena", "Legendary", 150, "ipfs://cell")).wait();
  console.log("✅ 3 NFTs minted");

  console.log("\n📜 Creating recipes...");
  await (await recipeManager.createRecipe("Legendary Flame Blade", [1, 2], "Legendary Flame Blade", "Cross-Game Legendary", "Legendary", 250, "ipfs://flame-blade")).wait();
  await (await recipeManager.createRecipe("Ultimate Cyber Weapon", [1, 2, 3], "Ultimate Cyber Weapon", "Cross-Game Mythic", "Mythic", 500, "ipfs://ultimate")).wait();
  console.log("✅ 2 recipes created");

  console.log("\n🔑 Transferring ownership...");
  await (await itemFactory.transferOwnership(await craftingHub.getAddress())).wait();

  console.log("\n" + "=".repeat(70));
  console.log("ITEM_FACTORY_ADDRESS = \"" + ITEM_FACTORY + "\"");
  console.log("RECIPE_MANAGER_ADDRESS = \"" + recipeManagerAddress + "\"");
  console.log("CRAFTING_HUB_ADDRESS = \"" + await craftingHub.getAddress() + "\"");
  console.log("=".repeat(70));
}

main();
