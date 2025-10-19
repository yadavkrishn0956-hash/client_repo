import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GenerateDataPage from './pages/GenerateDataPage';
import SellDataPage from './pages/SellDataPage';
import MarketplacePage from './pages/MarketplacePage';
import PurchasePage from './pages/PurchasePage';
import DatasetDetailsPage from './pages/DatasetDetailsPage';

function App() {
  return (
    <div style={{
      background: 'radial-gradient(at 0% 0%, rgba(255, 107, 0, 0.3) 0px, transparent 50%), radial-gradient(at 50% 0%, rgba(138, 43, 226, 0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0, 191, 255, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(255, 20, 147, 0.2) 0px, transparent 50%), radial-gradient(at 100% 50%, rgba(0, 255, 255, 0.2) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(138, 43, 226, 0.3) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(255, 107, 0, 0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0, 191, 255, 0.3) 0px, transparent 50%), #0f0f0f',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated gradient overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(138, 43, 226, 0.15) 0%, transparent 50%)',
        animation: 'gradientShift 15s ease infinite',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/generate" element={<GenerateDataPage />} />
              <Route path="/sell" element={<SellDataPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/dataset/:cid" element={<DatasetDetailsPage />} />
              <Route path="/purchase/:cid" element={<PurchasePage />} />
            </Routes>
          </Layout>
        </Router>
      </div>
    </div>
  );
}

export default App;