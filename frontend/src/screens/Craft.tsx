import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import useWallet from '../hooks/useWallet';
import { ADDR, NFT_ABI, HUB_ABI } from '../contracts';

export default function Craft() {
  const { provider, signer, address } = useWallet();
  const [ids,setIds]=useState<string[]>([]);
  const [sel,setSel]=useState<string[]>([]);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{(async()=>{
    if(!provider||!address)return;
    const c=new ethers.Contract(ADDR.FACTORY,NFT_ABI,provider);
    const n=(await c.balanceOf(address)).toNumber();
    const arr=[];
    for(let i=0;i<n;i++){arr.push((await c.tokenOfOwnerByIndex(address,i)).toString());}
    setIds(arr);
  })();},[address]);

  const toggle=(id:string)=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):p.length<2?[...p,id]:p);

  const craft=async()=>{
    if(!signer)return;
    setLoading(true);
    try{
      const nft=new ethers.Contract(ADDR.FACTORY,NFT_ABI,signer);
      const hub=new ethers.Contract(ADDR.HUB,HUB_ABI,signer);
      await Promise.all(sel.map(id=>nft.approve(ADDR.HUB,id).then((tx:any)=>tx.wait())));
      await (await hub.craftLegendary([sel[0],sel[1]])).wait();
      toast.success('Legendary crafted!');
      setSel([]);
    }catch(e:any){toast.error(e.message);}
    setLoading(false);
  };

  return(
    <section className="section">
      <h2>Craft</h2>
      <div className="grid small">
        {ids.map(id=>(
          <div key={id} className={clsx('card-mini',sel.includes(id)&&'selected')}
               onClick={()=>toggle(id)}>#{id}</div>
        ))}
      </div>
      <button className="btn-craft" disabled={sel.length!=2||loading} onClick={craft}>
        {loading?'⏳ Crafting…':'🔥 Craft Now'}
      </button>
    </section>
  );
}
