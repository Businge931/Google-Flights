import {
  ThemeProvider,
  CssBaseline,
  Box,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import theme from "./theme";
import { SearchForm, Header, FlightResults } from "./components";
import { NotificationProvider } from "./context/NotificationProvider";
import { FlightProvider } from "./context/FlightProvider";
import { HotelProvider } from "./context/HotelContext";
import { useFlightContext } from "./context/useFlightContext";
import { LocalizationProvider } from "./context/LocalizationContext";
import { NavigationProvider } from "./context/NavigationContext";
import useNavigation from "./hooks/useNavigation";
import { useTranslation } from "react-i18next";
import type { FlightResult } from "./types/flight";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import FlightDetails from "./components/features/flightDetails/FlightDetails/FlightDetails";
import HotelSearch from "./components/features/hotels/HotelSearch/HotelSearch";
import CarRentalSearch from "./components/features/cars/CarRentalSearch/CarRentalSearch";
import HotelDetails from "./components/features/hotels/HotelDetails";

function FlightResultsContainer() {
  const {
    searchResults,
    loading,
    error,
    selectFlight: selectFlightById,
  } = useFlightContext();
  const navigate = useNavigate();

  const selectFlight = (flight: FlightResult) => {
    if (flight && flight.id) {
      // First select the flight in context to trigger API call
      selectFlightById(flight.id);
      // Then navigate to flight details page
      navigate(`/flight/${flight.id}`);
    }
  };

  return (
    (searchResults || loading || error) && (
      <Box sx={{ mt: 3, px: { xs: 2, sm: 3, md: 10 }, pb: 3 }}>
        <Divider sx={{ my: 2 }} />
        <FlightResults
          results={searchResults || []}
          loading={loading}
          error={error}
          onSelectFlight={selectFlight}
        />
      </Box>
    )
  );
}

function MainContent() {
  const { activeTab } = useNavigation();

  switch (activeTab) {
    case "flights":
      return <FlightsTabContent />;
    case "hotels":
      return (
        <HotelProvider>
          <HotelSearch />
        </HotelProvider>
      );
    case "cars":
      return <CarRentalSearch />;
    default:
      return <FlightsTabContent />;
  }
}

// Original flights content
function FlightsTabContent() {
  const { t } = useTranslation();

  return (
    <>
      {/* Blue hero section with heading */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "primary.main",
          // backgroundColor: "#05203c",
          color: "white",
          pt: 4,
          pb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          flexGrow: 0,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {t("searchForm.findYourPerfectFlight", "Find your perfect flight")}
        </Typography>

        <Typography variant="body1" sx={{ maxWidth: 600, mb: 4, px: 2 }}>
          {t(
            "searchForm.searchCompareFlights",
            "Search and compare flights from hundreds of airlines and travel sites to find the best deals for your next trip."
          )}
        </Typography>
      </Box>

      {/* Main content area with search form */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "background.default",
          mt: -3,
          display: "flex",
          justifyContent: "center",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 1000,
            borderRadius: 2,
            mt: -3,
            overflow: "hidden",
            mb: 4,
          }}
        >
          <SearchForm />
        </Paper>
      </Box>
      <FlightResultsContainer />
    </>
  );
}

function App() {
  return (
    <Router>
      <LocalizationProvider>
        <NavigationProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <NotificationProvider>
              <FlightProvider>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    width: "100vw",
                    overflow: "auto",
                  }}
                >
                  <Header />
                  <Routes>
                    <Route path="/" element={<MainContent />} />
                    <Route
                      path="/flight/:flightId"
                      element={<FlightDetails />}
                    />
                    <Route
                      path="/hotel/:hotelId/:hotelName"
                      element={<HotelDetails />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Box>
              </FlightProvider>
            </NotificationProvider>
          </ThemeProvider>
        </NavigationProvider>
      </LocalizationProvider>
    </Router>
  );
}

export default App;
