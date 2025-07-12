import React from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTranslation } from "react-i18next";

const CarRentalSearch: React.FC = () => {
  const { t } = useTranslation();
  const [pickupDate, setPickupDate] = React.useState<Date | null>(null);
  const [returnDate, setReturnDate] = React.useState<Date | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for car rental search functionality
    console.log("Car rental search clicked");
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
          {t("carRental.findPerfectCar", "Find your perfect rental car")}
        </Typography>

        <Typography variant="body1" sx={{ maxWidth: 600, mb: 4, px: 2 }}>
          {t(
            "carRental.searchCompareRentals",
            "Search and compare car rentals from hundreds of providers to find the best vehicle for your trip."
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
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ p: { xs: 2, sm: 3 } }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t("carRental.pickupLocation", "Pickup Location")}
                  variant="outlined"
                  placeholder={t(
                    "carRental.locationPlaceholder",
                    "City, Airport, or Address"
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t(
                    "carRental.dropoffLocation",
                    "Drop-off Location (if different)"
                  )}
                  variant="outlined"
                  placeholder={t(
                    "carRental.locationPlaceholder",
                    "City, Airport, or Address"
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t("carRental.pickupDate", "Pickup Date")}
                    value={pickupDate}
                    onChange={(newValue) => setPickupDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t("carRental.returnDate", "Return Date")}
                    value={returnDate}
                    onChange={(newValue) => setReturnDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="car-type-label">
                    {t("carRental.carType", "Car Type")}
                  </InputLabel>
                  <Select
                    labelId="car-type-label"
                    defaultValue="all"
                    label={t("carRental.carType", "Car Type")}
                  >
                    <MenuItem value="all">
                      {t("carRental.allTypes", "All Types")}
                    </MenuItem>
                    <MenuItem value="economy">
                      {t("carRental.economy", "Economy")}
                    </MenuItem>
                    <MenuItem value="compact">
                      {t("carRental.compact", "Compact")}
                    </MenuItem>
                    <MenuItem value="midsize">
                      {t("carRental.midsize", "Midsize")}
                    </MenuItem>
                    <MenuItem value="suv">{t("carRental.suv", "SUV")}</MenuItem>
                    <MenuItem value="luxury">
                      {t("carRental.luxury", "Luxury")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="driver-age-label">
                    {t("carRental.driverAge", "Driver Age")}
                  </InputLabel>
                  <Select
                    labelId="driver-age-label"
                    defaultValue="25+"
                    label={t("carRental.driverAge", "Driver Age")}
                  >
                    <MenuItem value="18-24">
                      {t("carRental.age18to24", "18-24")}
                    </MenuItem>
                    <MenuItem value="25+">
                      {t("carRental.age25Plus", "25+")}
                    </MenuItem>
                    <MenuItem value="65+">
                      {t("carRental.age65Plus", "65+")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {t("carRental.searchCars", "Search Cars")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Container>
        <Box sx={{ mt: 4, mb: 8, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            {t("carRental.comingSoon", "Car Rental Search Coming Soon")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t(
              "carRental.featureInDevelopment",
              "This feature is currently in development. Check back later for updates!"
            )}
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default CarRentalSearch;
