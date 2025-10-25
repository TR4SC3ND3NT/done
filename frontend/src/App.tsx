// frontend/src/App.tsx
import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import clsx from 'clsx';
import './App.css';

/* ---------- CONSTS ---------------------------------- */
const ITEM_FACTORY_ADDRESS   = '0x9aEA7275DAf22c2AC42D85BC35177cf7cDbD8079';
const CRAFTING_HUB_ADDRESS   = '0x9c78DB1A8f5d95B7473Efb39A57eFB52963d00a3';

// сокращённое ABI (ethers v5)
const NFT_ABI  = [
  'function balanceOf(address) view returns (uint256)',
  'function tokenOfOwnerByIndex(address,uint256) view returns (uint256)',
  'function getItem(uint256) view returns (tuple(string,string,string,uint256))',
  'function approve(address,uint256) returns ()',
];
const HUB_ABI  = ['function craft(uint256,uint256[]) returns (uint256)'];

interface Item {
  id: string;
  name: string;
  game: string;
  rarity: string;
  power: string;
}
const ICONS: Record<string, string> = {
  'Fantasy Quest': '⚔️',
  'Crystal Mines': '💎',
  'Cyber Arena'  : '⚡',
  'Cross-Game'   : '👑',
};

/* ---------- HOOKS ---------------------------------- */
function useEthers() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer  , setSigner  ] = useState<ethers.Signer>();
  const [address , setAddress ] = useState<string>('');

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Установите MetaMask!');
      return;
    }
    const web3 = new ethers.providers.Web3Provider(window.ethereum as any);
    await web3.send('eth_requestAccounts', []);
    const s = web3.getSigner();
    setProvider(web3);
    setSigner(s);
    setAddress(await s.getAddress());
    toast.success('Кошелёк подключён');
  }, []);

  return { provider, signer, address, connect };
}

/* ---------- MAIN COMPONENT ------------------------- */
export default function App() {
  const { provider, signer, address, connect } = useEthers();
  const [items   , setItems   ] = useState<Item[]>([]);
  const [loading , setLoading ] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  /* ---------- LOAD ITEMS --------------------------- */
  const loadItems = useCallback(async () => {
    if (!provider || !address) return;
    try {
      const nft = new ethers.Contract(ITEM_FACTORY_ADDRESS, NFT_ABI, provider);
      const count = (await nft.balanceOf(address)).toNumber();
      const batch: Item[] = [];

      for (let i = 0; i < count; i++) {
        const tokenId = await nft.tokenOfOwnerByIndex(address, i);
        const [name, game, rarity, power] = await nft.getItem(tokenId);

        batch.push({
          id: tokenId.toString(),
          name,
          game,
          rarity,
          power: power.toString(),
        });
      }
      setItems(batch);
    } catch (err: any) {
      toast.error('Ошибка загрузки NFT: ' + err.message);
    }
  }, [provider, address]);

  useEffect(() => { loadItems(); }, [loadItems]);

  /* ---------- TOGGLE ITEM -------------------------- */
  const toggle = (id: string) =>
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 2
        ? [...prev, id]
        : prev
    );

  /* ---------- CRAFT -------------------------------- */
  const craft = async () => {
    if (!signer) return toast.error('Сначала подключите кошелёк');
    if (selected.length !== 2) return toast('Нужно выбрать 2 предмета');

    setLoading(true);
    try {
      const nft = new ethers.Contract(ITEM_FACTORY_ADDRESS, NFT_ABI, signer);
      const hub = new ethers.Contract(CRAFTING_HUB_ADDRESS, HUB_ABI, signer);

      // approve both
      await Promise.all(
        selected.map(id =>
          nft.approve(CRAFTING_HUB_ADDRESS, id).then((tx: any) => tx.wait())
        )
      );

      const tx = await hub.craft(1, selected);
      toast.loading('Крафтим...', { id: 'craft' });
      await tx.wait();
      toast.success('Успех! Получен легендарный предмет', { id: 'craft' });

      setSelected([]);
      await loadItems();
    } catch (err: any) {
      toast.error('Ошибка крафта: ' + err.message);
    }
    setLoading(false);
  };

  /* ---------- RENDER -------------------------------- */
  return (
    <div className="app">
      <Toaster position="top-center" />

      <header className="header">
        <h1>🎮 Cross-Game Crafting Hub</h1>

        {address ? (
          <span className="wallet">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        ) : (
          <button className="btn-primary" onClick={connect}>
            Connect Wallet
          </button>
        )}
      </header>

      {address && (
        <main className="container">
          {/* ---------- INVENTORY --------------------- */}
          <section className="section">
            <h2>Your Inventory ({items.length})</h2>

            {items.length === 0 ? (
              <div className="empty">
                <p>No items yet!</p>
                <p>Mint some in Remix IDE</p>
              </div>
            ) : (
              <div className="grid">
                {items.map(it => (
                  <div
                    key={it.id}
                    className={clsx(
                      'card',
                      selected.includes(it.id) && 'selected'
                    )}
                    onClick={() => toggle(it.id)}
                  >
                    <div className="icon">{ICONS[it.game] ?? '🎮'}</div>
                    <div className="name">{it.name}</div>
                    <div className="game">{it.game}</div>

                    <div className="stats">
                      <span className={clsx('rarity', it.rarity.toLowerCase())}>
                        {it.rarity}
                      </span>
                      <span className="power">⚡{it.power}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ---------- CRAFT PANEL ------------------- */}
          {items.length > 0 && (
            <section className="section">
              <h2>🔨 Craft Legendary Item</h2>

              <div className="recipe">
                <div className="recipe-info">
                  <p>Recipe: any 2 items → legendary</p>
                  <p>Selected: {selected.length}/2</p>
                </div>

                <button
                  className="btn-craft"
                  disabled={selected.length !== 2 || loading}
                  onClick={craft}
                >
                  {loading ? '⏳ Crafting…' : '🔥 Craft Now'}
                </button>
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  );
}
