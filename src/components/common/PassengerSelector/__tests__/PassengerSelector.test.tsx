import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PassengerSelector from "../PassengerSelector";
import type { PassengerCounts } from "../PassengerSelector";

describe("PassengerSelector Component", () => {
  // Test 1: Basic rendering with required props
  test("renders with required props", () => {
    render(<PassengerSelector value={1} />);

    expect(screen.getByText("Passengers")).toBeInTheDocument();

    // Look for text that contains '1' followed by 'Passenger'
    const passengerText = screen.getByText(/1\s*Passenger/i);
    expect(passengerText).toBeInTheDocument();
  });

  // Test 2: Renders with custom label and required indicator
  test("renders with custom label and required indicator", () => {
    render(<PassengerSelector value={1} label="Travellers" required={true} />);

    const label = screen.getByText("Travellers");
    expect(label).toBeInTheDocument();

    const requiredIndicator = screen.getByText("*");
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveStyle("color: rgb(255, 0, 0)");
  });

  // Test 3: Displays correct initial passenger count
  test("displays correct initial passenger count", () => {
    const initialPassengers: PassengerCounts = {
      adults: 2,
      children: 1,
      infants: 1,
    };

    render(
      <PassengerSelector
        value={4} // 2 adults + 1 child + 1 infant = 4
        initialPassengers={initialPassengers}
      />
    );

    // Open the popover
    fireEvent.click(screen.getByText(/4\s*Passenger/i));

    // Check individual passenger counts in the popover
    const adultsSection = screen.getByText("Adults").closest("div")
      ?.parentElement?.parentElement;
    const childrenSection = screen.getByText("Children").closest("div")
      ?.parentElement?.parentElement;
    const infantsSection = screen.getByText("Infants").closest("div")
      ?.parentElement?.parentElement;

    // Target count elements by finding p elements containing only numbers
    // This approach is more reliable than using complex CSS selectors for MUI components
    const adultCountText = Array.from(
      adultsSection?.querySelectorAll("p") || []
    ).find((el: Element) => el.textContent?.match(/^\d+$/));

    const childCountText = Array.from(
      childrenSection?.querySelectorAll("p") || []
    ).find((el: Element) => el.textContent?.match(/^\d+$/));

    const infantCountText = Array.from(
      infantsSection?.querySelectorAll("p") || []
    ).find((el: Element) => el.textContent?.match(/^\d+$/));

    // Check counts in each section
    expect(adultCountText?.textContent).toBe("2");
    expect(childCountText?.textContent).toBe("1");
    expect(infantCountText?.textContent).toBe("1");
  });

  // Test 4: Opens popover when clicked
  test("opens popover when clicked", () => {
    render(<PassengerSelector value={1} />);

    // Initially, popover content should not be visible
    expect(screen.queryByText("Adults")).not.toBeInTheDocument();

    // Find and click the passenger selector area
    const passengerText = screen.getByText(/1\s*Passenger/i);
    fireEvent.click(passengerText);

    // Popover content should now be visible
    expect(screen.getByText("Adults")).toBeInTheDocument();
    expect(screen.getByText("Children")).toBeInTheDocument();
    expect(screen.getByText("Infants")).toBeInTheDocument();
  });

  // Test 5: Closes popover when "Done" is clicked
  test("closes popover when Done is clicked", () => {
    render(<PassengerSelector value={1} />);

    // Click to open popover
    const passengerText = screen.getByText(/1\s*Passenger/i);
    fireEvent.click(passengerText);
    expect(screen.getByText("Adults")).toBeInTheDocument();

    // Click Done to close popover
    fireEvent.click(screen.getByText("Done"));

    // For MUI Popover, we just need to verify the popover content is not visible
    // Instead of checking for the DOM element which might still be in transition
    // We check that the Adults text is no longer accessible via screen queries
    expect(screen.queryByText("Adults")).not.toBeVisible();

    // Alternatively, we could verify the anchor element is set to null after clicking Done
    // But this requires knowledge of the component's internal state
  });

  // Test 6: Increments adult count when + is clicked
  test("increments adult count when + is clicked", () => {
    const handleChange = jest.fn();
    const handlePassengerChange = jest.fn();

    render(
      <PassengerSelector
        value={1}
        onChange={handleChange}
        onPassengerChange={handlePassengerChange}
      />
    );

    // Click to open popover
    const passengerText = screen.getByText(/1\s*Passenger/i);
    fireEvent.click(passengerText);

    // Get the adults section
    const adultsSection = screen.getByText("Adults").closest("div")
      ?.parentElement?.parentElement;
    expect(adultsSection).toBeInTheDocument();

    // Find the + button in the adults section - it's in a Typography component
    const plusButton = Array.from(
      adultsSection?.querySelectorAll(".MuiTypography-root") || []
    ).find((el) => el.textContent === "+");
    expect(plusButton).toBeInTheDocument();
    fireEvent.click(plusButton as HTMLElement);

    // Callbacks should be called
    expect(handleChange).toHaveBeenCalledWith(2); // Total is now 2
    expect(handlePassengerChange).toHaveBeenCalledWith({
      adults: 2,
      children: 0,
      infants: 0,
    });
  });

  // Test 7: Decrements adult count when - is clicked
  test("decrements adult count when - is clicked", () => {
    const handleChange = jest.fn();
    const handlePassengerChange = jest.fn();

    const initialPassengers: PassengerCounts = {
      adults: 2,
      children: 0,
      infants: 0,
    };

    render(
      <PassengerSelector
        value={2}
        onChange={handleChange}
        onPassengerChange={handlePassengerChange}
        initialPassengers={initialPassengers}
      />
    );

    // Click to open popover
    const passengerText = screen.getByText(/2\s*Passenger/i);
    fireEvent.click(passengerText);

    // Get the adults section
    const adultsSection = screen.getByText("Adults").closest("div")
      ?.parentElement?.parentElement;
    expect(adultsSection).toBeInTheDocument();

    // Check the current adult count
    const adultCount = Array.from(
      adultsSection?.querySelectorAll(".MuiTypography-root") || []
    ).filter((el) => el.textContent?.match(/^\d+$/))[0];
    expect(adultCount?.textContent).toBe("2");

    // Find the - button in the adults section and click it
    const minusButton = Array.from(
      adultsSection?.querySelectorAll(".MuiTypography-root") || []
    ).find((el) => el.textContent === "-");
    expect(minusButton).toBeInTheDocument();
    fireEvent.click(minusButton as HTMLElement);

    // Callbacks should be called
    expect(handleChange).toHaveBeenCalledWith(1); // Total is now 1
    expect(handlePassengerChange).toHaveBeenCalledWith({
      adults: 1,
      children: 0,
      infants: 0,
    });
  });

  // Test 8: Cannot decrement adults below 1
  test("cannot decrement adults below 1", () => {
    const handleChange = jest.fn();
    const handlePassengerChange = jest.fn();

    render(
      <PassengerSelector
        value={1}
        onChange={handleChange}
        onPassengerChange={handlePassengerChange}
      />
    );

    // Click to open popover
    const passengerText = screen.getByText(/1\s*Passenger/i);
    fireEvent.click(passengerText);

    // Get the adults section
    const adultsSection = screen.getByText("Adults").closest("div")
      ?.parentElement?.parentElement;
    expect(adultsSection).toBeInTheDocument();

    // Check the current adult count
    const adultCount = Array.from(
      adultsSection?.querySelectorAll(".MuiTypography-root") || []
    ).filter((el) => el.textContent?.match(/^\d+$/))[0];
    expect(adultCount?.textContent).toBe("1");

    // Find the - button in the adults section and click it
    const minusButton = Array.from(
      adultsSection?.querySelectorAll(".MuiTypography-root") || []
    ).find((el) => el.textContent === "-");
    expect(minusButton).toBeInTheDocument();
    fireEvent.click(minusButton as HTMLElement);

    // Callbacks should not be called because we can't go below 1 adult
    expect(handleChange).not.toHaveBeenCalled();
    expect(handlePassengerChange).not.toHaveBeenCalled();
  });

  // Test 9: Increments children count when + is clicked
  test("increments children count when + is clicked", () => {
    const handleChange = jest.fn();
    const handlePassengerChange = jest.fn();

    render(
      <PassengerSelector
        value={1}
        onChange={handleChange}
        onPassengerChange={handlePassengerChange}
      />
    );

    // Click to open popover
    const passengerText = screen.getByText(/1\s*Passenger/i);
    fireEvent.click(passengerText);

    // Get the children section
    const childrenSection = screen.getByText("Children").closest("div")
      ?.parentElement?.parentElement;
    expect(childrenSection).toBeInTheDocument();

    // Find the + button in the children section - it's in a Typography component
    const plusButton = Array.from(
      childrenSection?.querySelectorAll(".MuiTypography-root") || []
    ).find((el) => el.textContent === "+");
    expect(plusButton).toBeInTheDocument();
    fireEvent.click(plusButton as HTMLElement);

    // Callbacks should be called
    expect(handleChange).toHaveBeenCalledWith(2); // Total is now 2
    expect(handlePassengerChange).toHaveBeenCalledWith({
      adults: 1,
      children: 1,
      infants: 0,
    });
  });

  // Test 10: Cannot have more infants than adults
  test("cannot have more infants than adults", () => {
    const handleChange = jest.fn();
    const handlePassengerChange = jest.fn();

    const initialPassengers: PassengerCounts = {
      adults: 1,
      children: 0,
      infants: 1,
    };

    render(
      <PassengerSelector
        value={2}
        onChange={handleChange}
        onPassengerChange={handlePassengerChange}
        initialPassengers={initialPassengers}
      />
    );

    // Click to open popover
    const passengerText = screen.getByText(/2\s*Passenger/i);
    fireEvent.click(passengerText);

    // Get the infants section
    const infantsSection = screen.getByText("Infants").closest("div")
      ?.parentElement?.parentElement;
    expect(infantsSection).toBeInTheDocument();

    // Check the current infant count
    const infantCount = Array.from(
      infantsSection?.querySelectorAll(".MuiTypography-root") || []
    ).filter((el) => el.textContent?.match(/^\d+$/))[0];
    expect(infantCount?.textContent).toBe("1");

    // Find the + button in the infants section - it's in a Typography component
    const plusButton = Array.from(
      infantsSection?.querySelectorAll(".MuiTypography-root") || []
    ).find((el) => el.textContent === "+");
    expect(plusButton).toBeInTheDocument();
    fireEvent.click(plusButton as HTMLElement);

    // Callbacks should not be called because infants can't exceed adults
    expect(handleChange).not.toHaveBeenCalled();
    expect(handlePassengerChange).not.toHaveBeenCalled();
  });

  // Test 11: Renders in disabled state
  test("renders in disabled state", () => {
    render(<PassengerSelector value={1} disabled={true} />);

    // Find selector by passenger text
    const passengerText = screen.getByText(/1\s*Passenger/i);

    // Click should not open popover when disabled
    fireEvent.click(passengerText);

    // Popover content should not be visible
    expect(screen.queryByText("Adults")).not.toBeInTheDocument();
  });

  // Test 12: Renders in error state with helper text
  test("renders in error state with helper text", () => {
    render(
      <PassengerSelector
        value={1}
        error={true}
        helperText="Please select passengers"
      />
    );

    // Helper text should be visible
    expect(screen.getByText("Please select passengers")).toBeInTheDocument();

    // The container should have error styling
    // We can't easily check the border color directly, but we can check
    // that the component renders without crashing in error state
    expect(screen.getByText(/1\s*Passenger/i)).toBeInTheDocument();
  });
});
