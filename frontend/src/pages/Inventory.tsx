// src/pages/Inventory.tsx
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import useWallet from '../hooks/useWallet';

const FACTORY_ADDRESS = "0x9aEA7275DAf22c2AC42D85BC35177cf7cDbD8079";
const FACTORY_ABI = [
  "function demoMint() external",
  "function balanceOf(address) view returns (uint256)",
  "function tokenOfOwnerByIndex(address, uint256) view returns (uint256)",
  "function getItem(uint256) view returns (string name, string game, string rarity, uint256 power)"
];

export default function Inventory() {
  const { address, signer } = useWallet();
  const [items, setItems] = useState<any[]>([]);

  const factory = signer ? new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer) : null;

  const mintDemo = async () => {
    if (!factory) return toast.error("Connect wallet first");
    try {
      const tx = await factory.demoMint();
      toast.loading("Minting 3 demo items...");
      await tx.wait();
      toast.success("Demo items received!");
      loadItems();
    } catch (e: any) {
      toast.error("Failed: " + (e.message || "Try again"));
    }
  };

  const loadItems = async () => {
    if (!factory || !address) return;
    try {
      const balance = await factory.balanceOf(address);
      const list = [];
      for (let i = 0; i < balance; i++) {
        const id = await factory.tokenOfOwnerByIndex(address, i);
        const [name, game, rarity, power] = await factory.getItem(id);
        list.push({ id: id.toString(), name, game, rarity, power: power.toString() });
      }
      setItems(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (address && factory) loadItems();
  }, [address, factory]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient">Inventory ({items.length})</h1>
        <button onClick={mintDemo} className="btn-primary">
          Get Demo Items
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No items yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="card p-4 text-center hover:glow">
              <div className="text-4xl mb-2">
                {item.rarity === 'Epic' ? 'Gem' : item.rarity === 'Rare' ? 'Sword' : 'Cell'}
              </div>
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-cyan-400">{item.game}</p>
              <p className="text-xs text-purple-400">{item.rarity}</p>
              <p className="text-yellow-400">Power: {item.power}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
