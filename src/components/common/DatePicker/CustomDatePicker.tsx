import React from 'react';
import { Box, InputAdornment, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface CustomDatePickerProps {
  label?: string;
  placeholder?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  startIcon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  placeholder = "MM/DD/YYYY",
  value,
  onChange,
  startIcon,
  disabled = false,
  required = false,
  error = false,
  helperText,
  minDate,
  maxDate
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%' }}>
        {label && (
          <Typography variant="caption" sx={{ pl: 1, mb: 0.5, display: 'block' }}>
            {label}{required && <span style={{ color: 'red' }}> *</span>}
          </Typography>
        )}
        <DatePicker
          value={value}
          onChange={onChange}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          slotProps={{
            textField: {
              fullWidth: true,
              placeholder,
              error,
              helperText,
              InputProps: {
                startAdornment: startIcon ? (
                  <InputAdornment position="start">
                    {startIcon}
                  </InputAdornment>
                ) : undefined,
              }
            }
          }}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
