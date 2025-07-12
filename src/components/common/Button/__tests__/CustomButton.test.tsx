import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CustomButton from "../CustomButton";

describe("CustomButton Component", () => {
  test("renders with children and default props", () => {
    render(<CustomButton>Click Me</CustomButton>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("MuiButton-contained");
    expect(button).toHaveClass("MuiButton-containedPrimary");
    expect(button).not.toHaveAttribute("disabled");
  });

  test("renders with different variants", () => {
    const { rerender } = render(
      <CustomButton variant="outlined">Outlined Button</CustomButton>
    );

    let button = screen.getByRole("button", { name: /outlined button/i });
    expect(button).toHaveClass("MuiButton-outlined");

    rerender(<CustomButton variant="text">Text Button</CustomButton>);
    button = screen.getByRole("button", { name: /text button/i });
    expect(button).toHaveClass("MuiButton-text");
  });

  // Test 3: Renders with different colors
  test("renders with different colors", () => {
    const { rerender } = render(
      <CustomButton color="secondary">Secondary Button</CustomButton>
    );

    let button = screen.getByRole("button", { name: /secondary button/i });
    expect(button).toHaveClass("MuiButton-containedSecondary");

    rerender(<CustomButton color="error">Error Button</CustomButton>);
    button = screen.getByRole("button", { name: /error button/i });
    expect(button).toHaveClass("MuiButton-containedError");
  });

  test("renders with different sizes", () => {
    const { rerender } = render(
      <CustomButton size="small">Small Button</CustomButton>
    );

    let button = screen.getByRole("button", { name: /small button/i });
    expect(button).toHaveClass("MuiButton-sizeSmall");

    rerender(<CustomButton size="large">Large Button</CustomButton>);
    button = screen.getByRole("button", { name: /large button/i });
    expect(button).toHaveClass("MuiButton-sizeLarge");
  });

  test("applies disabled state correctly", () => {
    render(<CustomButton disabled>Disabled Button</CustomButton>);

    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("disabled");
  });

  test("applies fullWidth prop correctly", () => {
    render(<CustomButton fullWidth>Full Width Button</CustomButton>);

    const button = screen.getByRole("button", { name: /full width button/i });
    expect(button).toHaveClass("MuiButton-fullWidth");
  });

  test("handles click events", () => {
    const handleClick = jest.fn();
    render(<CustomButton onClick={handleClick}>Clickable Button</CustomButton>);

    const button = screen.getByRole("button", { name: /clickable button/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("does not trigger onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <CustomButton onClick={handleClick} disabled>
        Disabled Button
      </CustomButton>
    );

    const button = screen.getByRole("button", { name: /disabled button/i });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  test("renders with startIcon", () => {
    render(
      <CustomButton startIcon={<span data-testid="start-icon">★</span>}>
        Button with Start Icon
      </CustomButton>
    );

    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /button with start icon/i })
    ).toBeInTheDocument();
  });

  test("renders with endIcon", () => {
    render(
      <CustomButton endIcon={<span data-testid="end-icon">★</span>}>
        Button with End Icon
      </CustomButton>
    );

    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /button with end icon/i })
    ).toBeInTheDocument();
  });

  test("applies custom styles via sx prop", () => {
    render(
      <CustomButton sx={{ margin: "10px", padding: "15px" }}>
        Custom Styled Button
      </CustomButton>
    );

    const button = screen.getByRole("button", {
      name: /custom styled button/i,
    });
    expect(button).toHaveStyle("margin: 10px");
    expect(button).toHaveStyle("padding: 15px");
  });
});
