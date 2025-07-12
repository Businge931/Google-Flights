import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Pagination,
  Grid,
  Stack,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import FlightCard from "../FlightCard/FlightCard";
import SortSelector from "../SortSelector/SortSelector";
import FlightFiltersComponent from "../FlightFilters/FlightFilters";
import type { FlightFilters } from "../FlightFilters/FlightFilters";
import { sortFlights } from "../utils/sortUtils";
import type { FlightResult } from "../../../../types/flight";
import type { SortOption } from "../SortSelector/sortTypes";

interface FlightResultsProps {
  results: FlightResult[];
  loading: boolean;
  error?: string | null;
  onSelectFlight?: (flight: FlightResult) => void;
}

const FlightResults: React.FC<FlightResultsProps> = ({
  results,
  loading,
  error,
  onSelectFlight,
}) => {
  // Pagination state
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Sorting state
  const [sortBy, setSortBy] = useState<SortOption>("best");

  // Use Material UI's responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Filter state
  const [filters, setFilters] = useState<FlightFilters>({
    stops: [],
    airlines: [],
    priceRange: [0, 10000],
    durationRange: [0, 3000],
    departureTimeRange: [0, 24],
    arrivalTimeRange: [0, 24],
    refundable: null,
    changeable: null,
  });

  // Apply filters to the results
  const filteredResults = useMemo(() => {
    return results.filter((flight) => {
      // Filter by stops
      if (filters.stops.length > 0) {
        const hasMatchingStop = flight.legs.some((leg) => {
          // For 2+ stops
          if (filters.stops.includes(2) && leg.stops >= 2) return true;
          // For exact stop count match (0 or 1)
          return filters.stops.includes(leg.stops);
        });
        if (!hasMatchingStop) return false;
      }

      // Filter by price
      if (
        flight.price.amount < filters.priceRange[0] ||
        flight.price.amount > filters.priceRange[1]
      ) {
        return false;
      }

      // Filter by duration
      const maxLegDuration = Math.max(
        ...flight.legs.map((leg) => leg.duration)
      );
      if (
        maxLegDuration < filters.durationRange[0] ||
        maxLegDuration > filters.durationRange[1]
      ) {
        return false;
      }

      // Filter by departure time (hour of day)
      if (
        filters.departureTimeRange[0] > 0 ||
        filters.departureTimeRange[1] < 24
      ) {
        const hasDepartureInRange = flight.legs.some((leg) => {
          const departureDate = new Date(leg.departure);
          const departureHour = departureDate.getHours();
          return (
            departureHour >= filters.departureTimeRange[0] &&
            departureHour <= filters.departureTimeRange[1]
          );
        });
        if (!hasDepartureInRange) return false;
      }

      // Filter by arrival time (hour of day)
      if (filters.arrivalTimeRange[0] > 0 || filters.arrivalTimeRange[1] < 24) {
        const hasArrivalInRange = flight.legs.some((leg) => {
          const arrivalDate = new Date(leg.arrival);
          const arrivalHour = arrivalDate.getHours();
          return (
            arrivalHour >= filters.arrivalTimeRange[0] &&
            arrivalHour <= filters.arrivalTimeRange[1]
          );
        });
        if (!hasArrivalInRange) return false;
      }

      // Filter by airlines
      if (filters.airlines.length > 0) {
        const hasSelectedAirline = flight.legs.some((leg) => {
          return filters.airlines.includes(leg.carrier.name);
        });
        if (!hasSelectedAirline) return false;
      }

      // We don't have farePolicy in FlightResult type, so skip these filters
      // If needed, these can be added when the API returns this data

      return true;
    });
  }, [results, filters]);

  // Calculate pagination properties
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const showPagination = filteredResults.length > ITEMS_PER_PAGE;

  // Sort and paginate filtered results
  const sortedAndPaginatedItems = useMemo(() => {
    // First sort the results based on selected criteria
    const sortedResults = sortFlights(filteredResults, sortBy);

    // Then paginate the sorted results
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedResults.slice(startIndex, endIndex);
  }, [filteredResults, sortBy, page]);

  // Handle sort changes
  const handleSortChange = useCallback((newSortOption: SortOption) => {
    setSortBy(newSortOption);
  }, []);

  // Handle pagination changes
  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    []
  );

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FlightFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  // Show loading state or error message if applicable
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3, mb: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Searching for flights...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3, mb: 5 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 5 }} id="flight-results-top">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" component="h2">
          Flight Results ({filteredResults.length})
          {showPagination && (
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              Page {page} of {totalPages}
            </Typography>
          )}
        </Typography>

        {/* Sorting dropdown */}
        <SortSelector sortBy={sortBy} onChange={handleSortChange} />
      </Stack>

      <Grid container spacing={3}>
        {/* Filters Column */}
        <Grid
          size={{ xs: 12, lg: 3 }}
          sx={{ display: { xs: "none", lg: "block" } }}
        >
          <FlightFiltersComponent
            flights={results}
            onApplyFilters={handleFilterChange}
            activeFilters={filters}
            isMobile={false}
          />
        </Grid>

        {/* Mobile Filters - Will render as a floating button and drawer */}
        <Box sx={{ display: { xs: "block", lg: "none" } }}>
          <FlightFiltersComponent
            flights={results}
            onApplyFilters={handleFilterChange}
            activeFilters={filters}
            isMobile={true}
          />
        </Box>

        {/* Results Column */}
        <Grid size={{ xs: 12, lg: 9 }}>
          {filteredResults.length === 0 ? (
            <Box sx={{ my: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No flights found matching your filters.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your filter criteria.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {sortedAndPaginatedItems.map((flight) => (
                <Grid size={{ xs: 12, lg: 6 }} key={flight.id}>
                  <FlightCard
                    flight={flight}
                    onSelect={() => {
                      if (onSelectFlight) {
                        onSelectFlight(flight);
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Pagination component - only shown if there are more than 10 results */}
      {showPagination && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            "& .MuiPagination-ul": {
              flexWrap: isMobile ? "nowrap" : "wrap",
            },
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
            siblingCount={isMobile ? 0 : 1}
          />
        </Box>
      )}
    </Container>
  );
};

export default FlightResults;
