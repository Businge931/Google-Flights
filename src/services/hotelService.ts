import axios, { type AxiosRequestConfig } from "axios";
import { formatDate } from "../utils/dateUtils";
import type { HotelSearchFormData } from "../components/features/hotels/HotelSearchForm/schema";
import type {
  HotelSearchParams,
  HotelSearchResponse,
  HotelDetailsParams,
  HotelDetailsResponse,
} from "../types/hotel";

// API Configuration
const API_CONFIG = {
  BASE_URL: "https://sky-scrapper.p.rapidapi.com/api/v1/hotels",
  ENDPOINTS: {
    SEARCH_DESTINATIONS: "/searchDestinationOrHotel",
    SEARCH_HOTELS: "/searchHotels",
    HOTEL_DETAILS: "/getHotelDetails",
  },
};

/**
 * Get headers for API requests
 */
const getApiHeaders = () => ({
  "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
  "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
});

/**
 * Make a request to the Sky Scrapper API
 * @template T The expected response type
 * @param endpoint API endpoint
 * @param params Request parameters
 * @returns Promise with API response
 */
const makeApiRequest = async <T>(
  endpoint: string,
  params: Record<string, unknown>
): Promise<T> => {
  const config: AxiosRequestConfig = {
    url: `${API_CONFIG.BASE_URL}${endpoint}`,
    params,
    headers: getApiHeaders(),
    method: "GET",
  };

  try {
    const response = await axios(config);
    return response.data as T;
  } catch (error) {
    console.error(`Error in API request to ${endpoint}:`, error);
    // Rethrow with more context
    if (axios.isAxiosError(error)) {
      throw new Error(`API request to ${endpoint} failed: ${error.message}`);
    }
    throw new Error(`API request to ${endpoint} failed with unexpected error`);
  }
};

/**
 * Interface for hotel destination search response
 */
export interface HotelDestination {
  hierarchy: string;
  location: string;
  score: number;
  entityName: string;
  entityId: string;
  entityType: string;
  suggestItem: string;
  class: string;
  pois: null | unknown;
}

export interface HotelDestinationSearchResponse {
  status: boolean;
  timestamp: number;
  data: HotelDestination[];
}

/**
 * Search for hotel destinations or hotels by query
 * @param query Search query text
 * @returns Promise with destination search results
 */
export const searchDestinations = async (
  query: string
): Promise<HotelDestinationSearchResponse> => {
  try {
    return await makeApiRequest<HotelDestinationSearchResponse>(
      API_CONFIG.ENDPOINTS.SEARCH_DESTINATIONS,
      { query }
    );
  } catch (error) {
    console.error("Error searching for destinations:", error);
    throw new Error(
      `Destination search failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Search for hotels based on the provided search parameters
 * @param formData Form data with search parameters
 * @returns Promise with hotel search results
 */
export const searchHotels = async (
  formData: HotelSearchFormData
): Promise<HotelSearchResponse> => {
  try {
    // Use entityId from the form data or default to London (27544008)
    const entityId = formData.entityId || "27544008";

    const params: HotelSearchParams = {
      entityId,
      checkin: formatDate(formData.checkIn),
      checkout: formatDate(formData.checkOut),
      adults: formData.adults,
      rooms: formData.rooms,
      children: formData.children,
      limit: 30,
      sorting: "-relevance",
      currency: "USD",
      market: "en-US",
      countryCode: "US",
    };

    return await makeApiRequest<HotelSearchResponse>(
      API_CONFIG.ENDPOINTS.SEARCH_HOTELS,
      params
    );
  } catch (error) {
    console.error("Error searching for hotels:", error);
    throw new Error(
      `Hotel search failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Get detailed information about a specific hotel
 * @param options - The hotel details parameters
 * @returns Promise with hotel details response
 */
export const getHotelDetails = async (
  options: HotelDetailsParams
): Promise<HotelDetailsResponse> => {
  try {
    // Set up the request parameters
    const params: HotelDetailsParams = {
      hotelId: options.hotelId,
      entityId: options.entityId,
      currency: options.currency || "USD",
      market: options.market || "en-US",
      countryCode: options.countryCode || "US",
    };

    return await makeApiRequest<HotelDetailsResponse>(
      API_CONFIG.ENDPOINTS.HOTEL_DETAILS,
      params
    );
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    throw new Error(
      `Hotel details fetch failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
