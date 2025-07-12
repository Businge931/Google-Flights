import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { AirportOption } from "../../../types/airport";

interface NearbyAirportsDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectAirport: (airport: AirportOption) => void;
  loading: boolean;
  error: string | null;
  currentAirport: AirportOption | null;
  nearbyAirports: AirportOption[];
}

const NearbyAirportsDialog: React.FC<NearbyAirportsDialogProps> = ({
  open,
  onClose,
  onSelectAirport,
  loading,
  error,
  currentAirport,
  nearbyAirports,
}) => {
  const handleSelect = (airport: AirportOption) => {
    onSelectAirport(airport);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nearby Airports</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            {currentAirport && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  <LocationOnIcon
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 1 }}
                  />
                  Current Location Airport
                </Typography>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleSelect(currentAirport)}>
                    <ListItemText
                      primary={currentAirport.label}
                      secondary={currentAirport.country}
                    />
                  </ListItemButton>
                </ListItem>
              </Box>
            )}

            {nearbyAirports.length > 0 && (
              <Box>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  <LocationOnIcon
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 1 }}
                  />
                  Nearby Airports
                </Typography>
                <List disablePadding>
                  {nearbyAirports.map((airport) => (
                    <ListItem key={airport.entityId} disablePadding>
                      <ListItemButton onClick={() => handleSelect(airport)}>
                        <ListItemText
                          primary={airport.label}
                          secondary={airport.country}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {currentAirport === null && nearbyAirports.length === 0 && (
              <Typography variant="body1" sx={{ p: 2, textAlign: "center" }}>
                No airports found near your location
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NearbyAirportsDialog;
