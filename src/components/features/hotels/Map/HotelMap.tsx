import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Typography, Paper } from "@mui/material";

// Fix for default marker icons in Leaflet with webpack/vite
// This is needed because the default marker icons are not properly loaded
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icons
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Transportation {
  id: string;
  type: string;
  coordinate: {
    longitude: number;
    latitude: number;
  };
  name: string;
  linearDistance: number;
  distanceFromHotel: string;
}

interface POI {
  entityId: string;
  poiName: string;
  address?: string;
  poiType: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  linearDistance: number;
  distanceFromHotel: string;
  reviewScore?: number;
  imageUrls?: string[];
}

export interface NearbyMapData {
  transportations: Transportation[];
  poiInfo: POI[];
  nearestTransportation: {
    nearestOne: Transportation;
    description: string;
  };
  attractionsSummary: string;
}

interface HotelMapProps {
  initialCenter?: { lat: number; lng: number };
  selectedLocation?: { lat: number; lng: number };
  onLocationSelected?: (location: { lat: number; lng: number }) => void;
  nearbyData?: NearbyMapData;
  height?: string;
  interactive?: boolean; // Whether users can click on the map to select location
}

// Component to handle map clicks
const MapClickHandler = ({
  onLocationSelected,
  interactive = true,
}: {
  onLocationSelected?: (lat: number, lng: number) => void;
  interactive?: boolean;
}) => {
  useMapEvents({
    click: (e) => {
      if (interactive && onLocationSelected) {
        onLocationSelected(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const HotelMap: React.FC<HotelMapProps> = ({
  initialCenter,
  selectedLocation,
  onLocationSelected,
  nearbyData,
  height = "450px",
  interactive = true, // Interactive by default
}) => {
  // Use selectedLocation if provided, otherwise use null
  const [selectedPosition, setSelectedPosition] =
    useState<LatLngExpression | null>(
      selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null
    );

  // Create default icon for POIs
  const defaultPOIIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Icons for different POI types - expanded with more common types
  const poiIcons: Record<string, L.Icon> = {
    // Original types
    TouristAttraction: new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    ShoppingMall: new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    UniversityBuilding: new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    // Added more common types
    Restaurant: new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    Museum: new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    Park: new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    Attraction: defaultPOIIcon, // Generic attraction
  };

  // Icons for different transportation types
  const transportationIcons: Record<string, L.Icon> = {
    Airport: new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    TrainStation: new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    MetroStation: new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    BusStation: new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
  };

  // Handle map click
  const handleLocationSelected = (lat: number, lng: number) => {
    setSelectedPosition([lat, lng]);
    if (onLocationSelected) {
      onLocationSelected({ lat, lng });
    }
  };

  // Determine center coordinates based on available data
  const center: LatLngExpression = selectedPosition
    ? selectedPosition
    : initialCenter
    ? ([initialCenter.lat, initialCenter.lng] as LatLngExpression)
    : ([0, 0] as LatLngTuple); // Fallback to [0,0] if nothing is available

  return (
    <Box sx={{ height, width: "100%", position: "relative" }}>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "4px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          onLocationSelected={handleLocationSelected}
          interactive={interactive}
        />

        {/* Show selected position marker */}
        {selectedPosition && (
          <Marker position={selectedPosition}>
            <Popup>
              Selected Location
              <br />
              Latitude:{" "}
              {typeof selectedPosition === "object" && "lat" in selectedPosition
                ? selectedPosition.lat
                : ""}
              <br />
              Longitude:{" "}
              {typeof selectedPosition === "object" && "lng" in selectedPosition
                ? selectedPosition.lng
                : ""}
            </Popup>
          </Marker>
        )}

        {/* Display transportation markers */}
        {nearbyData?.transportations?.map((transport) => (
          <Marker
            key={transport.id}
            position={[
              transport.coordinate.latitude,
              transport.coordinate.longitude,
            ]}
            icon={transportationIcons[transport.type] || new L.Icon.Default()}
          >
            <Popup>
              <strong>{transport.name}</strong>
              <br />
              Type: {transport.type}
              <br />
              Distance: {transport.distanceFromHotel}
            </Popup>
          </Marker>
        ))}

        {/* Display POI markers */}
        {nearbyData?.poiInfo?.map((poi) => {
          // Log POI data for debugging
          console.log(`Rendering POI: ${poi.poiName}, type: ${poi.poiType}, coordinates: [${poi.coordinate.latitude}, ${poi.coordinate.longitude}]`);
          
          // Display the marker
          return (
            <Marker
              key={poi.entityId}
              position={[poi.coordinate.latitude, poi.coordinate.longitude]}
              icon={poiIcons[poi.poiType] || defaultPOIIcon} // Use our default icon as fallback
            >
              <Popup>
                <strong>{poi.poiName}</strong>
                <br />
                {poi.address && (
                  <>
                    {poi.address}
                    <br />
                  </>
                )}
                Type: {poi.poiType}
                <br />
                {poi.reviewScore && (
                  <>
                    Rating: {poi.reviewScore}
                    <br />
                  </>
                )}
                Distance: {poi.distanceFromHotel}
              </Popup>
            </Marker>
          );
        })}
        
        {/* Log if no POIs available (invisible in DOM) */}
        {nearbyData?.poiInfo?.length === 0 ? (
          console.log('No POI data available to render markers'),
          null // Return null to avoid React node error
        ) : null}

        {/* Show radius circle for selected position */}
        {selectedPosition && (
          <Circle
            center={selectedPosition}
            radius={1000}
            pathOptions={{
              fillColor: "blue",
              fillOpacity: 0.1,
              color: "blue",
              opacity: 0.5,
            }}
          />
        )}
      </MapContainer>



      {/* Display coordinates info box */}
      {selectedPosition && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            padding: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 1000,
          }}
        >
          <Typography variant="body2">
            <strong>Selected Coordinates:</strong>
            <br />
            Latitude:{" "}
            {typeof selectedPosition === "object" && "lat" in selectedPosition
              ? selectedPosition.lat.toFixed(6)
              : ""}
            <br />
            Longitude:{" "}
            {typeof selectedPosition === "object" && "lng" in selectedPosition
              ? selectedPosition.lng.toFixed(6)
              : ""}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default HotelMap;
