import React, { useState } from "react";
import { Box, Typography, Container, Paper, Tabs, Tab } from "@mui/material";
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

  // Hotel filters state
  const [hotelFilters, setHotelFilters] = useState<HotelFiltersType>({
    price: [0, 1000],
    reviewScore: 7,
    stars: [],
    discounts: [],
    amenities: [],
    accommodationType: [],
    popularWith: [],
  });

  const getHotelsByFilter = () => {
    if (!hotels || hotels.length === 0) return [];

    const filteredHotels = hotels.filter((hotel) => {
      // Price filter
      const hotelPrice =
        typeof hotel.price === "string" ? parseFloat(hotel.price) : hotel.price;
      if (
        hotelPrice < hotelFilters.price[0] ||
        hotelPrice > hotelFilters.price[1]
      ) {
        return false;
      }

      // Review score filter
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

      if (hotelFilters.accommodationType.length > 0) {
        const hotelName = hotel.name.toLowerCase();
        const matchesType = hotelFilters.accommodationType.some((type) => {
          // Check if hotel name contains words that might indicate the type
          // This is just a simple heuristic and not a proper solution
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
        // Sort by lowest price
        return [...filteredHotels].sort((a, b) => {
          const priceA =
            typeof a.price === "string" ? parseFloat(a.price) : a.price;
          const priceB =
            typeof b.price === "string" ? parseFloat(b.price) : b.price;
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
                <Typography variant="h6" gutterBottom>
                  {t("hotelSearch.filters", "Filters")}
                </Typography>
                <Box
                  sx={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}
                >
                  <HotelFilters
                    filters={hotelFilters}
                    onChange={setHotelFilters}
                    minPrice={0}
                    maxPrice={1000}
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
