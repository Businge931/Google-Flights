import { useContext } from "react";
import { HotelContext } from "../context/HotelContext";
import type { Hotel } from "../types/hotel";
import type { HotelSearchFormData } from "../components/features/hotels/HotelSearchForm/schema";

interface HotelContextType {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
  resultsSummary: string | null;
  searchHotels: (searchData: HotelSearchFormData) => Promise<void>;
  clearHotels: () => void;
}

/**
 * Hook to access the hotel context
 * @returns HotelContext functions and state
 */
export const useHotelContext = (): HotelContextType => {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error("useHotelContext must be used within a HotelProvider");
  }
  return context;
};
