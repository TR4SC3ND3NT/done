// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import useWallet from './hooks/useWallet';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Craft from './pages/Craft';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { address, connect, isConnecting } = useWallet();

  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
          <header className="p-4 backdrop-blur-md bg-white/5 border-b border-cyan-500/20">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">Cross-Game Crafting Hub</span>
              </Link>
              <div className="flex items-center gap-4">
                {address ? (
                  <>
                    <span className="text-green-400 text-sm">Wallet connected!</span>
                    <nav className="flex gap-4">
                      <Link to="/inventory" className="hover:text-cyan-400">Inventory</Link>
                      <Link to="/craft" className="hover:text-cyan-400">Craft</Link>
                    </nav>
                  </>
                ) : (
                  <button
                    onClick={connect}
                    disabled={isConnecting}
                    className="btn-primary"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
              </div>
            </div>
          </header>

          <main className="p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/craft" element={<Craft />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
      <Toaster position="bottom-right" />
    </>
  );
}
