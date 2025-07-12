import React, { useState } from "react";
import {
  Box,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PoolIcon from "@mui/icons-material/Pool";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PetsIcon from "@mui/icons-material/Pets";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import SpaIcon from "@mui/icons-material/Spa";
import { useTranslation } from "react-i18next";

// Define filter options and their types
export interface HotelFilters {
  price: [number, number];
  reviewScore: number;
  stars: number[];
  discounts: string[];
  amenities: string[];
  accommodationType: string[];
  popularWith: string[];
}

interface HotelFiltersProps {
  filters: HotelFilters;
  onChange: (filters: HotelFilters) => void;
  minPrice?: number;
  maxPrice?: number;
}

const HotelFilters: React.FC<HotelFiltersProps> = ({
  filters,
  onChange,
  minPrice = 0,
  maxPrice = 2000,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | false>("price");

  // Amenity icons mapping
  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <WifiIcon fontSize="small" />,
    parking: <LocalParkingIcon fontSize="small" />,
    fitness: <FitnessCenterIcon fontSize="small" />,
    pool: <PoolIcon fontSize="small" />,
    restaurant: <RestaurantIcon fontSize="small" />,
    pets: <PetsIcon fontSize="small" />,
    airConditioning: <AcUnitIcon fontSize="small" />,
    spa: <SpaIcon fontSize="small" />,
  };

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // Handle price change
  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onChange({ ...filters, price: newValue as [number, number] });
    }
  };

  // Handle review score change
  const handleReviewScoreChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    onChange({ ...filters, reviewScore: newValue as number });
  };

  // Handle star rating change
  const handleStarChange = (star: number) => {
    const currentStars = [...filters.stars];
    const starIndex = currentStars.indexOf(star);

    if (starIndex === -1) {
      currentStars.push(star);
    } else {
      currentStars.splice(starIndex, 1);
    }

    onChange({ ...filters, stars: currentStars });
  };

  // Handle checkbox filters (discounts, amenities, accommodation type, popular with)
  const handleCheckboxChange = (
    category: keyof HotelFilters,
    value: string
  ) => {
    if (
      category === "stars" ||
      category === "price" ||
      category === "reviewScore"
    ) {
      return; // These are not string array categories
    }

    const currentValues = [...(filters[category] as string[])];
    const valueIndex = currentValues.indexOf(value);

    if (valueIndex === -1) {
      currentValues.push(value);
    } else {
      currentValues.splice(valueIndex, 1);
    }

    onChange({ ...filters, [category]: currentValues });
  };

  // Format price label
  const priceValueText = (value: number) => `$${value}`;

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Price Range */}
      <Accordion
        expanded={expanded === "price"}
        onChange={handleAccordionChange("price")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {t("hotelFilters.priceRange", "Price Range")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Box px={2}>
            <Slider
              value={filters.price}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              valueLabelFormat={priceValueText}
              min={minPrice}
              max={maxPrice}
              step={10}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                ${filters.price[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${filters.price[1]}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* Guest Rating */}
      <Accordion
        expanded={expanded === "rating"}
        onChange={handleAccordionChange("rating")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {t("hotelFilters.guestRating", "Guest Rating")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Box px={2}>
            <Typography variant="body2" gutterBottom>
              {t("hotelFilters.minScore", "Minimum Score")}:{" "}
              {filters.reviewScore}+
            </Typography>
            <Slider
              value={filters.reviewScore}
              onChange={handleReviewScoreChange}
              min={1}
              max={10}
              step={0.5}
              marks
              valueLabelDisplay="auto"
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="caption" color="text.secondary">
                {t("hotelFilters.poor", "Poor")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("hotelFilters.excellent", "Excellent")}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* Star Rating */}
      <Accordion
        expanded={expanded === "stars"}
        onChange={handleAccordionChange("stars")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {t("hotelFilters.starRating", "Star Rating")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Box px={2} display="flex" gap={1} flexWrap="wrap">
            {[1, 2, 3, 4, 5].map((star) => (
              <Chip
                key={star}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2">{star}</Typography>
                    <Rating
                      value={1}
                      max={1}
                      size="small"
                      readOnly
                      sx={{ ml: 0.5 }}
                    />
                  </Box>
                }
                onClick={() => handleStarChange(star)}
                color={filters.stars.includes(star) ? "primary" : "default"}
                variant={filters.stars.includes(star) ? "filled" : "outlined"}
                sx={{ minWidth: 60 }}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* Discounts */}
      <Accordion
        expanded={expanded === "discounts"}
        onChange={handleAccordionChange("discounts")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {t("hotelFilters.discounts", "Discounts")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormGroup>
            {[
              {
                value: "deals",
                label: t("hotelFilters.specialDeals", "Special Deals"),
              },
              {
                value: "freeCancellation",
                label: t("hotelFilters.freeCancellation", "Free Cancellation"),
              },
              {
                value: "priceDrops",
                label: t("hotelFilters.priceDrops", "Price Drops"),
              },
              {
                value: "memberDeals",
                label: t("hotelFilters.memberDeals", "Member Deals"),
              },
            ].map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={filters.discounts.includes(option.value)}
                    onChange={() =>
                      handleCheckboxChange("discounts", option.value)
                    }
                    size="small"
                  />
                }
                label={<Typography variant="body2">{option.label}</Typography>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* Amenities */}
      <Accordion
        expanded={expanded === "amenities"}
        onChange={handleAccordionChange("amenities")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {t("hotelFilters.amenities", "Amenities")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormGroup>
            {[
              {
                value: "wifi",
                label: t("hotelFilters.wifi", "WiFi"),
                icon: amenityIcons["wifi"],
              },
              {
                value: "parking",
                label: t("hotelFilters.parking", "Parking"),
                icon: amenityIcons["parking"],
              },
              {
                value: "fitness",
                label: t("hotelFilters.fitness", "Fitness Center"),
                icon: amenityIcons["fitness"],
              },
              {
                value: "pool",
                label: t("hotelFilters.pool", "Pool"),
                icon: amenityIcons["pool"],
              },
              {
                value: "restaurant",
                label: t("hotelFilters.restaurant", "Restaurant"),
                icon: amenityIcons["restaurant"],
              },
              {
                value: "pets",
                label: t("hotelFilters.pets", "Pet Friendly"),
                icon: amenityIcons["pets"],
              },
              {
                value: "airConditioning",
                label: t("hotelFilters.airConditioning", "Air Conditioning"),
                icon: amenityIcons["airConditioning"],
              },
              {
                value: "spa",
                label: t("hotelFilters.spa", "Spa"),
                icon: amenityIcons["spa"],
              },
            ].map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={filters.amenities.includes(option.value)}
                    onChange={() =>
                      handleCheckboxChange("amenities", option.value)
                    }
                    size="small"
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {option.icon}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {option.label}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* Accommodation Type */}
      <Accordion
        expanded={expanded === "accommodationType"}
        onChange={handleAccordionChange("accommodationType")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {t("hotelFilters.accommodationType", "Accommodation Type")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormGroup>
            {[
              { value: "hotel", label: t("hotelFilters.hotel", "Hotel") },
              {
                value: "apartment",
                label: t("hotelFilters.apartment", "Apartment"),
              },
              { value: "resort", label: t("hotelFilters.resort", "Resort") },
              {
                value: "guesthouse",
                label: t("hotelFilters.guesthouse", "Guesthouse"),
              },
              { value: "hostel", label: t("hotelFilters.hostel", "Hostel") },
              { value: "villa", label: t("hotelFilters.villa", "Villa") },
            ].map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={filters.accommodationType.includes(option.value)}
                    onChange={() =>
                      handleCheckboxChange("accommodationType", option.value)
                    }
                    size="small"
                  />
                }
                label={<Typography variant="body2">{option.label}</Typography>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* Popular With */}
      <Accordion
        expanded={expanded === "popularWith"}
        onChange={handleAccordionChange("popularWith")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {t("hotelFilters.popularWith", "Popular With")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormGroup>
            {[
              {
                value: "families",
                label: t("hotelFilters.families", "Families"),
              },
              { value: "couples", label: t("hotelFilters.couples", "Couples") },
              {
                value: "solo",
                label: t("hotelFilters.solo", "Solo Travelers"),
              },
              {
                value: "business",
                label: t("hotelFilters.business", "Business Travelers"),
              },
              { value: "groups", label: t("hotelFilters.groups", "Groups") },
            ].map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={filters.popularWith.includes(option.value)}
                    onChange={() =>
                      handleCheckboxChange("popularWith", option.value)
                    }
                    size="small"
                  />
                }
                label={<Typography variant="body2">{option.label}</Typography>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default HotelFilters;
