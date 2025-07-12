/**
 * Types for the Flight Details API response
 */

export interface FlightDetailsParams {
  itineraryId?: string;
  legs: Array<{
    origin: string;
    destination: string;
    date: string;
  }>;
  sessionId: string;
  adults?: number;
  currency?: string;
  locale?: string;
  market?: string;
  cabinClass?: string;
  countryCode?: string;
}

export interface FlightDetailsResponse {
  status: boolean;
  timestamp: number;
  data: FlightDetailsData;
}

export interface FlightDetailsData {
  itinerary: FlightItinerary;
  pollingCompleted: boolean;
}

export interface FlightItinerary {
  legs: FlightDetailsLeg[];
  pricingOptions: PricingOption[];
  isTransferRequired: boolean;
  destinationImage?: string;
  operatingCarrierSafetyAttributes?: CarrierSafetyAttribute[];
  flexibleTicketPolicies: unknown[];
}

export interface FlightDetailsLeg {
  id: string;
  origin: Place;
  destination: Place;
  segments: FlightSegment[];
  duration: number;
  stopCount: number;
  departure: string;
  arrival: string;
  dayChange: number;
}

export interface Place {
  id: string;
  name: string;
  displayCode: string;
  city: string;
}

export interface FlightSegment {
  id: string;
  origin: Place;
  destination: Place;
  duration: number;
  dayChange: number;
  flightNumber: string;
  departure: string;
  arrival: string;
  marketingCarrier: Carrier;
  operatingCarrier: Carrier;
}

export interface Carrier {
  id: string;
  name: string;
  displayCode: string;
  displayCodeType: string;
  logo: string;
  altId: string;
}

export interface PricingOption {
  agents: Agent[];
  totalPrice: number;
}

export interface Agent {
  id: string;
  name: string;
  isCarrier: boolean;
  bookingProposition: string;
  url: string;
  price: number;
  rating?: {
    value: number;
    count: number;
  };
  updateStatus: string;
  segments: FlightSegment[];
  isDirectDBookUrl: boolean;
  quoteAge: number;
}

export interface CarrierSafetyAttribute {
  carrierID: string;
  carrierName: string;
  faceMasksCompulsory: boolean | null;
  aircraftDeepCleanedDaily: boolean | null;
  attendantsWearPPE: boolean | null;
  cleaningPacksProvided: boolean | null;
  foodServiceChanges: boolean | null;
  safetyUrl: string | null;
}
