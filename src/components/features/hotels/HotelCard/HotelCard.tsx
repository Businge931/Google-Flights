import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useNavigate } from "react-router-dom";
import type { Hotel } from "../../../../types/hotel";
import { useTranslation } from "react-i18next";

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleViewDeal = () => {
    // Use the hotel name for the URL
    const hotelName = hotel.name ? encodeURIComponent(hotel.name) : "unknown-hotel";
    navigate(`/hotel/${hotel.hotelId}/${hotelName}`);
  };

  return (
    <Card
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        position: "relative",
        border: "1px solid #e0e0e0",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: { xs: "100%", md: 250 },
          height: { xs: 200, md: "auto" },
        }}
        image={hotel.heroImage}
        alt={hotel.name}
      />
      <IconButton
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "rgba(255,255,255,0.8)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.9)",
          },
        }}
      >
        <FavoriteIcon />
      </IconButton>

      <CardContent sx={{ flex: 1, p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6" component="div">
            {hotel.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
              <Box
                key={i}
                component="span"
                sx={{
                  color: "gold",
                  fontSize: "18px",
                  lineHeight: 1,
                }}
              >
                ★
              </Box>
            ))}
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {hotel.distance}
        </Typography>

        {hotel.relevantPoiDistance && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {hotel.relevantPoiDistance}
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          {hotel.rating && (
            <>
              <Box
                sx={{
                  backgroundColor:
                    hotel.rating.color === "colorMonteverde"
                      ? "#006ce4"
                      : "#FF6B00",
                  color: "white",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  mr: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {hotel.rating.value}
                </Typography>
              </Box>
              <Typography variant="body2">
                {hotel.rating.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {hotel.rating.count.toLocaleString()} reviews
              </Typography>
            </>
          )}
        </Box>
      </CardContent>

      <Box
        sx={{
          width: { xs: "100%", md: 220 },
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderLeft: { xs: "none", md: "1px solid #e0e0e0" },
          bgcolor: { xs: "#f8f9fa", md: "transparent" },
        }}
      >
        <Box>
          {hotel.cug && (
            <Chip
              icon={<ThumbUpIcon fontSize="small" />}
              label={hotel.cug.discount}
              color="primary"
              size="small"
              sx={{ mb: 1 }}
            />
          )}

          <Typography variant="body2" color="primary" gutterBottom>
            {hotel.cheapestOfferPartnerName || "Best offer"}
          </Typography>

          {hotel.pricesFrom && (
            <Typography variant="caption" color="text.secondary">
              {hotel.pricesFrom}
            </Typography>
          )}
        </Box>

        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            {hotel.price}
          </Typography>

          {hotel.cug && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ textDecoration: "line-through" }}
            >
              {hotel.cug.priceWithoutDiscount}
            </Typography>
          )}

          {hotel.taxPolicy && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {hotel.taxPolicy}
            </Typography>
          )}

          {hotel.priceDescription && (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {hotel.priceDescription}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleViewDeal}
          >
            {t("hotelCard.viewDeal", "View Deal")}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default HotelCard;
