import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import useWallet from './hooks/useWallet';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Craft from './pages/Craft';
import { Toaster } from 'react-hot-toast';
import './App.css';

export default function App() {
  const { address, connect, isConnecting } = useWallet();

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <Link to="/" className="logo">Cross-Game Crafting Hub</Link>
          <div className="tabs">
            {address ? (
              <>
                <span className="wallet">Wallet: {address.slice(0, 6)}...{address.slice(-4)}</span>
                <nav style={{ display: 'flex', gap: 16, marginLeft: 12 }}>
                  <Link to="/inventory" className="tabs-link">Inventory</Link>
                  <Link to="/craft" className="tabs-link">Craft</Link>
                </nav>
              </>
            ) : (
              <button onClick={connect} disabled={isConnecting} className="btn-primary">
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </header>

        <main style={{ marginTop: 24 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/craft" element={<Craft />} />
          </Routes>
        </main>

        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

