import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import { formatDuration, formatTime } from "../../../../utils/dateUtils";
import type { FlightResult } from "../../../../types/flight";

interface FlightCardProps {
  flight: FlightResult;
  onSelect: (flightId: string) => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelect }) => {
  const outboundLeg = flight.legs[0];
  const returnLeg = flight.legs.length > 1 ? flight.legs[1] : null;

  return (
    <Card sx={{ mb: 2, height: "100%" }}>
      <CardContent sx={{ pb: 1 }}>
        {/* Airline information */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {outboundLeg.carrier.logoUrl && (
            <Avatar
              src={outboundLeg.carrier.logoUrl}
              alt={outboundLeg.carrier.name}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
          )}
          <Typography variant="subtitle1" component="div">
            {outboundLeg.carrier.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {outboundLeg.carrier.code} {flight.id.split("-")[0]}
          </Typography>
        </Box>

        {/* Outbound leg */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ textAlign: "left" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <FlightTakeoffIcon
                fontSize="small"
                sx={{ mr: 1, color: "primary.main" }}
              />
              <Typography variant="h6">
                {formatTime(outboundLeg.departure)}
              </Typography>
            </Box>
            <Typography variant="body2">{outboundLeg.origin.code}</Typography>
            <Typography variant="caption" color="text.secondary">
              {outboundLeg.origin.city}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mx: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {formatDuration(outboundLeg.duration)}
            </Typography>
            <Box sx={{ width: "100%", position: "relative", my: 1 }}>
              <Divider sx={{ width: "100%" }} />
              <Box
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  transform: "rotate(-45deg)",
                }}
              >
                &gt;
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {outboundLeg.stops === 0
                ? "Non-stop"
                : `${outboundLeg.stops} ${
                    outboundLeg.stops === 1 ? "stop" : "stops"
                  }`}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                mb: 0.5,
              }}
            >
              <Typography variant="h6">
                {formatTime(outboundLeg.arrival)}
              </Typography>
              <FlightLandIcon
                fontSize="small"
                sx={{ ml: 1, color: "primary.main" }}
              />
            </Box>
            <Typography variant="body2">
              {outboundLeg.destination.code}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {outboundLeg.destination.city}
            </Typography>
          </Box>
        </Box>

        {/* Return leg if this is a round trip */}
        {returnLeg && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ textAlign: "left" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <FlightTakeoffIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "primary.main" }}
                  />
                  <Typography variant="h6">
                    {formatTime(returnLeg.departure)}
                  </Typography>
                </Box>
                <Typography variant="body2">{returnLeg.origin.code}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {returnLeg.origin.city}
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mx: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {formatDuration(returnLeg.duration)}
                </Typography>
                <Box sx={{ width: "100%", position: "relative", my: 1 }}>
                  <Divider sx={{ width: "100%" }} />
                  <Box
                    sx={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      transform: "rotate(-45deg)",
                    }}
                  >
                    &gt;
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {returnLeg.stops === 0
                    ? "Non-stop"
                    : `${returnLeg.stops} ${
                        returnLeg.stops === 1 ? "stop" : "stops"
                      }`}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="h6">
                    {formatTime(returnLeg.arrival)}
                  </Typography>
                  <FlightLandIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "primary.main" }}
                  />
                </Box>
                <Typography variant="body2">
                  {returnLeg.destination.code}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {returnLeg.destination.city}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Chip
            label={
              outboundLeg.stops === 0
                ? "Non-stop"
                : `${outboundLeg.stops} ${
                    outboundLeg.stops === 1 ? "stop" : "stops"
                  }`
            }
            size="small"
            color={outboundLeg.stops === 0 ? "success" : "default"}
          />
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            {flight.price.formatted}
          </Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => onSelect(flight.id)}
        >
          Select Flight
        </Button>
      </CardActions>
    </Card>
  );
};

export default FlightCard;
