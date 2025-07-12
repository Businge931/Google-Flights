import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
  type SelectChangeEvent,
  InputAdornment,
} from "@mui/material";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label?: string;
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  options: DropdownOption[];
  startIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  startIcon,
  fullWidth = true,
  disabled = false,
  required = false,
  error = false,
  helperText,
  placeholder,
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      {label && (
        <Typography variant="caption" sx={{ pl: 1, mb: 0.5, display: "block" }}>
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </Typography>
      )}
      <FormControl
        fullWidth={fullWidth}
        error={error}
        disabled={disabled}
        required={required}
      >
        {placeholder && <InputLabel>{placeholder}</InputLabel>}
        <Select
          value={value}
          onChange={onChange}
          displayEmpty={!placeholder}
          startAdornment={
            startIcon ? (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ) : null
          }
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: 2,
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <Typography
            variant="caption"
            color={error ? "error" : "text.secondary"}
            sx={{ mt: 0.5, ml: 1 }}
          >
            {helperText}
          </Typography>
        )}
      </FormControl>
    </Box>
  );
};

export default Dropdown;
