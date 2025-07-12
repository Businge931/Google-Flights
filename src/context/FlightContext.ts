import { createContext } from "react";
import type { FlightContextType } from "./FlightTypes";

/**
 * Context for flight search and results
 */
export const FlightContext = createContext<FlightContextType | undefined>(
  undefined
);
