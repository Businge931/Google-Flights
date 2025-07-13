import { fetchWithCache } from "./api";
import { getCityIdFromCoordinates, getBrowserSettings } from "./locationService";
import {
  type NearbyMapParams,
  type NearbyMapResponse,
} from "../types/nearbyMap";

/**
 * Fetch nearby map data including POIs and transportation options
 * Uses the existing API utility function to handle authentication properly
 * and attempts to use browser settings and geolocation when available
 */
export const fetchNearbyMapData = async (params: NearbyMapParams) => {
  try {
    // If we don't have a cityId but do have coordinates, try to get the cityId
    let cityId = params.cityId;
    if ((!cityId || cityId === "") && params.latitude && params.longitude) {
      try {
        cityId = await getCityIdFromCoordinates(params.latitude, params.longitude);
      } catch (err) {
        console.warn("Failed to get cityId from coordinates, using default", err);
        // Continue with empty cityId, the API may still work with just coordinates
      }
    }
    
    // Get browser settings for consistent locale/currency usage
    const browserSettings = getBrowserSettings();
    const language = params.market || browserSettings.language;
    const countryCode = params.countryCode || browserSettings.countryCode;
    
    // Build query string for the request
    const queryParams = new URLSearchParams();
    queryParams.append("cityId", cityId || "");
    queryParams.append("latitude", params.latitude.toString());
    queryParams.append("longitude", params.longitude.toString());
    queryParams.append("currency", params.currency || browserSettings.currency);
    queryParams.append("market", language);
    queryParams.append("countryCode", countryCode);

    const response = await fetchWithCache<NearbyMapResponse>(
      `/v1/hotels/nearbyMap?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching nearby map data:", error);
    throw error;
  }
};
