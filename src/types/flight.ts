/**
 * Flight search and response types
 */

// Flight search request parameters
export interface FlightSearchParams {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string; // YYYY-MM-DD format
  returnDate?: string; // YYYY-MM-DD format
  cabinClass?: "economy" | "premium_economy" | "business" | "first";
  adults?: number;
  childrens?: number; // API uses 'childrens' not 'children'
  infants?: number;
  sortBy?:
    | "best"
    | "price_high"
    | "fastest"
    | "outbound_take_off_time"
    | "outbound_landing_time"
    | "return_take_off_time"
    | "return_landing_time";
  limit?: number;
  carriersIds?: string;
  currency?: string;
  market?: string;
  countryCode?: string;
}

export interface FlightSearchResponse {
  status: boolean;
  timestamp: number;
  data: FlightSearchData;
}

export interface FlightSearchData {
  context: {
    status: string;
    sessionId: string;
    totalResults: number;
  };
  itineraries: FlightItinerary[];
  messages: unknown[];
  filterStats: FilterStats;
  flightsSessionId: string;
  destinationImageUrl: string;
}

export interface FlightItinerary {
  id: string;
  price: {
    raw: number;
    formatted: string;
    pricingOptionId: string;
  };
  legs: FlightLeg[];
  isSelfTransfer: boolean;
  isProtectedSelfTransfer: boolean;
  farePolicy: {
    isChangeAllowed: boolean;
    isPartiallyChangeable: boolean;
    isCancellationAllowed: boolean;
    isPartiallyRefundable: boolean;
  };
  fareAttributes: Record<string, unknown>;
  tags: string[];
  isMashUp: boolean;
  hasFlexibleOptions: boolean;
  score: number;
}

export interface FlightLeg {
  id: string;
  origin: FlightPlace;
  destination: FlightPlace;
  durationInMinutes: number;
  stopCount: number;
  isSmallestStops: boolean;
  departure: string; // ISO date-time string
  arrival: string; // ISO date-time string
  timeDeltaInDays: number;
  carriers: {
    marketing: FlightCarrier[];
    operationType: string;
  };
  segments: FlightSegment[];
}

export interface FlightPlace {
  id: string;
  entityId: string;
  name: string;
  displayCode: string;
  city: string;
  country: string;
  isHighlighted: boolean;
}

export interface FlightCarrier {
  id: number;
  alternateId: string;
  logoUrl: string;
  name: string;
  allianceId?: number;
  displayCode?: string;
}

export interface FlightSegment {
  id: string;
  origin: {
    flightPlaceId: string;
    displayCode: string;
    parent?: {
      flightPlaceId: string;
      displayCode: string;
      name: string;
      type: string;
    };
    name: string;
    type: string;
    country: string;
  };
  destination: {
    flightPlaceId: string;
    displayCode: string;
    parent?: {
      flightPlaceId: string;
      displayCode: string;
      name: string;
      type: string;
    };
    name: string;
    type: string;
    country: string;
  };
  departure: string; // ISO date-time string
  arrival: string; // ISO date-time string
  durationInMinutes: number;
  flightNumber: string;
  marketingCarrier: {
    id: number;
    name: string;
    alternateId: string;
    allianceId: number;
    displayCode: string;
  };
  operatingCarrier: {
    id: number;
    name: string;
    alternateId: string;
    allianceId: number;
    displayCode: string;
  };
  transportMode: string;
}

export interface FilterStats {
  duration: {
    min: number;
    max: number;
    multiCityMin: number;
    multiCityMax: number;
  };
  total: number;
  hasCityOpenJaw: boolean;
  multipleCarriers: {
    minPrice: string;
    rawMinPrice: number | null;
  };
  airports: {
    city: string;
    airports: {
      id: string;
      entityId: string;
      name: string;
    }[];
  }[];
  carriers: FlightCarrier[];
  stopPrices: {
    direct: {
      isPresent: boolean;
      formattedPrice: string;
      rawPrice: number;
    };
    one: {
      isPresent: boolean;
      formattedPrice: string;
      rawPrice: number;
    };
    twoOrMore: {
      isPresent: boolean;
      formattedPrice: string;
      rawPrice: number;
    };
  };
  alliances: {
    id: number;
    name: string;
  }[];
}

// Type to represent a flight search result for the UI
export interface FlightResult {
  id: string;
  price: {
    amount: number;
    formatted: string;
  };
  legs: {
    id: string;
    origin: {
      code: string;
      name: string;
      city: string;
      country: string;
    };
    destination: {
      code: string;
      name: string;
      city: string;
      country: string;
    };
    duration: number; // in minutes
    stops: number;
    departure: string;
    arrival: string;
    carrier: {
      name: string;
      logoUrl: string;
      code: string;
    };
  }[];
  totalDuration: number;
}
