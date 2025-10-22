import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient, APIError } from '../services/api';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiOptions {
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: APIError) => void;
}

export function useApi<T>(
    apiCall: () => Promise<any>,
    options: UseApiOptions = {}
) {
    const { immediate = true, onSuccess, onError } = options;
    const apiCallRef = useRef(apiCall);
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);
    const hasExecutedRef = useRef(false);

    // Update refs on each render
    apiCallRef.current = apiCall;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;

    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: immediate,
        error: null,
    });

    const execute = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await apiCallRef.current();
            const data = response.data || response;

            setState({
                data,
                loading: false,
                error: null,
            });

            if (onSuccessRef.current) {
                onSuccessRef.current(data);
            }

            return data;
        } catch (error) {
            const errorMessage = error instanceof APIError
                ? error.message
                : 'An unexpected error occurred';

            setState({
                data: null,
                loading: false,
                error: errorMessage,
            });

            if (onErrorRef.current && error instanceof APIError) {
                onErrorRef.current(error);
            }

            throw error;
        }
    }, []);

    useEffect(() => {
        if (immediate && !hasExecutedRef.current) {
            hasExecutedRef.current = true;
            execute();
        }
    }, [immediate, execute]);

    const retry = useCallback(() => {
        execute();
    }, [execute]);

    return {
        ...state,
        execute,
        retry,
    };
}

// Specialized hooks for common operations
export function useDatasets(params?: any) {
    return useApi(() => apiClient.listDatasets(params), { immediate: false });
}

export function useDatasetMetadata(cid: string, immediate = true) {
    return useApi(() => apiClient.getDatasetMetadata(cid), { immediate });
}

export function useUserTransactions(user: string, status?: string) {
    return useApi(() => apiClient.getUserTransactions(user, status), { immediate: false });
}

export function useMarketplaceStats() {
    return useApi(() => apiClient.getMarketplaceStats());
}

// Hook for handling async operations with loading states
export function useAsyncOperation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async <T>(
        operation: () => Promise<T>,
        onSuccess?: (result: T) => void,
        onError?: (error: APIError) => void
    ): Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await operation();

            if (onSuccess) {
                onSuccess(result);
            }

            return result;
        } catch (err) {
            const errorMessage = err instanceof APIError
                ? err.message
                : 'An unexpected error occurred';

            setError(errorMessage);

            if (onError && err instanceof APIError) {
                onError(err);
            }

            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        execute,
        clearError: () => setError(null),
    };
}