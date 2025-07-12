/**
 * Flight search service
 * Handles API calls for searching flights
 */
import { fetchWithCache } from "./api";
import type {
  FlightSearchParams,
  FlightSearchResponse,
  FlightResult,
} from "../types/flight";

/**
 * Search flights using the provided parameters
 * @param params Flight search parameters
 * @returns Promise with flight search results
 */
export async function searchFlights(
  params: FlightSearchParams,
  signal?: AbortSignal
): Promise<FlightSearchResponse> {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    // Required parameters
    queryParams.append("originSkyId", params.originSkyId);
    queryParams.append("destinationSkyId", params.destinationSkyId);
    queryParams.append("originEntityId", params.originEntityId);
    queryParams.append("destinationEntityId", params.destinationEntityId);
    queryParams.append("date", params.date);

    // Optional parameters with defaults
    if (params.returnDate) queryParams.append("returnDate", params.returnDate);
    if (params.cabinClass) queryParams.append("cabinClass", params.cabinClass);
    if (params.adults !== undefined)
      queryParams.append("adults", params.adults.toString());
    if (params.childrens !== undefined)
      queryParams.append("childrens", params.childrens.toString());
    if (params.infants !== undefined)
      queryParams.append("infants", params.infants.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.limit !== undefined)
      queryParams.append("limit", params.limit.toString());
    if (params.carriersIds)
      queryParams.append("carriersIds", params.carriersIds);
    if (params.currency) queryParams.append("currency", params.currency);
    if (params.market) queryParams.append("market", params.market);
    if (params.countryCode)
      queryParams.append("countryCode", params.countryCode);

    const response = await fetchWithCache<FlightSearchResponse>(
      `/v2/flights/searchFlights?${queryParams.toString()}`,
      { signal }
    );

    return response;
  } catch (error) {
    console.error("Error searching for flights:", error);
    throw error;
  }
}

/**
 * Transform flight search response into a more user-friendly format
 * @param response Flight search API response
 * @returns Simplified flight results
 */
export function transformFlightResults(
  response: FlightSearchResponse
): FlightResult[] {
  if (!response.status || !response.data || !response.data.itineraries) {
    return [];
  }

  return response.data.itineraries.map((itinerary) => {
    // Calculate total duration across all legs
    const totalDuration = itinerary.legs.reduce(
      (total, leg) => total + leg.durationInMinutes,
      0
    );

    return {
      id: itinerary.id,
      price: {
        amount: itinerary.price.raw,
        formatted: itinerary.price.formatted,
      },
      legs: itinerary.legs.map((leg) => {
        // Get primary carrier information
        const carrier = leg.carriers.marketing[0] || {
          id: 0,
          alternateId: "",
          logoUrl: "",
          name: "Unknown Airline",
        };

        return {
          id: leg.id,
          origin: {
            code: leg.origin.displayCode,
            name: leg.origin.name,
            city: leg.origin.city,
            country: leg.origin.country,
          },
          destination: {
            code: leg.destination.displayCode,
            name: leg.destination.name,
            city: leg.destination.city,
            country: leg.destination.country,
          },
          duration: leg.durationInMinutes,
          stops: leg.stopCount,
          departure: leg.departure,
          arrival: leg.arrival,
          carrier: {
            name: carrier.name,
            logoUrl: carrier.logoUrl,
            code: carrier.alternateId,
          },
        };
      }),
      totalDuration,
    };
  });
}
