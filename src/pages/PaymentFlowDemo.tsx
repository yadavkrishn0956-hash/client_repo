import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentFlowTracker from '../components/PaymentFlowTracker';

const PaymentFlowDemo: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-text-secondary hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-nunito">Back</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4 font-poppins">
          Payment Flow Tracker Demo
        </h1>
        <p className="text-xl text-text-secondary font-nunito">
          Visual step-by-step payment process tracking
        </p>
      </div>

      {/* Payment Flow Tracker */}
      <PaymentFlowTracker currentStep={currentStep} amount={0.5} currency="MATIC" />

      {/* Step Controls */}
      <div className="mt-8 glassmorphism p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4 font-poppins">Demo Controls</h3>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
          >
            Previous Step
          </button>

          <div className="text-center">
            <div className="text-sm text-text-secondary font-nunito">Current Step</div>
            <div className="text-3xl font-bold text-white font-poppins">{currentStep} / 4</div>
          </div>

          <button
            onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
            disabled={currentStep === 5}
            className="px-6 py-3 bg-gradient-primary hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
          >
            Next Step
          </button>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`py-2 rounded-lg font-semibold transition-all ${
                currentStep === step
                  ? 'bg-gradient-primary text-white'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10'
              }`}
            >
              Step {step}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Explanation */}
      <div className="mt-8 bg-accent-cyan/10 border border-accent-cyan/30 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-3 font-poppins">✨ Features</h3>
        <ul className="space-y-2 text-sm text-text-secondary font-nunito">
          <li className="flex items-start space-x-2">
            <span className="text-accent-cyan">✓</span>
            <span>Visual progress bar showing current step</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-accent-cyan">✓</span>
            <span>Color-coded status indicators (green=complete, blue=current, gray=pending)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-accent-cyan">✓</span>
            <span>Timestamps for completed steps</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-accent-cyan">✓</span>
            <span>Transaction hashes with explorer links</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-accent-cyan">✓</span>
            <span>Current status description</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-accent-cyan">✓</span>
            <span>Next step preview</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-accent-cyan">✓</span>
            <span>Expandable detailed timeline</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentFlowDemo;
