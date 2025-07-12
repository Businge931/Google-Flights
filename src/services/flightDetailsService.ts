import { fetchWithCache } from "./api";
import type { 
  FlightDetailsParams, 
  FlightDetailsResponse 
} from "../types/flightDetails";

/**
 * Fetches detailed information about a flight
 */
export async function getFlightDetails(
  params: FlightDetailsParams,
  signal?: AbortSignal
): Promise<FlightDetailsResponse> {
  // Build legs query parameter (needs to be a JSON string)
  const legs = encodeURIComponent(JSON.stringify(params.legs));

  // Build query parameters
  const queryParams = new URLSearchParams();
  queryParams.append("legs", legs);
  
  // Required params
  queryParams.append("sessionId", params.sessionId);
  
  // Optional params
  if (params.itineraryId) {
    queryParams.append("itineraryId", params.itineraryId);
  }
  
  if (params.adults) {
    queryParams.append("adults", params.adults.toString());
  }
  
  if (params.currency) {
    queryParams.append("currency", params.currency);
  }
  
  if (params.locale) {
    queryParams.append("locale", params.locale);
  }
  
  if (params.market) {
    queryParams.append("market", params.market);
  }
  
  if (params.cabinClass) {
    queryParams.append("cabinClass", params.cabinClass);
  }
  
  if (params.countryCode) {
    queryParams.append("countryCode", params.countryCode);
  }

  // Make API call
  return fetchWithCache<FlightDetailsResponse>(
    `/v1/flights/getFlightDetails?${queryParams.toString()}`,
    { signal }
  );
}
