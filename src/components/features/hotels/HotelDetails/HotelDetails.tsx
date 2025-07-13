import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Divider,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  Rating,
  Alert,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelDetails } from "../../../../services/hotelService";
import type { HotelDetails as HotelDetailsType } from "../../../../types/hotel";
import { useTranslation } from "react-i18next";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SpaIcon from "@mui/icons-material/Spa";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PetsIcon from "@mui/icons-material/Pets";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { useNotification } from "../../../../hooks/useNotification";
import HotelMap from "../Map/HotelMap";
import { fetchNearbyMapData } from "../../../../services/hotelMapService";
import { type NearbyMapData } from "../../../../types/nearbyMap";
import {
  useUserLocation,
  getBrowserSettings,
} from "../../../../services/locationService";
import DirectionsIcon from "@mui/icons-material/Directions";
import AttractionsIcon from "@mui/icons-material/Attractions";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CommuteIcon from "@mui/icons-material/Commute";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Map of amenity icons by keyword
const amenityIconMap: Record<string, React.ReactNode> = {
  WiFi: <WifiIcon />,
  Pool: <PoolIcon />,
  Fitness: <FitnessCenterIcon />,
  Restaurant: <RestaurantIcon />,
  Spa: <SpaIcon />,
  Parking: <LocalParkingIcon />,
  Pets: <PetsIcon />,
  "Air conditioning": <AcUnitIcon />,
};

