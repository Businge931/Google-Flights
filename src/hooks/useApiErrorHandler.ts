import { useNotification } from './useNotification';

/**
 * Hook that provides error handling functions for API calls
 * @returns Error handling utilities
 */
export function useApiErrorHandler() {
  const { showNotification } = useNotification();

  /**
   * Handle API errors with user-friendly messages
   * @param error The error object to handle
   * @param customMessage Optional custom message to display instead of the default
   */
  const handleApiError = (error: unknown, customMessage?: string) => {
    console.error('API Error:', error);
    
    // Extract error message with fallbacks
    let errorMessage = customMessage || 'An unexpected error occurred';
    
    if (error instanceof Error) {
      errorMessage = customMessage || error.message || 'An error occurred';
    }

    // Handle network errors specifically
    if (!navigator.onLine) {
      errorMessage = 'You appear to be offline. Please check your internet connection.';
    }

    // Handle different error types
    if (error instanceof Response && error.status) {
      switch (error.status) {
        case 401:
          errorMessage = 'Authentication failed. Please try again.';
          break;
        case 403:
          errorMessage = 'You don\'t have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage = 'Server error. Please try again later.';
          break;
      }
    }

    // Show the notification to the user
    showNotification(errorMessage, 'error');
  };

  /**
   * Wrap an async function with error handling
   * @param asyncFn The async function to wrap with error handling
   * @param customMessage Optional custom error message
   * @returns A new function with built-in error handling
   */
  const withErrorHandling = <T, Args extends unknown[]>(
    asyncFn: (...args: Args) => Promise<T>,
    customMessage?: string
  ) => {
    return async (...args: Args): Promise<T | null> => {
      try {
        return await asyncFn(...args);
      } catch (error) {
        handleApiError(error, customMessage);
        return null;
      }
    };
  };

  return {
    handleApiError,
    withErrorHandling,
  };
}
