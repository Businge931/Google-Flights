/**
 * Airport Search Service
 * Handles API calls for airport search and autocomplete
 */
import { fetchWithCache } from "./api";
import type { AirportResponse, AirportOption } from "../types/airport";

/**
 * Search for airports using Sky Scrapper API
 * @param query The search query string
 * @param signal Optional AbortController signal for cancellable requests
 * @returns Promise with airport options
 */
export async function searchAirports(
  query: string,
  signal?: AbortSignal
): Promise<AirportOption[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetchWithCache<AirportResponse>(
      `/v1/flights/searchAirport?query=${encodeURIComponent(
        query
      )}&locale=en-US`,
      { signal }
    );

    if (response.status && response.data) {
      return response.data.map((airport) => ({
        label: airport.presentation.suggestionTitle,
        value: airport.skyId,
        city: airport.presentation.title,
        country: airport.presentation.subtitle,
        entityId: airport.entityId || airport.navigation.entityId,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error searching for airports:", error);
    // Re-throw the error instead of returning empty array
    // This will allow the error to be properly handled up the chain
    throw error;
  }
}

/**
 * Get nearby airports based on user's geolocation
 * @param lat Latitude
 * @param lng Longitude
 * @returns Promise with nearby airports and current airport
 */
export async function getNearbyAirports(
  lat: number,
  lng: number
): Promise<{
  current: AirportOption;
  nearby: AirportOption[];
}> {
  try {
    const response = await fetchWithCache(
      `/v1/flights/getNearByAirports?lat=${lat}&lng=${lng}&locale=en-US`
    );

    interface NearbyAirportsResponse {
      status: boolean;
      timestamp: number;
      data: {
        current: {
          skyId: string;
          entityId: string;
          presentation: {
            title: string;
            suggestionTitle: string;
            subtitle: string;
          };
          navigation: {
            entityId: string;
            entityType: string;
            localizedName: string;
            relevantFlightParams: {
              skyId: string;
              entityId: string;
              flightPlaceType: string;
              localizedName: string;
            };
          };
        };
        nearby: Array<{
          presentation: {
            title: string;
            suggestionTitle: string;
            subtitle: string;
          };
          navigation: {
            entityId: string;
            entityType: string;
            localizedName: string;
            relevantFlightParams: {
              skyId: string;
              entityId: string;
              flightPlaceType: string;
              localizedName: string;
            };
          };
        }>;
      };
    }

    const typedResponse = response as NearbyAirportsResponse;

    if (!typedResponse.status || !typedResponse.data) {
      throw new Error("No nearby airports found");
    }

    const { current, nearby } = typedResponse.data;

    // Format current airport
    const currentAirport: AirportOption = {
      label: current.presentation.suggestionTitle,
      value: current.skyId,
      city: current.presentation.title,
      country: current.presentation.subtitle,
      entityId: current.entityId,
    };

    // Define the nearby airport type based on the actual API response
    type NearbyAirport = {
      presentation: {
        title: string;
        suggestionTitle: string;
        subtitle: string;
      };
      navigation: {
        entityId: string;
        entityType: string;
        localizedName: string;
        relevantFlightParams: {
          skyId: string;
          entityId: string;
          flightPlaceType: string;
          localizedName: string;
        };
      };
    };

    // Format nearby airports
    const nearbyAirports: AirportOption[] = nearby.map(
      (airport: NearbyAirport) => ({
        label: airport.presentation.suggestionTitle,
        value: airport.navigation.relevantFlightParams.skyId,
        city: airport.presentation.title,
        country: airport.presentation.subtitle,
        entityId: airport.navigation.relevantFlightParams.entityId,
      })
    );

    return {
      current: currentAirport,
      nearby: nearbyAirports,
    };
  } catch (error) {
    console.error("Error fetching nearby airports:", error);
    throw new Error("Failed to fetch nearby airports");
  }
}

/**
 * Get airport search results directly from API
 * @param query The search query
 * @param signal Optional AbortController signal for cancellable requests
 * @returns Promise with airport options
 */
export function getAirportSearchResults(
  query: string,
  signal?: AbortSignal
): Promise<AirportOption[]> {
  return searchAirports(query, signal);
}
