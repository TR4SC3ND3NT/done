import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import useWallet from '../hooks/useWallet';
import { ADDR, NFT_ABI } from '../contracts';

const ICON:Record<string,string>={
  'Fantasy Quest':'⚔️','Cyber Arena':'⚡','Crystal Mines':'💎','Cross-Game':'👑'
};

export default function Inventory() {
  const { provider, signer, address } = useWallet();
  const [items, setItems] = useState<any[]>([]);
  const contract = provider && new ethers.Contract(ADDR.FACTORY, NFT_ABI, signer||provider);

  async function load() {
    if (!provider||!address) return;
    const c=new ethers.Contract(ADDR.FACTORY,NFT_ABI,provider);
    const n=(await c.balanceOf(address)).toNumber();
    const arr=[];
    for(let i=0;i<n;i++){
      const id=await c.tokenOfOwnerByIndex(address,i);
      const it=await c.getItem(id);
      arr.push({id:id.toString(),name:it[0],game:it[1],rarity:it[2],power:it[3].toString()});
    }
    setItems(arr);
  }

  async function getDemo() {
    if(!signer) return toast('Connect wallet first');
    try{
      await (await contract.demoMint()).wait();
      toast.success('3 demo NFT minted');
      load();
    }catch(e:any){toast.error(e.message);}
  }

  useEffect(()=>{load();},[address]);

  return(
    <section className="section">
      <h2>Inventory ({items.length})</h2>
      {items.length===0 ? (
        <div className="empty">
          <p>No items yet</p>
          <button className="btn-primary" onClick={getDemo}>🎁 Get Demo Items</button>
        </div>
      ):(
        <div className="grid">
          {items.map(it=>(
            <div key={it.id} className={clsx('card',it.rarity.toLowerCase())}>
              <div className="icon">{ICON[it.game]??'🎮'}</div>
              <div className="name">{it.name}</div>
              <div className="game">{it.game}</div>
              <div className="stats">
                <span className={`rarity ${it.rarity.toLowerCase()}`}>{it.rarity}</span>
                <span className="power">⚡{it.power}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
