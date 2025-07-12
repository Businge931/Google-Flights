import { useContext } from "react";
import { FlightContext } from "./FlightContext";

/**
 * Custom hook to access the Flight context
 * @returns Flight context with state and actions
 */
export function useFlightContext() {
  const context = useContext(FlightContext);
  
  if (context === undefined) {
    throw new Error("useFlightContext must be used within a FlightProvider");
  }
  
  return context;
}
