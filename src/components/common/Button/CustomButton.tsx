import React from "react";
import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
} from "@mui/material";

interface CustomButtonProps extends Omit<MuiButtonProps, "color"> {
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  onClick,
  startIcon,
  endIcon,
  sx,
  ...rest
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 600,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </MuiButton>
  );
};

export default CustomButton;
