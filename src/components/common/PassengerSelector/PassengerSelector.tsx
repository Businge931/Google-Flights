import React from "react";
import { Box, Typography, Popover, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerSelectorProps {
  value: number; // Total passengers (for backward compatibility)
  onChange?: (value: number) => void; // Total passengers (for backward compatibility)
  onPassengerChange?: (passengers: PassengerCounts) => void; // New detailed breakdown
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  // Optional initial values for each passenger type
  initialPassengers?: PassengerCounts;
}

const PassengerSelector: React.FC<PassengerSelectorProps> = ({
  value,
  onChange,
  onPassengerChange,
  label = "Passengers",
  required = false,
  disabled = false,
  error = false,
  helperText,
  initialPassengers,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  // Initialize detailed passenger counts
  const [passengerCounts, setPassengerCounts] = React.useState<PassengerCounts>(
    () => {
      if (initialPassengers) {
        return { ...initialPassengers };
      }
      return {
        adults: value || 1, // Default to 1 adult if no value
        children: 0,
        infants: 0,
      };
    }
  );

  // Calculate total passenger count
  const totalPassengers =
    passengerCounts.adults + passengerCounts.children + passengerCounts.infants;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Update passenger counts with validation
  const updatePassengerCounts = (
    type: keyof PassengerCounts,
    delta: number
  ) => {
    if (disabled) return;

    const newCounts = { ...passengerCounts };

    // Apply change with validation
    if (type === "adults") {
      // Ensure at least 1 adult and that infants don't exceed adults
      if (delta < 0 && newCounts.adults <= 1) return;
      if (delta < 0 && newCounts.infants > newCounts.adults - 1) return;
      newCounts.adults += delta;
    } else if (type === "children") {
      // Children can't be negative
      if (delta < 0 && newCounts.children <= 0) return;
      newCounts.children += delta;
    } else if (type === "infants") {
      // Infants can't be negative or exceed adults
      if (delta < 0 && newCounts.infants <= 0) return;
      if (delta > 0 && newCounts.infants >= newCounts.adults) return;
      newCounts.infants += delta;
    }

    // Update local state
    setPassengerCounts(newCounts);

    // Call the detailed callback if provided
    if (onPassengerChange) {
      onPassengerChange(newCounts);
    }

    // Call the legacy callback with total count
    if (onChange) {
      onChange(newCounts.adults + newCounts.children + newCounts.infants);
    }
  };

  const handleDone = () => {
    handleClose();
  };

  return (
    <Box sx={{ width: "100%" }}>
      {label && (
        <Typography variant="caption" sx={{ pl: 1, mb: 0.5, display: "block" }}>
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </Typography>
      )}
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid",
          borderColor: error ? "error.main" : "divider",
          borderRadius: 2,
          p: 1,
          height: 56, // Match the height of other inputs
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.7 : 1,
          "&:hover": {
            borderColor: disabled
              ? error
                ? "error.main"
                : "divider"
              : "primary.main",
          },
        }}
      >
        <PersonIcon color="action" sx={{ ml: 1 }} />
        <Typography
          color={error ? "error" : "primary"}
          sx={{
            ml: 1,
            fontWeight: "medium",
            textDecoration: open ? "underline" : "none",
            "&:hover": {
              textDecoration: disabled ? "none" : "underline",
            },
          }}
        >
          {totalPassengers} Passenger{totalPassengers !== 1 ? "s" : ""}
        </Typography>
      </Box>
      {helperText && (
        <Typography
          variant="caption"
          sx={{
            pl: 1,
            color: error ? "error.main" : "text.secondary",
          }}
        >
          {helperText}
        </Typography>
      )}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            p: 2,
            width: 300,
            mt: 1,
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Passengers
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Select number of passengers by category
        </Typography>

        {/* Adults */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon fontSize="small" />
            <Typography variant="body1">Adults</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="button"
              color="primary"
              onClick={() => updatePassengerCounts("adults", -1)}
              sx={{
                cursor:
                  passengerCounts.adults > 1 &&
                  passengerCounts.infants < passengerCounts.adults &&
                  !disabled
                    ? "pointer"
                    : "default",
                opacity:
                  passengerCounts.adults > 1 &&
                  passengerCounts.infants < passengerCounts.adults &&
                  !disabled
                    ? 1
                    : 0.5,
                fontWeight: "bold",
                fontSize: "1.5rem",
                userSelect: "none",
              }}
            >
              -
            </Typography>
            <Typography
              variant="body1"
              sx={{ minWidth: "20px", textAlign: "center" }}
            >
              {passengerCounts.adults}
            </Typography>
            <Typography
              variant="button"
              color="primary"
              onClick={() => updatePassengerCounts("adults", 1)}
              sx={{
                cursor: !disabled ? "pointer" : "default",
                fontWeight: "bold",
                fontSize: "1.5rem",
                userSelect: "none",
              }}
            >
              +
            </Typography>
          </Box>
        </Box>

        {/* Children (2-12 years) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ChildCareIcon fontSize="small" />
            <Box>
              <Typography variant="body1">Children</Typography>
              <Typography variant="caption" color="text.secondary">
                2-12 years
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="button"
              color="primary"
              onClick={() => updatePassengerCounts("children", -1)}
              sx={{
                cursor:
                  passengerCounts.children > 0 && !disabled
                    ? "pointer"
                    : "default",
                opacity: passengerCounts.children > 0 && !disabled ? 1 : 0.5,
                fontWeight: "bold",
                fontSize: "1.5rem",
                userSelect: "none",
              }}
            >
              -
            </Typography>
            <Typography
              variant="body1"
              sx={{ minWidth: "20px", textAlign: "center" }}
            >
              {passengerCounts.children}
            </Typography>
            <Typography
              variant="button"
              color="primary"
              onClick={() => updatePassengerCounts("children", 1)}
              sx={{
                cursor: !disabled ? "pointer" : "default",
                fontWeight: "bold",
                fontSize: "1.5rem",
                userSelect: "none",
              }}
            >
              +
            </Typography>
          </Box>
        </Box>

        {/* Infants (under 2 years) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BabyChangingStationIcon fontSize="small" />
            <Box>
              <Typography variant="body1">Infants</Typography>
              <Typography variant="caption" color="text.secondary">
                Under 2 years
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="button"
              color="primary"
              onClick={() => updatePassengerCounts("infants", -1)}
              sx={{
                cursor:
                  passengerCounts.infants > 0 && !disabled
                    ? "pointer"
                    : "default",
                opacity: passengerCounts.infants > 0 && !disabled ? 1 : 0.5,
                fontWeight: "bold",
                fontSize: "1.5rem",
                userSelect: "none",
              }}
            >
              -
            </Typography>
            <Typography
              variant="body1"
              sx={{ minWidth: "20px", textAlign: "center" }}
            >
              {passengerCounts.infants}
            </Typography>
            <Tooltip
              title={
                passengerCounts.infants >= passengerCounts.adults
                  ? "Number of infants cannot exceed number of adults"
                  : ""
              }
            >
              <span>
                <Typography
                  variant="button"
                  color="primary"
                  onClick={() => updatePassengerCounts("infants", 1)}
                  sx={{
                    cursor:
                      passengerCounts.infants < passengerCounts.adults &&
                      !disabled
                        ? "pointer"
                        : "default",
                    opacity:
                      passengerCounts.infants < passengerCounts.adults &&
                      !disabled
                        ? 1
                        : 0.5,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    userSelect: "none",
                  }}
                >
                  +
                </Typography>
              </span>
            </Tooltip>
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{ display: "block", color: "text.secondary", mb: 2 }}
        >
          * Each infant must be assigned to an adult
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography
            variant="button"
            color="primary"
            onClick={handleDone}
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Done
          </Typography>
        </Box>
      </Popover>
    </Box>
  );
};

export default PassengerSelector;
