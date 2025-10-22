import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  User,
  Calendar,
  Database
} from 'lucide-react';
import { DatasetMetadata, Transaction } from '../types';
import { useDatasetMetadata, useAsyncOperation } from '../hooks/useApi';
import { apiClient } from '../services/api';
import { formatCurrency, formatDate, downloadBlob } from '../utils';
import QualityIndicator from '../components/QualityIndicator';
import PaymentModal from '../components/PaymentModal';
import PaymentFlowTracker from '../components/PaymentFlowTracker';

type PurchaseStep = 'loading' | 'details' | 'payment' | 'processing' | 'success' | 'error';

const PurchasePage: React.FC = () => {
  const { cid } = useParams<{ cid: string }>();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<PurchaseStep>('loading');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [buyerAddress, setBuyerAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentFlowStep, setPaymentFlowStep] = useState(1);

  const { data: dataset, loading: datasetLoading, error: datasetError } = useDatasetMetadata(cid || '', !!cid);
  const { loading: operationLoading, execute } = useAsyncOperation();

  useEffect(() => {
    if (datasetLoading) {
      setCurrentStep('loading');
    } else if (datasetError) {
      setCurrentStep('error');
      setErrorMessage('Dataset not found');
    } else if (dataset) {
      setCurrentStep('details');
    }
  }, [dataset, datasetLoading, datasetError]);

  const handleInitiatePurchase = () => {
    if (!buyerAddress.trim()) {
      alert('Please enter your wallet address');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async (amount: number, buyer: string) => {
    if (!dataset || !cid) return;

    setShowPaymentModal(false);
    setCurrentStep('processing');

    try {
      // Step 1: Initiate purchase (creates transaction and escrow)
      const purchaseResponse = await execute(() =>
        apiClient.initiatePurchase(cid, buyer, amount)
      );

      if (!purchaseResponse?.transaction) {
        throw new Error('Failed to initiate purchase');
      }

      const txId = purchaseResponse.transaction.tx_id;
      setTransaction(purchaseResponse.transaction);

      // Step 2: Complete payment (simulated)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing

      const paymentResponse = await execute(() =>
        apiClient.completePayment(txId, amount)
      );

      if (paymentResponse?.access_granted) {
        setTransaction(paymentResponse.transaction);
        setCurrentStep('success');
      } else {
        throw new Error('Payment verification failed');
      }

    } catch (error) {
      setCurrentStep('error');
      setErrorMessage((error as Error).message);
    }
  };

  const handleDownload = async () => {
    if (!cid || !transaction) return;

    try {
      const blob = await apiClient.downloadDataset(cid, 'zip', transaction.buyer);
      const filename = `${(dataset as any)?.title || 'dataset'}_${cid.slice(0, 8)}.zip`;
      downloadBlob(blob, filename);
    } catch (error) {
      alert('Download failed: ' + (error as Error).message);
    }
  };

  const renderDatasetDetails = (): JSX.Element | null => {
    if (!dataset || !(dataset as any).title) return null;

    const typedDataset = dataset as DatasetMetadata;

    return (
      <div className="glassmorphism p-8 rounded-3xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-3 font-poppins">{typedDataset.title}</h2>
            <p className="text-text-secondary mb-4 font-nunito leading-relaxed">{typedDataset.description}</p>

            <div className="flex items-center space-x-4 text-sm text-text-secondary mb-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4 text-accent-cyan" />
                <span className="font-nunito">{typedDataset.uploader.slice(0, 12)}...</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-accent-violet" />
                <span className="font-nunito">{formatDate(typedDataset.timestamp)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Database className="h-4 w-4 text-accent-cyan" />
                <span className="font-nunito">{typedDataset.category}</span>
              </div>
            </div>
          </div>

          <QualityIndicator score={typedDataset.quality_score} size="lg" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-white font-poppins">Dataset Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-text-secondary font-nunito">Rows:</span>
                <span className="font-medium text-white">{typedDataset.rows?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-text-secondary font-nunito">Columns:</span>
                <span className="font-medium text-white">{typedDataset.columns || 'N/A'}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-text-secondary font-nunito">File Size:</span>
                <span className="font-medium text-white">{(typedDataset.file_size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-text-secondary font-nunito">Format:</span>
                <span className="font-medium text-white">ZIP Archive</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white font-poppins">Pricing</h3>
            <div className="text-4xl font-bold gradient-text">
              {typedDataset.price === 0 ? 'Free' : formatCurrency(typedDataset.price)}
            </div>
            {typedDataset.price > 0 && (
              <div className="text-sm text-text-secondary font-nunito">
                One-time purchase with lifetime access
              </div>
            )}
          </div>
        </div>

        {typedDataset.tags && typedDataset.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-3 font-poppins">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {typedDataset.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    index % 2 === 0 ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-accent-violet/20 text-accent-violet'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center space-x-2 text-sm text-accent-cyan bg-accent-cyan/10 p-4 rounded-xl mb-6">
            <Shield className="h-5 w-5" />
            <span className="font-nunito">Secure transaction protected by smart contract escrow</span>
          </div>

          {typedDataset.price === 0 ? (
            <button
              onClick={() => handleDownload()}
              className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold font-poppins transition-all duration-300 transform hover:scale-105 glow-effect flex items-center justify-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Download Free Dataset</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-poppins">
                  Your Wallet Address
                </label>
                <input
                  type="text"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  placeholder="0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e416"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text-secondary focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan transition-all font-nunito"
                />
              </div>

              <button
                onClick={handleInitiatePurchase}
                disabled={!buyerAddress.trim()}
                className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold font-poppins transition-all duration-300 transform hover:scale-105 glow-effect flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <CreditCard className="h-5 w-5" />
                <span>Purchase for {formatCurrency(typedDataset.price)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProcessingStep = (): JSX.Element => (
    <div className="card text-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-6"></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h2>
      <p className="text-gray-600 mb-6">
        Your payment is being processed and verified. This may take a few moments.
      </p>
      <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
        <Clock className="h-4 w-4" />
        <span>Estimated time: 30-60 seconds</span>
      </div>
    </div>
  );

  const renderSuccessStep = (): JSX.Element => (
    <div className="space-y-6">
      {/* Payment Flow Tracker */}
      <PaymentFlowTracker 
        currentStep={5} 
        amount={dataset ? (dataset as any).price || 0.5 : 0.5} 
        currency="MATIC" 
      />

      {/* Success Card */}
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchase Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your payment has been processed and the dataset is now available for download.
        </p>

        {transaction && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Transaction Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono">{transaction.tx_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{formatCurrency(transaction.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Dataset</span>
          </button>

          <button
            onClick={() => navigate('/marketplace')}
            className="btn-secondary"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    </div>
  );

  const renderErrorStep = (): JSX.Element => (
    <div className="card text-center py-12">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchase Failed</h2>
      <p className="text-gray-600 mb-6">
        {errorMessage || 'An error occurred while processing your purchase.'}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => {
            setCurrentStep('details');
            setErrorMessage('');
          }}
          className="btn-primary"
        >
          Try Again
        </button>

        <button
          onClick={() => navigate('/marketplace')}
          className="btn-secondary"
        >
          Back to Marketplace
        </button>
      </div>
    </div>
  );

  const renderLoadingStep = (): JSX.Element => (
    <div className="glassmorphism p-12 rounded-3xl text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-cyan border-t-transparent mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-white font-poppins">Loading Dataset...</h2>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/marketplace')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white font-poppins">Purchase Dataset</h1>
          <p className="text-text-secondary font-nunito">Review details and complete your purchase</p>
        </div>
      </div>

      {/* Content based on current step */}
      {currentStep === 'loading' && renderLoadingStep()}
      {currentStep === 'details' && renderDatasetDetails()}
      {currentStep === 'processing' && renderProcessingStep()}
      {currentStep === 'success' && renderSuccessStep()}
      {currentStep === 'error' && renderErrorStep()}

      {/* Payment Modal */}
      {showPaymentModal && dataset && (dataset as any).title && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          dataset={dataset as DatasetMetadata}
          onPayment={handlePayment}
        />
      )}
    </div>
  );
};

export default PurchasePage;