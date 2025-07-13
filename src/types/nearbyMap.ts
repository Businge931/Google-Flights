export interface NearbyMapParams {
  cityId: string;
  latitude: number;
  longitude: number;
  currency?: string;
  market?: string;
  countryCode?: string;
}

// Types for nearby map data structures
export interface Transportation {
  id: string;
  type: string;
  coordinate: {
    longitude: number;
    latitude: number;
  };
  name: string;
  linearDistance: number;
  distanceFromHotel: string;
}

interface POI {
  entityId: string;
  poiName: string;
  address?: string;
  poiType: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  linearDistance: number;
  distanceFromHotel: string;
  reviewScore?: number;
  imageUrls?: string[];
  score?: number;
  poiTypeCategory?: string;
  poiTypeLocale?: string;
  poiTypeCategoryLocale?: string;
  formatReviewScore?: string;
}

export interface NearbyMapData {
  transportations: Transportation[];
  poiInfo: POI[];
  nearestTransportation: {
    nearestOne: Transportation;
    description: string;
  };
  attractionsSummary: string;
}

export interface NearbyMapResponse {
  status: boolean;
  timestamp: number;
  data: NearbyMapData;
}
