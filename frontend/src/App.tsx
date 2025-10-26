import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useWallet from './hooks/useWallet';
import Home from './screens/Home';
import Inventory from './screens/Inventory';
import Recipes from './screens/Recipes';
import Craft from './screens/Craft';
import './App.css';

export default function App() {
  const { address } = useWallet();
  const { pathname } = useLocation();

  return (
    <div className="app">
      <Toaster position="top-center"/>
      <header className="header">
        <Link to="/" className="logo">▲ Cross-Game</Link>
        <nav className="tabs">
          <Link to="/"          className={pathname==='/'          ?'active':''}>Home</Link>
          {address && <>
            <Link to="/inventory" className={pathname.startsWith('/inventory')?'active':''}>Inventory</Link>
            <Link to="/recipes"   className={pathname.startsWith('/recipes')  ?'active':''}>Recipes</Link>
            <Link to="/craft"     className={pathname.startsWith('/craft')    ?'active':''}>Craft</Link>
          </>}
        </nav>
        {address && <span className="wallet">{address.slice(0,6)}…{address.slice(-4)}</span>}
      </header>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/inventory" element={<Inventory/>}/>
        <Route path="/recipes" element={<Recipes/>}/>
        <Route path="/craft" element={<Craft/>}/>
      </Routes>
    </div>
  );
}
