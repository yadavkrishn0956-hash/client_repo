import React from 'react';
import { Lock, Unlock, Clock, CheckCircle, DollarSign } from 'lucide-react';

interface EscrowStatusProps {
  amount: number;
  status: 'locked' | 'pending_release' | 'released' | 'refunded';
  currency?: string;
  releaseDate?: string;
}

const EscrowStatus: React.FC<EscrowStatusProps> = ({
  amount,
  status,
  currency = 'MATIC',
  releaseDate
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'locked':
        return {
          icon: Lock,
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          title: 'Funds Locked in Escrow',
          description: 'Payment secured until quality verification'
        };
      case 'pending_release':
        return {
          icon: Clock,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          title: 'Pending Release',
          description: 'Quality check passed. Awaiting final confirmation'
        };
      case 'released':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          title: 'Payment Released',
          description: 'Funds successfully transferred to seller'
        };
      case 'refunded':
        return {
          icon: Unlock,
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          title: 'Refunded',
          description: 'Funds returned to buyer'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border rounded-xl p-4`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 bg-white/5 rounded-lg ${config.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-white font-poppins">{config.title}</h4>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-accent-cyan" />
              <span className="font-bold text-white">{amount} {currency}</span>
            </div>
          </div>
          <p className="text-sm text-text-secondary font-nunito">{config.description}</p>
          {releaseDate && status === 'pending_release' && (
            <p className="text-xs text-accent-cyan mt-2 font-nunito">
              Expected release: {releaseDate}
            </p>
          )}
        </div>
      </div>

      {status === 'locked' && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary font-nunito">Smart Contract:</span>
            <code className="text-accent-cyan font-mono">0x742d...e416</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscrowStatus;
