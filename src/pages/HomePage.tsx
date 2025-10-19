import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShoppingCart, Upload, TrendingUp, Users, Database, Shield, Sparkles, Activity } from 'lucide-react';
import { useMarketplaceStats } from '../hooks/useApi';
import { formatNumber, formatCurrency } from '../utils';

const HomePage: React.FC = () => {
  const [demoMode, setDemoMode] = useState(false);
  const { data: stats, loading: statsLoading } = useMarketplaceStats();

  const features = [
    {
      icon: Activity,
      title: 'AI Quality Assessment',
      description: 'Automated quality scoring using machine learning metrics for data completeness, consistency, and statistical validity.',
      color: 'text-accent-cyan'
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Mock blockchain with escrow functionality ensures secure transactions and immutable dataset storage.',
      color: 'text-accent-violet'
    },
    {
      icon: Database,
      title: 'Synthetic Data Generation',
      description: 'Generate realistic datasets for Medical, Finance, Business, Retail, and Image categories with customizable parameters.',
      color: 'text-accent-cyan'
    },
    {
      icon: Zap,
      title: 'Instant Download',
      description: 'Download datasets immediately after generation or purchase with multiple format options (CSV, ZIP).',
      color: 'text-accent-violet'
    },
    {
      icon: ShoppingCart,
      title: 'Escrow Protection',
      description: 'Smart contract escrow system protects both buyers and sellers during transactions.',
      color: 'text-accent-cyan'
    },
    {
      icon: TrendingUp,
      title: 'Category Templates',
      description: 'Pre-built templates for different industries ensure realistic and relevant synthetic data generation.',
      color: 'text-accent-violet'
    }
  ];

  const quickActions = [
    {
      title: 'Generate Dataset',
      description: 'Create synthetic data with custom parameters',
      icon: Zap,
      link: '/generate',
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      title: 'Browse Market',
      description: 'Explore available datasets for purchase',
      icon: ShoppingCart,
      link: '/marketplace',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Sell Your Data',
      description: 'Upload and monetize your datasets',
      icon: Upload,
      link: '/sell',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center py-20 glassmorphism rounded-3xl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 glassmorphism glow-effect floating-animation">
            <Database className="h-10 w-10 text-accent-cyan" />
            <Sparkles className="h-6 w-6 text-accent-violet absolute -top-1 -right-1" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text font-poppins">
            Decentralized Synthetic Data Market
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 leading-relaxed text-text-secondary font-nunito max-w-3xl mx-auto">
            Generate, buy, and sell high-quality synthetic datasets with AI-powered 
            quality verification and blockchain-secured transactions. The future of 
            privacy-preserving data commerce.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-bold font-poppins transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 glow-effect"
                >
                  <Icon className="h-5 w-5" />
                  <span>{action.title}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-center space-x-4">
            <label className="flex items-center space-x-3 text-sm text-text-secondary font-nunito bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="rounded border-white/20 text-accent-cyan focus:ring-accent-cyan bg-white/10"
              />
              <span>Demo Mode (with sample data)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="glassmorphism p-10 rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-10 gradient-text font-poppins">
          Platform Statistics
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center glassmorphism p-6 rounded-2xl hover:bg-white/10 transition-all">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-2xl mx-auto mb-4 glow-effect">
              <Database className="h-7 w-7 text-white" />
            </div>
            <div className="text-4xl font-bold gradient-text font-poppins mb-2">
              {statsLoading ? '...' : formatNumber((stats as any)?.datasets?.total_count || 0)}
            </div>
            <div className="text-text-secondary font-nunito">Total Datasets</div>
          </div>
          
          <div className="text-center glassmorphism p-6 rounded-2xl hover:bg-white/10 transition-all">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-2xl mx-auto mb-4 glow-effect">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div className="text-4xl font-bold gradient-text font-poppins mb-2">
              {statsLoading ? '...' : formatNumber((stats as any)?.transactions?.completed_transactions || 0)}
            </div>
            <div className="text-text-secondary font-nunito">Completed Sales</div>
          </div>
          
          <div className="text-center glassmorphism p-6 rounded-2xl hover:bg-white/10 transition-all">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-2xl mx-auto mb-4 glow-effect">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div className="text-4xl font-bold gradient-text font-poppins mb-2">
              {statsLoading ? '...' : formatNumber((stats as any)?.transactions?.total_transactions || 0)}
            </div>
            <div className="text-text-secondary font-nunito">Total Transactions</div>
          </div>
          
          <div className="text-center glassmorphism p-6 rounded-2xl hover:bg-white/10 transition-all">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-2xl mx-auto mb-4 glow-effect">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div className="text-4xl font-bold gradient-text font-poppins mb-2">
              {statsLoading ? '...' : formatCurrency((stats as any)?.transactions?.total_volume || 0)}
            </div>
            <div className="text-text-secondary font-nunito">Total Volume</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-4xl font-bold text-white text-center mb-12 font-poppins">
          Why Choose <span className="gradient-text">Dataset Bazar</span>?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="glassmorphism p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 glow-effect">
                  <Icon className={`h-8 w-8 text-white`} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white font-poppins">
                  {feature.title}
                </h3>
                <p className="text-text-secondary font-nunito leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="glassmorphism p-12 rounded-3xl">
        <h2 className="text-4xl font-bold text-white text-center mb-12 font-poppins">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
              <span className="text-3xl font-bold text-white font-poppins">1</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-white font-poppins">Generate or Upload</h3>
            <p className="text-text-secondary font-nunito leading-relaxed">
              Create synthetic datasets using our AI generators or upload your own data for quality assessment.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
              <span className="text-3xl font-bold text-white font-poppins">2</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-white font-poppins">Quality Verification</h3>
            <p className="text-text-secondary font-nunito leading-relaxed">
              Our AI system automatically assesses data quality using multiple metrics and provides detailed scores.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
              <span className="text-3xl font-bold text-white font-poppins">3</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-white font-poppins">Secure Trading</h3>
            <p className="text-text-secondary font-nunito leading-relaxed">
              Buy and sell datasets with confidence using our blockchain-secured escrow system.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="glassmorphism p-12 rounded-3xl text-center glow-effect">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text font-poppins">
          Ready to Start Trading Data?
        </h2>
        <p className="text-xl md:text-2xl mb-10 text-text-secondary font-nunito max-w-2xl mx-auto">
          Join the future of decentralized data commerce today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/generate"
            className="bg-gradient-primary text-white px-10 py-4 rounded-2xl font-bold font-poppins transition-all duration-300 transform hover:scale-105 glow-effect"
          >
            Start Generating
          </Link>
          <Link
            to="/marketplace"
            className="bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white px-10 py-4 rounded-2xl font-bold font-poppins transition-all duration-300 transform hover:scale-105"
          >
            Explore Market
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;