import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
// import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MenuIcon from "@mui/icons-material/Menu";
import RegionalSettingsModal from "../RegionalSettingsModal/RegionalSettingsModal";
import { useTranslation } from "react-i18next";
import useNavigation from "../../../hooks/useNavigation";
import type { NavigationTab } from "../../../context/navigationTypes";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Journey Vista" }) => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useNavigation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Menu state for mobile navigation
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

  // Regional settings state
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    handleMobileMenuClose();
  };

  const handleRegionDialogClose = () => {
    setRegionDialogOpen(false);
  };

  return (
    <>
      <AppBar
        position="static"
        color="primary"
        elevation={0}
        sx={{
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            width: "100%",
            px: { xs: 2, md: 4 },
          }}
        >
          <Toolbar disableGutters>
            {/* Logo and Title */}
            <FlightIcon sx={{ mr: 1, transform: "rotate(-45deg)" }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 600,
                letterSpacing: ".05rem",
                color: "inherit",
                textDecoration: "none",
                mr: 3,
              }}
            >
              {t("header.title", title)}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Navigation Buttons */}
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1.8,
                  mt: 0.5,
                }}
              >
                <Button
                  startIcon={<FlightIcon />}
                  onClick={() => setActiveTab("flights")}
                  disableRipple
                  disableFocusRipple
                  variant={activeTab === "flights" ? "contained" : "outlined"}
                  sx={{
                    textTransform: "none",
                    color: "white",
                    borderRadius: "50px",
                    minWidth: "auto",
                    px: { sm: 2 },
                    py: 0.3,
                    border: "1px solid white",
                    backgroundColor:
                      activeTab === "flights" ? "#0062cc" : "transparent",
                    fontWeight: activeTab === "flights" ? "bold" : "normal",
                    "&:hover": {
                      backgroundColor:
                        activeTab === "flights"
                          ? "#0057b8"
                          : "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  {t("navigation.flights", "Flights")}
                </Button>

                <Button
                  startIcon={<HotelIcon />}
                  onClick={() => setActiveTab("hotels")}
                  disableRipple
                  disableFocusRipple
                  variant={activeTab === "hotels" ? "contained" : "outlined"}
                  sx={{
                    textTransform: "none",
                    color: "white",
                    borderRadius: "50px",
                    minWidth: "auto",
                    px: { sm: 2 },
                    py: 0.3,
                    border: "1px solid white",
                    backgroundColor:
                      activeTab === "hotels" ? "#0062cc" : "transparent",
                    fontWeight: activeTab === "hotels" ? "bold" : "normal",
                    "&:hover": {
                      backgroundColor:
                        activeTab === "hotels"
                          ? "#0057b8"
                          : "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  {t("navigation.hotels", "Hotels")}
                </Button>

                {/* <Button
                  startIcon={<DirectionsCarIcon />}
                  onClick={() => setActiveTab("cars")}
                  disableRipple
                  disableFocusRipple
                  variant={activeTab === "cars" ? "contained" : "outlined"}
                  sx={{
                    textTransform: "none",
                    color: "white",
                    borderRadius: "50px",
                    minWidth: "auto",
                    px: { sm: 2 },
                    py: 0.3,
                    border: "1px solid white",
                    backgroundColor:
                      activeTab === "cars" ? "#0062cc" : "transparent",
                    fontWeight: activeTab === "cars" ? "bold" : "normal",
                    "&:hover": {
                      backgroundColor:
                        activeTab === "cars"
                          ? "#0057b8"
                          : "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  {t("navigation.carRental", "Car Rental")}
                </Button> */}
              </Box>
            )}

            {/* Mobile Menu Icon */}
            {isMobile && (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Menu */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        id="mobile-menu"
        keepMounted
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1.5, width: 200 },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => handleTabChange("flights" as NavigationTab)}
          selected={activeTab === "flights"}
          sx={{
            backgroundColor:
              activeTab === "flights" ? "rgba(0, 98, 204, 0.1)" : "inherit",
            "&:hover": {
              backgroundColor:
                activeTab === "flights"
                  ? "rgba(0, 98, 204, 0.2)"
                  : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <ListItemIcon>
            <FlightIcon
              color={activeTab === "flights" ? "primary" : "inherit"}
            />
          </ListItemIcon>
          <ListItemText primary={t("navigation.flights", "Flights")} />
        </MenuItem>
        <MenuItem
          onClick={() => handleTabChange("hotels" as NavigationTab)}
          selected={activeTab === "hotels"}
          sx={{
            backgroundColor:
              activeTab === "hotels" ? "rgba(0, 98, 204, 0.1)" : "inherit",
            "&:hover": {
              backgroundColor:
                activeTab === "hotels"
                  ? "rgba(0, 98, 204, 0.2)"
                  : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <ListItemIcon>
            <HotelIcon color={activeTab === "hotels" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText primary={t("navigation.hotels", "Hotels")} />
        </MenuItem>
        {/* <MenuItem
          onClick={() => handleTabChange("cars" as NavigationTab)}
          selected={activeTab === "cars"}
          sx={{
            backgroundColor:
              activeTab === "cars" ? "rgba(0, 98, 204, 0.1)" : "inherit",
            "&:hover": {
              backgroundColor:
                activeTab === "cars"
                  ? "rgba(0, 98, 204, 0.2)"
                  : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <ListItemIcon>
            <DirectionsCarIcon
              color={activeTab === "cars" ? "primary" : "inherit"}
            />
          </ListItemIcon>
          <ListItemText primary={t("navigation.carRental", "Car Rental")} />
        </MenuItem> */}
      </Menu>

      {/* Regional Settings Dialog */}
      <RegionalSettingsModal
        open={regionDialogOpen}
        onClose={handleRegionDialogClose}
      />
    </>
  );
};

export default Header;
