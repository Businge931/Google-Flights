import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { type SortOption, sortOptions } from "./sortTypes";

interface SortSelectorProps {
  sortBy: SortOption;
  onChange: (sortBy: SortOption) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({ sortBy, onChange }) => {
  const handleSortChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as SortOption);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="sort-select-label">Sort By</InputLabel>
      <Select
        labelId="sort-select-label"
        id="sort-select"
        value={sortBy}
        label="Sort By"
        onChange={handleSortChange}
        startAdornment={<SortIcon fontSize="small" sx={{ mr: 1, ml: -0.5 }} />}
      >
        {(Object.entries(sortOptions) as [SortOption, string][]).map(([value, label]) => (
          <MenuItem key={value} value={value}>{label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SortSelector;
