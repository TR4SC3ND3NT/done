import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

export default function useWallet() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer,   setSigner]   = useState<ethers.Signer>();
  const [address,  setAddress]  = useState('');

  const connect = useCallback(async () => {
    if (!window.ethereum) return toast.error('Install MetaMask');
    const p = new ethers.providers.Web3Provider(window.ethereum as any);
    await p.send('eth_requestAccounts', []);
    const s = p.getSigner();
    setProvider(p); setSigner(s); setAddress(await s.getAddress());
  }, []);

  return { provider, signer, address, connect };
}
