import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import FlightResults from "../FlightResults";
import { type FlightResult } from "../../../../../types/flight";

// Mock the child components to isolate FlightResults testing
jest.mock("../../FlightCard/FlightCard", () => ({
  __esModule: true,
  default: ({
    flight,
    onSelect,
  }: {
    flight: FlightResult;
    onSelect: () => void;
  }) => (
    <div
      data-testid={`flight-card-${flight.id}`}
      className="mock-flight-card"
      onClick={onSelect}
    >
      <div data-testid="mock-flight-price">
        {flight.price.amount} {flight.price.formatted}
      </div>
      <div data-testid="mock-flight-duration">
        {flight.legs[0].duration} mins
      </div>
    </div>
  ),
}));

jest.mock("../../SortSelector/SortSelector", () => ({
  __esModule: true,
  default: ({
    sortBy,
    onChange,
  }: {
    sortBy: string;
    onChange: (option: string) => void;
  }) => (
    <div data-testid="mock-sort-selector">
      <select
        data-testid="sort-select"
        value={sortBy}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="best">Best</option>
        <option value="price">Price</option>
        <option value="duration">Duration</option>
      </select>
    </div>
  ),
}));

jest.mock("../../FlightFilters/FlightFilters", () => ({
  __esModule: true,
  default: ({
    onApplyFilters,
    activeFilters,
    isMobile,
  }: {
    onApplyFilters: (filters: any) => void;
    activeFilters: any;
    isMobile: boolean;
  }) => (
    <div
      data-testid={
        isMobile ? "mock-flight-filters-mobile" : "mock-flight-filters-desktop"
      }
      className="mock-flight-filters"
    >
      <button
        data-testid="mock-apply-filters-button"
        onClick={() =>
          onApplyFilters({
            ...activeFilters,
            stops: [0], // Add direct flights filter
          })
        }
      >
        Apply Filter
      </button>
      <button
        data-testid="mock-reset-filters-button"
        onClick={() =>
          onApplyFilters({
            stops: [],
            airlines: [],
            priceRange: [0, 10000],
            durationRange: [0, 3000],
            departureTimeRange: [0, 24],
            arrivalTimeRange: [0, 24],
            refundable: null,
            changeable: null,
          })
        }
      >
        Reset Filters
      </button>
    </div>
  ),
}));

// Sample flight data for tests
const mockFlights: FlightResult[] = [
  {
    id: "1",
    price: { amount: 299, formatted: "$299" },
    legs: [
      {
        id: "leg1",
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
        departure: "2023-07-01T08:00:00",
        arrival: "2023-07-01T11:00:00",
        duration: 180,
        stops: 0,
        carrier: {
          code: "AA",
          name: "American Airlines",
          logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/AA.png",
        },
      },
    ],
    totalDuration: 180,
  },
  {
    id: "2",
    price: { amount: 199, formatted: "$199" },
    legs: [
      {
        id: "leg2",
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
        departure: "2023-07-01T10:00:00",
        arrival: "2023-07-01T14:30:00",
        duration: 270,
        stops: 1,
        carrier: {
          code: "DL",
          name: "Delta",
          logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/DL.png",
        },
      },
    ],
    totalDuration: 270,
  },
  {
    id: "3",
    price: { amount: 399, formatted: "$399" },
    legs: [
      {
        id: "leg3",
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
        departure: "2023-07-01T06:00:00",
        arrival: "2023-07-01T09:00:00",
        duration: 180,
        stops: 0,
        carrier: {
          code: "UA",
          name: "United Airlines",
          logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/UA.png",
        },
      },
    ],
    totalDuration: 180,
  },
];

