import { useState, useEffect, useCallback } from "react";
import type { AirportOption } from "../types/airport";
import { performAirportSearch } from "../components/features/flightSearch/SearchForm/utils";
import { useNotification } from "./useNotification";

/**
 * Custom hook for airport search with built-in debouncing
 * @param debounceMs Debounce time in milliseconds
 * @returns Search functions and state
 */
export function useAirportSearch(debounceMs = 300) {
  const { showNotification } = useNotification();
  const [originQuery, setOriginQuery] = useState("");
  const [originOptions, setOriginOptions] = useState<AirportOption[]>([]);
  const [originLoading, setOriginLoading] = useState(false);

  const [destinationQuery, setDestinationQuery] = useState("");
  const [destinationOptions, setDestinationOptions] = useState<AirportOption[]>([]);
  const [destinationLoading, setDestinationLoading] = useState(false);
  
  // Memoize the error handler to prevent it from causing re-renders
  const handleApiError = useCallback((error: unknown, customMessage?: string) => {
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
    
    showNotification(errorMessage, 'error');
  }, [showNotification]);

  // State to track whether we've shown an error for the current query
  const [originQueryErrorShown, setOriginQueryErrorShown] = useState(false);
  const [destinationQueryErrorShown, setDestinationQueryErrorShown] = useState(false);

  // Reset error flags when query changes
  useEffect(() => {
    setOriginQueryErrorShown(false);
  }, [originQuery]);

  useEffect(() => {
    setDestinationQueryErrorShown(false);
  }, [destinationQuery]);

  // Debounced origin search
  useEffect(() => {
    if (originQuery.length < 2 || originQueryErrorShown) {
      setOriginOptions([]);
      setOriginLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await performAirportSearch(
          originQuery,
          setOriginLoading,
          setOriginOptions,
          "origin"
        );
      } catch (error) {
        // Set the error shown flag to prevent further retries for this query
        setOriginQueryErrorShown(true);
        setOriginLoading(false);
        handleApiError(
          error,
          "Could not retrieve airport suggestions. Please try again later."
        );
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [originQuery, debounceMs, handleApiError, originQueryErrorShown]);

  // Debounced destination search
  useEffect(() => {
    if (destinationQuery.length < 2 || destinationQueryErrorShown) {
      setDestinationOptions([]);
      setDestinationLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await performAirportSearch(
          destinationQuery,
          setDestinationLoading,
          setDestinationOptions,
          "destination"
        );
      } catch (error) {
        // Set the error shown flag to prevent further retries for this query
        setDestinationQueryErrorShown(true);
        setDestinationLoading(false);
        handleApiError(
          error,
          "Could not retrieve airport suggestions. Please try again later."
        );
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [destinationQuery, debounceMs, handleApiError, destinationQueryErrorShown]);

  // Memoized handler functions
  const handleOriginInputChange = useCallback((input: string) => {
    setOriginQuery(input);
  }, []);

  const handleDestinationInputChange = useCallback((input: string) => {
    setDestinationQuery(input);
  }, []);

  return {
    // Origin
    originOptions,
    originLoading,
    handleOriginInputChange,
    // Destination
    destinationOptions,
    destinationLoading,
    handleDestinationInputChange,
  };
}
