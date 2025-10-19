import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Database, DollarSign, Download, Heart, Building2, ShoppingCart, Image, Activity, Star, Shield, Zap } from 'lucide-react';
import { DatasetMetadata } from '../types';
import QualityIndicator from './QualityIndicator';

interface DatasetCardProps {
  dataset: DatasetMetadata;
  showPurchaseButton?: boolean;
  onDownload?: (cid: string) => void;
}

const DatasetCard: React.FC<DatasetCardProps> = ({ 
  dataset, 
  showPurchaseButton = true,
  onDownload 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Medical: Heart,
      Finance: DollarSign,
      Business: Building2,
      Retail: ShoppingCart,
      Image: Image
    };
    const IconComponent = icons[category] || Activity;
    return <IconComponent className="h-5 w-5 text-white" />;
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-accent-cyan';
    if (score >= 70) return 'text-accent-violet';
    return 'text-yellow-400';
  };

  const getQualityBadge = (score: number) => {
    if (score >= 90) return { text: 'Premium', color: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30' };
    if (score >= 70) return { text: 'Verified', color: 'bg-accent-violet/20 text-accent-violet border-accent-violet/30' };
    return { text: 'Standard', color: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' };
  };

  const qualityBadge = getQualityBadge(dataset.quality_score);

  return (
    <div className="group glassmorphism p-6 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 glow-effect h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0">
            {getCategoryIcon(dataset.category)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold font-poppins text-white line-clamp-2 leading-tight">
              {dataset.title}
            </h3>
            <span className="text-xs text-text-secondary font-nunito">{dataset.category}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className={`px-2 py-1 rounded-full border text-xs font-medium ${qualityBadge.color} whitespace-nowrap`}>
            {qualityBadge.text}
          </div>
          <div className="flex items-center">
            <Star className={`h-3 w-3 mr-1 ${getQualityColor(dataset.quality_score)}`} fill="currentColor" />
            <span className={`text-xs font-semibold ${getQualityColor(dataset.quality_score)}`}>
              {dataset.quality_score.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-text-secondary text-xs mb-4 line-clamp-2 font-nunito leading-relaxed">
        {dataset.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="flex items-center space-x-1 text-text-secondary overflow-hidden">
          <Database className="h-3 w-3 text-accent-cyan flex-shrink-0" />
          <span className="font-nunito truncate">{dataset.rows?.toLocaleString() || 'N/A'} rows</span>
        </div>
        <div className="flex items-center space-x-1 text-text-secondary overflow-hidden">
          <Database className="h-3 w-3 text-accent-violet flex-shrink-0" />
          <span className="font-nunito truncate">{dataset.columns || 'N/A'} cols</span>
        </div>
        <div className="flex items-center space-x-1 text-text-secondary overflow-hidden">
          <User className="h-3 w-3 text-accent-cyan flex-shrink-0" />
          <span className="truncate font-nunito">{dataset.uploader.slice(0, 8)}...</span>
        </div>
        <div className="flex items-center space-x-1 text-text-secondary overflow-hidden">
          <Calendar className="h-3 w-3 text-accent-violet flex-shrink-0" />
          <span className="font-nunito truncate">{formatDate(dataset.timestamp)}</span>
        </div>
      </div>

      {/* Size and AI Badge */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
        <div className="text-xs text-text-secondary font-nunito">
          <span className="text-white font-semibold">{formatFileSize(dataset.file_size)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Zap className="h-3 w-3 text-accent-cyan" />
          <span className="text-xs text-accent-cyan font-nunito whitespace-nowrap">AI Verified</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {dataset.tags?.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-0.5 rounded-full text-xs font-medium truncate max-w-[100px] ${
              index === 0 ? 'bg-accent-cyan/20 text-accent-cyan' :
              'bg-accent-violet/20 text-accent-violet'
            }`}
            title={tag}
          >
            #{tag}
          </span>
        )) || <span className="text-xs text-text-secondary">No tags</span>}
        {dataset.tags && dataset.tags.length > 2 && (
          <span className="px-2 py-0.5 bg-white/5 text-text-secondary rounded-full text-xs font-medium">
            +{dataset.tags.length - 2}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xl font-bold gradient-text">${dataset.price === 0 ? 'Free' : dataset.price.toFixed(2)}</div>
            <div className="text-xs text-text-secondary font-nunito">ETH equivalent</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {dataset.price === 0 && onDownload ? (
            <button
              onClick={() => onDownload(dataset.cid)}
              className="flex-1 bg-gradient-primary text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 glow-effect flex items-center justify-center space-x-1"
            >
              <Download className="h-3 w-3" />
              <span className="font-poppins">Download</span>
            </button>
          ) : showPurchaseButton ? (
            <Link
              to={`/purchase/${dataset.cid}`}
              className="flex-1 bg-gradient-primary text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 glow-effect flex items-center justify-center space-x-1"
            >
              <Zap className="h-3 w-3" />
              <span className="font-poppins whitespace-nowrap">{dataset.price === 0 ? 'Get' : 'Buy'}</span>
            </Link>
          ) : null}
          
          <Link
            to={`/dataset/${dataset.cid}`}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border border-white/10"
          >
            <span className="font-nunito">Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DatasetCard;
