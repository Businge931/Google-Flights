import React, { forwardRef, useState } from "react";
import {
  TextField,
  InputAdornment,
  Typography,
  Box,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import type { AutocompleteRenderInputParams } from "@mui/material";
import { getNearbyAirports } from "../../../services/airportService";
import NearbyAirportsDialog from "../NearbyAirportsDialog/NearbyAirportsDialog";
import type { AirportOption } from "../../../types/airport";
import { useNotification } from "../../../hooks/useNotification";

export interface Option {
  label: string;
  value: string;
  city: string;
  country: string;
  entityId: string;
}

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value?: Option | null;
  onChange?: (value: Option | null) => void;
  onInputChange?: (value: string) => void;
  options: Option[];
  startIcon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  name?: string;
  nearByAirport?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      onInputChange,
      options,
      startIcon,
      loading = false,
      fullWidth = true,
      disabled = false,
      required = false,
      error = false,
      helperText,
      nearByAirport = false,
    },
    ref
  ) => {
    const { showNotification } = useNotification();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [nearbyLoading, setNearbyLoading] = useState(false);
    const [nearbyError, setNearbyError] = useState<string | null>(null);
    const [currentAirport, setCurrentAirport] = useState<AirportOption | null>(
      null
    );
    const [nearbyAirports, setNearbyAirports] = useState<AirportOption[]>([]);

    const handleNearbyAirportsClick = () => {
      setDialogOpen(true);
      setNearbyLoading(true);
      setNearbyError(null);

      // Request user's geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const airportsData = await getNearbyAirports(latitude, longitude);

              setCurrentAirport(airportsData.current);
              setNearbyAirports(airportsData.nearby);
              setNearbyLoading(false);
            } catch (error) {
              console.error("Error fetching nearby airports:", error);
              setNearbyError(
                "Failed to fetch nearby airports. Please try again."
              );
              setNearbyLoading(false);
              showNotification("Failed to fetch nearby airports", "error");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setNearbyError(
              "Unable to access your location. Please allow location access and try again."
            );
            setNearbyLoading(false);
            showNotification(
              "Location access denied. Please enable location services.",
              "error"
            );
          }
        );
      } else {
        setNearbyError("Geolocation is not supported by this browser.");
        setNearbyLoading(false);
        showNotification(
          "Geolocation is not supported by your browser",
          "warning"
        );
      }
    };

    const handleDialogClose = () => {
      setDialogOpen(false);
    };

    const handleSelectAirport = (airport: AirportOption) => {
      if (onChange) {
        onChange(airport);
      }
      setDialogOpen(false);
    };

    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {label && (
            <Typography
              variant="caption"
              sx={{ pl: 1, mb: 0.5, display: "block" }}
            >
              {label}
              {required && <span style={{ color: "red" }}> *</span>}
            </Typography>
          )}
          {nearByAirport && (
            <Typography
              variant="caption"
              sx={{
                pl: 1,
                mb: 0.5,
                textAlign: "right",
                "&:hover": {
                  cursor: "pointer",
                  color: "primary.main",
                  textDecoration: "underline",
                },
              }}
              onClick={handleNearbyAirportsClick}
            >
              Want nearby airports?
            </Typography>
          )}
        </Box>
        <Autocomplete
          options={options}
          value={value}
          onChange={(_, newValue) => {
            if (onChange) {
              onChange(newValue);
            }
          }}
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              <div>
                <Typography variant="body1">{option.label}</Typography>
                {option.city && option.country && (
                  <Typography variant="caption" color="text.secondary">
                    {option.city}, {option.country}
                  </Typography>
                )}
              </div>
            </li>
          )}
          onInputChange={(_, newInputValue, reason) => {
            // Only trigger search when user is typing, not when selecting an item
            if (onInputChange && reason === "input") {
              onInputChange(newInputValue);
            }
          }}
          fullWidth={fullWidth}
          disabled={disabled}
          loading={loading}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              placeholder={placeholder}
              inputRef={ref}
              error={error}
              helperText={helperText}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    {startIcon && (
                      <InputAdornment position="start">
                        {startIcon}
                      </InputAdornment>
                    )}
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {loading && <CircularProgress color="inherit" size={20} />}
                  </>
                ),
                sx: { borderRadius: 2, height: 56 },
              }}
            />
          )}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        {/* Nearby Airports Dialog */}
        <NearbyAirportsDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onSelectAirport={handleSelectAirport}
          loading={nearbyLoading}
          error={nearbyError}
          currentAirport={currentAirport}
          nearbyAirports={nearbyAirports}
        />
      </Box>
    );
  }
);

export default InputField;
