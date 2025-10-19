import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, Upload, ShoppingCart, Zap, Wallet } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Database },
    { name: 'Generate', href: '/generate', icon: Zap },
    { name: 'Sell Data', href: '/sell', icon: Upload },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen">
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <Database className="h-12 w-12 text-accent-cyan" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))' }} />
                  <Zap className="h-5 w-5 text-accent-violet absolute -top-1 -right-1" />
                </div>
                <div>
                  <h1 className="text-3xl font-black gradient-text font-poppins">
                    Dataset Bazar
                  </h1>
                  <p className="text-xs text-text-secondary font-nunito">
                    Powered by AI & Blockchain
                  </p>
                </div>
              </Link>
              
              <nav className="hidden md:flex space-x-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group relative flex items-center space-x-2 px-5 py-3 rounded-xl text-base font-semibold font-nunito transition-all duration-300 ${
                        isActive(item.href)
                          ? 'bg-gradient-primary text-white shadow-lg glow-effect'
                          : 'text-text-secondary hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
                        isActive(item.href) ? 'text-white' : 'text-accent-cyan'
                      }`} />
                      <span>{item.name}</span>
                      {isActive(item.href) && (
                        <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-20 animate-pulse"></div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsWalletConnected(!isWalletConnected)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold font-poppins transition-all duration-300 transform hover:scale-105 ${
                  isWalletConnected
                    ? 'bg-green-500/20 text-green-300 border-2 border-green-400/40 shadow-lg glow-effect'
                    : 'bg-gradient-primary text-white shadow-lg glow-effect'
                }`}
              >
                <Wallet className="h-5 w-5" />
                <span>
                  {isWalletConnected ? 'Connected' : 'Connect Wallet'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;