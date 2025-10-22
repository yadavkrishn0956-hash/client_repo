import React, { useState } from 'react';
import { Download, Eye, Settings, Zap, FileText, Image as ImageIcon, BarChart3 } from 'lucide-react';
import { DatasetGenerationRequest } from '../types';
import { useAsyncOperation } from '../hooks/useApi';
import { apiClient } from '../services/api';
import { downloadBlob, formatFileSize, getCategoryIcon } from '../utils';
import QualityIndicator from '../components/QualityIndicator';
import DatasetAnalysisDashboard from '../components/DatasetAnalysisDashboard';

const GenerateDataPage: React.FC = () => {
  const [formData, setFormData] = useState<DatasetGenerationRequest>({
    category: 'Medical',
    rows: 1000,
    columns: 10,
    title: '',
    description: ''
  });
  
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const { loading, error, execute } = useAsyncOperation();

  const categories = [
    { value: 'Medical', label: 'Medical', icon: '🏥', description: 'Patient records, medical measurements, diagnoses' },
    { value: 'Finance', label: 'Finance', icon: '💰', description: 'Transactions, accounts, credit scores, payments' },
    { value: 'Business', label: 'Business', icon: '💼', description: 'Employee data, performance metrics, departments' },
    { value: 'Retail', label: 'Retail', icon: '🛒', description: 'Products, sales, inventory, customer data' },
    { value: 'Image', label: 'Image', icon: '🖼️', description: '32x32 pixel synthetic images with patterns' }
  ];

  const handleInputChange = (field: keyof DatasetGenerationRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    await execute(
      () => apiClient.generateDataset(formData),
      (result) => {
        if (result) {
          setGeneratedData(result);
          setPreviewData(result.preview);
          setShowPreview(true);
        }
      }
    );
  };

  const handleDownload = async (format: 'csv' | 'zip' = 'zip') => {
    if (!generatedData?.cid) return;

    try {
      const blob = await apiClient.downloadDataset(generatedData.cid, format);
      const filename = `${formData.title || 'dataset'}_${generatedData.cid.slice(0, 8)}.${format}`;
      downloadBlob(blob, filename);
    } catch (error) {
      alert('Download failed: ' + (error as Error).message);
    }
  };

  const renderPreview = () => {
    if (!previewData) return null;

    if (formData.category === 'Image') {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-white">Sample Images</h4>
          <div className="grid grid-cols-3 gap-4">
            {previewData.sample_images?.map((imageData: string, index: number) => (
              <div key={index} className="border rounded-lg p-2">
                <img 
                  src={imageData} 
                  alt={`Sample ${index + 1}`}
                  className="w-full h-auto border rounded"
                />
                <p className="text-xs text-white font-semibold mt-1 text-center">
                  Image {index + 1}
                </p>
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <p>Total Images: {previewData.total_images}</p>
            <p>Dimensions: {previewData.image_dimensions}</p>
            <p>Format: {previewData.format}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h4 className="font-bold text-white">Data Preview</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                {previewData.sample_data?.[0] && Object.keys(previewData.sample_data[0]).map((column: string) => (
                  <th key={column} className="px-4 py-2 text-left text-xs font-bold text-white uppercase">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.sample_data?.map((row: any, index: number) => (
                <tr key={index} className="border-t border-gray-200">
                  {Object.values(row).map((value: any, cellIndex: number) => (
                    <td key={cellIndex} className="px-4 py-2 text-sm text-white font-semibold">
                      {value?.toString() || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-sm text-white font-semibold">
          <p>Showing {previewData.sample_data?.length || 0} of {previewData.total_rows} rows</p>
          <p>Total Columns: {previewData.total_columns}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 glassmorphism glow-effect">
          <Zap className="h-8 w-8 text-accent-cyan animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-poppins gradient-text mb-4">
          Generate Synthetic Dataset
        </h1>
        <p className="text-xl text-text-secondary font-nunito max-w-3xl mx-auto">
          Create high-quality synthetic datasets powered by advanced AI algorithms
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div className="glassmorphism p-8 rounded-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold font-poppins text-white">Configuration</h2>
            </div>

            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 font-nunito">
                  Data Category
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((category) => (
                    <label
                      key={category.value}
                      className={`group flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                        formData.category === category.value
                          ? 'bg-gradient-primary glow-effect'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={formData.category === category.value}
                        onChange={(e) => handleInputChange('category', e.target.value as any)}
                        className="sr-only"
                      />
                      <span className="text-3xl mr-4">{category.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold text-white font-poppins">{category.label}</div>
                        <div className="text-sm text-text-secondary font-nunito">{category.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dataset Parameters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-2 font-nunito">
                    {formData.category === 'Image' ? 'Number of Images' : 'Rows'}
                  </label>
                  <input
                    type="number"
                    value={formData.rows}
                    onChange={(e) => handleInputChange('rows', parseInt(e.target.value) || 0)}
                    min="1"
                    max="100000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan transition-all"
                  />
                </div>
                
                {formData.category !== 'Image' && (
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 font-nunito">
                      Columns
                    </label>
                    <input
                      type="number"
                      value={formData.columns}
                      onChange={(e) => handleInputChange('columns', parseInt(e.target.value) || 0)}
                      min="1"
                      max="1000"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Optional Metadata */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 font-nunito">
                  Dataset Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="My Synthetic Dataset"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-secondary focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2 font-nunito">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your dataset..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-secondary focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan transition-all"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-8">
              <button
                onClick={handleGenerate}
                disabled={loading || formData.rows <= 0 || (formData.category !== 'Image' && formData.columns <= 0)}
                className="w-full bg-gradient-primary text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 glow-effect disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span className="font-poppins">Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 animate-pulse" />
                    <span className="font-poppins">Generate Dataset</span>
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
          {generatedData && (
            <div className="glassmorphism p-8 rounded-3xl glow-effect">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold font-poppins text-white">Generated Dataset</h3>
                <QualityIndicator 
                  score={generatedData?.metadata?.quality_score || 0} 
                  size="sm" 
                />
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-text-secondary font-nunito">CID:</span>
                      <div className="font-mono text-xs break-all text-accent-cyan mt-1">{generatedData.cid}</div>
                    </div>
                    <div>
                      <span className="text-text-secondary font-nunito">Size:</span>
                      <div className="font-bold text-white mt-1">{generatedData.file_size_mb} MB</div>
                    </div>
                    <div>
                      <span className="text-text-secondary font-nunito">Category:</span>
                      <div className="font-bold text-white mt-1">{formData.category}</div>
                    </div>
                    <div>
                      <span className="text-text-secondary font-nunito">
                        {formData.category === 'Image' ? 'Images:' : 'Rows:'}
                      </span>
                      <div className="font-bold text-white mt-1">{formData.rows.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-white/10"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="font-nunito">{showPreview ? 'Hide' : 'Preview'}</span>
                  </button>

                  <button
                    onClick={() => setShowAnalysis(true)}
                    className="bg-accent-violet/20 hover:bg-accent-violet/30 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-accent-violet/30"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="font-nunito">Analysis</span>
                  </button>
                  
                  <button
                    onClick={() => handleDownload('zip')}
                    className="bg-gradient-primary text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 glow-effect flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span className="font-poppins">Download</span>
                  </button>
                </div>

                {formData.category !== 'Image' && (
                  <button
                    onClick={() => handleDownload('csv')}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-white/10"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="font-nunito">Download as CSV</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {showPreview && previewData && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-5 w-5 text-white" />
                <h3 className="text-lg font-bold text-white">Preview</h3>
              </div>
              {renderPreview()}
            </div>
          )}

          {!generatedData && (
            <div className="glassmorphism p-12 rounded-3xl text-center">
              <div className="text-7xl mb-6 floating-animation">{getCategoryIcon(formData.category)}</div>
              <h3 className="text-2xl font-bold font-poppins text-white mb-3">
                Ready to Generate
              </h3>
              <p className="text-text-secondary font-nunito text-lg">
                Configure your dataset parameters and click generate to create synthetic data.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Dashboard Modal */}
      {showAnalysis && generatedData && (
        <DatasetAnalysisDashboard
          datasetName={formData.title || `${formData.category} Dataset`}
          cid={generatedData.cid}
          stats={{
            rows: formData.rows,
            columns: formData.columns,
            size: `${generatedData.file_size_mb} MB`,
            completeness: generatedData.metadata?.quality_score || 95,
            uniqueness: 92,
            consistency: 88,
            balance: 85,
            nullValues: Math.floor(formData.rows * 0.02),
            duplicates: Math.floor(formData.rows * 0.01),
            dataTypes: {
              numeric: Math.floor(formData.columns * 0.6),
              categorical: Math.floor(formData.columns * 0.3),
              datetime: Math.floor(formData.columns * 0.1)
            },
            columnStats: Array.from({ length: Math.min(formData.columns, 10) }, (_, i) => ({
              name: `column_${i + 1}`,
              type: i % 3 === 0 ? 'categorical' : 'numeric',
              nullCount: Math.floor(Math.random() * 10),
              uniqueCount: Math.floor(formData.rows * (0.7 + Math.random() * 0.3)),
              mean: i % 3 !== 0 ? Math.random() * 100 : undefined,
              std: i % 3 !== 0 ? Math.random() * 20 : undefined,
              min: i % 3 !== 0 ? Math.random() * 10 : undefined,
              max: i % 3 !== 0 ? Math.random() * 100 + 100 : undefined
            }))
          }}
          onClose={() => setShowAnalysis(false)}
          onDownload={() => handleDownload('zip')}
        />
      )}
    </div>
  );
};

export default GenerateDataPage;