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
  Radio,
  RadioGroup,
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
import PercentIcon from "@mui/icons-material/Percent";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useTranslation } from "react-i18next";

export interface HotelFilters {
  price: [number, number];
  reviewScore: number;
  stars: number[];
  discounts: string[];
  amenities: string[];
  accommodationType: string[];
  distanceFromCenter: number | null; // in miles
  minDiscountPercentage: number;
  offerPartners: string[];
  taxPolicy: string[];
  guestType: string | null;
  confidenceScore: number | null;
}

interface HotelFiltersProps {
  filters: HotelFilters;
  onChange: (filters: HotelFilters) => void;
  minPrice?: number;
  maxPrice?: number;
  availablePartners?: string[];
  maxDistanceFromCenter?: number;
  maxConfidenceScore?: number;
}

const HotelFilters: React.FC<HotelFiltersProps> = ({
  filters,
  onChange,
  minPrice = 0,
  maxPrice = 2000,
  availablePartners = ["Expedia", "Hotels.com", "Booking.com"],
  maxDistanceFromCenter = 10,
  maxConfidenceScore = 5,
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

  // Handle distance change
  const handleDistanceChange = (_event: Event, newValue: number | number[]) => {
    onChange({ ...filters, distanceFromCenter: newValue as number });
  };

  // Handle discount percentage change
  const handleDiscountPercentageChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    onChange({ ...filters, minDiscountPercentage: newValue as number });
  };

  // Handle confidence score change
  const handleConfidenceScoreChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    onChange({ ...filters, confidenceScore: newValue as number });
  };

  // Handle radio button change
  const handleRadioChange = (
    category: "guestType",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({ ...filters, [category]: event.target.value });
  };

  // Handle checkbox filters (discounts, amenities, accommodation type, tax policies, etc.)
  const handleCheckboxChange = (
    category: keyof HotelFilters,
    value: string
  ) => {
    if (
      category === "stars" ||
      category === "price" ||
      category === "reviewScore" ||
      category === "distanceFromCenter" ||
      category === "minDiscountPercentage" ||
      category === "guestType" ||
      category === "confidenceScore"
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

  // Format distance label
  const distanceValueText = (value: number) => `${value} mi`;

  // Format discount percentage label
  const discountValueText = (value: number) => `${value}%`;

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

      {/* Distance from Center */}
      <Accordion
        expanded={expanded === "distance"}
        onChange={handleAccordionChange("distance")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
              {t("hotelFilters.distance", "Distance from Center")}
            </Box>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Box px={2}>
            <Typography variant="body2" gutterBottom>
              {t("hotelFilters.maxDistance", "Maximum Distance")}:{" "}
              {filters.distanceFromCenter
                ? `${filters.distanceFromCenter} miles`
                : t("hotelFilters.any", "Any")}
            </Typography>
            <Slider
              value={filters.distanceFromCenter || 0}
              onChange={handleDistanceChange}
              min={0}
              max={maxDistanceFromCenter}
              step={0.5}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={distanceValueText}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* Minimum Discount */}
      <Accordion
        expanded={expanded === "discount"}
        onChange={handleAccordionChange("discount")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PercentIcon fontSize="small" sx={{ mr: 1 }} />
              {t("hotelFilters.discount", "Minimum Discount")}
            </Box>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Box px={2}>
            <Typography variant="body2" gutterBottom>
              {t("hotelFilters.minDiscount", "Minimum Discount")}:{" "}
              {filters.minDiscountPercentage}%+
            </Typography>
            <Slider
              value={filters.minDiscountPercentage}
              onChange={handleDiscountPercentageChange}
              min={0}
              max={30}
              step={5}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={discountValueText}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* Offer Partners */}
      <Accordion
        expanded={expanded === "offerPartners"}
        onChange={handleAccordionChange("offerPartners")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StorefrontIcon fontSize="small" sx={{ mr: 1 }} />
              {t("hotelFilters.offerPartners", "Offer Partners")}
            </Box>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormGroup>
            {availablePartners.map((partner) => (
              <FormControlLabel
                key={partner}
                control={
                  <Checkbox
                    checked={filters.offerPartners.includes(partner)}
                    onChange={() =>
                      handleCheckboxChange("offerPartners", partner)
                    }
                    size="small"
                  />
                }
                label={<Typography variant="body2">{partner}</Typography>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* Tax Policy */}
      <Accordion
        expanded={expanded === "taxPolicy"}
        onChange={handleAccordionChange("taxPolicy")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
              {t("hotelFilters.taxPolicy", "Tax Policy")}
            </Box>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormGroup>
            {[
              {
                value: "included",
                label: t(
                  "hotelFilters.taxIncluded",
                  "All taxes and fees included"
                ),
              },
              {
                value: "excluded",
                label: t("hotelFilters.taxExcluded", "Taxes and fees excluded"),
              },
              {
                value: "payLater",
                label: t("hotelFilters.payLater", "Pay at the property"),
              },
            ].map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={filters.taxPolicy.includes(option.value)}
                    onChange={() =>
                      handleCheckboxChange("taxPolicy", option.value)
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

      {/* Guest Type */}
      <Accordion
        expanded={expanded === "guestType"}
        onChange={handleAccordionChange("guestType")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              {t("hotelFilters.guestType", "Guest Type")}
            </Box>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <RadioGroup
            value={filters.guestType || ""}
            onChange={(e) => handleRadioChange("guestType", e)}
          >
            <FormControlLabel
              value=""
              control={<Radio size="small" />}
              label={
                <Typography variant="body2">
                  {t("hotelFilters.any", "Any")}
                </Typography>
              }
            />
            <FormControlLabel
              value="families"
              control={<Radio size="small" />}
              label={
                <Typography variant="body2">
                  {t("hotelFilters.families", "Families")}
                </Typography>
              }
            />
            <FormControlLabel
              value="couples"
              control={<Radio size="small" />}
              label={
                <Typography variant="body2">
                  {t("hotelFilters.couples", "Couples")}
                </Typography>
              }
            />
            <FormControlLabel
              value="business"
              control={<Radio size="small" />}
              label={
                <Typography variant="body2">
                  {t("hotelFilters.business", "Business")}
                </Typography>
              }
            />
            <FormControlLabel
              value="solo"
              control={<Radio size="small" />}
              label={
                <Typography variant="body2">
                  {t("hotelFilters.solo", "Solo Traveler")}
                </Typography>
              }
            />
          </RadioGroup>
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* Location Rating */}
      <Accordion
        expanded={expanded === "locationRating"}
        onChange={handleAccordionChange("locationRating")}
        elevation={0}
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PublicIcon fontSize="small" sx={{ mr: 1 }} />
              {t("hotelFilters.locationRating", "Location Rating")}
            </Box>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Box px={2}>
            <Typography variant="body2" gutterBottom>
              {t("hotelFilters.minScore", "Minimum Score")}:{" "}
              {filters.confidenceScore
                ? filters.confidenceScore
                : t("hotelFilters.any", "Any")}
            </Typography>
            <Slider
              value={filters.confidenceScore || 0}
              onChange={handleConfidenceScoreChange}
              min={0}
              max={maxConfidenceScore}
              step={0.5}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
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
    </Box>
  );
};

export default HotelFilters;
