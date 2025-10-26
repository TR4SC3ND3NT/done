import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

const RPC = import.meta.env.VITE_RPC || 'https://zkrpc-sepolia.xsollazk.com';
const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 11155111);

export default function useWallet() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Install MetaMask');
      return;
    }

    setIsConnecting(true);
    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await web3Provider.send('eth_requestAccounts', []);

      const network = await web3Provider.getNetwork();
      if (network.chainId !== CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${CHAIN_ID.toString(16)}`,
                chainName: 'Xsolla ZK Testnet',
                rpcUrls: [RPC],
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      const signer = web3Provider.getSigner();
      const addr = await signer.getAddress();
      setProvider(web3Provider);
      setSigner(signer);
      setAddress(addr);
      toast.success('Wallet connected!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return { provider, signer, address, connect, isConnecting };
}