describe("FlightResults Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.scrollTo to prevent JSDOM errors
    window.scrollTo = jest.fn();
  });

  test("renders loading state correctly", () => {
    render(<FlightResults results={[]} loading={true} error={null} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("Searching for flights...")).toBeInTheDocument();
  });

  test("renders error state correctly", () => {
    const errorMessage = "Failed to fetch flight results";
    render(<FlightResults results={[]} loading={false} error={errorMessage} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test("renders empty results state correctly", () => {
    render(<FlightResults results={[]} loading={false} error={null} />);

    expect(
      screen.getByText("No flights found matching your filters.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your filter criteria.")
    ).toBeInTheDocument();
  });

  test("renders flight results correctly", () => {
    render(
      <FlightResults results={mockFlights} loading={false} error={null} />
    );

    // Check that the correct number of results is displayed
    expect(screen.getByText("Flight Results (3)")).toBeInTheDocument();

    // Check flight cards are rendered
    mockFlights.forEach((flight) => {
      expect(
        screen.getByTestId(`flight-card-${flight.id}`)
      ).toBeInTheDocument();
    });

    // Check filters and sort components are rendered
    expect(screen.getByTestId("mock-sort-selector")).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-flight-filters-desktop")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-flight-filters-mobile")
    ).toBeInTheDocument();
  });

  test("sorting flight results works correctly", () => {
    render(
      <FlightResults results={mockFlights} loading={false} error={null} />
    );

    // Change sort option
    const sortSelect = screen.getByTestId("sort-select");
    fireEvent.change(sortSelect, { target: { value: "price" } });

    // The sort select should now have 'price' value
    expect(sortSelect).toHaveValue("price");

    // Since we mocked the SortSelector, we can't easily test the actual sorting logic
    // That should be tested separately in a unit test for the sortFlights function
    // Here we just verify the sort selector works and triggers a re-render with the new sort option
  });

  test("filtering flight results works correctly", () => {
    render(
      <FlightResults results={mockFlights} loading={false} error={null} />
    );

    // Apply a filter - use the first button found (desktop filter)
    const applyButton = screen.getAllByTestId("mock-apply-filters-button")[0];
    fireEvent.click(applyButton);
    // Since we mocked FlightFilters to add a direct flights filter when clicking Apply,
    // we should now see only direct flights
    expect(screen.getByText("Flight Results (2)")).toBeInTheDocument(); // Only 2 flights have stops: 0
    expect(screen.getByTestId("flight-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("flight-card-3")).toBeInTheDocument();
    expect(screen.queryByTestId("flight-card-2")).not.toBeInTheDocument(); // This has stops: 1
  });

  test("resetting filters works correctly", () => {
    render(
      <FlightResults results={mockFlights} loading={false} error={null} />
    );

    // Apply a filter first - use desktop filter (first instance)
    const applyButton = screen.getAllByTestId("mock-apply-filters-button")[0];
    fireEvent.click(applyButton);

    // Then reset filters - use desktop filter (first instance)
    const resetButton = screen.getAllByTestId("mock-reset-filters-button")[0];
    fireEvent.click(resetButton);

    // All flights should be visible again
    expect(screen.getByText("Flight Results (3)")).toBeInTheDocument();
    mockFlights.forEach((flight) => {
      expect(
        screen.getByTestId(`flight-card-${flight.id}`)
      ).toBeInTheDocument();
    });
  });

  test("flight selection callback works correctly", () => {
    const onSelectFlight = jest.fn();
    render(
      <FlightResults
        results={mockFlights}
        loading={false}
        error={null}
        onSelectFlight={onSelectFlight}
      />
    );

    // Click on a flight card
    const flightCard = screen.getByTestId("flight-card-1");
    fireEvent.click(flightCard);

    // Check that the callback was called with the correct flight
    expect(onSelectFlight).toHaveBeenCalledWith(mockFlights[0]);
  });

  // Simplified pagination test that doesn't rely on page navigation behavior
  test("pagination renders correctly with many results", () => {
    // Create enough flights to trigger pagination (more than ITEMS_PER_PAGE)
    const manyFlights = [
      ...mockFlights,
      ...Array(20)
        .fill(0)
        .map((_, i) => ({
          id: `paginated-${i + 4}`, // Use a simple ID pattern
          price: { amount: 100 + i * 10, formatted: `$${100 + i * 10}` },
          legs: [
            {
              id: `paginated-leg-${i + 4}`,
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
              departure: `2023-07-01T${String(8 + (i % 12)).padStart(
                2,
                "0"
              )}:00:00`,
              arrival: `2023-07-01T${String((11 + (i % 12)) % 24).padStart(
                2,
                "0"
              )}:00:00`,
              duration: 180,
              stops: 0,
              carrier: {
                code: "AA",
                name: "American Airlines",
                logoUrl:
                  "https://logos.skyscnr.com/images/airlines/favicon/AA.png",
              },
            },
          ],
          totalDuration: 180,
        })),
    ];

    // Render the component with many flights
    render(
      <FlightResults results={manyFlights} loading={false} error={null} />
    );

    // Verify pagination is shown
    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();

    // Verify pagination buttons are present
    const paginationButtons = within(pagination).getAllByRole("button");
    expect(paginationButtons.length).toBeGreaterThan(1); // At least 2 pages

    // Verify only ITEMS_PER_PAGE (10) items are displayed initially
    const displayedCards = screen.getAllByTestId(/^flight-card-/);
    expect(displayedCards).toHaveLength(10);

    // Instead of testing page navigation, which is complex with JSDOM,
    // we'll just verify the initial page shows the correct cards
    // Based on the sorting logic, the first items shown will be the paginated flights with the lowest prices
    expect(screen.getByTestId("flight-card-paginated-4")).toBeInTheDocument();
    expect(screen.getByTestId("flight-card-paginated-5")).toBeInTheDocument();
    expect(screen.getByTestId("flight-card-paginated-6")).toBeInTheDocument();

    // Verify that cards that should be on page 2 are not shown yet
    expect(
      screen.queryByTestId("flight-card-paginated-14")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("flight-card-paginated-15")
    ).not.toBeInTheDocument();
  });

  test("no pagination shown with few results", () => {
    render(
      <FlightResults results={mockFlights} loading={false} error={null} />
    );

    // Shouldn't show pagination with only 3 results
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
