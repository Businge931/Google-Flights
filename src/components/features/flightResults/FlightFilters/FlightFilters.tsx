import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
  Drawer,
  Radio,
  RadioGroup,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import type { FlightResult } from "../../../../types/flight";

export interface FlightFilters {
  stops: number[];
  airlines: string[];
  priceRange: [number, number];
  durationRange: [number, number]; // in minutes
  departureTimeRange: [number, number]; // in hours (0-24)
  arrivalTimeRange: [number, number]; // in hours (0-24)
  refundable: boolean | null;
  changeable: boolean | null;
}

interface FlightFiltersProps {
  flights: FlightResult[];
  onApplyFilters: (filters: FlightFilters) => void;
  activeFilters: FlightFilters;
  isMobile?: boolean;
}

const FlightFilters: React.FC<FlightFiltersProps> = ({
  flights,
  onApplyFilters,
  activeFilters,
  isMobile: forceMobile,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = forceMobile !== undefined ? forceMobile : isSmallScreen;
  const [mobileOpen, setMobileOpen] = useState(false);

  const [filters, setFilters] = useState<FlightFilters>(activeFilters);

  const availableAirlines = React.useMemo(() => {
    const airlinesSet = new Set<string>();

    flights.forEach((flight) => {
      flight.legs.forEach((leg) => {
        if (leg.carrier && leg.carrier.name) {
          airlinesSet.add(leg.carrier.name);
        }
      });
    });

    return Array.from(airlinesSet).sort();
  }, [flights]);

  // Calculate min/max price
  const [minPrice, maxPrice] = React.useMemo(() => {
    if (flights.length === 0) return [0, 1000];

    let min = Number.MAX_SAFE_INTEGER;
    let max = 0;

    flights.forEach((flight) => {
      min = Math.min(min, flight.price.amount);
      max = Math.max(max, flight.price.amount);
    });

    return [Math.floor(min), Math.ceil(max)];
  }, [flights]);

  // Calculate min/max duration
  const [minDuration, maxDuration] = React.useMemo(() => {
    if (flights.length === 0) return [0, 1440]; // 24 hours

    let min = Number.MAX_SAFE_INTEGER;
    let max = 0;

    flights.forEach((flight) => {
      flight.legs.forEach((leg) => {
        if (leg.duration) {
          min = Math.min(min, leg.duration);
          max = Math.max(max, leg.duration);
        }
      });
    });

    return [Math.floor(min), Math.ceil(max)];
  }, [flights]);

  // Initialize filters on component mount or when flights change
  useEffect(() => {
    if (flights.length === 0) return;

    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: [minPrice, maxPrice],
      durationRange: [minDuration, maxDuration],
    }));
  }, [flights, minPrice, maxPrice, minDuration, maxDuration]);

  const handleFilterChange = <K extends keyof FlightFilters>(
    key: K,
    value: FlightFilters[K]
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (hour: number) => {
    return `${hour}:00`;
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters: FlightFilters = {
      stops: [],
      airlines: [],
      priceRange: [minPrice, maxPrice],
      durationRange: [minDuration, maxDuration],
      departureTimeRange: [0, 24],
      arrivalTimeRange: [0, 24],
      refundable: null,
      changeable: null,
    };

    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0;

    if (filters.stops.length > 0) count++;
    if (filters.airlines.length > 0) count++;
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice)
      count++;
    if (
      filters.durationRange[0] > minDuration ||
      filters.durationRange[1] < maxDuration
    )
      count++;
    if (filters.departureTimeRange[0] > 0 || filters.departureTimeRange[1] < 24)
      count++;
    if (filters.arrivalTimeRange[0] > 0 || filters.arrivalTimeRange[1] < 24)
      count++;
    if (filters.refundable !== null) count++;
    if (filters.changeable !== null) count++;

    return count;
  }, [filters, minPrice, maxPrice, minDuration, maxDuration]);

  const filterContent = (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Filters</Typography>
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Stops Filter */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SyncAltIcon sx={{ mr: 1 }} />
            <Typography>Stops</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.stops.includes(0)}
                  onChange={(e) => {
                    const newStops = e.target.checked
                      ? [...filters.stops, 0]
                      : filters.stops.filter((s) => s !== 0);
                    handleFilterChange("stops", newStops);
                  }}
                />
              }
              label="Direct (0 stops)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.stops.includes(1)}
                  onChange={(e) => {
                    const newStops = e.target.checked
                      ? [...filters.stops, 1]
                      : filters.stops.filter((s) => s !== 1);
                    handleFilterChange("stops", newStops);
                  }}
                />
              }
              label="1 Stop"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.stops.includes(2)}
                  onChange={(e) => {
                    const newStops = e.target.checked
                      ? [...filters.stops, 2]
                      : filters.stops.filter((s) => s !== 2);
                    handleFilterChange("stops", newStops);
                  }}
                />
              }
              label="2+ Stops"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Price Filter */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AttachMoneyIcon sx={{ mr: 1 }} />
            <Typography>Price</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2 }}>
            <Slider
              value={filters.priceRange}
              onChange={(_, newValue) =>
                handleFilterChange("priceRange", newValue as [number, number])
              }
              valueLabelDisplay="auto"
              min={minPrice}
              max={maxPrice}
              valueLabelFormat={(value) => `$${value}`}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="body2">${filters.priceRange[0]}</Typography>
              <Typography variant="body2">${filters.priceRange[1]}</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Duration Filter */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccessTimeIcon sx={{ mr: 1 }} />
            <Typography>Duration</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2 }}>
            <Slider
              value={filters.durationRange}
              onChange={(_, newValue) =>
                handleFilterChange(
                  "durationRange",
                  newValue as [number, number]
                )
              }
              valueLabelDisplay="auto"
              min={minDuration}
              max={maxDuration}
              valueLabelFormat={(value) => formatDuration(value)}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="body2">
                {formatDuration(filters.durationRange[0])}
              </Typography>
              <Typography variant="body2">
                {formatDuration(filters.durationRange[1])}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Departure Time Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FlightTakeoffIcon sx={{ mr: 1 }} />
            <Typography>Departure Time</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2 }}>
            <Slider
              value={filters.departureTimeRange}
              onChange={(_, newValue) =>
                handleFilterChange(
                  "departureTimeRange",
                  newValue as [number, number]
                )
              }
              valueLabelDisplay="auto"
              min={0}
              max={24}
              step={1}
              valueLabelFormat={(value) => formatTime(value)}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="body2">
                {formatTime(filters.departureTimeRange[0])}
              </Typography>
              <Typography variant="body2">
                {formatTime(filters.departureTimeRange[1])}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Arrival Time Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FlightLandIcon sx={{ mr: 1 }} />
            <Typography>Arrival Time</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2 }}>
            <Slider
              value={filters.arrivalTimeRange}
              onChange={(_, newValue) =>
                handleFilterChange(
                  "arrivalTimeRange",
                  newValue as [number, number]
                )
              }
              valueLabelDisplay="auto"
              min={0}
              max={24}
              step={1}
              valueLabelFormat={(value) => formatTime(value)}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="body2">
                {formatTime(filters.arrivalTimeRange[0])}
              </Typography>
              <Typography variant="body2">
                {formatTime(filters.arrivalTimeRange[1])}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Airlines Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AirplanemodeActiveIcon sx={{ mr: 1 }} />
            <Typography>Airlines</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {availableAirlines.map((airline) => (
              <FormControlLabel
                key={airline}
                control={
                  <Checkbox
                    checked={filters.airlines.includes(airline)}
                    onChange={(e) => {
                      const newAirlines = e.target.checked
                        ? [...filters.airlines, airline]
                        : filters.airlines.filter((a) => a !== airline);
                      handleFilterChange("airlines", newAirlines);
                    }}
                  />
                }
                label={airline}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Fare Policy Filters */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AirlineSeatReclineNormalIcon sx={{ mr: 1 }} />
            <Typography>Fare Policy</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle2" gutterBottom>
            Refundable
          </Typography>
          <RadioGroup
            value={
              filters.refundable === null
                ? "any"
                : filters.refundable.toString()
            }
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange(
                "refundable",
                value === "any" ? null : value === "true"
              );
            }}
          >
            <FormControlLabel value="any" control={<Radio />} label="Any" />
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="Refundable"
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Non-refundable"
            />
          </RadioGroup>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Changeable
          </Typography>
          <RadioGroup
            value={
              filters.changeable === null
                ? "any"
                : filters.changeable.toString()
            }
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange(
                "changeable",
                value === "any" ? null : value === "true"
              );
            }}
          >
            <FormControlLabel value="any" control={<Radio />} label="Any" />
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="Changeable"
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Non-changeable"
            />
          </RadioGroup>
        </AccordionDetails>
      </Accordion>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={handleResetFilters}>
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  );

  // Mobile Filter Trigger Button
  const filterTrigger = isMobile && (
    <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FilterAltIcon />}
        onClick={() => setMobileOpen(true)}
        sx={{ borderRadius: 28, px: 2 }}
      >
        Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </Button>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            slotProps={{
              paper: {
                sx: { width: "85%", maxWidth: 360 },
              },
            }}
          >
            {filterContent}
          </Drawer>
          {filterTrigger}
        </>
      ) : (
        <Paper elevation={2} sx={{ height: "fit-content" }}>
          {filterContent}
        </Paper>
      )}
    </>
  );
};

export default FlightFilters;
