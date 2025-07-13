import { fetchWithCache } from "./api";
import { getBrowserSettings } from "./locationService";
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
  // Get browser settings for localization
  const browserSettings = getBrowserSettings();
  
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
  
  // Use provided values or browser defaults for localization
  const currency = params.currency || browserSettings.currency;
  queryParams.append("currency", currency);
  
  const locale = params.locale || browserSettings.language;
  queryParams.append("locale", locale);
  
  const market = params.market || browserSettings.language;
  queryParams.append("market", market);
  
  if (params.cabinClass) {
    queryParams.append("cabinClass", params.cabinClass);
  }
  
  const countryCode = params.countryCode || browserSettings.countryCode;
  queryParams.append("countryCode", countryCode);

  // Make API call
  try {
    const response = await fetchWithCache<FlightDetailsResponse>(
      `/v1/flights/getFlightDetails?${queryParams.toString()}`,
      { signal }
    );
    return response;
  } catch (error) {
    console.error("Error fetching flight details:", error);
    throw error;
  }
}
