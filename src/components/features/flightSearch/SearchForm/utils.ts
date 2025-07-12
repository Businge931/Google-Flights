// Helper functions and utilities for the Search Form component
import { getAirportSearchResults } from "../../../../services/airportService";
import { searchFlights as searchFlightsApi } from "../../../../services/flightService";
import type {
  FlightSearchParams,
  FlightSearchResponse,
} from "../../../../types/flight";
import type { FlightSearchData } from "../../../../types/flightSearch";
import type { AirportOption } from "../../../../types/airport";
import { apiCache } from "../../../../utils/cacheUtils";
import { formatDateForApi } from "../../../../utils/dateUtils";

// Keep track of the latest request for each search type to handle race conditions
const currentSearchRequests: Record<string, AbortController> = {};

/**
 * Performs real airport search using the API service with advanced error handling,
 * caching, and race condition management
 * @param query Search query string
 * @param setLoading Function to set loading state
 * @param setOptions Function to set options state
 * @param searchType Identifier for the search type (e.g., 'origin', 'destination')
 */
export async function performAirportSearch(
  query: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setOptions: React.Dispatch<React.SetStateAction<AirportOption[]>>,
  searchType: string = "default"
): Promise<void> {
  // Minimum query length check
  if (!query.trim() || query.trim().length < 2) {
    setOptions([]);
    return;
  }

  setLoading(true);

  // Generate cache key
  const cacheKey = `airport-search-${query.toLowerCase().trim()}`;

  // Check if we have a cached result
  const cachedResult = apiCache.get<AirportOption[]>(cacheKey);
  if (cachedResult) {
    setOptions(cachedResult);
    setLoading(false);
    return;
  }

  // Cancel any ongoing request for the same search type
  if (currentSearchRequests[searchType]) {
    currentSearchRequests[searchType].abort();
  }

  // Create new abort controller
  const abortController = new AbortController();
  currentSearchRequests[searchType] = abortController;

  try {
    // Get search results from the API service
    const results = await getAirportSearchResults(
      query,
      abortController.signal
    );

    // Map the results to the AirportOption interface
    const formattedOptions: AirportOption[] = results.map((airport) => ({
      label: airport.label, // Already formatted as "City (Code)"
      value: airport.value, // Airport code
      city: airport.city,
      country: airport.country,
      entityId: airport.entityId, // Include entityId for API calls
    }));

    // Cache the results
    apiCache.set(cacheKey, formattedOptions);

    // Update options state (only if this is still the current request)
    if (!abortController.signal.aborted) {
      setOptions(formattedOptions);
    }
  } catch (error) {
    // Don't show errors for aborted requests
    if ((error as Error).name !== "AbortError") {
      console.error("Error searching airports:", error);

      // Clear options on error unless aborted
      setOptions([]);

      // Re-throw error for the component to handle with useApiErrorHandler
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to search airports. Please try again."
      );
    }
  } finally {
    // Clean up request reference and loading state
    if (currentSearchRequests[searchType] === abortController) {
      delete currentSearchRequests[searchType];
      setLoading(false);
    }
  }
}

/**
 * Legacy function for backward compatibility - now calls the real search function
 * @param setLoading State setter function for loading state
 */
export const simulateLocationSearch = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  console.warn(
    "simulateLocationSearch is deprecated. Use performAirportSearch instead."
  );
  setLoading(true);
  setTimeout(() => setLoading(false), 500);
};

/**
 * Performs flight search using the flightService API
 * @param searchData Form data from the search form
 * @param setIsSubmitting Function to set the submitting state
 * @param onComplete Callback function with the search results
 * @param onError Callback function for error handling
 */
export const searchFlights = async (
  searchData: FlightSearchData,
  setIsSubmitting: (isSubmitting: boolean) => void,
  onComplete?: (results: FlightSearchResponse) => void,
  onError?: (error: Error) => void
): Promise<void> => {
  // Abort any existing search
  if (currentSearchRequests["flight-search"]) {
    currentSearchRequests["flight-search"].abort();
  }

  // Create new abort controller
  const abortController = new AbortController();
  currentSearchRequests["flight-search"] = abortController;

  setIsSubmitting(true);

  try {
    // Use the AirportOption objects directly for API parameters
    // Map form data to API parameters
    const searchParams: FlightSearchParams = {
      originSkyId: searchData.origin.value,
      destinationSkyId: searchData.destination.value,
      originEntityId: searchData.origin.entityId,
      destinationEntityId: searchData.destination.entityId,
      date: formatDateForApi(searchData.departureDate as Date),
      cabinClass: mapCabinClass(searchData.cabinClass),
      adults: searchData.passengerDetails?.adults || 1,
      childrens: searchData.passengerDetails?.children || 0,
      infants: searchData.passengerDetails?.infants || 0,
    };

    // Only add returnDate for round trips
    if (searchData.tripType === "roundTrip" && searchData.returnDate) {
      searchParams.returnDate = formatDateForApi(searchData.returnDate as Date);
    }

    // Call the flight search API
    const results = await searchFlightsApi(
      searchParams,
      abortController.signal
    );

    if (onComplete && !abortController.signal.aborted) {
      onComplete(results);
    }
  } catch (error) {
    // Only handle errors if not aborted
    if ((error as Error).name !== "AbortError" && onError) {
      console.error("Error searching flights:", error);
      onError(error as Error);
    }
  } finally {
    // Clean up
    if (currentSearchRequests["flight-search"] === abortController) {
      delete currentSearchRequests["flight-search"];
      setIsSubmitting(false);
    }
  }
};

/**
 * Maps UI-friendly cabin class names to API-expected values
 * @param uiCabinClass The cabin class from the UI
 * @returns API compatible cabin class value
 */
const mapCabinClass = (
  uiCabinClass: string
): "economy" | "premium_economy" | "business" | "first" => {
  switch (uiCabinClass.toLowerCase()) {
    case "premium economy":
      return "premium_economy";
    case "business":
      return "business";
    case "first":
      return "first";
    case "economy":
    default:
      return "economy";
  }
};
