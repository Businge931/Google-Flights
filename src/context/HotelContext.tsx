import React, { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { Hotel } from "../types/hotel";
import { searchHotels } from "../services/hotelService";
import type { HotelSearchFormData } from "../components/features/hotels/HotelSearchForm/schema";
import { useNotification } from "../hooks/useNotification";

interface HotelContextType {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
  resultsSummary: string | null;
  searchHotels: (searchData: HotelSearchFormData) => Promise<void>;
  clearHotels: () => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultsSummary, setResultsSummary] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const searchHotelsHandler = async (searchData: HotelSearchFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchHotels(searchData);

      if (response.status) {
        setHotels(response.data.hotels || []);
        setResultsSummary(response.data.resultsSummary || null);

        if (response.data.hotels?.length === 0) {
          showNotification("No hotels found for your search criteria", "info");
        } else {
          showNotification(
            `Found ${response.data.hotels?.length} hotels`,
            "success"
          );
        }
      } else {
        setError("Failed to fetch hotels");
        showNotification("Failed to fetch hotels", "error");
      }
    } catch (err) {
      console.error("Error searching hotels:", err);
      setError("An error occurred while searching for hotels");
      showNotification("An error occurred while searching for hotels", "error");
    } finally {
      setLoading(false);
    }
  };

  const clearHotels = () => {
    setHotels([]);
    setResultsSummary(null);
    setError(null);
  };

  const value = {
    hotels,
    loading,
    error,
    resultsSummary,
    searchHotels: searchHotelsHandler,
    clearHotels,
  };

  return (
    <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
  );
};

// Export HotelContext for useHotelContext hook
export { HotelContext };
