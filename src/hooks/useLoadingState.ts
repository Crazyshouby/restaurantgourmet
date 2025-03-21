
import { useState, useCallback } from 'react';

export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const startLoading = useCallback((message?: string) => {
    setIsLoading(true);
    if (message) {
      setLoadingMessage(message);
    }
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage(null);
  }, []);

  const withLoading = useCallback(async <T,>(
    promiseFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      startLoading(message);
      return await promiseFn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading
  };
}
