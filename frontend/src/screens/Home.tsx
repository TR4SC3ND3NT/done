import { Link } from 'react-router-dom';
import useWallet from '../hooks/useWallet';

export default function Home() {
  const { address, connect } = useWallet();
  return (
    <section className="landing">
      <h1 className="big-gradient">Cross-Game Crafting Hub</h1>
      <p className="subtitle">Mint → Select → Craft Legendary across universes</p>
      {!address ? (
        <button className="btn-primary big" onClick={connect}>🔌 Connect Wallet</button>
      ) : (
        <>
          <p className="connected">Wallet: {address.slice(0,6)}…{address.slice(-4)}</p>
          <Link to="/inventory" className="btn-primary big">🚀 Start Demo</Link>
        </>
      )}
      <div className="scanlines"/>
    </section>
  );
}
