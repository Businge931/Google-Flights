import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NearbyAirportsDialog from "../NearbyAirportsDialog";

type AirportOption = {
  label: string;
  value: string;
  city: string;
  country: string;
  entityId: string;
};

// Sample airports data for testing
const currentAirport: AirportOption = {
  label: "JFK - John F. Kennedy International Airport",
  value: "JFK",
  city: "New York",
  country: "United States",
  entityId: "jfk123",
};

const nearbyAirports: AirportOption[] = [
  {
    label: "LGA - LaGuardia Airport",
    value: "LGA",
    city: "New York",
    country: "United States",
    entityId: "lga456",
  },
  {
    label: "EWR - Newark Liberty International Airport",
    value: "EWR",
    city: "Newark",
    country: "United States",
    entityId: "ewr789",
  },
];

describe("NearbyAirportsDialog Component", () => {
  // Test 1: Basic rendering in closed state
  test("does not render content when closed", () => {
    const handleClose = jest.fn();
    const handleSelectAirport = jest.fn();

    render(
      <NearbyAirportsDialog
        open={false}
        onClose={handleClose}
        onSelectAirport={handleSelectAirport}
        loading={false}
        error={null}
        currentAirport={currentAirport}
        nearbyAirports={nearbyAirports}
      />
    );

    // Dialog title should not be visible when closed
    expect(screen.queryByText("Nearby Airports")).not.toBeInTheDocument();
  });

  // Test 2: Basic rendering in open state
  test("renders dialog content when open", () => {
    const handleClose = jest.fn();
    const handleSelectAirport = jest.fn();

    render(
      <NearbyAirportsDialog
        open={true}
        onClose={handleClose}
        onSelectAirport={handleSelectAirport}
        loading={false}
        error={null}
        currentAirport={currentAirport}
        nearbyAirports={nearbyAirports}
      />
    );

    // Dialog title should be visible (using role to be more specific)
    const dialogTitle = screen.getByRole("heading", { level: 2 });
    expect(dialogTitle).toBeInTheDocument();
    expect(dialogTitle).toHaveTextContent("Nearby Airports");

    // Cancel button should be visible
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  // Test 3: Renders loading state
  test("displays loading indicator when loading", () => {
    const handleClose = jest.fn();
    const handleSelectAirport = jest.fn();

    render(
      <NearbyAirportsDialog
        open={true}
        onClose={handleClose}
        onSelectAirport={handleSelectAirport}
        loading={true}
        error={null}
        currentAirport={null}
        nearbyAirports={[]}
      />
    );

    // Dialog title is always present
    const dialogTitle = screen.getByRole("heading", { level: 2 });
    expect(dialogTitle).toBeInTheDocument();
    expect(dialogTitle).toHaveTextContent("Nearby Airports");

    // CircularProgress should be visible
    const progressIndicator = screen.getByRole("progressbar");
    expect(progressIndicator).toBeInTheDocument();

    // Airport data should not be visible
    expect(screen.queryByText("Current Location Airport")).not.toBeInTheDocument();

    // Section heading shouldn't be present (not the dialog title)
    // Use queryAllByText and check that there's only one element (the dialog title)
    const nearbyAirportsTexts = screen.queryAllByText("Nearby Airports");
    expect(nearbyAirportsTexts).toHaveLength(1); // Only dialog title
  });

  // Test 4: Renders error state
  test("displays error message when there is an error", () => {
    const handleClose = jest.fn();
    const handleSelectAirport = jest.fn();
    const errorMessage = "Failed to fetch nearby airports";

    render(
      <NearbyAirportsDialog
        open={true}
        onClose={handleClose}
        onSelectAirport={handleSelectAirport}
        loading={false}
        error={errorMessage}
        currentAirport={null}
        nearbyAirports={[]}
      />
    );

    // Dialog title is always present
    const dialogTitle = screen.getByRole("heading", { level: 2 });
    expect(dialogTitle).toBeInTheDocument();
    expect(dialogTitle).toHaveTextContent("Nearby Airports");

    // Error message should be visible
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    // Airport data should not be visible
    expect(screen.queryByText("Current Location Airport")).not.toBeInTheDocument();

    // Section heading shouldn't be present (not the dialog title)
    // Use queryAllByText and check that there's only one element (the dialog title)
    const nearbyAirportsTexts = screen.queryAllByText("Nearby Airports");
    expect(nearbyAirportsTexts).toHaveLength(1); // Only dialog title
  });

  // Test 5: Renders current airport section
  test("displays current airport when available", () => {
    const handleClose = jest.fn();
    const handleSelectAirport = jest.fn();

    render(
      <NearbyAirportsDialog
        open={true}
        onClose={handleClose}
        onSelectAirport={handleSelectAirport}
        loading={false}
        error={null}
        currentAirport={currentAirport}
        nearbyAirports={[]}
      />
    );

    // Current airport section should be visible
    expect(screen.getByText("Current Location Airport")).toBeInTheDocument();
    expect(screen.getByText(currentAirport.label)).toBeInTheDocument();

    // Find the list item containing the current airport label and check its secondary text
    const airportListItem = screen.getByText(currentAirport.label).closest('.MuiListItemText-root');
    const countryElement = airportListItem?.querySelector('.MuiListItemText-secondary');
    expect(countryElement).toHaveTextContent(currentAirport.country);
  });

  // Test 6: Renders nearby airports section
  test("displays nearby airports when available", () => {
    const handleClose = jest.fn();
    const handleSelectAirport = jest.fn();

    render(
      <NearbyAirportsDialog
        open={true}
        onClose={handleClose}
        onSelectAirport={handleSelectAirport}
        loading={false}
        error={null}
        currentAirport={null}
        nearbyAirports={nearbyAirports}
      />
    );

    // Multiple elements might have text 'Nearby Airports', so let's be more specific
    // Find the subtitle for nearby airports section (it's an h6)
    const nearbyAirportsHeadings = screen.getAllByText("Nearby Airports");
    const sectionHeading = nearbyAirportsHeadings.find(
      (el) => el.tagName.toLowerCase() === "h6"
    );
    expect(sectionHeading).toBeInTheDocument();

    // All nearby airports should be listed by label
    expect(screen.getByText(nearbyAirports[0].label)).toBeInTheDocument();
    expect(screen.getByText(nearbyAirports[1].label)).toBeInTheDocument();

    // For countries, we need to check within their respective list items since they may have the same value
    const airportLabels = [nearbyAirports[0].label, nearbyAirports[1].label];

    airportLabels.forEach((label, index) => {
      const listItemText = screen.getByText(label).closest('.MuiListItemText-root');
      const countryElement = listItemText?.querySelector('.MuiListItemText-secondary');
      expect(countryElement).toHaveTextContent(nearbyAirports[index].country);
    });
  });

  // Test 7: Displays message when no airports found
  test("displays message when no airports are found", () => {
    const handleClose = jest.fn();
    const handleSelectAirport = jest.fn();

    render(
      <NearbyAirportsDialog
        open={true}
        onClose={handleClose}
        onSelectAirport={handleSelectAirport}
        loading={false}
        error={null}
        currentAirport={null}
        nearbyAirports={[]}
      />
    );

    // No airports message should be visible
    expect(
      screen.getByText("No airports found near your location")
    ).toBeInTheDocument();
  });

  // Test 8: Calls onClose when Cancel button is clicked
  test("calls onClose when Cancel button is clicked", () => {
    const handleClose = jest.fn();
    const handleSelectAirport = jest.fn();

    render(
      <NearbyAirportsDialog
        open={true}
        onClose={handleClose}
        onSelectAirport={handleSelectAirport}
        loading={false}
        error={null}
        currentAirport={currentAirport}
        nearbyAirports={nearbyAirports}
      />
    );

    // Click Cancel button
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // onClose should have been called
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // Test 9: Calls onSelectAirport when current airport is selected
  test("calls onSelectAirport when current airport is selected", () => {
    const handleClose = jest.fn();
    const handleSelectAirport = jest.fn();

    render(
      <NearbyAirportsDialog
        open={true}
        onClose={handleClose}
        onSelectAirport={handleSelectAirport}
        loading={false}
        error={null}
        currentAirport={currentAirport}
        nearbyAirports={nearbyAirports}
      />
    );

    // Find the ListItemButton that contains the current airport label and click it
    const currentAirportElement = screen.getByText(currentAirport.label);
    const listItemButton = currentAirportElement.closest('div[role="button"]');
    fireEvent.click(listItemButton || currentAirportElement);

    // onSelectAirport should have been called with current airport
    expect(handleSelectAirport).toHaveBeenCalledWith(currentAirport);

    // onClose should also have been called
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // Test 10: Calls onSelectAirport when a nearby airport is selected
  test("calls onSelectAirport when a nearby airport is selected", () => {
    const handleClose = jest.fn();
    const handleSelectAirport = jest.fn();

    render(
      <NearbyAirportsDialog
        open={true}
        onClose={handleClose}
        onSelectAirport={handleSelectAirport}
        loading={false}
        error={null}
        currentAirport={currentAirport}
        nearbyAirports={nearbyAirports}
      />
    );

    // Find the ListItemButton that contains the nearby airport label and click it
    const nearbyAirportElement = screen.getByText(nearbyAirports[0].label);
    const listItemButton = nearbyAirportElement.closest('div[role="button"]');
    fireEvent.click(listItemButton || nearbyAirportElement);

    // onSelectAirport should have been called with first nearby airport
    expect(handleSelectAirport).toHaveBeenCalledWith(nearbyAirports[0]);

    // onClose should also have been called
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
