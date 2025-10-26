import { Link } from 'react-router-dom';
import useWallet from '../hooks/useWallet';

export default function Home() {
  const { address, connect } = useWallet();
  return (
    <section className="landing fade-in">
      <h1 className="big-gradient">Cross-Game Crafting Hub</h1>
      <p className="subtitle">Combine NFTs from different games to craft legendary items in a decentralized metaverse.</p>
      {!address ? (
        <button className="btn-primary big" onClick={connect}>🔌 Connect Wallet</button>
      ) : (
        <>
          <p className="connected">Connected: {address.slice(0, 6)}…{address.slice(-4)}</p>
          <Link to="/inventory" className="btn-primary big">🚀 Explore Inventory</Link>
        </>
      )}
    </section>
  );
}
