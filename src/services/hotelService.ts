import axios from "axios";
import type { HotelSearchFormData } from "../components/features/hotels/HotelSearchForm/schema";
import type { 
  HotelSearchParams, 
  HotelSearchResponse,
  HotelDetailsParams,
  HotelDetailsResponse 
} from "../types/hotel";

// Format the date to YYYY-MM-DD format required by the API
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Searches for hotels based on the provided search parameters
 */
export const searchHotels = async (
  formData: HotelSearchFormData
): Promise<HotelSearchResponse> => {
  try {
    // Extract entityId from destination string - in a real app, this would be extracted from a selected option
    // For now, we'll use a default value of "27544008" for London
    const entityId = "27544008"; // Default to London for this example

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

    const response = await axios.get(
      "https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchHotels",
      {
        params,
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
          "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error searching for hotels:", error);
    throw error;
  }
};

/**
 * Get detailed information about a specific hotel
 * @param hotelId - The unique ID of the hotel
 * @param entityId - The entity ID (city/location) where the hotel is located
 * @param options - Optional parameters like currency, market, and countryCode
 */
export const getHotelDetails = async (
  hotelId: string,
  entityId: string,
  options: {
    currency?: string;
    market?: string;
    countryCode?: string;
  } = {}
): Promise<HotelDetailsResponse> => {
  try {
    const params: HotelDetailsParams = {
      hotelId,
      entityId,
      currency: options.currency || "USD",
      market: options.market || "en-US",
      countryCode: options.countryCode || "US",
    };

    const response = await axios.get(
      "https://sky-scrapper.p.rapidapi.com/api/v1/hotels/getHotelDetails",
      {
        params,
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
          "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    throw error;
  }
};
