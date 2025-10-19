import React, { useState, useRef } from 'react';
import { Upload, FileText, DollarSign, Tag, User, CheckCircle, AlertCircle, Heart, Building2, ShoppingCart, Image, Activity } from 'lucide-react';
import { useAsyncOperation } from '../hooks/useApi';
import { apiClient } from '../services/api';
import { formatFileSize, getCategoryIcon } from '../utils';
import QualityIndicator from '../components/QualityIndicator';

interface UploadFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  uploader: string;
  tags: string;
}

const SellDataPage: React.FC = () => {
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    category: 'Medical',
    price: 0,
    uploader: '',
    tags: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loading, error, execute } = useAsyncOperation();

  const categories = [
    { value: 'Medical', label: 'Medical', icon: Heart },
    { value: 'Finance', label: 'Finance', icon: DollarSign },
    { value: 'Business', label: 'Business', icon: Building2 },
    { value: 'Retail', label: 'Retail', icon: ShoppingCart },
    { value: 'Image', label: 'Image', icon: Image }
  ];

  const handleInputChange = (field: keyof UploadFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    if (!formData.title.trim()) {
      alert('Please enter a dataset title');
      return;
    }

    if (!formData.uploader.trim()) {
      alert('Please enter your name/address');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', selectedFile);
    uploadFormData.append('title', formData.title);
    uploadFormData.append('description', formData.description);
    uploadFormData.append('category', formData.category);
    uploadFormData.append('price', formData.price.toString());
    uploadFormData.append('uploader', formData.uploader);
    uploadFormData.append('tags', formData.tags);

    await execute(
      () => apiClient.uploadDataset(uploadFormData),
      (result) => {
        setUploadResult(result.data);
        // Reset form
        setSelectedFile(null);
        setFormData({
          title: '',
          description: '',
          category: 'Medical',
          price: 0,
          uploader: formData.uploader, // Keep uploader name
          tags: ''
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    );
  };

  const renderQualityExplanation = (assessment: any) => {
    if (!assessment) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">Quality Assessment</h4>
          <QualityIndicator score={assessment.overall_score} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Completeness:</span>
            <span className="ml-2 font-medium">{assessment.metrics.completeness.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-gray-600">Consistency:</span>
            <span className="ml-2 font-medium">{assessment.metrics.statistical_consistency.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-gray-600">Balance:</span>
            <span className="ml-2 font-medium">{assessment.metrics.class_balance.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-gray-600">Uniqueness:</span>
            <span className="ml-2 font-medium">{assessment.metrics.duplicates.toFixed(1)}%</span>
          </div>
        </div>

        {assessment.explanation && assessment.explanation.length > 0 && (
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Quality Insights:</h5>
            <ul className="space-y-1">
              {assessment.explanation.map((insight: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {assessment.recommendations && assessment.recommendations.length > 0 && (
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Recommendations:</h5>
            <ul className="space-y-1">
              {assessment.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 glassmorphism glow-effect">
          <Upload className="h-8 w-8 text-accent-violet animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-poppins gradient-text mb-4">
          Sell Your Dataset
        </h1>
        <p className="text-xl text-text-secondary font-nunito max-w-3xl mx-auto">
          Upload your dataset, get AI-powered quality assessment, and start earning
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div className="space-y-6">
          <div className="glassmorphism p-8 rounded-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold font-poppins text-white">Dataset Information</h2>
            </div>

            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 font-nunito">
                  Dataset File
                </label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    dragActive
                      ? 'border-accent-cyan bg-accent-cyan/10 glow-effect'
                      : selectedFile
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/20 hover:border-white/40 bg-white/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json,.zip"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-3">
                      <FileText className="h-16 w-16 text-green-400 mx-auto" />
                      <div className="font-bold text-white text-lg font-poppins">{selectedFile.name}</div>
                      <div className="text-sm text-text-secondary font-nunito">
                        {formatFileSize(selectedFile.size)}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-accent-cyan hover:text-accent-violet text-sm font-semibold transition-colors"
                      >
                        Change file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-16 w-16 text-text-secondary mx-auto" />
                      <div className="text-white font-nunito">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-accent-cyan hover:text-accent-violet font-bold transition-colors"
                        >
                          Click to upload
                        </button>
                        {' '}or drag and drop
                      </div>
                      <div className="text-sm text-text-secondary font-nunito">
                        CSV, JSON, or ZIP files (max 100MB)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 font-nunito">
                  Dataset Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="My Awesome Dataset"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-secondary focus:ring-2 focus:ring-accent-violet focus:border-accent-violet transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2 font-nunito">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your dataset, its contents, and potential use cases..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-secondary focus:ring-2 focus:ring-accent-violet focus:border-accent-violet transition-all"
                />
              </div>

              {/* Category and Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-2 font-nunito">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent-violet focus:border-accent-violet transition-all font-nunito"
                    style={{ color: 'white' }}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value} className="bg-secondary text-white" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2 font-nunito">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-cyan" />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-secondary focus:ring-2 focus:ring-accent-violet focus:border-accent-violet transition-all"
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-1 font-nunito">Set to 0 for free dataset</p>
                </div>
              </div>

              {/* Seller Information */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 font-nunito">
                  Your Name/Address *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-cyan" />
                  <input
                    type="text"
                    value={formData.uploader}
                    onChange={(e) => handleInputChange('uploader', e.target.value)}
                    placeholder="0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e416"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-secondary focus:ring-2 focus:ring-accent-violet focus:border-accent-violet transition-all font-mono text-sm"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 font-nunito">
                  Tags (comma-separated)
                </label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-cyan" />
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="machine learning, healthcare, synthetic"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-secondary focus:ring-2 focus:ring-accent-violet focus:border-accent-violet transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Upload Button */}
            <div className="mt-8">
              <button
                onClick={handleUpload}
                disabled={loading || !selectedFile || !formData.title.trim() || !formData.uploader.trim()}
                className="w-full bg-gradient-primary text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 glow-effect disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span className="font-poppins">Uploading & Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span className="font-poppins">Upload & Assess Quality</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-300 text-sm font-nunito">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {uploadResult && (
            <div className="glassmorphism p-8 rounded-3xl glow-effect">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <h3 className="text-2xl font-bold font-poppins text-white">Upload Successful!</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Dataset CID:</span>
                      <div className="font-mono text-xs break-all mt-1">{uploadResult.cid}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <span className="text-gray-600">File Size:</span>
                        <div className="font-medium">{uploadResult.file_size_mb} MB</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <div className="font-medium text-green-600">Listed for Sale</div>
                      </div>
                    </div>
                  </div>
                </div>

                {renderQualityExplanation(uploadResult.quality_assessment)}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Your dataset is now live!</p>
                      <p>Buyers can discover and purchase your dataset on the marketplace.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!uploadResult && (
            <div className="glassmorphism p-12 rounded-3xl text-center">
              <Activity className="h-20 w-20 text-accent-violet mx-auto mb-6 floating-animation" />
              <h3 className="text-2xl font-bold font-poppins text-white mb-3">
                Ready to Upload
              </h3>
              <p className="text-text-secondary font-nunito mb-6 text-lg">
                Select your dataset file and fill in the details to get started.
              </p>
              <div className="text-sm text-text-secondary font-nunito space-y-2">
                <p className="flex items-center justify-center space-x-2">
                  <span className="text-accent-cyan">✓</span>
                  <span>AI-powered quality assessment</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span className="text-accent-violet">✓</span>
                  <span>Automatic CID generation</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span className="text-accent-cyan">✓</span>
                  <span>Immutable storage</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span className="text-accent-violet">✓</span>
                  <span>Instant marketplace listing</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellDataPage;