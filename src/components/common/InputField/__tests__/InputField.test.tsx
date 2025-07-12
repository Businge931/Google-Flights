import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputField from "../InputField";
import type { Option } from "../InputField";

type AirportOption = {
  label: string;
  value: string;
  city: string;
  country: string;
  entityId: string;
};

// Mock the airportService module
jest.mock("../../../../services/airportService", () => ({
  getNearbyAirports: jest.fn(() =>
    Promise.resolve({
      current: {
        label: "Current Airport (CUR)",
        value: "cur",
        city: "Current City",
        country: "Current Country",
        entityId: "cur123",
      },
      nearby: [
        {
          label: "Nearby Airport 1 (NB1)",
          value: "nb1",
          city: "Nearby City 1",
          country: "Nearby Country 1",
          entityId: "nb1123",
        },
        {
          label: "Nearby Airport 2 (NB2)",
          value: "nb2",
          city: "Nearby City 2",
          country: "Nearby Country 2",
          entityId: "nb2123",
        },
      ],
    })
  ),
}));

// Mock the useNotification hook
jest.mock("../../../../hooks/useNotification", () => ({
  useNotification: () => ({
    showNotification: jest.fn(),
  }),
}));

// Mock the NearbyAirportsDialog component
jest.mock("../../NearbyAirportsDialog/NearbyAirportsDialog", () => ({
  __esModule: true,
  default: jest.fn(
    ({
      open,
      onClose,
      onSelectAirport,
      loading,
      error,
      currentAirport,
      nearbyAirports,
    }) => (
      <div data-testid="nearby-airports-dialog">
        {open && (
          <div>
            <button onClick={onClose} data-testid="close-dialog-btn">
              Close
            </button>
            {loading && <div data-testid="loading-indicator">Loading...</div>}
            {error && <div data-testid="error-message">{error}</div>}
            {currentAirport && (
              <div data-testid="current-airport">{currentAirport.label}</div>
            )}
            <div data-testid="nearby-airports">
              {nearbyAirports.map((airport: AirportOption) => (
                <button
                  key={airport.value}
                  onClick={() => onSelectAirport(airport)}
                  data-testid={`select-airport-${airport.value}`}
                >
                  {airport.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  ),
}));

// Mock the navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn((successCallback) => {
    successCallback({
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    });
  }),
};
Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
  writable: true,
});

// Sample options for testing
const testOptions: Option[] = [
  {
    label: "Option 1",
    value: "option1",
    city: "City 1",
    country: "Country 1",
    entityId: "id1",
  },
  {
    label: "Option 2",
    value: "option2",
    city: "City 2",
    country: "Country 2",
    entityId: "id2",
  },
  {
    label: "Option 3",
    value: "option3",
    city: "City 3",
    country: "Country 3",
    entityId: "id3",
  },
];

describe("InputField Component", () => {
  // Test 1: Basic rendering with required props
  test("renders with required props", () => {
    render(<InputField options={testOptions} />);

    const inputElement = screen.getByRole("combobox");
    expect(inputElement).toBeInTheDocument();
  });

  // Test 2: Renders with label
  test("renders with label", () => {
    render(<InputField label="Test Label" options={testOptions} />);

    const labelElement = screen.getByText("Test Label");
    expect(labelElement).toBeInTheDocument();
  });

  // Test 3: Shows required indicator when required is true
  test("shows required indicator when required is true", () => {
    render(
      <InputField label="Test Label" options={testOptions} required={true} />
    );

    const requiredIndicator = screen.getByText("*");
    expect(requiredIndicator).toBeInTheDocument();
    // Use RGB value instead of named color as MUI converts named colors to RGB
    expect(requiredIndicator).toHaveStyle("color: rgb(255, 0, 0)");
  });

  // Test 4: Renders in disabled state
  test("renders in disabled state", () => {
    render(<InputField options={testOptions} disabled={true} />);

    const inputElement = screen.getByRole("combobox");
    expect(inputElement).toBeDisabled();
  });

  // Test 5: Displays placeholder
  test("displays placeholder when provided", () => {
    render(<InputField options={testOptions} placeholder="Enter something" />);

    const inputElement = screen.getByPlaceholderText("Enter something");
    expect(inputElement).toBeInTheDocument();
  });

  // Test 6: Renders in error state with helper text
  test("renders in error state with helper text", () => {
    render(
      <InputField
        options={testOptions}
        error={true}
        helperText="This is an error"
      />
    );

    const helperText = screen.getByText("This is an error");
    expect(helperText).toBeInTheDocument();

    // In MUI Autocomplete, the error state is applied to the TextField wrapper
    // We can check for the presence of helperText and that it has error color
    const formHelperText = screen.getByText("This is an error");
    expect(formHelperText).toHaveClass("Mui-error");
  });

  // Test 7: Displays helper text without error
  test("displays helper text without error", () => {
    render(
      <InputField
        options={testOptions}
        helperText="Helper information"
        error={false}
      />
    );

    const helperText = screen.getByText("Helper information");
    expect(helperText).toBeInTheDocument();
  });

  // Test 8: Displays start icon when provided
  test("displays start icon when provided", () => {
    render(
      <InputField
        options={testOptions}
        startIcon={<span data-testid="test-icon">Icon</span>}
      />
    );

    const startIcon = screen.getByTestId("test-icon");
    expect(startIcon).toBeInTheDocument();
  });

  // Test 9: Calls onChange handler when selection changes
  test("calls onChange handler when selection changes", async () => {
    const handleChange = jest.fn();

    render(<InputField options={testOptions} onChange={handleChange} />);

    // Open the dropdown
    const inputElement = screen.getByRole("combobox");
    fireEvent.focus(inputElement);
    fireEvent.keyDown(inputElement, { key: "ArrowDown" });

    // Wait for options to be visible then click one
    await waitFor(() => {
      // Find and click an option (options get rendered in a portal)
      const option = screen.getByText("Option 2");
      fireEvent.click(option);
    });

    // Verify onChange was called with the selected option
    expect(handleChange).toHaveBeenCalledWith(testOptions[1]);
  });

  // Test 10: Calls onInputChange handler when user types
  test("calls onInputChange handler when user types", () => {
    const handleInputChange = jest.fn();

    render(
      <InputField options={testOptions} onInputChange={handleInputChange} />
    );

    const inputElement = screen.getByRole("combobox");
    fireEvent.change(inputElement, { target: { value: "test input" } });

    // onInputChange should be called with the input value
    expect(handleInputChange).toHaveBeenCalledWith("test input");
  });

  // Test 11: Shows loading indicator
  test("shows loading indicator when loading is true", () => {
    render(<InputField options={testOptions} loading={true} />);

    // MUI CircularProgress is rendered with role="progressbar"
    const loadingIndicator = screen.getByRole("progressbar");
    expect(loadingIndicator).toBeInTheDocument();
  });

  // Test 12: Renders full width when fullWidth is true
  test("renders full width when fullWidth is true", () => {
    render(<InputField options={testOptions} fullWidth={true} />);

    // Check that the component has the fullWidth class or attribute
    // Since we're using MUI Autocomplete, we need to check the wrapper element
    const autocompleteElement = screen
      .getByRole("combobox")
      .closest(".MuiAutocomplete-root");
    expect(autocompleteElement).toHaveClass("MuiAutocomplete-fullWidth");
  });

  // Test 13: Renders the "Want nearby airports?" link when nearByAirport is true
  test("renders the nearby airports link when nearByAirport is true", () => {
    render(<InputField options={testOptions} nearByAirport={true} />);

    const nearbyLink = screen.getByText("Want nearby airports?");
    expect(nearbyLink).toBeInTheDocument();
  });

  // Test 14: Opens nearby airports dialog when link is clicked
  test("opens nearby airports dialog when the link is clicked", async () => {
    render(<InputField options={testOptions} nearByAirport={true} />);

    // Click the nearby airports link
    const nearbyLink = screen.getByText("Want nearby airports?");
    fireEvent.click(nearbyLink);

    // Check that the dialog is open
    const dialog = screen.getByTestId("nearby-airports-dialog");
    expect(dialog).toBeInTheDocument();

    // Wait for loading to complete and verify geolocation was called
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();

    // Wait for the current and nearby airports to be fetched and displayed
    await waitFor(() => {
      const currentAirport = screen.getByTestId("current-airport");
      expect(currentAirport).toBeInTheDocument();
    });
  });

  // Test 15: Selects airport from nearby airports dialog
  test("selects airport when clicked in the nearby airports dialog", async () => {
    const handleChange = jest.fn();

    render(
      <InputField
        options={testOptions}
        nearByAirport={true}
        onChange={handleChange}
      />
    );

    // Click the nearby airports link
    const nearbyLink = screen.getByText("Want nearby airports?");
    fireEvent.click(nearbyLink);

    // Wait for the dialog to open and nearby airports to load
    await waitFor(() => {
      const nearbyAirportsElement = screen.getByTestId("nearby-airports");
      expect(nearbyAirportsElement).toBeInTheDocument();
    });

    // Select an airport
    const selectAirportBtn = screen.getByTestId("select-airport-nb1");
    fireEvent.click(selectAirportBtn);

    // Check that onChange was called with the selected airport
    expect(handleChange).toHaveBeenCalled();
  });
});
