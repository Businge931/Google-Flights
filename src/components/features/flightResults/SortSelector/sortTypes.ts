// Sorting options type
export type SortOption = 
  | "best"
  | "price_high"
  | "fastest"
  | "outbound_take_off_time"
  | "outbound_landing_time"
  | "return_take_off_time"
  | "return_landing_time";

// Sorting options mapping for display in UI
export const sortOptions: Record<SortOption, string> = {
  best: "Best (Default)",
  price_high: "Cheapest",
  fastest: "Fastest",
  outbound_take_off_time: "Outbound Take Off Time",
  outbound_landing_time: "Outbound Landing Time",
  return_take_off_time: "Return Take Off Time",
  return_landing_time: "Return Landing Time"
};
