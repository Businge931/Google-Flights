import React from "react";
import { Container, Box } from "@mui/material";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  disableGutters?: boolean;
  sx?: Record<string, unknown>;
}

/**
 * A responsive container component that adapts to different screen sizes
 * Uses MUI's Container with responsive padding and width
 */
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = "xl",
  disableGutters = false,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Container
        maxWidth={maxWidth}
        disableGutters={disableGutters}
        sx={{
          width: "100%",
          px: { xs: 2, sm: 3, md: 4 },
          ...sx,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default ResponsiveContainer;
