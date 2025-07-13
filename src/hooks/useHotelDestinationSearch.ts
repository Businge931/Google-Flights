import { useState, useEffect, useCallback, useRef } from "react";
import { searchDestinations } from "../services/hotelService";
import type { HotelDestination } from "../services/hotelService";
import { useDebounce } from "./useDebounce";
import { useNotification } from "../hooks/useNotification";

// Cache to store previous search results
const searchCache = new Map<string, HotelDestination[]>();
// Cache for failed queries to prevent repeated calls for the same failed query
const failedQueriesCache = new Set<string>();

interface UseHotelDestinationSearchResult {
  loading: boolean;
  options: HotelDestination[];
  search: (query: string) => void;
  error: string | null;
}

/**
 * Custom hook for searching hotel destinations with debouncing and caching
 */
export const useHotelDestinationSearch =
  (): UseHotelDestinationSearchResult => {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<HotelDestination[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [abortController, setAbortController] =
      useState<AbortController | null>(null);

    // Ref to track if component is mounted
    const isMountedRef = useRef(true);
    // Ref to store error cooldown timestamp
    const errorCooldownRef = useRef<Record<string, number>>({});

    const debouncedQuery = useDebounce(query, 400);
    const { showNotification } = useNotification();

    // Clear failed query cache after some time (10 seconds)
    const clearFailedQueryFromCache = useCallback((failedQuery: string) => {
      setTimeout(() => {
        failedQueriesCache.delete(failedQuery);
        delete errorCooldownRef.current[failedQuery];
      }, 10000); // 10 second cooldown
    }, []);

    // Function to perform the destination search
    const performDestinationSearch = useCallback(
      async (searchQuery: string) => {
        // Don't search if query is too short
        if (!searchQuery || searchQuery.length < 2) {
          setOptions([]);
          setLoading(false);
          return;
        }

        // Check if this query previously failed and is still in cooldown
        if (failedQueriesCache.has(searchQuery)) {
          const now = Date.now();
          const cooldownTime = errorCooldownRef.current[searchQuery];
          
          // If we're still in cooldown period, don't try again
          if (cooldownTime && now < cooldownTime) {
            setOptions([]);
            setLoading(false);
            return;
          }
        }

        // Check cache first
        if (searchCache.has(searchQuery)) {
          setOptions(searchCache.get(searchQuery) || []);
          setLoading(false);
          return;
        }

        // Cancel any in-flight requests
        if (abortController) {
          abortController.abort();
        }

        // Create new abort controller for this request
        const newAbortController = new AbortController();
        setAbortController(newAbortController);

        setLoading(true);
        setError(null);

        try {
          const response = await searchDestinations(searchQuery);

          // Only update state if component is still mounted
          if (isMountedRef.current) {
            if (response.status && Array.isArray(response.data)) {
              setOptions(response.data);
              searchCache.set(searchQuery, response.data);
              
              // If this was a previously failed query that succeeded, remove from failed cache
              if (failedQueriesCache.has(searchQuery)) {
                failedQueriesCache.delete(searchQuery);
                delete errorCooldownRef.current[searchQuery];
              }
            } else {
              setOptions([]);
            }
          }
        } catch (err) {
          // Only show error if it's not an abort error and component is still mounted
          if (isMountedRef.current && !(err instanceof DOMException && err.name === "AbortError")) {
            setError("Failed to fetch destination suggestions");
            showNotification(
              "Failed to fetch destination suggestions",
              "error"
            );
            console.error("Error fetching destination suggestions:", err);
            
            // Add to failed queries cache with cooldown timestamp
            failedQueriesCache.add(searchQuery);
            errorCooldownRef.current[searchQuery] = Date.now() + 10000; // 10 second cooldown
            clearFailedQueryFromCache(searchQuery);
          }
          
          if (isMountedRef.current) {
            setOptions([]);
          }
        } finally {
          if (isMountedRef.current) {
            setLoading(false);
          }
        }
      },
      [showNotification, abortController, clearFailedQueryFromCache]
    );

    // Effect for component mount/unmount
    useEffect(() => {
      isMountedRef.current = true;
      
      return () => {
        // Mark component as unmounted
        isMountedRef.current = false;
        
        // Cleanup: abort any pending requests when component unmounts
        if (abortController) {
          abortController.abort();
        }
      };
    }, [abortController]);
    
    // Effect to trigger search when debounced query changes
    useEffect(() => {
      performDestinationSearch(debouncedQuery);
    }, [debouncedQuery, performDestinationSearch]);

    // Public method to trigger a search
    const search = useCallback((newQuery: string) => {
      setQuery(newQuery);
    }, []);

    return {
      loading,
      options,
      search,
      error,
    };
  };
