import React from 'react';
import { CheckCircle, Clock, Circle, DollarSign, Package, Search, Unlock } from 'lucide-react';

interface PaymentStep {
  id: number;
  label: string;
  icon: React.ComponentType<any>;
  status: 'complete' | 'current' | 'pending';
  timestamp?: string;
  txHash?: string;
}

interface PaymentFlowTrackerProps {
  currentStep: number;
  steps?: PaymentStep[];
  amount?: number;
  currency?: string;
}

const PaymentFlowTracker: React.FC<PaymentFlowTrackerProps> = ({
  currentStep,
  steps,
  amount = 0.5,
  currency = 'MATIC'
}) => {
  const defaultSteps: PaymentStep[] = steps || [
    {
      id: 1,
      label: 'Deposit Escrow',
      icon: DollarSign,
      status: currentStep > 1 ? 'complete' : currentStep === 1 ? 'current' : 'pending',
      timestamp: currentStep >= 1 ? '2 min ago' : undefined,
      txHash: currentStep >= 1 ? '0x3f2a...9b4c' : undefined
    },
    {
      id: 2,
      label: 'Seller Delivers',
      icon: Package,
      status: currentStep > 2 ? 'complete' : currentStep === 2 ? 'current' : 'pending',
      timestamp: currentStep >= 2 ? '5 min ago' : undefined,
      txHash: currentStep >= 2 ? '0x7b8c...3d2e' : undefined
    },
    {
      id: 3,
      label: 'QA Verification',
      icon: Search,
      status: currentStep > 3 ? 'complete' : currentStep === 3 ? 'current' : 'pending',
      timestamp: currentStep >= 3 ? '1 min ago' : undefined
    },
    {
      id: 4,
      label: 'Release Payment',
      icon: Unlock,
      status: currentStep > 4 ? 'complete' : currentStep === 4 ? 'current' : 'pending',
      timestamp: currentStep >= 4 ? 'Just now' : undefined,
      txHash: currentStep >= 4 ? '0x9e1f...5a6b' : undefined
    }
  ];

  const getStepIcon = (step: PaymentStep) => {
    const Icon = step.icon;
    
    if (step.status === 'complete') {
      return <CheckCircle className="h-6 w-6 text-green-400" />;
    } else if (step.status === 'current') {
      return <Clock className="h-6 w-6 text-blue-400 animate-pulse" />;
    } else {
      return <Circle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStepColor = (step: PaymentStep) => {
    if (step.status === 'complete') return 'border-green-400 bg-green-500/20';
    if (step.status === 'current') return 'border-blue-400 bg-blue-500/20';
    return 'border-gray-600 bg-gray-500/10';
  };

  const getConnectorColor = (index: number) => {
    if (defaultSteps[index].status === 'complete') return 'bg-green-400';
    if (defaultSteps[index].status === 'current') return 'bg-gradient-to-r from-green-400 to-blue-400';
    return 'bg-gray-600';
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white font-poppins">Payment Flow</h3>
        <div className="text-right">
          <div className="text-sm text-text-secondary font-nunito">Escrow Amount</div>
          <div className="text-lg font-bold text-white font-poppins">
            {amount} {currency}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-8">
        {/* Background line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-600 rounded-full" />
        
        {/* Progress line */}
        <div 
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (defaultSteps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {defaultSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center" style={{ width: '25%' }}>
              {/* Step Circle */}
              <div className={`w-12 h-12 rounded-full border-2 ${getStepColor(step)} flex items-center justify-center mb-3 transition-all duration-300 z-10 bg-secondary`}>
                {getStepIcon(step)}
              </div>

              {/* Step Label */}
              <div className="text-center">
                <div className={`text-sm font-semibold font-poppins mb-1 ${
                  step.status === 'complete' ? 'text-green-400' :
                  step.status === 'current' ? 'text-blue-400' :
                  'text-gray-500'
                }`}>
                  {step.label}
                </div>
                {step.timestamp && (
                  <div className="text-xs text-text-secondary font-nunito">
                    {step.timestamp}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            {React.createElement(defaultSteps[currentStep - 1]?.icon || Clock, {
              className: "h-5 w-5 text-blue-400"
            })}
          </div>
          <div className="flex-1">
            <div className="font-bold text-white font-poppins mb-1">
              Current: {defaultSteps[currentStep - 1]?.label}
            </div>
            <div className="text-sm text-text-secondary font-nunito">
              {currentStep === 1 && "Waiting for escrow deposit confirmation..."}
              {currentStep === 2 && "Seller is preparing and delivering the dataset..."}
              {currentStep === 3 && "Running automated quality verification checks..."}
              {currentStep === 4 && "Processing payment release to seller..."}
            </div>
            {defaultSteps[currentStep - 1]?.txHash && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-text-secondary font-nunito">Transaction:</span>
                <code className="text-xs text-accent-cyan font-mono">
                  {defaultSteps[currentStep - 1].txHash}
                </code>
                <button
                  onClick={() => window.open(`https://mumbai.polygonscan.com/tx/${defaultSteps[currentStep - 1].txHash}`, '_blank')}
                  className="text-xs text-accent-cyan hover:text-accent-violet transition-colors"
                >
                  View →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Step Preview */}
      {currentStep < defaultSteps.length && (
        <div className="mt-4 bg-accent-violet/10 border border-accent-violet/30 rounded-xl p-3">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-accent-violet font-semibold font-poppins">Next:</span>
            <span className="text-white font-nunito">
              {defaultSteps[currentStep]?.label}
              {currentStep === 1 && " - Seller will be notified"}
              {currentStep === 2 && " - Automated quality checks will run"}
              {currentStep === 3 && " - Payment will auto-release if passed"}
            </span>
          </div>
        </div>
      )}

      {/* Completed Message */}
      {currentStep > defaultSteps.length && (
        <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <div>
              <div className="font-bold text-green-400 font-poppins">Transaction Complete!</div>
              <div className="text-sm text-text-secondary font-nunito mt-1">
                Payment has been released and dataset access granted.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Details (Expandable) */}
      <details className="mt-4">
        <summary className="text-sm text-accent-cyan hover:text-accent-violet cursor-pointer font-semibold font-poppins">
          View Detailed Timeline
        </summary>
        <div className="mt-3 space-y-2">
          {defaultSteps.map((step, index) => (
            step.status !== 'pending' && (
              <div key={step.id} className="flex items-center justify-between text-xs bg-white/5 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  {getStepIcon(step)}
                  <span className="text-white font-nunito">{step.label}</span>
                </div>
                <div className="text-right">
                  {step.timestamp && (
                    <div className="text-text-secondary font-nunito">{step.timestamp}</div>
                  )}
                  {step.txHash && (
                    <code className="text-accent-cyan font-mono">{step.txHash}</code>
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      </details>
    </div>
  );
};

export default PaymentFlowTracker;
