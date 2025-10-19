import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Shield, Clock } from 'lucide-react';
import { DatasetMetadata } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: DatasetMetadata;
  onPayment: (amount: number, buyer: string) => Promise<void>;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  dataset,
  onPayment
}) => {
  const [paymentAmount, setPaymentAmount] = useState(dataset.price.toString());
  const [buyerAddress, setBuyerAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');

  const handlePayment = async () => {
    if (!buyerAddress.trim()) {
      alert('Please enter a buyer address');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount < dataset.price) {
      alert(`Payment amount must be at least $${dataset.price}`);
      return;
    }

    setStep('processing');
    setIsProcessing(true);

    try {
      await onPayment(amount, buyerAddress);
      setStep('success');
    } catch (error) {
      alert('Payment failed: ' + (error as Error).message);
      setStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setStep('details');
    setPaymentAmount(dataset.price.toString());
    setBuyerAddress('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Purchase Dataset</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Dataset Details Step */}
          {step === 'details' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{dataset.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{dataset.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Category: <span className="font-medium">{dataset.category}</span></div>
                  <div>Rows: <span className="font-medium">{dataset.rows?.toLocaleString() || 'N/A'}</span></div>
                  <div>Quality: <span className="font-medium">{dataset.quality_score}%</span></div>
                  <div>Price: <span className="font-medium text-green-600">${dataset.price}</span></div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                <Shield className="h-4 w-4" />
                <span>Payment is secured by smart contract escrow</span>
              </div>

              <button
                onClick={() => setStep('payment')}
                className="w-full btn-primary"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buyer Address
                  </label>
                  <input
                    type="text"
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    placeholder="0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e416"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Amount (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      min={dataset.price}
                      step="0.01"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum: ${dataset.price}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-yellow-800 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>This is a demo payment. No real money will be charged.</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Pay ${paymentAmount}</span>
                </button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-600">
                Your payment is being processed and verified...
              </p>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your dataset purchase is complete. You can now download the dataset.
              </p>
              <button
                onClick={handleClose}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;