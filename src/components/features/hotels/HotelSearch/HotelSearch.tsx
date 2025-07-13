import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import InfoIcon from "@mui/icons-material/Info";
import HotelSearchForm from "../HotelSearchForm/HotelSearchForm";
import HotelResults from "../HotelResults/HotelSearchResults";
import HotelFilters from "../HotelFilters/HotelFilters";
import type { HotelFilters as HotelFiltersType } from "../HotelFilters/HotelFilters";
import { useHotelContext } from "../../../../hooks/useHotelContext";

const HotelSearch: React.FC = () => {
  const { t } = useTranslation();
  const { hotels, loading, error } = useHotelContext();

  const [filterValue, setFilterValue] = useState("recommended");

  // Hotel filters state with enhanced properties
  const [hotelFilters, setHotelFilters] = useState<HotelFiltersType>({
    price: [0, 1000],
    reviewScore: 7,
    stars: [],
    discounts: [],
    amenities: [],
    accommodationType: [],
    distanceFromCenter: null,
    minDiscountPercentage: 0,
    offerPartners: [],
    taxPolicy: [],
    guestType: null,
    confidenceScore: null,
  });

  const getHotelsByFilter = () => {
    if (!hotels || hotels.length === 0) return [];

    const filteredHotels = hotels.filter((hotel) => {
      // Price filter
      // Use rawPrice property directly from API data
      const hotelPrice = hotel.rawPrice || 0;
      if (
        hotelPrice < hotelFilters.price[0] ||
        hotelPrice > hotelFilters.price[1]
      ) {
        return false;
      }

      // Review score filter
      // Extract review score from the API data
      const reviewScore = hotel.rating?.value
        ? parseFloat(hotel.rating.value)
        : 0;
      if (reviewScore < hotelFilters.reviewScore) {
        return false;
      }

      // Star rating filter
      const starRating = hotel.stars || 0;
      if (
        hotelFilters.stars.length > 0 &&
        !hotelFilters.stars.includes(starRating)
      ) {
        return false;
      }

      // Distance filter - actual API format: "0.7 miles from Eiffel Tower"
      if (hotelFilters.distanceFromCenter !== null && hotel.distance) {
        // Extract distance value from distance string
        const distanceMatch = hotel.distance.match(/(\d+\.?\d*)/);
        const distanceValue = distanceMatch ? parseFloat(distanceMatch[1]) : 0;
        
        if (distanceValue > hotelFilters.distanceFromCenter) {
          return false;
        }
      }
      
      // Discount percentage filter using the API cug.rawDiscountPercentage property
      if (hotelFilters.minDiscountPercentage > 0) {
        const discountPercentage = hotel.cug?.rawDiscountPercentage || 0;
        if (discountPercentage < hotelFilters.minDiscountPercentage) {
          return false;
        }
      }
      
      // Offer partners filter using cheapestOfferPartnerName and otherRates
      if (hotelFilters.offerPartners.length > 0) {
        // First check the main partner
        const hotelPartner = hotel.cheapestOfferPartnerName;
        const mainPartnerMatches = hotelPartner && hotelFilters.offerPartners.includes(hotelPartner);
        
        if (!mainPartnerMatches) {
          // If main partner doesn't match, check if any other partners match
          const hasMatchingPartner = hotel.otherRates?.some(rate => 
            rate.partnerName && hotelFilters.offerPartners.includes(rate.partnerName)
          );
          
          if (!hasMatchingPartner) {
            return false;
          }
        }
      }
      
      // Tax policy filter using the API taxPolicy property
      if (hotelFilters.taxPolicy.length > 0 && hotel.taxPolicy) {
        const taxPolicy = hotel.taxPolicy.toLowerCase();
        
        const matches = hotelFilters.taxPolicy.some(policy => {
          switch (policy) {
            case 'included':
              return taxPolicy.includes('included') || taxPolicy.includes('all taxes');
            case 'excluded':
              return taxPolicy.includes('excluded') || taxPolicy.includes('not included');
            case 'payLater':
              return taxPolicy.includes('pay later') || taxPolicy.includes('at the property');
            default:
              return false;
          }
        });
        
        if (!matches) {
          return false;
        }
      }
      
      // Guest type filter using the API guestType property and confidence badge
      if (hotelFilters.guestType && hotelFilters.guestType !== 'any') {
        // First try direct match on guestType property
        if (hotel.guestType && hotel.guestType === hotelFilters.guestType) {
          return true;
        }
        
        // Then try to match on confidence badge message
        const confidenceBadgeMessage = hotel.reviewSummary?.confidenceBadge?.message?.toLowerCase() || '';
        const guestTypeKeywords: Record<string, string[]> = {
          'couples': ['couple', 'romance', 'romantic'],
          'family': ['family', 'families', 'kids', 'children'],
          'business': ['business', 'work', 'working'],
          'solo': ['solo', 'alone', 'single traveler'],
          'friends': ['friends', 'group']
        };
        
        const keywords = guestTypeKeywords[hotelFilters.guestType] || [];
        const guestTypeMatches = keywords.some(keyword => 
          confidenceBadgeMessage.includes(keyword)
        );
        
        if (!guestTypeMatches) {
          return false;
        }
      }
      
      // Confidence score for location rating
      if (hotelFilters.confidenceScore !== null) {
        const locationScore = hotel.reviewSummary?.confidenceBadge?.score || 0;
        if (locationScore < hotelFilters.confidenceScore) {
          return false;
        }
      }

      // Accommodation type filter using hotel name heuristics
      if (hotelFilters.accommodationType.length > 0) {
        const hotelName = hotel.name.toLowerCase();
        const matchesType = hotelFilters.accommodationType.some((type) => {
          switch (type) {
            case "hotel":
              return hotelName.includes("hotel");
            case "resort":
              return hotelName.includes("resort");
            case "apartment":
              return (
                hotelName.includes("apartment") || hotelName.includes("suite")
              );
            case "guesthouse":
              return hotelName.includes("guest") || hotelName.includes("house");
            case "hostel":
              return hotelName.includes("hostel");
            case "villa":
              return hotelName.includes("villa");
            default:
              return false;
          }
        });

        if (!matchesType) {
          return false;
        }
      }

      return true;
    });

    switch (filterValue) {
      case "price":
        // Sort by lowest price using rawPrice from API
        return [...filteredHotels].sort((a, b) => {
          const priceA = a.rawPrice || 0;
          const priceB = b.rawPrice || 0;
          return priceA - priceB;
        });
      case "reviews":
        // Sort by highest reviews
        return [...filteredHotels].sort((a, b) => {
          const ratingA = a.rating?.value ? parseFloat(a.rating.value) : 0;
          const ratingB = b.rating?.value ? parseFloat(b.rating.value) : 0;
          return ratingB - ratingA;
        });
      case "stars":
        // Sort by star rating
        return [...filteredHotels].sort((a, b) => {
          const starsA = a.stars || 0;
          const starsB = b.stars || 0;
          return starsB - starsA;
        });
      case "closest":
        // Distance logic would go here
        return filteredHotels;
      case "recommended":
      default:
        return filteredHotels;
    }
  };

  const displayedHotels = getHotelsByFilter();

  const handleFilterChange = (
    _event: React.SyntheticEvent,
    newValue: string
  ) => {
    setFilterValue(newValue);
  };

  return (
    <>
      {/* Blue hero section with heading */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "primary.main",
          color: "white",
          pt: 4,
          pb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {t("hotelSearch.findPerfectStay", "Find your perfect stay")}
        </Typography>

        <Typography variant="body1" sx={{ maxWidth: 600, mb: 4, px: 2 }}>
          {t(
            "hotelSearch.searchCompareHotels",
            "Search and compare hotels from hundreds of travel sites to find the best accommodation for your trip."
          )}
        </Typography>
      </Box>

      {/* Main content area with search form */}
      <Container maxWidth="xl" sx={{ mt: -4 }}>
        <Paper
          elevation={2}
          sx={{
            position: { xs: "static", md: "sticky" },
            top: 0,
            zIndex: 10,
            mb: 3,
            backgroundColor: "background.paper",
            borderRadius: 2,
          }}
        >
          <HotelSearchForm />
        </Paper>

        {/* Results area with 3-column layout */}
        <Box sx={{ mb: 4, mt: 4 }}>
          {/* Results summary and tabs */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              We find prices from all across the web – what providers pay us
              affects how we sort results.
            </Typography>
          </Box>

          {/* 3-column layout */}
          <Grid container spacing={3}>
            {/* Left column - Filters */}
            <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  height: "fit-content",
                  position: "sticky",
                  top: 20,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">
                    {t("hotelSearch.filters", "Filters")}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    color="primary"
                    onClick={() => {
                      const calculatedMaxPrice = hotels.length > 0 
                        ? Math.max(...hotels.map(hotel => hotel.rawPrice || 0)) + 100 
                        : 1000;
                      setHotelFilters({
                        price: [0, calculatedMaxPrice],
                        reviewScore: 7,
                        stars: [],
                        discounts: [],
                        amenities: [],
                        accommodationType: [],
                        distanceFromCenter: null,
                        minDiscountPercentage: 0,
                        offerPartners: [],
                        taxPolicy: [],
                        guestType: null,
                        confidenceScore: null,
                      });
                    }}
                  >
                    {t("hotelFilters.clearAll", "Clear All")}
                  </Button>
                </Box>
                <Box
                  sx={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}
                >
                  <HotelFilters
                    filters={hotelFilters}
                    onChange={setHotelFilters}
                    minPrice={0}
                    maxPrice={hotels.length > 0 ? Math.max(...hotels.map(hotel => hotel.rawPrice || 0)) + 100 : 1000}
                    availablePartners={Array.from(new Set(hotels.flatMap(hotel => [
                      hotel.cheapestOfferPartnerName,
                      ...(hotel.otherRates?.map(rate => rate.partnerName) || [])
                    ]).filter(Boolean)))}
                    maxDistanceFromCenter={15}
                    maxConfidenceScore={5}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Middle column - Hotel results */}
            <Grid size={{ xs: 12, md: 6, lg: 6 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={filterValue}
                  onChange={handleFilterChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="hotel search filter tabs"
                  sx={{
                    "& .MuiTabs-flexContainer": {
                      "& .MuiButtonBase-root": {
                        "&:focus": {
                          outline: "none",
                        },
                      },
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#1976d2",
                    },
                  }}
                >
                  <Tab
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography>Recommended</Typography>
                        <InfoIcon
                          fontSize="small"
                          sx={{ ml: 0.5, width: 16, height: 16 }}
                        />
                      </Box>
                    }
                    value="recommended"
                  />
                  <Tab label="Top reviews" value="reviews" />
                  <Tab label="Lowest price" value="price" />
                  <Tab label="Most stars" value="stars" />
                  <Tab label="Closest" value="closest" />
                </Tabs>
              </Box>

              <HotelResults
                hotels={displayedHotels}
                loading={loading}
                error={error}
              />
            </Grid>

            {/* Right column - Map placeholder */}
            <Grid size={{ xs: 12, md: 3, lg: 3.5 }}>
              <Paper
                elevation={1}
                sx={{
                  position: "sticky",
                  top: 20,
                  height: "500px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {t(
                    "hotelSearch.mapPlaceholder",
                    "Map will be displayed here"
                  )}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default HotelSearch;
