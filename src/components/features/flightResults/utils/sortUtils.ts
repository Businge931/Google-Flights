import type { FlightResult } from "../../../../types/flight";
import type { SortOption } from "../SortSelector/sortTypes";

/**
 * Sorts flight results based on the selected sort option
 * @param flights The flight results to sort
 * @param sortBy The sort option to apply
 * @returns Sorted flight results array
 */
export const sortFlights = (
  flights: FlightResult[],
  sortBy: SortOption
): FlightResult[] => {
  return [...flights].sort((a, b) => {
    switch (sortBy) {
      case "price_high": {
        // Sort by price (lowest first)
        return (
          parseFloat(a.price.amount.toString()) -
          parseFloat(b.price.amount.toString())
        );
      }

      case "fastest": {
        // Sort by total duration (shortest first)
        return a.legs[0].duration - b.legs[0].duration;
      }

      case "outbound_take_off_time": {
        // Sort by outbound departure time
        return (
          new Date(a.legs[0].departure).getTime() -
          new Date(b.legs[0].departure).getTime()
        );
      }

      case "outbound_landing_time": {
        // Sort by outbound arrival time
        return (
          new Date(a.legs[0].arrival).getTime() -
          new Date(b.legs[0].arrival).getTime()
        );
      }

      case "return_take_off_time": {
        // Sort by return departure time (if return flight exists)
        if (a.legs.length > 1 && b.legs.length > 1) {
          return (
            new Date(a.legs[1].departure).getTime() -
            new Date(b.legs[1].departure).getTime()
          );
        }
        return a.legs.length > 1 ? -1 : b.legs.length > 1 ? 1 : 0;
      }

      case "return_landing_time": {
        // Sort by return arrival time (if return flight exists)
        if (a.legs.length > 1 && b.legs.length > 1) {
          return (
            new Date(a.legs[1].arrival).getTime() -
            new Date(b.legs[1].arrival).getTime()
          );
        }
        return a.legs.length > 1 ? -1 : b.legs.length > 1 ? 1 : 0;
      }

      case "best":
      default: {
        // Default sorting is by a weighted score (price and duration)
        const priceWeightA = parseFloat(a.price.amount.toString()) / 100;
        const priceWeightB = parseFloat(b.price.amount.toString()) / 100;
        const durationWeightA = a.legs[0].duration / 60; // duration in hours
        const durationWeightB = b.legs[0].duration / 60; // duration in hours

        // Calculate a composite score (lower is better)
        const scoreA = priceWeightA * 0.7 + durationWeightA * 0.3;
        const scoreB = priceWeightB * 0.7 + durationWeightB * 0.3;

        return scoreA - scoreB;
      }
    }
  });
};
