import React, { useState } from 'react';
import { Gavel, TrendingUp, Clock, DollarSign, Users } from 'lucide-react';

interface Bid {
  bidder: string;
  amount: number;
  timestamp: string;
}

interface BiddingPanelProps {
  datasetTitle: string;
  currentPrice: number;
  minimumBid?: number;
  endTime?: string;
  onPlaceBid?: (amount: number) => void;
}

const BiddingPanel: React.FC<BiddingPanelProps> = ({
  datasetTitle,
  currentPrice,
  minimumBid = currentPrice * 1.05,
  endTime = '2h 45m',
  onPlaceBid
}) => {
  const [bidAmount, setBidAmount] = useState(minimumBid);
  const [recentBids] = useState<Bid[]>([
    { bidder: '0x742d...e416', amount: currentPrice, timestamp: '2 min ago' },
    { bidder: '0x8f3a...b2c1', amount: currentPrice * 0.95, timestamp: '15 min ago' },
    { bidder: '0x1a2b...c3d4', amount: currentPrice * 0.90, timestamp: '1 hour ago' }
  ]);

  const handlePlaceBid = () => {
    if (bidAmount >= minimumBid && onPlaceBid) {
      onPlaceBid(bidAmount);
    }
  };

  return (
    <div className="glassmorphism rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Gavel className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-poppins">Place Your Bid</h3>
            <p className="text-sm text-text-secondary font-nunito">Auction ends in {endTime}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-accent-cyan">
          <Clock className="h-5 w-5 animate-pulse" />
          <span className="font-bold font-poppins">{endTime}</span>
        </div>
      </div>

      {/* Current Price */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary font-nunito">Current Highest Bid:</span>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400 font-semibold">+5.2%</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-8 w-8 text-accent-cyan" />
          <span className="text-4xl font-bold text-white font-poppins">{currentPrice.toFixed(2)}</span>
          <span className="text-xl text-text-secondary font-nunito">MATIC</span>
        </div>
        <div className="text-sm text-text-secondary mt-1 font-nunito">
          ≈ ${(currentPrice * 0.85).toFixed(2)} USD
        </div>
      </div>

      {/* Bid Input */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-white font-nunito">
          Your Bid Amount (Minimum: {minimumBid.toFixed(2)} MATIC)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent-cyan" />
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
            min={minimumBid}
            step="0.01"
            className="w-full pl-12 pr-20 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-bold placeholder-text-secondary focus:ring-2 focus:ring-accent-violet focus:border-accent-violet transition-all"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary font-nunito">
            MATIC
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span className="font-nunito">Gas fee: ~0.002 MATIC</span>
          <span className="font-nunito">Total: {(bidAmount + 0.002).toFixed(3)} MATIC</span>
        </div>
      </div>

      {/* Quick Bid Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {[5, 10, 15].map((percent) => (
          <button
            key={percent}
            onClick={() => setBidAmount(currentPrice * (1 + percent / 100))}
            className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold text-white transition-all"
          >
            +{percent}%
          </button>
        ))}
      </div>

      {/* Place Bid Button */}
      <button
        onClick={handlePlaceBid}
        disabled={bidAmount < minimumBid}
        className="w-full bg-gradient-primary text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 glow-effect disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
      >
        <Gavel className="h-5 w-5" />
        <span className="font-poppins">Place Bid</span>
      </button>

      {/* Recent Bids */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="h-4 w-4 text-accent-cyan" />
          <h4 className="text-sm font-bold text-white font-poppins">Recent Bids</h4>
          <span className="text-xs text-text-secondary font-nunito">({recentBids.length} total)</span>
        </div>
        <div className="space-y-2">
          {recentBids.map((bid, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <code className="text-xs font-mono text-text-secondary">{bid.bidder}</code>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{bid.amount.toFixed(2)} MATIC</div>
                <div className="text-xs text-text-secondary font-nunito">{bid.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiddingPanel;
