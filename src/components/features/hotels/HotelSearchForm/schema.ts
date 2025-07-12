import { z } from "zod";

// Schema for hotel search form validation
export const hotelSearchSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  checkIn: z.date()
    .refine((date) => {
      // Check that the date is today or in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, {
      message: "Check-in date must be today or later"
    }),
  checkOut: z.date(),
  adults: z.number().min(1, "At least 1 adult is required"),
  children: z.number().min(0, "Children cannot be negative"),
  rooms: z.number().min(1, "At least 1 room is required"),
}).refine((data) => {
  // Check that check-out is after check-in
  return data.checkOut > data.checkIn;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"]
}).refine((data) => {
  // Check that number of rooms doesn't exceed number of adults
  return data.rooms <= data.adults;
}, {
  message: "Number of rooms cannot exceed number of adults",
  path: ["rooms"]
});

// Type inference from schema
export type HotelSearchFormData = z.infer<typeof hotelSearchSchema>;

// Default form values
export const defaultFormValues: HotelSearchFormData = {
  destination: "City of London",
  checkIn: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  checkOut: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
  adults: 2,
  children: 0,
  rooms: 1,
};
