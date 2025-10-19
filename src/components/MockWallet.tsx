import React, { useState } from 'react';
import { Wallet, Check, X } from 'lucide-react';

interface MockWalletProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const MockWallet: React.FC<MockWalletProps> = ({ onConnect, onDisconnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const mockAddresses = [
    '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e416',
    '0x8ba1f109551bD432803012645Hac136c22C177e9',
    '0x1234567890123456789012345678901234567890',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
  ];

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const randomAddress = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
    setWalletAddress(randomAddress);
    setIsConnected(true);
    setIsConnecting(false);
    
    if (onConnect) {
      onConnect(randomAddress);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    
    if (onDisconnect) {
      onDisconnect();
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Wallet className="h-4 w-4" />
          <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Disconnect wallet"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${isConnecting 
          ? 'bg-blue-100 text-blue-700 cursor-not-allowed' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 hover:border-gray-300'
        }
      `}
    >
      {isConnecting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
};

export default MockWallet;