import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, SortAsc, SortDesc, RefreshCw } from 'lucide-react';
import { DatasetMetadata } from '../types';
import { apiClient } from '../services/api';
import { downloadBlob } from '../utils';
import DatasetCard from '../components/DatasetCard';

interface FilterState {
  category: string;
  minQuality: number;
  maxPrice: number;
  search: string;
}

interface SortState {
  field: 'quality_score' | 'price' | 'timestamp' | 'title';
  direction: 'asc' | 'desc';
}

const MarketplacePage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minQuality: 0,
    maxPrice: 1000,
    search: ''
  });
  
  const [sort, setSort] = useState<SortState>({
    field: 'quality_score',
    direction: 'desc'
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  const [datasetsData, setDatasetsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch datasets with current filters
  const fetchDatasets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.listDatasets({
        category: filters.category || undefined,
        min_quality: filters.minQuality || undefined,
        max_price: filters.maxPrice || undefined,
        search: filters.search || undefined,
        limit: 50
      });
      setDatasetsData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiClient.getCategories();
        setCategories(response?.categories || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Fetch datasets when filters change
  useEffect(() => {
    fetchDatasets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (field: keyof FilterState, value: string | number) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSortChange = (field: SortState['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleDownload = async (cid: string) => {
    try {
      const blob = await apiClient.downloadDataset(cid, 'zip');
      const filename = `dataset_${cid.slice(0, 8)}.zip`;
      downloadBlob(blob, filename);
    } catch (error) {
      alert('Download failed: ' + (error as Error).message);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minQuality: 0,
      maxPrice: 1000,
      search: ''
    });
  };

  // Sort datasets locally
  const sortedDatasets = React.useMemo(() => {
    if (!datasetsData?.datasets) return [];
    
    const datasets = [...datasetsData.datasets];
    return datasets.sort((a, b) => {
      let aValue = a[sort.field];
      let bValue = b[sort.field];
      
      if (sort.field === 'timestamp') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [datasetsData?.datasets, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-poppins gradient-text">Dataset Marketplace</h1>
          <p className="text-text-secondary mt-2 font-nunito text-lg">
            Discover and purchase high-quality synthetic datasets
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-3 glassmorphism rounded-xl hover:bg-white/20 transition-all"
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? <List className="h-5 w-5 text-accent-cyan" /> : <Grid className="h-5 w-5 text-accent-cyan" />}
          </button>
          
          <button
            onClick={() => fetchDatasets()}
            className="p-3 glassmorphism rounded-xl hover:bg-white/20 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 text-accent-violet ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glassmorphism p-6 rounded-3xl">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent-cyan" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search datasets by title, description, or tags..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-secondary focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan transition-all font-nunito"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-white/10"
          >
            <Filter className="h-5 w-5 text-accent-violet" />
            <span className="font-nunito">Filters</span>
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2 font-nunito">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan transition-all"
                >
                  <option value="" className="bg-secondary">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-secondary">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2 font-nunito">
                  Min Quality Score
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minQuality}
                  onChange={(e) => handleFilterChange('minQuality', parseInt(e.target.value))}
                  className="w-full accent-accent-cyan"
                />
                <div className="text-sm text-accent-cyan mt-2 font-semibold font-nunito">{filters.minQuality}%</div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2 font-nunito">
                  Max Price
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                  className="w-full accent-accent-violet"
                />
                <div className="text-sm text-accent-violet mt-2 font-semibold font-nunito">
                  ${filters.maxPrice === 1000 ? '1000+' : filters.maxPrice}
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-white/10"
                >
                  <span className="font-nunito">Clear Filters</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sort Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glassmorphism p-4 rounded-2xl">
        <div className="flex items-center flex-wrap gap-3">
          <span className="text-sm text-white font-bold font-nunito">Sort by:</span>
          {[
            { field: 'quality_score' as const, label: 'Quality' },
            { field: 'price' as const, label: 'Price' },
            { field: 'timestamp' as const, label: 'Date' },
            { field: 'title' as const, label: 'Title' }
          ].map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSortChange(field)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                sort.field === field
                  ? 'bg-gradient-primary text-white glow-effect'
                  : 'text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="font-nunito">{label}</span>
              {sort.field === field && (
                sort.direction === 'desc' ? 
                  <SortDesc className="h-4 w-4" /> : 
                  <SortAsc className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>

        <div className="text-sm font-semibold font-nunito">
          {loading ? (
            <span className="text-accent-cyan">Loading...</span>
          ) : (
            <span className="text-white">{sortedDatasets.length} <span className="text-text-secondary">datasets found</span></span>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="glassmorphism p-6 rounded-2xl border border-red-500/30 bg-red-500/10">
          <div className="text-red-300 font-nunito">
            Failed to load datasets: {error}
          </div>
          <button
            onClick={() => fetchDatasets()}
            className="mt-3 text-accent-cyan hover:text-accent-violet font-semibold text-sm transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="glassmorphism p-6 rounded-3xl animate-pulse">
              <div className="h-6 bg-white/10 rounded-xl w-3/4 mb-3"></div>
              <div className="h-4 bg-white/10 rounded-xl w-1/2 mb-6"></div>
              <div className="h-24 bg-white/10 rounded-xl mb-6"></div>
              <div className="h-10 bg-white/10 rounded-xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Dataset Grid/List */}
      {!loading && sortedDatasets.length > 0 && (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {sortedDatasets.map((dataset: DatasetMetadata) => (
            <DatasetCard
              key={dataset.cid}
              dataset={dataset}
              onDownload={dataset.price === 0 ? handleDownload : undefined}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && sortedDatasets.length === 0 && (
        <div className="glassmorphism p-16 rounded-3xl text-center">
          <div className="text-7xl mb-6 floating-animation">🔍</div>
          <h3 className="text-2xl font-bold font-poppins text-white mb-3">
            No datasets found
          </h3>
          <p className="text-text-secondary mb-6 font-nunito text-lg">
            Try adjusting your search criteria or filters to find more datasets.
          </p>
          <button
            onClick={clearFilters}
            className="bg-gradient-primary text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 glow-effect"
          >
            <span className="font-poppins">Clear all filters</span>
          </button>
        </div>
      )}

      {/* Load More (if pagination is needed) */}
      {datasetsData?.has_more && (
        <div className="text-center">
          <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 border border-white/10">
            <span className="font-nunito">Load More Datasets</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;