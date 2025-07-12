import { z } from "zod";

// Create a schema with validation
export const searchFormSchema = z.object({
  tripType: z.enum(["roundTrip", "oneWay"]),
  origin: z
    .object({
      label: z.string().min(1, "Origin is required"),
      value: z.string().min(1, "Origin is required"),
      city: z.string().min(1, "City is required"),
      country: z.string().min(1, "Country is required"),
      entityId: z.string().min(1, "Entity ID is required"),
    })
    .nullable()
    .refine((data) => data !== null, {
      message: "Origin is required",
    }),
  destination: z
    .object({
      label: z.string().min(1, "Destination is required"),
      value: z.string().min(1, "Destination is required"),
      city: z.string().min(1, "City is required"),
      country: z.string().min(1, "Country is required"),
      entityId: z.string().min(1, "Entity ID is required"),
    })
    .nullable()
    .refine((data) => data !== null, {
      message: "Destination is required",
    }),
  departureDate: z.date()
    .refine((date) => date !== null, {
      message: "Departure date is required",
    })
    .refine((date) => {
      // Ensure date is not before today
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      return date >= today;
    }, {
      message: "Departure date cannot be before today",
    }),
  returnDate: z.date().nullable(),
  passengers: z
    .number()
    .min(1, "At least one passenger is required")
    .max(10, "Maximum 10 passengers allowed"),
  cabinClass: z.string().min(1, "Cabin class is required"),
})
.refine(
  (data) => {
    // Skip validation if not a round trip
    if (data.tripType !== "roundTrip") return true;
    
    // For round trips, return date is required
    if (!data.returnDate) return false;
    
    return true;
  },
  {
    message: "Return date is required for round trips",
    path: ["returnDate"], // This ensures the error is attached to the returnDate field
  }
)
.refine(
  (data) => {
    // Skip validation if not a round trip or if return date is null
    if (data.tripType !== "roundTrip" || !data.returnDate) return true;
    
    // Return date must be on or after departure date
    return data.returnDate >= data.departureDate;
  },
  {
    message: "Return date cannot be before departure date",
    path: ["returnDate"], // This ensures the error is attached to the returnDate field
  }
);

export type FlightSearchFormData = z.infer<typeof searchFormSchema>;
