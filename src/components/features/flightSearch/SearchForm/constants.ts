import { type CabinClassOption } from "../../../../types/flightSearch";

// Cabin class options
export const CABIN_CLASS_OPTIONS: CabinClassOption[] = [
  { value: "Economy", label: "Economy" },
  { value: "Premium Economy", label: "Premium economy" },
  { value: "Business", label: "Business" },
  { value: "First Class", label: "First class" },
];

// Default form values
export const DEFAULT_FORM_VALUES = {
  tripType: "roundTrip" as const,
  origin: null,
  destination: null,
  departureDate: new Date(),
  returnDate: new Date(new Date().setDate(new Date().getDate() + 7)),
  passengers: 1,
  cabinClass: "Economy",
};
