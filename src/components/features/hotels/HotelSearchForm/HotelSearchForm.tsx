import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Popover,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { HotelSearchFormData } from "./schema";
import { hotelSearchSchema, defaultFormValues } from "./schema";
import { useHotelContext } from "../../../../hooks/useHotelContext";
import { useHotelDestinationSearch } from "../../../../hooks/useHotelDestinationSearch";
import type { HotelDestination } from "../../../../services/hotelService";

const HotelSearchForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<HotelSearchFormData>({
    resolver: zodResolver(hotelSearchSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  const adults = watch("adults");
  const children = watch("children");
  const rooms = watch("rooms");

  // Use custom hook for destination search
  const { loading, options, search } = useHotelDestinationSearch();
  const [selectedDestination, setSelectedDestination] =
    useState<HotelDestination | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const guestsPopoverOpen = Boolean(anchorEl);

  const formatGuestsRoomsLabel = () => {
    const guestsText = adults + children === 1 ? "guest" : "guests";
    const roomsText = rooms === 1 ? "room" : "rooms";
    return `${adults + children} ${guestsText}, ${rooms} ${roomsText}`;
  };

  const handleGuestsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGuestsClose = () => {
    setAnchorEl(null);
  };

  const { searchHotels } = useHotelContext();

  const onSubmit = (data: HotelSearchFormData) => {
    // Include the entityId from the selected destination
    const searchData = {
      ...data,
      // Pass the entityId if a destination was selected
      entityId: selectedDestination?.entityId,
    };
    searchHotels(searchData);
  };

  const updateAdults = (newValue: number) => {
    setValue("adults", newValue);
    // If rooms exceeds adults, reduce rooms count
    if (rooms > newValue) {
      setValue("rooms", newValue);
    }
  };

  const updateChildren = (newValue: number) => {
    setValue("children", newValue);
  };

  const updateRooms = (newValue: number) => {
    setValue("rooms", newValue);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          mb: 3,
        }}
      >
        <Box
          sx={{
            flex: 3,
            p: 2,
            display: "flex",
            alignItems: "center",
            borderRight: { xs: "none", md: "1px solid #e0e0e0" },
          }}
        >
          <Controller
            name="destination"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                fullWidth
                options={options}
                loading={loading}
                value={selectedDestination}
                onChange={(_, newValue) => {
                  setSelectedDestination(newValue);
                  field.onChange(newValue ? newValue.entityName : "");
                }}
                onInputChange={(_, newInputValue) => {
                  search(newInputValue);
                  field.onChange(newInputValue);
                }}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.entityName
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Where would you like to stay?"
                    variant="outlined"
                    size="small"
                    error={!!errors.destination}
                    helperText={errors.destination?.message}
                    sx={{ mr: 1 }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.entityId}>
                    <Box>
                      <Typography variant="body1">
                        {option.entityName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.hierarchy}
                      </Typography>
                    </Box>
                  </li>
                )}
                isOptionEqualToValue={(option, value) =>
                  option.entityId === value?.entityId
                }
              />
            )}
          />
        </Box>

        <Box
          sx={{
            flex: 1.5,
            p: 2,
            display: "flex",
            alignItems: "center",
            borderRight: { xs: "none", md: "1px solid #e0e0e0" },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="checkIn"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Check-in"
                  value={field.value}
                  onChange={field.onChange}
                  format="MM/dd/yy"
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      error: !!errors.checkIn,
                      helperText: errors.checkIn?.message,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Box>

        <Box
          sx={{
            flex: 1.5,
            p: 2,
            display: "flex",
            alignItems: "center",
            borderRight: { xs: "none", md: "1px solid #e0e0e0" },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="checkOut"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Check-out"
                  value={field.value}
                  onChange={field.onChange}
                  format="MM/dd/yy"
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      error: !!errors.checkOut,
                      helperText: errors.checkOut?.message,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Box>

        <Box
          sx={{
            flex: 2,
            p: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            value={formatGuestsRoomsLabel()}
            onClick={handleGuestsClick}
            label="Guests and rooms"
            size="small"
            InputProps={{
              readOnly: true,
            }}
            sx={{ cursor: "pointer" }}
          />
          <Popover
            open={guestsPopoverOpen}
            anchorEl={anchorEl}
            onClose={handleGuestsClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            slotProps={{
              paper: {
                sx: { width: 300, p: 2 },
              },
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 0 }}>
                Adults
              </Typography>
              <Typography variant="body2" color="text.secondary">
                18+ years
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <IconButton
                  onClick={() => updateAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{adults}</Typography>
                <IconButton onClick={() => updateAdults(adults + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
              {errors.adults && (
                <Typography color="error" variant="caption">
                  {errors.adults.message}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 0 }}>
                Children
              </Typography>
              <Typography variant="body2" color="text.secondary">
                0–17 years
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <IconButton
                  onClick={() => updateChildren(Math.max(0, children - 1))}
                  disabled={children <= 0}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{children}</Typography>
                <IconButton onClick={() => updateChildren(children + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
              {errors.children && (
                <Typography color="error" variant="caption">
                  {errors.children.message}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 0 }}>
                Rooms
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Each room should contain at least 1 adult
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <IconButton
                  onClick={() => updateRooms(Math.max(1, rooms - 1))}
                  disabled={rooms <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{rooms}</Typography>
                <IconButton
                  onClick={() => updateRooms(Math.min(adults, rooms + 1))}
                  disabled={rooms >= adults}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              {errors.rooms && (
                <Typography color="error" variant="caption">
                  {errors.rooms.message}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleGuestsClose}
              sx={{ mt: 2 }}
            >
              Done
            </Button>
          </Popover>
        </Box>

        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            type="submit"
            startIcon={<SearchIcon />}
            sx={{ height: "40px" }}
          >
            Search Hotels
          </Button>
        </Box>
      </Paper>
    </form>
  );
};

export default HotelSearchForm;
