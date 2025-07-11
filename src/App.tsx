import {
  ThemeProvider,
  CssBaseline,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import theme from "./theme";
import Header from "./components/layout/Header";
import SearchForm from "./components/features/flightSearch/SearchForm";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
          overflow: "auto",
        }}
      >
        <Header />

        {/* Blue hero section with heading */}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "primary.main",
            color: "white",
            pt: 4,
            pb: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            flexGrow: 0,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Find your perfect flight
          </Typography>

          <Typography variant="body1" sx={{ maxWidth: 600, mb: 4, px: 2 }}>
            Search and compare flights from hundreds of airlines and travel
            sites to find the best deals for your next trip.
          </Typography>
        </Box>

        {/* Main content area with search form */}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "background.default",
            mt: -3,
            display: "flex",
            justifyContent: "center",
            px: { xs: 2, sm: 3 },
            flexGrow: 1,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: 900,
              borderRadius: 2,
              mt: -3,
              overflow: "hidden",
            }}
          >
            <SearchForm
              onSearch={(data) => {
                console.log("Search data:", data);
                // Will implement search functionality in later steps
              }}
            />
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
