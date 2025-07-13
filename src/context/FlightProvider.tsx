import React, { useState, useCallback } from "react";
import { FlightContext } from "./FlightContext";
import type { FlightContextType, FlightState } from "./FlightTypes";
import type { FlightSearchData } from "../types/flightSearch";
import {
  searchFlights as searchFlightsApi,
  transformFlightResults,
} from "../services/flightService";
import { getFlightDetails } from "../services/flightDetailsService";
import { useNotification } from "../hooks/useNotification";

interface FlightProviderProps {
  children: React.ReactNode;
}

export const FlightProvider: React.FC<FlightProviderProps> = ({ children }) => {
  const [state, setState] = useState<FlightState>({
    searchResults: null,
    loading: false,
    error: undefined,
    selectedFlightId: null,
    selectedFlightDetails: null,
    flightDetailsLoading: false,
    flightDetailsError: null,
    sessionId: null,
  });

  const { showNotification } = useNotification();

  const searchFlights = useCallback(
    async (searchData: FlightSearchData): Promise<void> => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: undefined,
        selectedFlightId: null,
        selectedFlightDetails: null,
      }));

      try {
        // Build search parameters using the entityId directly from the option objects
        // The search form now provides the complete option objects with entityId
        const searchParams = {
          originSkyId: searchData.origin.value,
          destinationSkyId: searchData.destination.value,
          originEntityId: searchData.origin.entityId,
          destinationEntityId: searchData.destination.entityId,
          date: searchData.departureDate
            ? searchData.departureDate.toISOString().split("T")[0]
            : "",
          returnDate: searchData.returnDate
            ? searchData.returnDate.toISOString().split("T")[0]
            : undefined,
          cabinClass: searchData.cabinClass.toLowerCase().replace(" ", "_") as
            | "economy"
            | "premium_economy"
            | "business"
            | "first",
          adults: searchData.passengerDetails?.adults || 1,
          childrens: searchData.passengerDetails?.children || 0,
          infants: searchData.passengerDetails?.infants || 0,
        };

        const response = await searchFlightsApi(searchParams);

        const results = transformFlightResults(response);

        setState((prev) => ({
          ...prev,
          searchResults: results,
          loading: false,
          error: undefined,
          sessionId:
            response.data?.flightsSessionId ||
            response.data?.context?.sessionId ||
            null,
        }));

        showNotification(`${results.length} flights found!`, "success");
      } catch (error) {
        console.error("Error searching for flights:", error);
        setState((prev) => ({
          ...prev,
          searchResults: [],
          loading: false,
          error: "Failed to retrieve flight results. Please try again.",
        }));

        showNotification(
          "Failed to search for flights. Please try again.",
          "error"
        );
      }
    },
    [showNotification]
  );

  const clearResults = useCallback(() => {
    setState((prev) => ({
      ...prev,
      searchResults: null,
      loading: false,
      error: undefined,
      selectedFlightId: null,
      selectedFlightDetails: null,
    }));
  }, []);

  const selectFlight = useCallback(
    (flightId: string) => {
      setState((prev) => ({
        ...prev,
        selectedFlightId: flightId,
      }));

      // After selecting the flight, load its details
      loadFlightDetails(flightId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const loadFlightDetails = useCallback(
    async (flightId: string): Promise<void> => {
      // Always set loading state when we attempt to load flight details
      setState((prev) => ({
        ...prev,
        flightDetailsLoading: true,
        flightDetailsError: null,
      }));

      // Try to find flight in search results if available
      const flight = state.searchResults?.find((f) => f.id === flightId);

      // If we don't have search results or sessionId, we can't make the API call
      if (!state.searchResults || !state.sessionId) {
        setState((prev) => ({
          ...prev,
          flightDetailsLoading: false,
          flightDetailsError:
            "If you are seeing this error, it means the get-flight-details endpoint is down again!!",
        }));
        return;
      }

      if (!flight) {
        setState((prev) => ({
          ...prev,
          flightDetailsLoading: false,
          flightDetailsError: "Flight not found in current search results.",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        flightDetailsLoading: true,
        flightDetailsError: null,
      }));

      try {
        const legs = flight.legs.map((leg) => ({
          origin: leg.origin.code,
          destination: leg.destination.code,
          date: leg.departure.split("T")[0],
        }));

        const cabinClass = "economy";

        const details = await getFlightDetails({
          itineraryId: flightId,
          legs,
          sessionId: state.sessionId,
          adults: 1,
          currency: "USD",
          locale: "en-US",
          market: "en-US",
          cabinClass,
          countryCode: "US",
        });

        setState((prev) => ({
          ...prev,
          selectedFlightDetails: details,
          flightDetailsLoading: false,
          flightDetailsError: null, // Clear any previous errors
        }));

        showNotification("Flight details loaded successfully", "success");
      } catch (error: unknown) {
        console.error("Error loading flight details:", error);

        // Extract the actual error message from the API response if available
        let errorMessage = "Failed to load flight details. Please try again.";

        // Type narrowing for different error structures
        if (error && typeof error === "object") {
          // Check for Axios-style error response
          if (
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "data" in error.response
          ) {
            const responseData = error.response.data;
            if (typeof responseData === "object" && responseData) {
              if (
                "message" in responseData &&
                typeof responseData.message === "string"
              ) {
                errorMessage = responseData.message;
              } else if (
                "error" in responseData &&
                typeof responseData.error === "string"
              ) {
                errorMessage = responseData.error;
              }
            }
          }
          // Check for standard Error object
          else if ("message" in error && typeof error.message === "string") {
            errorMessage = error.message;
          }
        }

        setState((prev) => ({
          ...prev,
          flightDetailsLoading: false,
          flightDetailsError: errorMessage,
          selectedFlightDetails: null, // Clear any partial data
        }));

        // Use the same error message for the notification
        showNotification(errorMessage, "error");
      }
    },
    [state.searchResults, state.sessionId, showNotification]
  );

  // Context value
  const contextValue: FlightContextType = {
    ...state,
    searchFlights,
    clearResults,
    selectFlight,
    loadFlightDetails,
  };

  return (
    <FlightContext.Provider value={contextValue}>
      {children}
    </FlightContext.Provider>
  );
};
