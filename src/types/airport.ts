/**
 * Type definitions for airport search and results
 */

export interface AirportResponse {
  status: boolean;
  timestamp: number;
  data: AirportResult[];
}

export interface AirportResult {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
  navigation: {
    entityId: string;
    entityType: string;
    localizedName: string;
    relevantFlightParams: {
      skyId: string;
      entityId: string;
      flightPlaceType: string;
      localizedName: string;
    };
    relevantHotelParams?: {
      entityId: string;
      entityType: string;
      localizedName: string;
    };
  };
}

export interface AirportOption {
  label: string;
  value: string;
  city: string;
  country: string;
  entityId: string;
}
