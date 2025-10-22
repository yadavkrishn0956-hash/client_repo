import {
  APIResponse,
  DatasetMetadata,
  DatasetGenerationRequest,
  Transaction,
  QualityAssessment
} from '../types';

// Use environment variable or fallback to production backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://server-repo-three.vercel.app' 
    : 'http://localhost:8000');

console.log('API Configuration:', {
  API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL
});

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    console.log('APIClient initialized with baseURL:', this.baseURL);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('Making request to:', url);

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('Fetching:', url, 'with options:', defaultOptions);
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          response.status,
          errorData.detail || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // Network or other errors
      throw new APIError(0, `Network error: ${(error as Error).message}`);
    }
  }

  // Dataset Generation APIs
  async generateDataset(request: DatasetGenerationRequest) {
    const response = await this.request<{
      cid: string;
      preview: any;
      metadata: any;
      file_size_mb: number;
    }>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.data;
  }

  async getDatasetPreview(cid: string) {
    return this.request<any>(`/api/preview/${cid}`);
  }

  async downloadDataset(cid: string, format: string = 'zip', buyer?: string) {
    const params = new URLSearchParams({ format });
    if (buyer) params.append('buyer', buyer);

    const url = `${this.baseURL}/api/download/${cid}?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new APIError(response.status, 'Download failed');
    }

    return response.blob();
  }

  async getDatasetFormats(cid: string) {
    return this.request<{ formats: string[] }>(`/api/formats/${cid}`);
  }

  async getDatasetStats(cid: string) {
    return this.request<any>(`/api/stats/${cid}`);
  }

  // Marketplace APIs
  async uploadDataset(formData: FormData) {
    return this.request<{
      cid: string;
      quality_assessment: QualityAssessment;
      metadata: any;
      file_size_mb: number;
      quality_color: string;
    }>('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async listDatasets(params: {
    category?: string;
    min_quality?: number;
    max_price?: number;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<{
      datasets: DatasetMetadata[];
      total_count: number;
      limit: number;
      offset: number;
      has_more: boolean;
    }>(`/api/datasets?${searchParams}`);
    return response.data;
  }

  async getDatasetMetadata(cid: string) {
    const response = await this.request<DatasetMetadata>(`/api/metadata/${cid}`);
    return response.data;
  }

  async getCategories() {
    const response = await this.request<{ categories: string[] }>('/api/categories');
    return response.data;
  }

  async searchDatasets(params: {
    q: string;
    category?: string;
    min_quality?: number;
    max_price?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{
      datasets: DatasetMetadata[];
      total_count: number;
    }>(`/api/search?${searchParams}`);
  }

  async getMarketplaceStats() {
    try {
      const response = await this.request<any>('/api/stats');
      return response.data || response;
    } catch (error) {
      // Return mock data to prevent app crash
      return {
        datasets: { total_count: 0, category_distribution: {}, quality_distribution: {} },
        transactions: { completed_transactions: 0, total_transactions: 0, total_volume: 0 },
        storage: {}
      };
    }
  }

  // Transaction APIs
  async initiatePurchase(cid: string, buyer: string, amount: number) {
    const response = await this.request<{
      transaction: Transaction;
      next_step: string;
      payment_instructions: string;
    }>('/api/purchase', {
      method: 'POST',
      body: JSON.stringify({ cid, buyer, amount }),
    });
    return response.data;
  }

  async completePayment(txId: string, paymentAmount: number) {
    const response = await this.request<{
      transaction: Transaction;
      download_url: string;
      access_granted: boolean;
    }>('/api/pay', {
      method: 'POST',
      body: JSON.stringify({ tx_id: txId, payment_amount: paymentAmount }),
    });
    return response.data;
  }

  async getTransaction(txId: string) {
    return this.request<{
      transaction: Transaction;
      dataset: DatasetMetadata;
    }>(`/api/transaction/${txId}`);
  }

  async getUserTransactions(user: string, status?: string) {
    const params = status ? `?status=${status}` : '';
    return this.request<{
      transactions: Transaction[];
      user: string;
      total_count: number;
    }>(`/api/transactions/user/${user}${params}`);
  }

  async getDatasetTransactions(cid: string) {
    return this.request<{
      transactions: Transaction[];
      dataset: DatasetMetadata;
      total_sales: number;
      total_revenue: number;
    }>(`/api/transactions/dataset/${cid}`);
  }

  async cancelTransaction(txId: string, reason?: string) {
    return this.request<{
      transaction: Transaction;
    }>(`/api/transaction/${txId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getUserPurchases(buyer: string) {
    return this.request<{
      purchases: (Transaction & {
        dataset_title: string;
        dataset_category: string;
        download_url: string;
        can_download: boolean;
      })[];
      buyer: string;
      total_spent: number;
    }>(`/api/purchases/${buyer}`);
  }

  async getUserSales(seller: string) {
    return this.request<{
      sales: (Transaction & {
        dataset_title: string;
        dataset_category: string;
      })[];
      seller: string;
      total_earned: number;
      unique_datasets_sold: number;
    }>(`/api/sales/${seller}`);
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; service: string }>('/health');
  }
}

// Create and export a singleton instance
export const apiClient = new APIClient();
export { APIError };