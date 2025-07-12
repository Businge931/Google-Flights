import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FlightCard from "../FlightCard";
import { type FlightResult } from "../../../../../types/flight";

jest.mock("../../../../../utils/dateUtils", () => ({
  formatDuration: (minutes: number) =>
    `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
  formatTime: (isoString: string) => {
    // Return a consistent time format regardless of the input
    // This prevents timezone issues in tests
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  },
}));

describe("FlightCard Component", () => {
  // Mock data for a one-way flight
  const oneWayFlightMock: FlightResult = {
    id: "flight-123",
    price: {
      amount: 199.99,
      formatted: "$199.99",
    },
    legs: [
      {
        id: "leg-1",
        origin: {
          code: "JFK",
          name: "John F. Kennedy International Airport",
          city: "New York",
          country: "United States",
        },
        destination: {
          code: "LAX",
          name: "Los Angeles International Airport",
          city: "Los Angeles",
          country: "United States",
        },
        duration: 360, // 6 hours
        stops: 0,
        departure: "2023-08-15T08:00:00.000Z",
        arrival: "2023-08-15T14:00:00.000Z",
        carrier: {
          name: "American Airlines",
          logoUrl: "https://example.com/aa.png",
          code: "AA",
        },
      },
    ],
    totalDuration: 360,
  };

  // Mock data for a round-trip flight
  const roundTripFlightMock: FlightResult = {
    id: "flight-456",
    price: {
      amount: 399.99,
      formatted: "$399.99",
    },
    legs: [
      {
        id: "leg-1",
        origin: {
          code: "JFK",
          name: "John F. Kennedy International Airport",
          city: "New York",
          country: "United States",
        },
        destination: {
          code: "LAX",
          name: "Los Angeles International Airport",
          city: "Los Angeles",
          country: "United States",
        },
        duration: 360, // 6 hours
        stops: 0,
        departure: "2023-08-15T08:00:00.000Z",
        arrival: "2023-08-15T14:00:00.000Z",
        carrier: {
          name: "American Airlines",
          logoUrl: "https://example.com/aa.png",
          code: "AA",
        },
      },
      {
        id: "leg-2",
        origin: {
          code: "LAX",
          name: "Los Angeles International Airport",
          city: "Los Angeles",
          country: "United States",
        },
        destination: {
          code: "JFK",
          name: "John F. Kennedy International Airport",
          city: "New York",
          country: "United States",
        },
        duration: 330, // 5.5 hours
        stops: 1,
        departure: "2023-08-22T16:00:00.000Z",
        arrival: "2023-08-22T21:30:00.000Z",
        carrier: {
          name: "Delta Airlines",
          logoUrl: "https://example.com/delta.png",
          code: "DL",
        },
      },
    ],
    totalDuration: 690,
  };

  // Mock data for a flight with stops
  const flightWithStopsMock: FlightResult = {
    id: "flight-789",
    price: {
      amount: 149.99,
      formatted: "$149.99",
    },
    legs: [
      {
        id: "leg-1",
        origin: {
          code: "JFK",
          name: "John F. Kennedy International Airport",
          city: "New York",
          country: "United States",
        },
        destination: {
          code: "LAX",
          name: "Los Angeles International Airport",
          city: "Los Angeles",
          country: "United States",
        },
        duration: 420, // 7 hours
        stops: 2,
        departure: "2023-08-15T08:00:00.000Z",
        arrival: "2023-08-15T15:00:00.000Z",
        carrier: {
          name: "United Airlines",
          logoUrl: "https://example.com/united.png",
          code: "UA",
        },
      },
    ],
    totalDuration: 420,
  };

  // Test that the FlightCard renders correctly for a one-way flight
  test("renders one-way flight card correctly", () => {
    const mockOnSelect = jest.fn();
    render(<FlightCard flight={oneWayFlightMock} onSelect={mockOnSelect} />);

    // Check airline info is displayed
    expect(screen.getByText("American Airlines")).toBeInTheDocument();

    // Check for carrier code by finding spans that are captions
    // This is more specific than just looking for text content
    const typographyElements = screen.getAllByText(/AA|flight/);
    const carrierElement = typographyElements.find(
      (element) =>
        element.tagName.toLowerCase() === "span" &&
        element.classList.contains("MuiTypography-caption")
    );
    expect(carrierElement).toBeDefined();
    expect(carrierElement?.textContent).toContain("AA");
    expect(carrierElement?.textContent).toContain("flight");

    // Check origin and destination info
    expect(screen.getByText("JFK")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("LAX")).toBeInTheDocument();
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();

    // Check flight duration
    expect(screen.getByText("6h 0m")).toBeInTheDocument();

    // Check non-stop indicator - appears in multiple places
    const nonStopElements = screen.getAllByText("Non-stop");
    expect(nonStopElements.length).toBeGreaterThanOrEqual(1);

    // Check price
    expect(screen.getByText("$199.99")).toBeInTheDocument();

    // No return leg should be visible
    const dividers = screen.getAllByRole("separator");
    expect(dividers.length).toBe(1); // Only one divider for the flight path
  });

  // Test that the FlightCard renders correctly for a round-trip flight
  test("renders round-trip flight card correctly", () => {
    const mockOnSelect = jest.fn();
    render(<FlightCard flight={roundTripFlightMock} onSelect={mockOnSelect} />);

    // Check both legs are displayed (looking for unique identifiers for each leg)
    const airports = screen.getAllByText(/JFK|LAX/);
    expect(airports.length).toBeGreaterThanOrEqual(4); // At least 4 mentions (origin/destination for each leg)

    // Check both flight durations
    expect(screen.getByText("6h 0m")).toBeInTheDocument();
    expect(screen.getByText("5h 30m")).toBeInTheDocument();

    // Check stops information
    const nonStopText = screen.getAllByText("Non-stop");
    expect(nonStopText.length).toBe(2); // Once in outbound leg details, once in chip
    expect(screen.getByText("1 stop")).toBeInTheDocument();

    // Check price
    expect(screen.getByText("$399.99")).toBeInTheDocument();

    // Return leg should be visible (additional divider)
    const dividers = screen.getAllByRole("separator");
    expect(dividers.length).toBeGreaterThan(1); // More dividers for round trip
  });

  // Test that the FlightCard renders correctly for a flight with stops
  test("renders flight with stops correctly", () => {
    const mockOnSelect = jest.fn();
    render(<FlightCard flight={flightWithStopsMock} onSelect={mockOnSelect} />);

    // Check stops information - using getAllByText because it appears multiple times
    const stopElements = screen.getAllByText("2 stops");
    expect(stopElements.length).toBeGreaterThanOrEqual(1);

    // Shouldn't have "Non-stop" text
    expect(screen.queryByText("Non-stop")).not.toBeInTheDocument();
  });

  // Test that the select button calls onSelect with the flight ID
  test("calls onSelect with flight ID when select button is clicked", () => {
    const mockOnSelect = jest.fn();
    render(<FlightCard flight={oneWayFlightMock} onSelect={mockOnSelect} />);

    const selectButton = screen.getByText("Select Flight");
    fireEvent.click(selectButton);

    expect(mockOnSelect).toHaveBeenCalledWith("flight-123");
  });

  // Test that the carrier logo is displayed if available
  test("displays carrier logo when available", () => {
    const mockOnSelect = jest.fn();
    render(<FlightCard flight={oneWayFlightMock} onSelect={mockOnSelect} />);

    const logo = screen.getByAltText("American Airlines");
    expect(logo).toBeInTheDocument();
    expect(logo.getAttribute("src")).toBe("https://example.com/aa.png");
  });
});
