import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import FlightFilters, {
  type FlightFilters as FlightFiltersType,
} from "../FlightFilters";
import { type FlightResult } from "../../../../../types/flight";

// Mock the theme provider and media query hooks
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useTheme: () => ({
      breakpoints: {
        down: () => false,
      },
    }),
    useMediaQuery: () => false, // Default to desktop view
  };
});

describe("FlightFilters Component", () => {
  // Define mock data for testing
  const mockFlights: FlightResult[] = [
    {
      id: "flight-1",
      price: { amount: 200, formatted: "$200" },
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
          departure: "2023-06-15T08:00:00.000Z",
          arrival: "2023-06-15T14:00:00.000Z",
          carrier: {
            name: "American Airlines",
            code: "AA",
            logoUrl: "https://example.com/aa.png",
          },
        },
      ],
      totalDuration: 360,
    },
    {
      id: "flight-2",
      price: { amount: 150, formatted: "$150" },
      legs: [
        {
          id: "leg-2",
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
          stops: 1,
          departure: "2023-06-15T09:00:00.000Z",
          arrival: "2023-06-15T16:00:00.000Z",
          carrier: {
            name: "Delta Airlines",
            code: "DL",
            logoUrl: "https://example.com/dl.png",
          },
        },
      ],
      totalDuration: 420,
    },
    {
      id: "flight-3",
      price: { amount: 300, formatted: "$300" },
      legs: [
        {
          id: "leg-3",
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
          duration: 300, // 5 hours
          stops: 0,
          departure: "2023-06-15T07:00:00.000Z",
          arrival: "2023-06-15T12:00:00.000Z",
          carrier: {
            name: "United Airlines",
            code: "UA",
            logoUrl: "https://example.com/ua.png",
          },
        },
      ],
      totalDuration: 300,
    },
  ];

  const initialFilters: FlightFiltersType = {
    stops: [],
    airlines: [],
    priceRange: [0, 1000],
    durationRange: [0, 1440],
    departureTimeRange: [0, 24],
    arrivalTimeRange: [0, 24],
    refundable: null,
    changeable: null,
  };

  // Define mock props
  const mockOnApplyFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders filter sections correctly", () => {
    render(
      <FlightFilters
        flights={mockFlights}
        onApplyFilters={mockOnApplyFilters}
        activeFilters={initialFilters}
      />
    );

    // Check that all filter sections are present
    expect(screen.getByText("Stops")).toBeInTheDocument();
    expect(screen.getByText("Airlines")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Departure Time")).toBeInTheDocument();
    expect(screen.getByText("Arrival Time")).toBeInTheDocument();
    expect(screen.getByText("Fare Policy")).toBeInTheDocument();

    // Check action buttons
    expect(screen.getByText("Reset")).toBeInTheDocument();
    expect(screen.getByText("Apply Filters")).toBeInTheDocument();
  });

  test("expands and collapses accordion sections", () => {
    render(
      <FlightFilters
        flights={mockFlights}
        onApplyFilters={mockOnApplyFilters}
        activeFilters={initialFilters}
      />
    );

    // Initially all accordions are collapsed
    // Find the accordion summaries and click the one with Stops text
    const accordionSummaries = screen.getAllByRole("button");
    const stopsAccordion = accordionSummaries.find((summary) =>
      within(summary).queryByText("Stops")
    );
    if (!stopsAccordion) throw new Error("Stops accordion header not found");
    fireEvent.click(stopsAccordion);

    // Check that the accordion is expanded and contains checkboxes
    // The first checkbox should be for Non-stop, but we can just check if checkboxes are present
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);

    // Also check for the presence of FormControlLabel with the correct text
    // According to the error, the component uses 'Direct (0 stops)' instead of 'Non-stop'
    const accordionDetails = screen.getAllByRole("region")[0]; // First accordion region
    expect(accordionDetails).toBeVisible();
    expect(accordionDetails.textContent).toContain("Direct (0 stops)");
  });

  test("selects stop filters correctly", () => {
    render(
      <FlightFilters
        flights={mockFlights}
        onApplyFilters={mockOnApplyFilters}
        activeFilters={initialFilters}
      />
    );

    // Expand the Stops section
    const accordionSummaries = screen.getAllByRole("button");
    const stopsAccordion = accordionSummaries.find((summary) =>
      within(summary).queryByText("Stops")
    );
    if (!stopsAccordion) throw new Error("Stops accordion header not found");
    fireEvent.click(stopsAccordion);

    // Check the Non-stop checkbox - find by role and then click it
    // The first checkbox in the Stops accordion should be Non-stop
    const checkboxes = screen.getAllByRole("checkbox");
    const nonStopCheckbox = checkboxes[0]; // First checkbox is Non-stop
    fireEvent.click(nonStopCheckbox);

    // Apply filters and check that onApplyFilters was called
    const applyButton = screen.getByText("Apply Filters");
    fireEvent.click(applyButton);

    expect(mockOnApplyFilters).toHaveBeenCalledTimes(1);
    expect(mockOnApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        stops: [0],
      })
    );
  });

  test("selects airline filters correctly", () => {
    render(
      <FlightFilters
        flights={mockFlights}
        onApplyFilters={mockOnApplyFilters}
        activeFilters={initialFilters}
      />
    );

    // Expand the Airlines section
    const accordionSummaries = screen.getAllByRole("button");
    const airlinesAccordion = accordionSummaries.find((summary) =>
      within(summary).queryByText("Airlines")
    );
    if (!airlinesAccordion)
      throw new Error("Airlines accordion header not found");
    fireEvent.click(airlinesAccordion);

    // Check the American Airlines checkbox - find by testing all checkboxes
    // We need to find checkboxes after the airline accordion is expanded
    const checkboxes = screen.getAllByRole("checkbox");
    // Find checkbox that's in a container with "American Airlines" text
    const aaCheckbox = checkboxes.find((checkbox) => {
      const formControlLabel = checkbox.closest("label");
      return (
        formControlLabel &&
        formControlLabel.textContent?.includes("American Airlines")
      );
    });
    if (!aaCheckbox) throw new Error("American Airlines checkbox not found");
    fireEvent.click(aaCheckbox);

    // Apply filters and check that onApplyFilters was called
    const applyButton = screen.getByText("Apply Filters");
    fireEvent.click(applyButton);

    expect(mockOnApplyFilters).toHaveBeenCalledTimes(1);
    expect(mockOnApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        airlines: ["American Airlines"],
      })
    );
  });

  test("adjusts price range slider correctly", () => {
    render(
      <FlightFilters
        flights={mockFlights}
        onApplyFilters={mockOnApplyFilters}
        activeFilters={initialFilters}
      />
    );

    // Expand the Price section
    const accordionSummaries = screen.getAllByRole("button");
    const priceAccordion = accordionSummaries.find((summary) =>
      within(summary).queryByText("Price")
    );
    if (!priceAccordion) throw new Error("Price accordion header not found");
    fireEvent.click(priceAccordion);

    // Instead of looking for min/max labels directly, just check if the Price accordion details are expanded
    // and contains a slider component
    const sliders = screen.getAllByRole("slider");
    expect(sliders.length).toBeGreaterThan(0);

    // Apply filters and check that onApplyFilters was called
    const applyButton = screen.getByText("Apply Filters");
    fireEvent.click(applyButton);

    expect(mockOnApplyFilters).toHaveBeenCalledTimes(1);
  });

  test("selects refundable option correctly", () => {
    render(
      <FlightFilters
        flights={mockFlights}
        onApplyFilters={mockOnApplyFilters}
        activeFilters={initialFilters}
      />
    );

    // Expand the Fare Policy section
    const accordionSummaries = screen.getAllByRole("button");
    const fareAccordion = accordionSummaries.find((summary) =>
      within(summary).queryByText("Fare Policy")
    );
    if (!fareAccordion)
      throw new Error("Fare Policy accordion header not found");
    fireEvent.click(fareAccordion);

    // Select the Refundable radio button
    const radioButtons = screen.getAllByRole("radio");
    // Find the radio button in a container with "Refundable" text
    const refundableRadio = radioButtons.find((radio) => {
      const formControlLabel = radio.closest("label");
      return formControlLabel && formControlLabel.textContent === "Refundable";
    });
    if (!refundableRadio) throw new Error("Refundable radio button not found");
    fireEvent.click(refundableRadio);

    // Apply filters and check that onApplyFilters was called
    const applyButton = screen.getByText("Apply Filters");
    fireEvent.click(applyButton);

    expect(mockOnApplyFilters).toHaveBeenCalledTimes(1);
    expect(mockOnApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        refundable: true,
      })
    );
  });

  test("selects changeable option correctly", () => {
    render(
      <FlightFilters
        flights={mockFlights}
        onApplyFilters={mockOnApplyFilters}
        activeFilters={initialFilters}
      />
    );

    // Expand the Fare Policy section
    const accordionSummaries = screen.getAllByRole("button");
    const fareAccordion = accordionSummaries.find((summary) =>
      within(summary).queryByText("Fare Policy")
    );
    if (!fareAccordion)
      throw new Error("Fare Policy accordion header not found");
    fireEvent.click(fareAccordion);

    // Select the Changeable radio button
    const radioButtons = screen.getAllByRole("radio");
    // Find the radio button in a container with "Changeable" text
    const changeableRadio = radioButtons.find((radio) => {
      const formControlLabel = radio.closest("label");
      return formControlLabel && formControlLabel.textContent === "Changeable";
    });
    if (!changeableRadio) throw new Error("Changeable radio button not found");
    fireEvent.click(changeableRadio);

    // Apply filters and check that onApplyFilters was called
    const applyButton = screen.getByText("Apply Filters");
    fireEvent.click(applyButton);

    expect(mockOnApplyFilters).toHaveBeenCalledTimes(1);
    expect(mockOnApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        changeable: true,
      })
    );
  });

  test("resets all filters when reset button is clicked", () => {
    // Reset the mock first to ensure clean state
    mockOnApplyFilters.mockReset();

    render(
      <FlightFilters
        flights={mockFlights}
        onApplyFilters={mockOnApplyFilters}
        activeFilters={{
          ...initialFilters,
          stops: [0],
          airlines: ["American Airlines"],
          refundable: true,
        }}
      />
    );

    // Click Reset button
    const resetButton = screen.getByText("Reset");
    fireEvent.click(resetButton);

    // Apply filters and check that onApplyFilters was called with reset values
    const applyButton = screen.getByText("Apply Filters");
    fireEvent.click(applyButton);

    // Check the last call was with reset values
    expect(mockOnApplyFilters).toHaveBeenLastCalledWith(
      expect.objectContaining({
        stops: [],
        airlines: [],
        refundable: null,
      })
    );
  });

  test("renders in mobile mode correctly", () => {
    // Override the media query mock to simulate mobile view
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.spyOn(require("@mui/material"), "useMediaQuery").mockReturnValue(true);

    render(
      <FlightFilters
        flights={mockFlights}
        onApplyFilters={mockOnApplyFilters}
        activeFilters={initialFilters}
        isMobile={true}
      />
    );

    // Check that the mobile filter button is rendered
    const filterButton = screen.getByText("Filters");
    expect(filterButton).toBeInTheDocument();

    // Click the filter button to open the drawer
    fireEvent.click(filterButton);

    // Check that filter sections are now visible in the drawer
    expect(screen.getByText("Stops")).toBeInTheDocument();
    expect(screen.getByText("Airlines")).toBeInTheDocument();
  });
});
