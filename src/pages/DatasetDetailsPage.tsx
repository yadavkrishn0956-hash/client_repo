import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Download, ShoppingCart, User, Calendar, Database, 
  Star, Shield, Zap, TrendingUp, BarChart3, PieChart, Activity,
  CheckCircle, AlertCircle, Info
} from 'lucide-react';
import { apiClient } from '../services/api';
import { DatasetMetadata } from '../types';

const DatasetDetailsPage: React.FC = () => {
  const { cid } = useParams<{ cid: string }>();
  const [dataset, setDataset] = useState<DatasetMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataset = async () => {
      if (!cid) return;
      
      try {
        setLoading(true);
        const data = await apiClient.getDatasetMetadata(cid);
        if (data) {
          setDataset(data);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, [cid]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-accent-cyan';
    if (score >= 70) return 'text-accent-violet';
    return 'text-yellow-400';
  };

  const getQualityBadge = (score: number) => {
    if (score >= 90) return { text: 'Premium Quality', color: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30' };
    if (score >= 70) return { text: 'Verified Quality', color: 'bg-accent-violet/20 text-accent-violet border-accent-violet/30' };
    return { text: 'Standard Quality', color: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glassmorphism p-12 rounded-3xl text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-cyan border-t-transparent mx-auto mb-4"></div>
          <p className="text-text-secondary font-nunito">Loading dataset details...</p>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glassmorphism p-12 rounded-3xl text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2 font-poppins">Dataset Not Found</h2>
          <p className="text-text-secondary font-nunito mb-6">{error || 'The requested dataset could not be found.'}</p>
          <Link to="/marketplace" className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </div>
    );
  }

  const qualityBadge = getQualityBadge(dataset.quality_score);
  const qualityMetrics = (dataset as any).quality_metrics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back Button */}
      <Link 
        to="/marketplace" 
        className="inline-flex items-center space-x-2 text-text-secondary hover:text-white transition-colors font-nunito"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Marketplace</span>
      </Link>

      {/* Header Section */}
      <div className="glassmorphism p-8 rounded-3xl">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`px-4 py-2 rounded-full border text-sm font-semibold ${qualityBadge.color}`}>
                {qualityBadge.text}
              </div>
              <div className="flex items-center">
                <Star className={`h-5 w-5 mr-1 ${getQualityColor(dataset.quality_score)}`} fill="currentColor" />
                <span className={`text-lg font-bold ${getQualityColor(dataset.quality_score)}`}>
                  {dataset.quality_score.toFixed(1)}
                </span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 font-poppins">{dataset.title}</h1>
            <p className="text-lg text-text-secondary font-nunito leading-relaxed mb-6">{dataset.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {dataset.tags?.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    index % 2 === 0 ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-accent-violet/20 text-accent-violet'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-text-secondary">
                <User className="h-4 w-4 text-accent-cyan" />
                <div>
                  <div className="text-xs">Creator</div>
                  <div className="text-white font-semibold truncate">{dataset.uploader.slice(0, 12)}...</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-text-secondary">
                <Calendar className="h-4 w-4 text-accent-violet" />
                <div>
                  <div className="text-xs">Created</div>
                  <div className="text-white font-semibold">{formatDate(dataset.timestamp)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-text-secondary">
                <Database className="h-4 w-4 text-accent-cyan" />
                <div>
                  <div className="text-xs">Size</div>
                  <div className="text-white font-semibold">{formatFileSize(dataset.file_size)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-text-secondary">
                <Shield className="h-4 w-4 text-accent-violet" />
                <div>
                  <div className="text-xs">Category</div>
                  <div className="text-white font-semibold">{dataset.category}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-2xl min-w-[280px]">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold gradient-text mb-2">
                ${dataset.price === 0 ? 'Free' : dataset.price.toFixed(2)}
              </div>
              <div className="text-sm text-text-secondary font-nunito">ETH equivalent</div>
            </div>
            
            <div className="space-y-3">
              {dataset.price === 0 ? (
                <button className="w-full bg-gradient-primary text-white py-3 rounded-xl font-bold font-poppins transition-all duration-300 transform hover:scale-105 glow-effect flex items-center justify-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Download Free</span>
                </button>
              ) : (
                <Link
                  to={`/purchase/${cid}`}
                  className="w-full bg-gradient-primary text-white py-3 rounded-xl font-bold font-poppins transition-all duration-300 transform hover:scale-105 glow-effect flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Purchase Dataset</span>
                </Link>
              )}
              
              <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
                <Zap className="h-4 w-4 text-accent-cyan" />
                <span className="font-nunito">AI Verified & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Dashboard */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Dataset Statistics */}
        <div className="glassmorphism p-6 rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="h-6 w-6 text-accent-cyan" />
            <h2 className="text-2xl font-bold text-white font-poppins">Dataset Statistics</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
              <span className="text-text-secondary font-nunito">Total Rows</span>
              <span className="text-2xl font-bold text-white">{dataset.rows?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
              <span className="text-text-secondary font-nunito">Total Columns</span>
              <span className="text-2xl font-bold text-white">{dataset.columns || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
              <span className="text-text-secondary font-nunito">File Format</span>
              <span className="text-lg font-bold text-accent-cyan">CSV</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
              <span className="text-text-secondary font-nunito">Storage</span>
              <span className="text-lg font-bold text-accent-violet">IPFS</span>
            </div>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="glassmorphism p-6 rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="h-6 w-6 text-accent-violet" />
            <h2 className="text-2xl font-bold text-white font-poppins">Quality Metrics</h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries(qualityMetrics).map(([key, value]: [string, any]) => {
              const percentage = typeof value === 'number' ? value : 0;
              const label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
              
              return (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-text-secondary font-nunito">{label}</span>
                    <span className="text-sm font-bold text-white">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quality Insights */}
      {(dataset as any).quality_explanation && (dataset as any).quality_explanation.length > 0 && (
        <div className="glassmorphism p-6 rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white font-poppins">Quality Insights</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {(dataset as any).quality_explanation.map((insight: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary font-nunito">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {(dataset as any).quality_recommendations && (dataset as any).quality_recommendations.length > 0 && (
        <div className="glassmorphism p-6 rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <Info className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white font-poppins">Recommendations</h2>
          </div>
          
          <div className="space-y-3">
            {(dataset as any).quality_recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl">
                <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary font-nunito">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      {(dataset as any).transaction_history && (dataset as any).transaction_history.length > 0 && (
        <div className="glassmorphism p-6 rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-6 w-6 text-accent-cyan" />
            <h2 className="text-2xl font-bold text-white font-poppins">Transaction History</h2>
          </div>
          
          <div className="text-center text-text-secondary font-nunito">
            <p>{(dataset as any).total_sales || 0} successful transactions</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetDetailsPage;