const HotelDetails: React.FC = () => {
  const { t } = useTranslation();
  const { hotelId, hotelName } = useParams<{
    hotelId: string;
    hotelName: string;
  }>();
  const [hotelDetails, setHotelDetails] = useState<HotelDetailsType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [nearbyMapData, setNearbyMapData] = useState<NearbyMapData | null>(
    null
  );
  const [loadingMapData, setLoadingMapData] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const { userLocation } = useUserLocation();

  const fetchNearbyPOIs = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        setLoadingMapData(true);
        setMapError(null);

        const browserSettings = getBrowserSettings();

        const data = await fetchNearbyMapData({
          cityId: hotelId || "",
          latitude: latitude,
          longitude: longitude,
          market: userLocation?.language || browserSettings.language,
          countryCode: userLocation?.countryCode || browserSettings.countryCode,
        });

        setNearbyMapData(data);
      } catch (err) {
        console.error("Error fetching nearby POIs:", err);
        setMapError(
          t("hotelDetails.mapError", "Could not load nearby points of interest")
        );
      } finally {
        setLoadingMapData(false);
      }
    },
    [hotelId, t, setMapError, setNearbyMapData, setLoadingMapData, userLocation]
  );

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!hotelId) {
        setError(
          t("hotelDetails.missingParams", "Missing hotel ID or entity ID")
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getHotelDetails({
          hotelId,
          entityId: hotelName || "",
        });
        if (response.status) {
          setHotelDetails(response.data);

          if (
            response.data.location?.coordinates?.latitude &&
            response.data.location?.coordinates?.longitude
          ) {
            fetchNearbyPOIs(
              response.data.location.coordinates.latitude,
              response.data.location.coordinates.longitude
            );
          }
        } else {
          setError(
            t("hotelDetails.fetchError", "Failed to fetch hotel details")
          );
          showNotification(
            t("hotelDetails.fetchError", "Failed to fetch hotel details"),
            "error"
          );
        }
      } catch (err) {
        console.error("Error fetching hotel details:", err);
        setError(
          t(
            "hotelDetails.fetchError",
            "An error occurred while fetching hotel details"
          )
        );
        showNotification(
          t(
            "hotelDetails.fetchError",
            "An error occurred while fetching hotel details"
          ),
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotelId, hotelName, showNotification, t, fetchNearbyPOIs]);

  const getAmenityIcon = (description: string) => {
    const key = Object.keys(amenityIconMap).find((keyword) =>
      description.includes(keyword)
    );
    return key ? amenityIconMap[key] : null;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate(-1)}
        >
          {t("hotelDetails.goBack", "Go Back")}
        </Button>
      </Container>
    );
  }

  if (!hotelDetails) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">
          {t("hotelDetails.noInfo", "No information available for this hotel")}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate(-1)}
        >
          {t("hotelDetails.goBack", "Go Back")}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button
        variant="outlined"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate(-1)}
      >
        {t("hotelDetails.goBack", "Go Back")}
      </Button>

      {/* Hotel name and stars */}
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        {hotelDetails.general.name}
        <Rating
          value={hotelDetails.general.stars}
          readOnly
          precision={0.5}
          sx={{ ml: 1, verticalAlign: "middle" }}
        />
      </Typography>

      {/* Location information */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <PlaceIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="body1">{hotelDetails.location.address}</Typography>
      </Box>

      {/* Photo gallery */}
      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t("hotelDetails.photos", "Photo Gallery")}
        </Typography>
        <Box sx={{ maxHeight: 500, overflow: "auto" }}>
          <ImageList cols={3} gap={8}>
            {hotelDetails.gallery.images.map((image, index) => (
              <ImageListItem key={index}>
                <img
                  src={image.gallery}
                  alt={`${hotelDetails.general.name} - ${image.category}`}
                  loading="lazy"
                  style={{
                    borderRadius: "8px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Hotel description */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {hotelDetails.goodToKnow.description.title}
            </Typography>
            <Typography variant="body1">
              {hotelDetails.goodToKnow.description.content}
            </Typography>
            {hotelDetails.goodToKnow.description.image && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={hotelDetails.goodToKnow.description.image}
                  alt={hotelDetails.general.name}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            )}
          </Paper>

          {/* Amenities */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {hotelDetails.amenities.title}
            </Typography>
            <Grid container spacing={1}>
              {hotelDetails.amenities.contentV2.map((category) => (
                <Grid size={{ xs: 12 }} key={category.id}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    gutterBottom
                  >
                    {category.category}
                  </Typography>
                  <Grid container spacing={1}>
                    {category.items.map((item) => (
                      <Grid key={item.id}>
                        <Chip
                          icon={
                            <Box
                              component="span"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              {item.icon ? (
                                <img
                                  src={item.icon}
                                  width={18}
                                  height={18}
                                  alt={item.description}
                                />
                              ) : (
                                getAmenityIcon(item.description)
                              )}
                            </Box>
                          }
                          label={item.description}
                          sx={{ m: 0.5 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Policies */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {hotelDetails.goodToKnow.policies.title}
            </Typography>
            {hotelDetails.goodToKnow.policies.content.map((policy, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {policy.key}
                </Typography>
                {policy.values.map((value, vIndex) => (
                  <Typography key={vIndex} variant="body2" paragraph>
                    {value.content}
                  </Typography>
                ))}
              </Box>
            ))}
          </Paper>

          {/* Reviews */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">{hotelDetails.reviews.title}</Typography>
              <Box>
                <Typography
                  variant="h5"
                  component="span"
                  sx={{
                    bgcolor:
                      hotelDetails.reviewRatingSummary.color ===
                      "colorMonteverde"
                        ? "#006ce4"
                        : "#FF6B00",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: "bold",
                  }}
                >
                  {hotelDetails.reviewRatingSummary.score}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, textAlign: "center" }}
                >
                  {hotelDetails.reviewRatingSummary.scoreDesc}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1">
              {hotelDetails.reviewRatingSummary.count}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Review categories */}
            <Grid container spacing={2}>
              {hotelDetails.reviewRatingSummary.categories.map(
                (category, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">{category.name}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Rating
                          value={(parseFloat(category.score) / 5) * 5}
                          readOnly
                          size="small"
                          precision={0.1}
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {category.score}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar with check-in/check-out info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{ p: 3, mb: 4, position: "sticky", top: 20 }}
          >
            <Typography variant="h6" gutterBottom>
              {t("hotelDetails.goodToKnow", "Good to Know")}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle2">
                  {hotelDetails.goodToKnow.checkinTime.title}
                </Typography>
                <Typography variant="body1">
                  {hotelDetails.goodToKnow.checkinTime.time}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle2">
                  {hotelDetails.goodToKnow.checkoutTime.title}
                </Typography>
                <Typography variant="body1">
                  {hotelDetails.goodToKnow.checkoutTime.time}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Location */}
            <Typography variant="h6" gutterBottom>
              {hotelDetails.location.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {hotelDetails.location.shortAddress}
            </Typography>
            {hotelDetails.distance && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {hotelDetails.distance}
              </Typography>
            )}

            {/* Interactive Map */}
            <Box
              sx={{
                height: 250,
                borderRadius: 1,
                my: 2,
                overflow: "hidden",
              }}
            >
              {loadingMapData ? (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress size={28} />
                </Box>
              ) : mapError ? (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="error">
                    {mapError}
                  </Typography>
                </Box>
              ) : (
                <HotelMap
                  initialCenter={
                    hotelDetails?.location?.coordinates
                      ? {
                          lat: hotelDetails.location.coordinates.latitude,
                          lng: hotelDetails.location.coordinates.longitude,
                        }
                      : undefined
                  }
                  selectedLocation={
                    hotelDetails?.location?.coordinates
                      ? {
                          lat: hotelDetails.location.coordinates.latitude,
                          lng: hotelDetails.location.coordinates.longitude,
                        }
                      : undefined
                  }
                  nearbyData={nearbyMapData || undefined}
                  height="100%"
                  interactive={false}
                />
              )}
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() =>
                window.open(
                  "https://www.google.com/maps/search/?api=1&query=" +
                    encodeURIComponent(
                      `${hotelDetails.general.name} ${hotelDetails.location.address}`
                    ),
                  "_blank"
                )
              }
            >
              {t("hotelDetails.viewOnMap", "View on Google Maps")}
            </Button>

            <Divider sx={{ my: 3 }} />

            {/* Nearby Points of Interest and Transportation */}
            {nearbyMapData && (
              <>
                <Typography variant="h6" gutterBottom>
                  <AttractionsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  {t("hotelDetails.nearbyAttractions", "Nearby Attractions")}
                </Typography>

                {nearbyMapData.poiInfo.slice(0, 3).map((poi) => (
                  <Box key={poi.entityId} sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2">{poi.poiName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      <LocationOnIcon
                        sx={{ fontSize: 16, verticalAlign: "text-bottom" }}
                      />
                      {poi.distanceFromHotel}
                    </Typography>
                  </Box>
                ))}

                <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                  <CommuteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  {t("hotelDetails.transportation", "Transportation")}
                </Typography>

                {nearbyMapData.transportations.slice(0, 3).map((transport) => (
                  <Box key={transport.id} sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2">
                      {transport.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <DirectionsIcon
                        sx={{ fontSize: 16, verticalAlign: "text-bottom" }}
                      />
                      {transport.distanceFromHotel} ({transport.type})
                    </Typography>
                  </Box>
                ))}

                {nearbyMapData.nearestTransportation && (
                  <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                    {nearbyMapData.nearestTransportation.description}
                  </Alert>
                )}

                <Divider sx={{ my: 3 }} />
              </>
            )}

            {/* Book now section */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              {t("hotelDetails.bookNow", "Book Now")}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HotelDetails;
