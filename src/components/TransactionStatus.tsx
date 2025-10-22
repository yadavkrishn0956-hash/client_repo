import React from 'react';
import { CheckCircle, Clock, AlertCircle, Loader, ExternalLink } from 'lucide-react';

interface TransactionStatusProps {
  status: 'pending' | 'confirming' | 'success' | 'failed';
  txHash?: string;
  message?: string;
  onClose?: () => void;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status,
  txHash,
  message,
  onClose
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30',
          title: 'Transaction Pending',
          description: message || 'Waiting for wallet confirmation...'
        };
      case 'confirming':
        return {
          icon: Loader,
          color: 'text-blue-400',
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30',
          title: 'Confirming Transaction',
          description: message || 'Transaction submitted. Waiting for blockchain confirmation...'
        };
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bg: 'bg-green-500/20',
          border: 'border-green-500/30',
          title: 'Transaction Successful',
          description: message || 'Your transaction has been confirmed on the blockchain!'
        };
      case 'failed':
        return {
          icon: AlertCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          title: 'Transaction Failed',
          description: message || 'Transaction was rejected or failed. Please try again.'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`max-w-md w-full ${config.bg} ${config.border} border-2 rounded-2xl p-6 space-y-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Icon className={`h-8 w-8 ${config.color} ${status === 'confirming' ? 'animate-spin' : ''}`} />
            <div>
              <h3 className="text-xl font-bold text-white font-poppins">{config.title}</h3>
              <p className="text-sm text-text-secondary font-nunito mt-1">{config.description}</p>
            </div>
          </div>
        </div>

        {txHash && (
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <div className="text-xs text-text-secondary font-nunito">Transaction Hash:</div>
            <div className="flex items-center justify-between">
              <code className="text-xs font-mono text-accent-cyan break-all">
                {txHash.slice(0, 20)}...{txHash.slice(-20)}
              </code>
              <button
                onClick={() => window.open(`https://mumbai.polygonscan.com/tx/${txHash}`, '_blank')}
                className="ml-2 p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
              >
                <ExternalLink className="h-4 w-4 text-accent-cyan" />
              </button>
            </div>
          </div>
        )}

        {(status === 'success' || status === 'failed') && onClose && (
          <button
            onClick={onClose}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
          >
            Close
          </button>
        )}

        {status === 'confirming' && (
          <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-accent-violet rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="font-nunito">Estimated time: 15-30 seconds</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionStatus;
