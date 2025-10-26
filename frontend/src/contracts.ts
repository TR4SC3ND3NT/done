export const ADDR = {
  FACTORY : import.meta.env.VITE_FACTORY as string,
  HUB     : import.meta.env.VITE_HUB     as string,
};

export const NFT_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function tokenOfOwnerByIndex(address,uint256) view returns (uint256)",
  "function getItem(uint256) view returns (tuple(string,string,string,uint256))",
  "function demoMint() public",
  "function approve(address,uint256)",
];

export const HUB_ABI = [
  "function craftLegendary(uint256[2])",
];
