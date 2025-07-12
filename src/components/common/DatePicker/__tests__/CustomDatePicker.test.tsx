import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CustomDatePicker from "../CustomDatePicker";
import { CalendarToday } from "@mui/icons-material";

// Mock the MUI date picker to simplify testing
jest.mock("@mui/x-date-pickers/DatePicker", () => {
  return {
    DatePicker: ({
      value,
      onChange,
      disabled,
      minDate,
      maxDate,
      slotProps,
    }: {
      value: Date | null;
      onChange: (date: Date | null) => void;
      disabled?: boolean;
      minDate?: Date;
      maxDate?: Date;
      slotProps?: {
        textField?: {
          placeholder?: string;
          error?: boolean;
          helperText?: string;
          InputProps?: {
            startAdornment?: React.ReactNode;
          };
        };
      };
    }) => {
      // Create a simple mock implementation that handles onChange
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        onChange(date);
      };

      // Check if date is within min/max range
      const isDateDisabled = (dateStr: string | Date | null) => {
        if (!dateStr) return false;
        const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
      };

      return (
        <div data-testid="date-picker-mock">
          <input
            type="text"
            data-testid="date-picker-input"
            value={value ? value.toLocaleDateString() : ""}
            onChange={handleChange}
            disabled={disabled}
            placeholder={slotProps?.textField?.placeholder}
            aria-invalid={slotProps?.textField?.error ? "true" : "false"}
            className={isDateDisabled(value) ? "date-disabled" : ""}
          />
          {slotProps?.textField?.helperText && (
            <div data-testid="helper-text">
              {slotProps.textField.helperText}
            </div>
          )}
          {slotProps?.textField?.InputProps?.startAdornment && (
            <div data-testid="start-adornment">
              {slotProps.textField.InputProps.startAdornment}
            </div>
          )}
        </div>
      );
    },
  };
});

describe("CustomDatePicker Component", () => {
  test("renders with minimal required props", () => {
    const handleChange = jest.fn();
    render(<CustomDatePicker value={null} onChange={handleChange} />);

    const datePicker = screen.getByTestId("date-picker-mock");
    expect(datePicker).toBeInTheDocument();

    const input = screen.getByTestId("date-picker-input");
    expect(input).toHaveAttribute("placeholder", "MM/DD/YYYY");
  });

  test("renders with label", () => {
    const handleChange = jest.fn();
    render(
      <CustomDatePicker
        label="Departure Date"
        value={null}
        onChange={handleChange}
      />
    );

    expect(screen.getByText("Departure Date")).toBeInTheDocument();
  });

  test("shows required indicator when required is true", () => {
    const handleChange = jest.fn();
    render(
      <CustomDatePicker
        label="Departure Date"
        value={null}
        onChange={handleChange}
        required
      />
    );

    // The Typography component will contain both the label and the asterisk
    const labelContainer = screen.getByText(/Departure Date/i).closest("span"); // Typography renders as span
    expect(labelContainer).toHaveTextContent(/\*/); // Check for asterisk anywhere in the container
  });

  test("calls onChange when date is selected", () => {
    const handleChange = jest.fn();
    render(<CustomDatePicker value={null} onChange={handleChange} />);

    const input = screen.getByTestId("date-picker-input");
    fireEvent.change(input, { target: { value: "1/1/2023" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    // Check that onChange was called with a Date object
    expect(handleChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  test("displays the provided date value", () => {
    const handleChange = jest.fn();
    const testDate = new Date(2023, 0, 15); // Jan 15, 2023
    render(<CustomDatePicker value={testDate} onChange={handleChange} />);

    const input = screen.getByTestId("date-picker-input");
    expect(input).toHaveValue(testDate.toLocaleDateString());
  });

  test("displays in error state", () => {
    const handleChange = jest.fn();
    render(
      <CustomDatePicker
        value={null}
        onChange={handleChange}
        error={true}
        helperText="Invalid date"
      />
    );

    const input = screen.getByTestId("date-picker-input");
    expect(input).toHaveAttribute("aria-invalid", "true");

    const helperText = screen.getByTestId("helper-text");
    expect(helperText).toHaveTextContent("Invalid date");
  });

  test("respects disabled state", () => {
    const handleChange = jest.fn();
    render(
      <CustomDatePicker value={null} onChange={handleChange} disabled={true} />
    );

    const input = screen.getByTestId("date-picker-input");
    expect(input).toBeDisabled();
  });

  test("displays start icon when provided", () => {
    const handleChange = jest.fn();
    render(
      <CustomDatePicker
        value={null}
        onChange={handleChange}
        startIcon={<CalendarToday data-testid="calendar-icon" />}
      />
    );

    const startAdornment = screen.getByTestId("start-adornment");
    expect(startAdornment).toBeInTheDocument();
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
  });

  test("uses custom placeholder when provided", () => {
    const handleChange = jest.fn();
    render(
      <CustomDatePicker
        value={null}
        onChange={handleChange}
        placeholder="Select a date"
      />
    );

    const input = screen.getByTestId("date-picker-input");
    expect(input).toHaveAttribute("placeholder", "Select a date");
  });

  test("respects minDate constraint", () => {
    const handleChange = jest.fn();
    const minDate = new Date(2023, 0, 10); // Jan 10, 2023
    const earlierDate = new Date(2023, 0, 5); // Jan 5, 2023

    render(
      <CustomDatePicker
        value={earlierDate}
        onChange={handleChange}
        minDate={minDate}
      />
    );

    const input = screen.getByTestId("date-picker-input");
    expect(input).toHaveClass("date-disabled");
  });

  test("respects maxDate constraint", () => {
    const handleChange = jest.fn();
    const maxDate = new Date(2023, 0, 20); // Jan 20, 2023
    const laterDate = new Date(2023, 0, 25); // Jan 25, 2023

    render(
      <CustomDatePicker
        value={laterDate}
        onChange={handleChange}
        maxDate={maxDate}
      />
    );

    const input = screen.getByTestId("date-picker-input");
    expect(input).toHaveClass("date-disabled");
  });
});
