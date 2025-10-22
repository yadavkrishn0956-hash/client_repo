import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Database, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Eye,
  X,
  Activity,
  Layers,
  Hash,
  Percent
} from 'lucide-react';

interface DatasetStats {
  rows: number;
  columns: number;
  size: string;
  completeness: number;
  uniqueness: number;
  consistency: number;
  balance: number;
  nullValues: number;
  duplicates: number;
  dataTypes: { [key: string]: number };
  columnStats: Array<{
    name: string;
    type: string;
    nullCount: number;
    uniqueCount: number;
    mean?: number;
    std?: number;
    min?: number;
    max?: number;
  }>;
}

interface DatasetAnalysisDashboardProps {
  datasetName: string;
  cid: string;
  stats: DatasetStats;
  onClose: () => void;
  onDownload?: () => void;
}

const DatasetAnalysisDashboard: React.FC<DatasetAnalysisDashboardProps> = ({
  datasetName,
  cid,
  stats,
  onClose,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'columns' | 'quality'>('overview');

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getQualityBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const overallScore = Math.round(
    (stats.completeness + stats.uniqueness + stats.consistency + stats.balance) / 4
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="max-w-6xl w-full bg-secondary border border-white/20 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-primary p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-poppins">{datasetName}</h2>
              <p className="text-sm text-white/80 font-mono mt-1">CID: {cid.slice(0, 20)}...</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-white/5">
          {[
            { id: 'overview', label: 'Overview', icon: Database },
            { id: 'columns', label: 'Column Analysis', icon: Layers },
            { id: 'quality', label: 'Quality Metrics', icon: CheckCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-accent-cyan bg-white/5'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-poppins">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className={`${getQualityBg(overallScore)} border rounded-xl p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white font-poppins mb-2">Overall Quality Score</h3>
                    <p className="text-sm text-text-secondary font-nunito">
                      Based on completeness, uniqueness, consistency, and balance
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getQualityColor(overallScore)} font-poppins`}>
                      {overallScore}
                    </div>
                    <div className="text-sm text-text-secondary font-nunito mt-1">out of 100</div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="h-5 w-5 text-accent-cyan" />
                    <span className="text-sm text-text-secondary font-nunito">Total Rows</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-poppins">
                    {stats.rows.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Layers className="h-5 w-5 text-accent-violet" />
                    <span className="text-sm text-text-secondary font-nunito">Columns</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-poppins">
                    {stats.columns}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-text-secondary font-nunito">File Size</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-poppins">
                    {stats.size}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Hash className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-text-secondary font-nunito">Duplicates</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-poppins">
                    {stats.duplicates}
                  </div>
                </div>
              </div>

              {/* Data Types Distribution */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white font-poppins mb-4 flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-accent-cyan" />
                  <span>Data Types Distribution</span>
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.dataTypes).map(([type, count]) => {
                    const percentage = (count / stats.columns) * 100;
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white font-nunito capitalize">{type}</span>
                          <span className="text-sm text-text-secondary font-nunito">
                            {count} columns ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quality Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary font-nunito">Completeness</span>
                    <span className={`text-lg font-bold ${getQualityColor(stats.completeness)} font-poppins`}>
                      {stats.completeness}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stats.completeness >= 80 ? 'bg-green-400' : stats.completeness >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                      style={{ width: `${stats.completeness}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary font-nunito">Uniqueness</span>
                    <span className={`text-lg font-bold ${getQualityColor(stats.uniqueness)} font-poppins`}>
                      {stats.uniqueness}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stats.uniqueness >= 80 ? 'bg-green-400' : stats.uniqueness >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                      style={{ width: `${stats.uniqueness}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary font-nunito">Consistency</span>
                    <span className={`text-lg font-bold ${getQualityColor(stats.consistency)} font-poppins`}>
                      {stats.consistency}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stats.consistency >= 80 ? 'bg-green-400' : stats.consistency >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                      style={{ width: `${stats.consistency}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary font-nunito">Balance</span>
                    <span className={`text-lg font-bold ${getQualityColor(stats.balance)} font-poppins`}>
                      {stats.balance}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stats.balance >= 80 ? 'bg-green-400' : stats.balance >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                      style={{ width: `${stats.balance}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Column Analysis Tab */}
          {activeTab === 'columns' && (
            <div className="space-y-4">
              <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-4">
                <p className="text-sm text-white font-nunito">
                  Detailed statistics for each column in your dataset
                </p>
              </div>

              {stats.columnStats.map((col, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white font-poppins">{col.name}</h4>
                        <span className="text-xs text-text-secondary font-mono">{col.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-right">
                        <div className="text-text-secondary font-nunito">Unique</div>
                        <div className="text-white font-bold">{col.uniqueCount}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-text-secondary font-nunito">Nulls</div>
                        <div className={`font-bold ${col.nullCount > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {col.nullCount}
                        </div>
                      </div>
                    </div>
                  </div>

                  {col.type === 'numeric' && col.mean !== undefined && (
                    <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t border-white/10">
                      <div>
                        <div className="text-xs text-text-secondary font-nunito">Mean</div>
                        <div className="text-sm text-white font-bold">{col.mean.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary font-nunito">Std Dev</div>
                        <div className="text-sm text-white font-bold">{col.std?.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary font-nunito">Min</div>
                        <div className="text-sm text-white font-bold">{col.min?.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary font-nunito">Max</div>
                        <div className="text-sm text-white font-bold">{col.max?.toFixed(2)}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quality Metrics Tab */}
          {activeTab === 'quality' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Completeness */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <h3 className="text-lg font-bold text-white font-poppins">Completeness</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary font-nunito">Score</span>
                      <span className={`text-2xl font-bold ${getQualityColor(stats.completeness)} font-poppins`}>
                        {stats.completeness}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary font-nunito">Null Values</span>
                      <span className="text-white font-bold">{stats.nullValues}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary font-nunito">Complete Rows</span>
                      <span className="text-white font-bold">{stats.rows - stats.nullValues}</span>
                    </div>
                  </div>
                </div>

                {/* Uniqueness */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Hash className="h-6 w-6 text-blue-400" />
                    <h3 className="text-lg font-bold text-white font-poppins">Uniqueness</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary font-nunito">Score</span>
                      <span className={`text-2xl font-bold ${getQualityColor(stats.uniqueness)} font-poppins`}>
                        {stats.uniqueness}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary font-nunito">Duplicates</span>
                      <span className="text-white font-bold">{stats.duplicates}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary font-nunito">Unique Rows</span>
                      <span className="text-white font-bold">{stats.rows - stats.duplicates}</span>
                    </div>
                  </div>
                </div>

                {/* Consistency */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                    <h3 className="text-lg font-bold text-white font-poppins">Consistency</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary font-nunito">Score</span>
                      <span className={`text-2xl font-bold ${getQualityColor(stats.consistency)} font-poppins`}>
                        {stats.consistency}%
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary font-nunito">
                      Statistical consistency across data distributions
                    </p>
                  </div>
                </div>

                {/* Balance */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Percent className="h-6 w-6 text-yellow-400" />
                    <h3 className="text-lg font-bold text-white font-poppins">Balance</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary font-nunito">Score</span>
                      <span className={`text-2xl font-bold ${getQualityColor(stats.balance)} font-poppins`}>
                        {stats.balance}%
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary font-nunito">
                      Class distribution balance in categorical features
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-accent-violet/10 border border-accent-violet/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white font-poppins mb-4 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-accent-violet" />
                  <span>Recommendations</span>
                </h3>
                <ul className="space-y-2">
                  {stats.nullValues > 0 && (
                    <li className="text-sm text-text-secondary font-nunito flex items-start space-x-2">
                      <span className="text-accent-violet">•</span>
                      <span>Consider handling {stats.nullValues} null values for better data quality</span>
                    </li>
                  )}
                  {stats.duplicates > 0 && (
                    <li className="text-sm text-text-secondary font-nunito flex items-start space-x-2">
                      <span className="text-accent-violet">•</span>
                      <span>Remove {stats.duplicates} duplicate rows to improve uniqueness</span>
                    </li>
                  )}
                  {overallScore >= 80 && (
                    <li className="text-sm text-green-400 font-nunito flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 mt-0.5" />
                      <span>Excellent quality! Dataset is ready for production use</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 p-6 bg-white/5 flex items-center justify-between">
          <div className="text-sm text-text-secondary font-nunito">
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onDownload}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
            >
              <Download className="h-5 w-5" />
              <span className="font-poppins">Download Dataset</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-primary text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 glow-effect"
            >
              <span className="font-poppins">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetAnalysisDashboard;
