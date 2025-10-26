import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import useWallet from '../hooks/useWallet';
import { ADDR, NFT_ABI, HUB_ABI } from '../contracts';

export default function Craft() {
  const { provider, signer, address } = useWallet();
  const [ids, setIds] = useState<string[]>([]);
  const [sel, setSel] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!provider || !address) return;
      const c = new ethers.Contract(ADDR.FACTORY, NFT_ABI, provider);
      const n = (await c.balanceOf(address)).toNumber();
      const arr = [];
      for (let i = 0; i < n; i++) {
        arr.push((await c.tokenOfOwnerByIndex(address, i)).toString());
      }
      setIds(arr);
    })();
  }, [address]);

  const toggle = (id: string) => {
    setSel((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= 2) return p;
      return [...p, id];
    });
  };

  const craft = async () => {
    if (!signer) return;
    if (sel.length !== 2) return toast.error('Select exactly 2 items');
    setLoading(true);
    try {
      const nft = new ethers.Contract(ADDR.FACTORY, NFT_ABI, signer);
      const hub = new ethers.Contract(ADDR.HUB, HUB_ABI, signer);
      // Approve each selected token
      for (const id of sel) {
        const tx = await nft.approve(ADDR.HUB, id);
        await tx.wait();
      }
      // Craft
      const tx = await hub.craftLegendary([sel[0], sel[1]]);
      await tx.wait();
      toast.success('Legendary item crafted!');
      setSel([]);
    } catch (e: any) {
      toast.error(e.message || 'Crafting failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section fade-in">
      <h2>Craft Legendary Item</h2>
      <div className="grid small">
        {ids.map((id) => (
          <div
            key={id}
            className={clsx('card-mini', sel.includes(id) && 'selected')}
            onClick={() => toggle(id)}
          >
            #{id}
          </div>
        ))}
      </div>
      <button className="btn-craft" disabled={sel.length !== 2 || loading} onClick={craft}>
        {loading ? '⏳ Crafting…' : '🔥 Craft Now'}
      </button>
    </section>
  );
}
