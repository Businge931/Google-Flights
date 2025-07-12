import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FlightIcon from "@mui/icons-material/Flight";
import RegionalSettingsModal from "../RegionalSettingsModal/RegionalSettingsModal";
import { useLocalization } from "../../../context/LocalizationContext";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Journey Vista Flights" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const {
    getCurrentLanguageName,
    getCurrentCountryName,
    getCurrentCountryFlag,
    getCurrentCurrencyDisplay
  } = useLocalization();

  // Regional settings state
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);

  const handleRegionDialogOpen = () => {
    setRegionDialogOpen(true);
  };

  const handleRegionDialogClose = () => {
    setRegionDialogOpen(false);
  };

  return (
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
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: ".05rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {t("header.title", title)}
          </Typography>

          {/* Regional Settings Button */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Show full button with details on desktop */}
            {!isMobile && (
              <Button
                onClick={handleRegionDialogOpen}
                variant="text"
                color="inherit"
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  minWidth: 0,
                  p: 1,
                  color: "inherit",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  "&:hover": {
                    border: "1px solid #ccc",
                  },
                  "&:focus": {
                    border: "none",
                  },
                  "&:active": {
                    border: "none",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <span>{getCurrentLanguageName()}</span>
                  <Box component="span" sx={{ mx: 0.5, fontSize: "1.2em" }}>
                    {getCurrentCountryFlag()}
                  </Box>
                  <span>{getCurrentCountryName()}</span>
                  <Box component="span" sx={{ ml: 0.5 }}>
                    {getCurrentCurrencyDisplay()}
                  </Box>
                </Box>
              </Button>
            )}

            {/* Show only flag in a circle on mobile */}
            {isMobile && (
              <IconButton
                onClick={handleRegionDialogOpen}
                color="inherit"
                sx={{
                  width: 36,
                  height: 36,
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: "50%",
                  padding: 0.5,
                  fontSize: "1.2em",
                  ml: 1,
                }}
              >
                {getCurrentCountryFlag()}
              </IconButton>
            )}
          </Box>

          {/* Regional Settings Dialog */}
          <RegionalSettingsModal
            open={regionDialogOpen}
            onClose={handleRegionDialogClose}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
