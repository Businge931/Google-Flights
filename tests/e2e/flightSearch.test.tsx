import React from "react";
// Extend Jest matchers
import "@testing-library/jest-dom";

// Declare Jest-DOM matchers to avoid TypeScript errors
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }
}
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SearchForm from "../../src/components/features/flightSearch/SearchForm/SearchForm";
import { FlightProvider } from "../../src/context/FlightProvider";
import { NotificationProvider } from "../../src/context/NotificationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

// Mock the search hook to prevent actual API calls during tests
jest.mock("../../src/hooks/useAirportSearch", () => ({
  useAirportSearch: () => ({
    originOptions: [
      {
        label: "London Heathrow (LHR)",
        value: "LHR",
        city: "London",
        country: "United Kingdom",
        entityId: "LHR-sky",
      },
    ],
    originLoading: false,
    handleOriginInputChange: jest.fn(),
    destinationOptions: [
      {
        label: "New York JFK (JFK)",
        value: "JFK",
        city: "New York",
        country: "United States",
        entityId: "JFK-sky",
      },
    ],
    destinationLoading: false,
    handleDestinationInputChange: jest.fn(),
  }),
}));

// Mock the flight context
jest.mock("../../src/context/useFlightContext", () => ({
  useFlightContext: () => ({
    searchFlights: jest.fn().mockResolvedValue({}),
    loading: false,
  }),
}));

// Test wrapper component to provide all required contexts
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter>
    <NotificationProvider>
      <FlightProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {children}
        </LocalizationProvider>
      </FlightProvider>
    </NotificationProvider>
  </MemoryRouter>
);

describe("Flight Search Form End-to-End Test", () => {
  test("should complete the flight search flow", async () => {
    const onSearch = jest.fn();

    // Render the SearchForm with all required providers
    render(
      <TestWrapper>
        <SearchForm onSearch={onSearch} />
      </TestWrapper>
    );

    // Step 1: Verify the form is rendered with initial state
    expect(screen.getByText(/Round trip/i)).toBeInTheDocument();

    // Step 2: Change trip type to one-way
    fireEvent.click(screen.getByText(/One way/i));

    // Step 3: Select origin and destination
    // Note: We're simulating selection rather than typing because the actual
    // component uses Autocomplete which requires complex user interactions
    const originInput = screen.getByLabelText(/From/i);
    const destinationInput = screen.getByLabelText(/To/i);

    // Open origin dropdown and select London
    await userEvent.click(originInput);
    await waitFor(() => {
      expect(screen.getByText(/London Heathrow/i)).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText(/London Heathrow/i));

    // Open destination dropdown and select New York
    await userEvent.click(destinationInput);
    await waitFor(() => {
      expect(screen.getByText(/New York JFK/i)).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText(/New York JFK/i));

    // Step 4: Try the swap locations button
    const swapButton = screen.getByRole("button", { name: /swap/i });
    await userEvent.click(swapButton);

    // Step 5: Select cabin class as Business
    const cabinClassSelect = screen.getByLabelText(/Cabin class/i);
    await userEvent.click(cabinClassSelect);
    await userEvent.click(screen.getByText(/Business/i));

    // Step 6: Submit the form
    const searchButton = screen.getByRole("button", { name: /search/i });
    await userEvent.click(searchButton);

    // Step 7: Verify the search function was called
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalled();
    });

    // Verify the search function was called with expected data
    await waitFor(() => {
      const searchCall = onSearch.mock.calls[0][0];
      expect(searchCall.tripType).toBe("oneWay");
      expect(searchCall.origin.value).toBe("JFK"); // Values are swapped due to the swap button click
      expect(searchCall.destination.value).toBe("LHR");
      expect(searchCall.cabinClass).toBe("Business");
      expect(searchCall.returnDate).toBeNull(); // One-way trip has no return date
    });
  });

  test("form validation prevents submission with missing fields", async () => {
    const onSearch = jest.fn();

    // Render with empty initial state
    render(
      <TestWrapper>
        <SearchForm onSearch={onSearch} />
      </TestWrapper>
    );

    // Try to submit without filling in required fields
    const searchButton = screen.getByRole("button", { name: /search/i });
    await userEvent.click(searchButton);

    // Verify form validation worked - search was not called
    expect(onSearch).not.toHaveBeenCalled();

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Origin is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Destination is required/i)).toBeInTheDocument();
    });
  });
});
