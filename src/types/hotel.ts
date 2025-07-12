export interface HotelSearchParams {
  entityId: string;
  checkin: string;
  checkout: string;
  adults: number;
  rooms: number;
  children?: number;
  limit?: number;
  sorting?: string;
  currency?: string;
  market?: string;
  countryCode?: string;
}

export interface HotelSearchResponse {
  status: boolean;
  timestamp: number;
  data: {
    searchStatus: {
      completionPercentage: number;
      status: string;
      searchId: string;
      firstPageStatus: string;
    };
    hotels: Hotel[];
    nightsForPrice: string;
    resultsSummary: string;
    filters: Array<{
      type: string;
      title: string;
      values: Array<{
        id: string;
        label: string;
        minPrice: number;
        maxPrice: number;
        count: number;
      }>;
    }>;
    sortOptions: Array<{
      optionName: string;
      type: string;
    }>;
    totalHotels: number;
    totalHotelsFiltered: number;
    partners: string[];
  };
}

export interface Hotel {
  hotelId: string;
  heroImage: string;
  name: string;
  stars: number;
  brandIds: string[];
  distance: string;
  relevantPoiDistance?: string;
  coordinates: [number, number];
  price: string;
  cug?: {
    cugWithoutLabel: string;
    rawType: string;
    type: string;
    icons: string[];
    discount: string;
    priceWithoutDiscount: string;
    rawDiscountPercentage: number;
  };
  cheapestOfferPartnerId: string;
  cheapestOfferRateId: null | string;
  rawPrice: number;
  rating: {
    description: string;
    count: number;
    value: string;
    color: string;
  };
  reviewSummary: {
    description: string;
    count: number;
    formatCount: string;
    value: string;
    formatValue: string;
    color: string;
    taImage?: string;
    confidenceBadge?: {
      type: string;
      score: number;
      icon: string;
      color: {
        light: string;
        dark: string;
      };
      message: string;
    };
  };
  cheapestOffer: string;
  offerTypes: string;
  guestType: null | string;
  exclusiveDealLabel: null | string;
  pricesFrom: string;
  images: string[];
  otherRates: Array<{
    partnerId: string;
    partnerName: string;
    rawPrice: number;
    price: string;
  }>;
  priceDescription: string;
  taxPolicy: string;
  rateFeatures: unknown[];
  cheapestOfferPartnerName: string;
}

// Hotel Details types
export interface HotelDetailsParams {
  hotelId: string;
  entityId: string;
  currency?: string;
  market?: string;
  countryCode?: string;
}

export interface HotelDetailsResponse {
  status: boolean;
  timestamp: number;
  data: HotelDetails;
}

export interface HotelDetails {
  general: {
    name: string;
    stars: number;
  };
  goodToKnow: {
    title: string;
    checkinTime: {
      title: string;
      time: string;
    };
    checkoutTime: {
      title: string;
      time: string;
    };
    description: {
      title: string;
      content: string;
      image: string;
      translated: boolean;
      needTranslation: boolean;
      locale: string;
    };
    policies: {
      title: string;
      content: Array<{
        icon: string;
        translated: boolean;
        needTranslation: boolean;
        locale: string;
        key: string;
        type: string;
        values: Array<{
          content: string;
        }>;
      }>;
    };
  };
  childrenAndExtraBed: {
    title: string;
    content: unknown[];
  };
  location: {
    title: string;
    shortAddress: string;
    address: string;
    rawAddress: {
      street_address: string;
      postcode: string;
      city: string;
      district: string;
      adm1: string;
      nation: string;
      cityId: string;
    };
    coordinates: {
      latitude: number;
      longitude: number;
    };
    cta: string;
  };
  gallery: {
    images: Array<{
      category: string;
      thumbnail: string;
      gallery: string;
      dynamic: string;
    }>;
    categories: Array<{
      name: string;
      count: number;
      displayName: string;
    }>;
  };
  amenities: {
    title: string;
    ctaAll: string;
    ctaLess: string;
    content: Array<{
      icon: string;
      description: string;
    }>;
    contentV2: Array<{
      id: string;
      category: string;
      items: Array<{
        id: string;
        description: string;
        icon: string;
      }>;
    }>;
  };
  reviews: {
    title: string;
    newTitle: string;
    cta: string;
    summaryDescription: string;
    rating: number;
    ratingDescription: string;
    ratingDescriptionText: string;
    numberOfReviewsLabel: string;
    numberOfReviewsLabelExpanded: string;
    badges: unknown[];
    guests: {
      title: string;
      entries: unknown[];
    };
    categories: {
      title: string;
      entries: unknown[];
    };
    explanations: Array<{
      title: string;
      content: string;
    }>;
  };
  distance: string;
  reviewRatingSummary: {
    scoreLogoImageUrl: string;
    score: string;
    formatScore: string;
    totalScore: string;
    count: string;
    countNumber: number;
    formatCountString: string;
    color: string;
    scoreDesc: string;
    highlights: string;
    categories: Array<{
      type: string;
      score: string;
      formatScore: string;
      color: string;
      name: string;
      highlights: string;
      description: string;
    }>;
    cleanlinessMessage: string;
    locationMessage: string;
    highScoreReviews: Array<{
      type: string;
      score: string;
      icon: string;
      text: string;
    }>;
  };
}
