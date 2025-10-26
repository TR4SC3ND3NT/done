// src/pages/Craft.tsx
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import useWallet from '../hooks/useWallet';

const HUB_ADDRESS = "0x9c78DB1A8f5d95B7473Efb39A57eFB52963d00a3";
const HUB_ABI = [
  "function craftLegendary(uint256[2] calldata ids) external"
];

export default function Craft() {
  const { address, signer } = useWallet();
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const factory = new ethers.Contract(
    "0x9aEA7275DAf22c2AC42D85BC35177cf7cDbD8079",
    ["function tokenOfOwnerByIndex(address,uint256) view returns (uint256)", "function getItem(uint256) view returns (string,string,string,uint256)"],
    signer || undefined
  );

  const hub = signer ? new ethers.Contract(HUB_ADDRESS, HUB_ABI, signer) : null;

  const loadItems = async () => {
    if (!signer || !address) return;
    try {
      const balance = await factory.balanceOf(address);
      const list = [];
      for (let i = 0; i < balance; i++) {
        const id = await factory.tokenOfOwnerByIndex(address, i);
        const [name] = await factory.getItem(id);
        list.push({ id: id.toString(), name });
      }
      setItems(list);
    } catch (e) {
      console.error(e);
    }
  };

  const craft = async () => {
    if (!hub || selected.length !== 2) return toast.error("Select 2 items");
    try {
      const tx = await hub.craftLegendary([selected[0], selected[1]]);
      toast.loading("Crafting legendary...");
      await tx.wait();
      toast.success("Legendary Relic crafted!");
      setSelected([]);
      loadItems();
    } catch (e: any) {
      toast.error(e.message || "Failed");
    }
  };

  useEffect(() => {
    if (address) loadItems();
  }, [address]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gradient mb-6">Craft Legendary Item</h1>
      <p className="text-gray-300 mb-6">Select 2 items to create a legendary relic</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (selected.includes(item.id)) {
                setSelected(selected.filter(s => s !== item.id));
              } else if (selected.length < 2) {
                setSelected([...selected, item.id]);
              }
            }}
            className={`card p-4 text-center cursor-pointer transition-all ${
              selected.includes(item.id) ? 'ring-4 ring-cyan-400 glow' : ''
            }`}
          >
            <div className="text-2xl mb-1">Item</div>
            <p className="font-bold">{item.name}</p>
            <p className="text-xs text-gray-400">ID: {item.id}</p>
          </div>
        ))}
      </div>

      <button
        onClick={craft}
        disabled={selected.length !== 2}
        className="btn-primary w-full"
      >
        {selected.length !== 2 ? 'Select 2 items' : 'Craft Now'}
      </button>
    </div>
  );
}
