import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Grid,
  Container,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useFlightContext } from "../../../../context/useFlightContext";
import {
  formatDuration,
  formatTime,
  formatDateForDisplay,
} from "../../../../utils/dateUtils";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import type { FlightResult } from "../../../../types/flight";

interface FlightDetailsProps {
  flightId?: string;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({ flightId: propFlightId }) => {
  const {
    selectedFlightId,
    selectedFlightDetails,
    flightDetailsLoading,
    flightDetailsError,
    loadFlightDetails,
    searchResults,
  } = useFlightContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Get flightId from URL params if available
  const { flightId: urlFlightId } = useParams<{ flightId: string }>();
  
  // Get the flight ID from props, URL params, or context (in that order of priority)
  const currentFlightId = propFlightId || urlFlightId || selectedFlightId;

  // Find the selected flight from search results for basic info
  const flight = searchResults?.find((f) => f.id === currentFlightId) || null;

  // Load flight details only on mount or when flightId changes, and only if not already failed
  useEffect(() => {
    if (currentFlightId && !flightDetailsError) {
      // Only load flight details if we haven't already encountered an error
      loadFlightDetails(currentFlightId);
      console.log("Loading flight details for ID:", currentFlightId);
    }
  }, [currentFlightId, loadFlightDetails, flightDetailsError]);

  // Handle back button click
  const handleBackClick = () => {
    navigate("/");
  };

  if (!currentFlightId || !flight) {
    return (
      <Container>
        <Paper sx={{ p: 4, mt: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            {t("flightDetails.noFlightSelected", "No flight selected")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackClick}
            sx={{ mt: 2 }}
          >
            {t("common.backToSearch", "Back to Search")}
          </Button>
        </Paper>
      </Container>
    );
  }

  if (flightDetailsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (flightDetailsError) {
    return (
      <Container>
        <Paper sx={{ p: 4, mt: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error" gutterBottom>
            {t("flightDetails.errorLoading", "Error loading flight details")}
          </Typography>
          <Typography>{flightDetailsError}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackClick}
            sx={{ mt: 2 }}
          >
            {t("common.backToSearch", "Back to Search")}
          </Button>
        </Paper>
      </Container>
    );
  }

  // Use basic flight info if detailed info isn't available yet
  const flightData = selectedFlightDetails?.data?.itinerary || null;

  if (!flightData && flight) {
    // If we don't have detailed data but have basic flight info, show that
    return renderBasicFlightInfo(flight);
  }

  // Get flight legs from detailed data
  const legs = flightData?.legs || [];
  const pricingOptions = flightData?.pricingOptions || [];
  
  // Safely access flight price data with null checks
  const bestPrice = pricingOptions.length > 0
    ? pricingOptions[0].totalPrice
    : flight?.price?.amount || 0;
    
  // Use 'formatted' property which has the currency symbol, or extract currency code if available
  const currency = flight?.price?.formatted
    ? flight.price.formatted.replace(/[0-9,.]/g, "").trim()
    : "USD";

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, pb: 6, px: isMobile ? 1 : 3 }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackClick}
        sx={{ mb: 2 }}
        size={isMobile ? "small" : "medium"}
      >
        {t("common.backToSearch", "Back to Search")}
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        {t("flightDetails.flightDetails", "Flight Details")}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h5">
              {flight.legs[0].origin.city} →{" "}
              {flight.legs[flight.legs.length - 1].destination.city}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formatDateForDisplay(flight.legs[0].departure)}
              {flight.legs.length > 1 &&
                ` - ${formatDateForDisplay(flight.legs[1].departure)}`}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" color="primary">
              {currency} {bestPrice.toFixed(2)}
            </Typography>
            <Chip
              label={
                flight.legs[0].stops === 0
                  ? t("flightDetails.nonstop", "Non-stop")
                  : `${flight.legs[0].stops} ${t(
                      "flightDetails.stops",
                      "stops"
                    )}`
              }
              color={flight.legs[0].stops === 0 ? "success" : "default"}
              size="small"
              sx={{ mr: 1 }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Iterate through each leg and display detailed information */}
      {legs.map((leg, index) => (
        <Card key={leg.id} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {index === 0
                ? t("flightDetails.outbound", "Outbound")
                : t("flightDetails.return", "Return")}{" "}
              {t("flightDetails.flight", "Flight")}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Flight header with airline info */}
            {leg.segments.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {leg.segments[0].marketingCarrier.logo && (
                  <Avatar
                    src={leg.segments[0].marketingCarrier.logo}
                    alt={leg.segments[0].marketingCarrier.name}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                )}
                <Box>
                  <Typography variant="subtitle1">
                    {leg.segments[0].marketingCarrier.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {leg.segments[0].marketingCarrier.displayCode}{" "}
                    {leg.segments[0].flightNumber}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Origin and destination with times */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <FlightTakeoffIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Box>
                    <Typography variant="h6">
                      {formatTime(leg.departure)}
                    </Typography>
                    <Typography variant="body1">{leg.origin.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {leg.origin.city} ({leg.origin.displayCode})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <EventIcon
                        sx={{
                          fontSize: "1rem",
                          mr: 0.5,
                          verticalAlign: "text-bottom",
                        }}
                      />
                      {formatDateForDisplay(leg.departure)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid
                size={{ xs: 12, md: 2 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    <AccessTimeIcon
                      sx={{
                        fontSize: "1rem",
                        mr: 0.5,
                        verticalAlign: "text-bottom",
                      }}
                    />
                    {formatDuration(leg.duration)}
                  </Typography>
                  <Box sx={{ position: "relative", width: "100%", py: 1 }}>
                    <Divider sx={{ width: "100%" }} />
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(45deg)",
                        bgcolor: "background.paper",
                        p: 0.5,
                        borderRadius: "50%",
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "primary.main",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {leg.stopCount === 0
                      ? t("flightDetails.nonstop", "Non-stop")
                      : `${leg.stopCount} ${
                          leg.stopCount === 1
                            ? t("flightDetails.stop", "stop")
                            : t("flightDetails.stops", "stops")
                        }`}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <FlightLandIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Box>
                    <Typography variant="h6">
                      {formatTime(leg.arrival)}
                    </Typography>
                    <Typography variant="body1">
                      {leg.destination.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {leg.destination.city} ({leg.destination.displayCode})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <EventIcon
                        sx={{
                          fontSize: "1rem",
                          mr: 0.5,
                          verticalAlign: "text-bottom",
                        }}
                      />
                      {formatDateForDisplay(leg.arrival)}
                      {leg.dayChange > 0 && (
                        <Chip
                          label={`+${leg.dayChange} ${
                            leg.dayChange === 1
                              ? t("flightDetails.day", "day")
                              : t("flightDetails.days", "days")
                          }`}
                          size="small"
                          sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                        />
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Flight segments for multi-segment legs */}
            {leg.segments.length > 1 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t("flightDetails.flightSegments", "Flight Segments")}
                </Typography>

                {leg.segments.map((segment, idx) => (
                  <Paper
                    key={segment.id}
                    variant="outlined"
                    sx={{ p: 2, mb: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2">
                        {segment.marketingCarrier.name}{" "}
                        {segment.marketingCarrier.displayCode}
                        {segment.flightNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <AccessTimeIcon
                          sx={{
                            fontSize: "1rem",
                            mr: 0.5,
                            verticalAlign: "text-bottom",
                          }}
                        />
                        {formatDuration(segment.duration)}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 5 }}>
                        <Typography variant="body2">
                          <strong>{formatTime(segment.departure)}</strong>{" "}
                          {segment.origin.displayCode}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateForDisplay(segment.departure)}
                        </Typography>
                      </Grid>

                      <Grid
                        size={{ xs: 2 }}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{ width: "100%", height: 1, bgcolor: "divider" }}
                        />
                      </Grid>

                      <Grid size={{ xs: 5 }}>
                        <Typography variant="body2" sx={{ textAlign: "right" }}>
                          <strong>{formatTime(segment.arrival)}</strong>{" "}
                          {segment.destination.displayCode}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textAlign: "right", display: "block" }}
                        >
                          {formatDateForDisplay(segment.arrival)}
                          {segment.dayChange > 0 && ` (+${segment.dayChange})`}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* If not the last segment, show connection time */}
                    {idx < leg.segments.length - 1 && (
                      <Box
                        sx={{
                          mt: 2,
                          bgcolor: "action.hover",
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption">
                          {t("flightDetails.connection", "Connection")} •{" "}
                          {formatDuration(
                            calculateConnectionTime(
                              segment.arrival,
                              leg.segments[idx + 1].departure
                            )
                          )}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            )}
          </CardContent>

          {/* Booking options */}
          {pricingOptions.length > 0 && (
            <CardActions
              sx={{ flexDirection: "column", alignItems: "stretch", p: 2 }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {t("flightDetails.bookingOptions", "Booking Options")}
              </Typography>

              {pricingOptions[0].agents.map((agent) => (
                <Box
                  key={agent.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    py: 1,
                  }}
                >
                  <Typography variant="body2">{agent.name}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                      {currency} {agent.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      component="a"
                      href={agent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<AirplaneTicketIcon />}
                    >
                      {t("flightDetails.book", "Book")}
                    </Button>
                  </Box>
                </Box>
              ))}
            </CardActions>
          )}
        </Card>
      ))}
    </Container>
  );

  // Helper function to render basic flight info when detailed data isn't available
  function renderBasicFlightInfo(flight: FlightResult) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, pb: 8 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ mb: 2 }}
        >
          {t("common.backToSearch", "Back to Search")}
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          {t("flightDetails.flightDetails", "Flight Details")}
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="h5">
                {flight.legs[0]?.origin?.city || ""} →{" "}
                {flight.legs[flight.legs.length - 1]?.destination?.city || ""}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {flight.legs[0]?.departure ? formatDateForDisplay(flight.legs[0].departure) : ""}
                {flight.legs.length > 1 && flight.legs[1]?.departure &&
                  ` - ${formatDateForDisplay(flight.legs[1].departure)}`}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" color="primary">
                {flight.price?.formatted || `${flight.price?.amount?.toFixed(2) || "0.00"}`}
              </Typography>
              <Chip
                label={
                  flight.legs[0]?.stops === 0
                    ? t("flightDetails.nonstop", "Non-stop")
                    : `${flight.legs[0]?.stops || 0} ${t(
                        "flightDetails.stops",
                        "stops"
                      )}`
                }
                color={flight.legs[0]?.stops === 0 ? "success" : "default"}
                size="small"
                sx={{ mr: 1 }}
              />
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mt: 3, textAlign: "center" }}>
            {t(
              "flightDetails.loadingDetailedInfo",
              "Loading detailed flight information..."
            )}
          </Typography>
        </Paper>
      </Container>
    );
  }
};

// Helper function to calculate connection time between segments
function calculateConnectionTime(
  arrivalTime: string,
  departureTime: string
): number {
  const arrival = new Date(arrivalTime).getTime();
  const departure = new Date(departureTime).getTime();
  return (departure - arrival) / 60000; // Convert milliseconds to minutes
}

export default FlightDetails;
