import type { FlightResult } from "../types/flight";
import type { FlightSearchData } from "../types/flightSearch";
import type { FlightDetailsResponse } from "../types/flightDetails";

/**
 * Flight context state interface
 */
export interface FlightState {
  searchResults: FlightResult[] | null;
  loading: boolean;
  error?: string;
  selectedFlightId: string | null;
  selectedFlightDetails: FlightDetailsResponse | null;
  flightDetailsLoading: boolean;
  flightDetailsError: string | null;
  sessionId: string | null;
}

/**
 * Flight context interface
 */
export interface FlightContextType {
  // State
  searchResults: FlightResult[] | null;
  loading: boolean;
  error?: string;
  selectedFlightId: string | null;
  selectedFlightDetails: FlightDetailsResponse | null;
  flightDetailsLoading: boolean;
  flightDetailsError: string | null;
  sessionId: string | null;
  
  // Actions
  searchFlights: (searchData: FlightSearchData) => Promise<void>;
  clearResults: () => void;
  selectFlight: (flightId: string) => void;
  loadFlightDetails: (flightId: string) => Promise<void>;
}
