import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Download, Eye } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface TransactionHistoryProps {
  transactions: (Transaction & { 
    dataset_title?: string; 
    dataset_category?: string;
    download_url?: string;
    can_download?: boolean;
  })[];
  userAddress: string;
  onDownload?: (cid: string) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  userAddress,
  onDownload
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.status === filter;
  });

  const getTransactionType = (tx: Transaction) => {
    return tx.buyer === userAddress ? 'Purchase' : 'Sale';
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
        <p className="text-gray-600">Your transaction history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'completed', label: 'Completed' },
          { key: 'pending', label: 'Pending' },
          { key: 'failed', label: 'Failed' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.tx_id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(transaction.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {transaction.dataset_title || 'Unknown Dataset'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {getTransactionType(transaction)} • {transaction.dataset_category}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <div className="font-medium">{formatDate(transaction.timestamp)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Transaction ID:</span>
                    <div className="font-mono text-xs">{transaction.tx_id}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">
                      {getTransactionType(transaction) === 'Purchase' ? 'Seller:' : 'Buyer:'}
                    </span>
                    <div className="font-mono text-xs">
                      {getTransactionType(transaction) === 'Purchase' 
                        ? `${transaction.seller.slice(0, 6)}...${transaction.seller.slice(-4)}`
                        : `${transaction.buyer.slice(0, 6)}...${transaction.buyer.slice(-4)}`
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>

                {transaction.status === 'completed' && 
                 getTransactionType(transaction) === 'Purchase' && 
                 onDownload && (
                  <button
                    onClick={() => onDownload(transaction.cid)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Download dataset"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No {filter} transactions
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'No transactions found.'
              : `No ${filter} transactions found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;