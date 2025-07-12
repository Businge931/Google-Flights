import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  Pagination,
} from "@mui/material";

import type { Hotel } from "../../../../types/hotel";
import HotelCard from "../HotelCard/HotelCard";

interface HotelResultsProps {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
  resultsSummary?: string;
}

const HotelResults: React.FC<HotelResultsProps> = ({
  hotels,
  loading,
  error,
}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate pagination
  const totalPages = Math.ceil(hotels.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentHotels = hotels.slice(startIndex, startIndex + itemsPerPage);

  // Effect to scroll to top when page changes
  useEffect(() => {
    if (resultsRef.current) {
      // Find the nearest scrollable parent
      let scrollableParent: Element | null = resultsRef.current;
      
      while (
        scrollableParent &&
        !(
          window.getComputedStyle(scrollableParent).overflowY === 'auto' ||
          window.getComputedStyle(scrollableParent).overflowY === 'scroll'
        )
      ) {
        scrollableParent = scrollableParent.parentElement;
      }
      
      // If no scrollable parent found, default to document.documentElement (html)
      const scrollTarget = scrollableParent || document.documentElement;
      
      const yOffset = -120; // Account for sticky header
      const y = resultsRef.current.getBoundingClientRect().top + 
                window.pageYOffset + yOffset;
      
      scrollTarget.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [page]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (hotels.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, mt: 2, textAlign: "center" }}>
        <Typography variant="h6">No hotels found</Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search criteria
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 3 }} ref={resultsRef}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {currentHotels.map((hotel) => (
          <Box key={hotel.hotelId}>
            <HotelCard hotel={hotel} />
          </Box>
        ))}
      </Box>

      {/* Show pagination only if there are more than one page */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default HotelResults;
