import React from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  InputField,
  CustomDatePicker,
  Dropdown,
  CustomButton,
  PassengerSelector,
} from "../../../../components";
import type { Option } from "../../../../components/common/InputField/InputField";

import { searchFormSchema } from "./schema";
import type { FlightSearchFormData } from "./schema";
import type {
  FlightSearchData,
  SearchFormProps,
} from "../../../../types/flightSearch";
import type { AirportOption } from "../../../../types/airport";
import { CABIN_CLASS_OPTIONS } from "./constants";
import { useFlightContext } from "../../../../context/useFlightContext";
import { useAirportSearch } from "../../../../hooks/useAirportSearch";

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FlightSearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      tripType: "roundTrip" as const,
      origin: null,
      destination: null,
      departureDate: new Date(),
      returnDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      passengers: 1,
      cabinClass: "Economy",
    },
  });

  const tripType = watch("tripType");

  // Use our optimized airport search hook with built-in debouncing
  const {
    originOptions,
    originLoading,
    handleOriginInputChange,
    destinationOptions,
    destinationLoading,
    handleDestinationInputChange,
  } = useAirportSearch(350); // 350ms debounce

  const { searchFlights, loading } = useFlightContext();

  const handleTripTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTripType: "roundTrip" | "oneWay" | null
  ) => {
    if (newTripType !== null) {
      setValue("tripType", newTripType);
    }
  };

  const onSubmit = async (data: FlightSearchFormData) => {
    console.log("Form submitted with values:", data);

    // Transform form values into search data
    const passengerDetails =
      typeof data.passengers === "object"
        ? data.passengers
        : { adults: data.passengers, children: 0, infants: 0 };

    const defaultAirport = {
      label: "",
      value: "",
      city: "",
      country: "",
      entityId: "",
    } satisfies AirportOption;

    const searchData: FlightSearchData = {
      tripType: data.tripType,
      origin: data.origin || defaultAirport,
      destination: data.destination || defaultAirport,
      departureDate: data.departureDate,
      // Only include returnDate for round trips
      returnDate: data.tripType === "oneWay" ? null : data.returnDate,
      passengers:
        typeof data.passengers === "number"
          ? data.passengers
          : passengerDetails.adults +
            passengerDetails.children +
            passengerDetails.infants,
      passengerDetails,
      cabinClass: data.cabinClass,
    };

    // Call the search flights method from context
    await searchFlights(searchData);

    // Call the onSearch callback if provided (for any parent component handling)
    if (onSearch) {
      onSearch(searchData);
    }
  };

  const handleSwapLocations = () => {
    // Get current values
    const origin = watch("origin");
    const destination = watch("destination");

    // Swap form values
    setValue("origin", destination);
    setValue("destination", origin);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        component={Paper}
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Trip Type Toggle */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Controller
            name="tripType"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                value={field.value}
                exclusive
                onChange={handleTripTypeChange}
                aria-label="trip type"
                sx={{
                  "& .MuiToggleButtonGroup-grouped": {
                    px: 3,
                    py: 1,
                    border: 1,
                    borderColor: "divider",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "primary.light",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  },
                }}
              >
                <ToggleButton value="roundTrip">Round trip</ToggleButton>
                <ToggleButton value="oneWay">One way</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Box>

        {/* Main Form Layout */}
        <Stack spacing={3}>
          {/* From and To Fields Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Controller
                name="origin"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="From"
                    placeholder="Country,City or airport"
                    value={field.value as Option | null}
                    onChange={(newValue) => field.onChange(newValue)}
                    onInputChange={handleOriginInputChange}
                    options={originOptions as Option[]}
                    startIcon={<FlightTakeoffIcon color="action" />}
                    loading={originLoading}
                    error={!!errors.origin}
                    helperText={errors.origin?.message}
                    required
                    nearByAirport
                  />
                )}
              />
            </Box>

            {/* Swap Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "center", sm: "flex-end" },
                justifyContent: "center",
                pb: { xs: 0, sm: 1 },
                mx: { xs: "auto", sm: 0 },
                my: { xs: 1, sm: 0 },
              }}
            >
              <IconButton
                onClick={handleSwapLocations}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "50%",
                }}
              >
                <SwapHorizIcon />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Controller
                name="destination"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="To"
                    placeholder="Country,City or airport"
                    value={field.value as Option | null}
                    onChange={(newValue) => field.onChange(newValue)}
                    onInputChange={handleDestinationInputChange}
                    options={destinationOptions as Option[]}
                    startIcon={<FlightLandIcon color="action" />}
                    loading={destinationLoading}
                    error={!!errors.destination}
                    helperText={errors.destination?.message}
                    required
                  />
                )}
              />
            </Box>
          </Box>

          {/* Date Selection Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Controller
                name="departureDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    label="Depart"
                    value={field.value}
                    onChange={(newDate: Date | null) => field.onChange(newDate)}
                    startIcon={<CalendarMonthIcon color="action" />}
                    error={!!errors.departureDate}
                    helperText={errors.departureDate?.message}
                    minDate={new Date()} // Cannot select dates before today
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Controller
                name="returnDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    label="Return"
                    value={field.value}
                    onChange={(newDate: Date | null) => field.onChange(newDate)}
                    disabled={tripType === "oneWay"}
                    startIcon={<CalendarMonthIcon color="action" />}
                    error={!!errors.returnDate}
                    helperText={errors.returnDate?.message}
                    minDate={watch("departureDate") || new Date()} // Cannot select dates before departure date or today
                  />
                )}
              />
            </Box>
          </Box>

          {/* Passengers and Cabin Class Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Controller
                name="passengers"
                control={control}
                render={({ field }) => (
                  <PassengerSelector
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    error={!!errors.passengers}
                    helperText={errors.passengers?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Controller
                name="cabinClass"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    label="Cabin class"
                    value={field.value}
                    onChange={(e: SelectChangeEvent<string>) =>
                      field.onChange(e.target.value)
                    }
                    error={!!errors.cabinClass}
                    helperText={errors.cabinClass?.message}
                    options={CABIN_CLASS_OPTIONS}
                  />
                )}
              />
            </Box>
          </Box>
        </Stack>

        {/* Search Button - Centered */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <CustomButton
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit(onSubmit)}
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              py: 1,
              width: { xs: "100%", sm: "auto" },
              minWidth: { sm: "200px" },
            }}
          >
            {loading ? "Searching..." : "Search Flights"}
          </CustomButton>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default SearchForm;
