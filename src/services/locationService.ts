/**
 * Location Service
 * Handles browser geolocation and location-related utilities
 */
import { useState, useEffect } from "react";

// Default coordinates (New York City) as fallback
const DEFAULT_LOCATION = {
  latitude: 40.7128,
  longitude: -74.006,
  cityId: "298184", // New York City
  cityName: "New York",
  countryCode: "US",
  language: "en-US",
};

export interface UserLocation {
  latitude: number;
  longitude: number;
  cityId?: string; // Will be set after reverse geocoding if available
  cityName?: string;
  countryCode?: string;
  language?: string;
  permissionGranted: boolean;
}

/**
 * React hook to get the user's location
 * @returns UserLocation object and loading/error states
 */
export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation>({
    ...DEFAULT_LOCATION,
    permissionGranted: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserLocation = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported by your browser");
        }

        // Request user's position
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Here we would ideally perform reverse geocoding to get cityId
            // But for now,  just store the coordinates
            setUserLocation({
              latitude,
              longitude,
              permissionGranted: true,
              // Get browser language or default to en-US
              language: navigator.language || "en-US",
            });

            setLoading(false);
          },
          (err) => {
            console.error("Error getting location:", err);

            // More user-friendly error messages based on error code
            let errorMessage = "Could not determine your location";

            if (err.code === 1) {
              errorMessage =
                "Location access was denied. You can continue using default location.";
            } else if (err.code === 2) {
              errorMessage =
                "Your location is not available. Using default location instead.";
            } else if (err.code === 3) {
              errorMessage =
                "Location request timed out. Using default location.";
            }

            setError(errorMessage);

            // Still provide default location if permission denied
            setUserLocation({
              ...DEFAULT_LOCATION,
              permissionGranted: false,
            });

            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 60000, // Cache location for 1 minute
          }
        );
      } catch (err) {
        console.error("Error in geolocation:", err);
        setError(
          `Failed to get location: ${
            err instanceof Error ? err.message : String(err)
          }`
        );

        // Use default location on error
        setUserLocation({
          ...DEFAULT_LOCATION,
          permissionGranted: false,
        });

        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  return { userLocation, loading, error };
};

/**
 * Get approximate cityId based on coordinates
 * This would be expanded with actual reverse geocoding in a production app
 */
export const getCityIdFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  // This would typically call a reverse geocoding API to get the cityId
  console.log(
    `Attempting to get cityId for coordinates: ${latitude}, ${longitude}`
  );

  // In a real implementation, you would make an API call to a geocoding service
  // For now, we'll use some basic logic to return different IDs based on coordinates

  // New York area (approximately)
  if (latitude > 39 && latitude < 42 && longitude > -75 && longitude < -72) {
    return "298184"; // New York City
  }

  // London area (approximately)
  if (latitude > 50 && latitude < 53 && longitude > -1 && longitude < 1) {
    return "257342"; // London
  }

  // Tokyo area (approximately)
  if (latitude > 35 && latitude < 37 && longitude > 139 && longitude < 141) {
    return "132219"; // Tokyo
  }

  // Default to New York if we can't determine the location
  return "298184";
};

/**
 * Calculate distance between two coordinates in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Get browser language, country, and currency settings
 * @returns Object containing browser language, country code, and currency
 */
export const getBrowserSettings = (): {
  language: string;
  countryCode: string;
  currency: string;
} => {
  // Get browser language or default to en-US
  const browserLanguage = navigator?.language || "en-US";

  // Try to extract country code from browser language (e.g., en-US -> US)
  const countryCode = browserLanguage?.split("-")[1] || "US";

  // Map common country codes to their currencies
  // This is a simplified approach; in a production app, you'd use a more comprehensive solution
  const currencyMap: Record<string, string> = {
    US: "USD",
    GB: "GBP",
    EU: "EUR",
    JP: "JPY",
    CA: "CAD",
    AU: "AUD",
  };

  // Get currency based on country code or default to USD
  const currency = currencyMap[countryCode] || "USD";

  return {
    language: browserLanguage,
    countryCode,
    currency,
  };
};

// No longer needed as the calculation is included directly in the calculateDistance function
