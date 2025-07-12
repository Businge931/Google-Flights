import { type PassengerCounts } from "../components/common/PassengerSelector/PassengerSelector";

/**
 * Airport option type imported from ./airport.ts
 * This ensures consistency across the application
 */
import type { AirportOption } from "./airport";

export interface FlightSearchData {
  tripType: "roundTrip" | "oneWay";
  origin: AirportOption;
  destination: AirportOption;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: number;
  passengerDetails?: PassengerCounts; // Optional detailed breakdown
  cabinClass: string;
}

export interface SearchFormProps {
  onSearch?: (searchData: FlightSearchData) => void;
}

export interface CabinClassOption {
  value: string;
  label: string;
}
