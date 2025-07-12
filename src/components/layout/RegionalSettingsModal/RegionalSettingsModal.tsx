import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import PublicIcon from "@mui/icons-material/Public";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useLocalization } from "../../../context/LocalizationContext";
import { useTranslation } from "react-i18next";

interface RegionalSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const RegionalSettingsModal: React.FC<RegionalSettingsModalProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const {
    currentLanguage,
    currentCountry,
    currentCurrency,
    languageOptions,
    countryOptions,
    currencyOptions,
    setLanguage,
    setCountry,
    setCurrency,
  } = useLocalization();

  const [tempLanguage, setTempLanguage] = useState(currentLanguage);
  const [tempCountry, setTempCountry] = useState(currentCountry);
  const [tempCurrency, setTempCurrency] = useState(currentCurrency);

  // Reset temp values when modal opens
  useEffect(() => {
    if (open) {
      setTempLanguage(currentLanguage);
      setTempCountry(currentCountry);
      setTempCurrency(currentCurrency);
    }
  }, [open, currentLanguage, currentCountry, currentCurrency]);

  const handleSave = () => {
    setLanguage(tempLanguage);
    setCountry(tempCountry);
    setCurrency(tempCurrency);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6">{t("regionalSettings.title", "Regional settings")}</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ py: 2 }}>
        {/* Language Selection */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LanguageIcon
              sx={{ mr: 1, color: "text.secondary", fontSize: "1.25rem" }}
            />
            <Typography variant="subtitle1">{t("regionalSettings.language", "Language")}</Typography>
          </Box>
          <FormControl fullWidth>
            <Select
              value={tempLanguage}
              onChange={(e) => setTempLanguage(e.target.value)}
              displayEmpty
              sx={{ textAlign: "left" }}
            >
              {languageOptions.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Country/Region */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PublicIcon
              sx={{ mr: 1, color: "text.secondary", fontSize: "1.25rem" }}
            />
            <Typography variant="subtitle1">{t("regionalSettings.country", "Country / Region")}</Typography>
          </Box>
          <FormHelperText sx={{ mt: -1, mb: 1 }}>
            {t("regionalSettings.countryHelperText", "Selecting the country you're in will give you local deals and information.")}
          </FormHelperText>
          <FormControl fullWidth>
            <Select
              value={tempCountry}
              onChange={(e) => setTempCountry(e.target.value)}
              displayEmpty
              sx={{ textAlign: "left" }}
              renderValue={(value) => {
                const country = countryOptions.find(c => c.code === value);
                return country ? `${country.flag} ${country.name}` : value;
              }}
            >
              {countryOptions.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {`${country.flag} ${country.name}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Currency */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AttachMoneyIcon
              sx={{ mr: 1, color: "text.secondary", fontSize: "1.25rem" }}
            />
            <Typography variant="subtitle1">{t("regionalSettings.currency", "Currency")}</Typography>
          </Box>
          <FormControl fullWidth>
            <Select
              value={tempCurrency}
              onChange={(e) => setTempCurrency(e.target.value)}
              displayEmpty
              sx={{ textAlign: "left" }}
              renderValue={(value) => {
                const currency = currencyOptions.find(c => c.code === value);
                return currency ? `${currency.code} - ${currency.symbol}` : value;
              }}
            >
              {currencyOptions.map((currency) => (
                <MenuItem key={currency.code} value={currency.code}>
                  {`${currency.code} - ${currency.symbol} (${currency.name})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button onClick={onClose} variant="outlined" fullWidth sx={{ mr: 1 }}>
          {t("regionalSettings.cancel", "Cancel")}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ ml: 1 }}
        >
          {t("regionalSettings.save", "Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegionalSettingsModal;
