import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Define the structure for our language options
export interface LanguageOption {
  code: string;
  name: string;
}

// Define the structure for our country options
export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

// Define the structure for our currency options
export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

// Interface for our localization context
interface LocalizationContextType {
  currentLanguage: string;
  currentCountry: string;
  currentCurrency: string;
  languageOptions: LanguageOption[];
  countryOptions: CountryOption[];
  currencyOptions: CurrencyOption[];
  setLanguage: (code: string) => void;
  setCountry: (code: string) => void;
  setCurrency: (code: string) => void;
  getCurrentLanguageName: () => string;
  getCurrentCountryName: () => string;
  getCurrentCountryFlag: () => string;
  getCurrentCurrencyDisplay: () => string;
}

// Available languages
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
];

// Available countries
const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
];

// Available currencies
const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
];

// Create our context
const LocalizationContext = createContext<LocalizationContextType | null>(null);

// Custom hook to use the localization context
export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
};

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en-US",
    debug: import.meta.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    supportedLngs: LANGUAGE_OPTIONS.map((lang) => lang.code),
    // Lazy load translations
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    // Default namespace
    defaultNS: "common",
  });

interface LocalizationProviderProps {
  children: React.ReactNode;
}

// Provider component
export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    i18n.language || "en-US"
  );
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country") || "UG"
  );
  const [currentCurrency, setCurrentCurrency] = useState(
    localStorage.getItem("currency") || "UGX"
  );

  // Effect to initialize language from localStorage or browser
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (
      savedLanguage &&
      LANGUAGE_OPTIONS.some((lang) => lang.code === savedLanguage)
    ) {
      setCurrentLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Language change handler
  const handleLanguageChange = (code: string) => {
    setCurrentLanguage(code);
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
  };

  // Country change handler
  const handleCountryChange = (code: string) => {
    setCurrentCountry(code);
    localStorage.setItem("country", code);
  };

  // Currency change handler
  const handleCurrencyChange = (code: string) => {
    setCurrentCurrency(code);
    localStorage.setItem("currency", code);
  };

  // Helper functions to get display values
  const getCurrentLanguageName = (): string => {
    return (
      LANGUAGE_OPTIONS.find((lang) => lang.code === currentLanguage)?.name ||
      "English (US)"
    );
  };

  const getCurrentCountryName = (): string => {
    return (
      COUNTRY_OPTIONS.find((country) => country.code === currentCountry)
        ?.name || "Uganda"
    );
  };

  const getCurrentCountryFlag = (): string => {
    return (
      COUNTRY_OPTIONS.find((country) => country.code === currentCountry)
        ?.flag || "🇺🇬"
    );
  };

  const getCurrentCurrencyDisplay = (): string => {
    const currency = CURRENCY_OPTIONS.find(
      (currency) => currency.code === currentCurrency
    );
    return currency ? `${currency.code} - ${currency.symbol}` : "UGX - USh";
  };

  const value = {
    currentLanguage,
    currentCountry,
    currentCurrency,
    languageOptions: LANGUAGE_OPTIONS,
    countryOptions: COUNTRY_OPTIONS,
    currencyOptions: CURRENCY_OPTIONS,
    setLanguage: handleLanguageChange,
    setCountry: handleCountryChange,
    setCurrency: handleCurrencyChange,
    getCurrentLanguageName,
    getCurrentCountryName,
    getCurrentCountryFlag,
    getCurrentCurrencyDisplay,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocalizationContext;
