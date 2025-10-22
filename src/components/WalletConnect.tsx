import React, { useState } from 'react';
import { Wallet, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('Polygon Mumbai');
  const [balance, setBalance] = useState('12.5');
  const [showDropdown, setShowDropdown] = useState(false);

  const mockConnect = () => {
    // Simulate wallet connection
    const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
    setWalletAddress(mockAddress);
    setIsConnected(true);
    if (onConnect) onConnect(mockAddress);
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    setShowDropdown(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    alert('Address copied to clipboard!');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <button
        onClick={mockConnect}
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 glow-effect"
      >
        <Wallet className="h-5 w-5" />
        <span className="font-poppins">Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono text-white">{formatAddress(walletAddress)}</span>
        </div>
        <div className="text-xs text-text-secondary font-nunito">
          {balance} MATIC
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-secondary border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 bg-gradient-primary">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80 font-nunito">Connected Wallet</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400 font-semibold">{network}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-white">{formatAddress(walletAddress)}</span>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Copy className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-nunito">Balance</span>
              <span className="text-lg font-bold text-white font-poppins">{balance} MATIC</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-nunito">Network</span>
              <span className="text-sm text-white font-semibold">{network}</span>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <button
                onClick={() => window.open(`https://mumbai.polygonscan.com/address/${walletAddress}`, '_blank')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-accent-cyan" />
                <span className="text-sm text-white font-nunito">View on Explorer</span>
              </button>

              <button
                onClick={disconnect}
                className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-semibold text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
