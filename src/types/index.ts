// Dataset types
export interface DatasetMetadata {
  cid: string;
  title: string;
  category: 'Medical' | 'Finance' | 'Business' | 'Retail' | 'Image';
  uploader: string;
  timestamp: string;
  quality_score: number;
  rows?: number;
  columns?: number;
  file_size: number;
  price: number;
  description: string;
  tags: string[];
  quality_color?: string;
}

// Quality assessment types
export interface QualityMetrics {
  completeness: number;
  statistical_consistency: number;
  class_balance: number;
  duplicates: number;
  outliers: number;
  schema_match: number;
}

export interface QualityAssessment {
  overall_score: number;
  metrics: QualityMetrics;
  explanation: string[];
  recommendations: string[];
}

// Transaction types
export interface Transaction {
  tx_id: string;
  cid: string;
  buyer: string;
  seller: string;
  amount: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  escrow_released: boolean;
}

// API response types
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Dataset generation types
export interface DatasetGenerationRequest {
  category: 'Medical' | 'Finance' | 'Business' | 'Retail' | 'Image';
  rows: number;
  columns: number;
  title?: string;
  description?: string;
}

export interface DatasetPreview {
  sample_data: any[];
  total_rows: number;
  total_columns: number;
  file_size_mb: number;
}