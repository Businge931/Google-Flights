import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dropdown from '../Dropdown';
import type { DropdownOption } from '../Dropdown';

// Sample options for testing
const testOptions: DropdownOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Dropdown Component', () => {
  test('renders with required props', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown 
        value="option1" 
        onChange={handleChange} 
        options={testOptions}
      />
    );
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveTextContent('Option 1');
  });

  test('renders with label', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown 
        label="Test Label"
        value="option1" 
        onChange={handleChange} 
        options={testOptions}
      />
    );
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('shows required indicator when required is true', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown 
        label="Test Label"
        value="option1" 
        onChange={handleChange} 
        options={testOptions}
        required
      />
    );
    
    const labelContainer = screen.getByText(/Test Label/i).closest('span');
    expect(labelContainer).toHaveTextContent(/\*/);
  });

  test('renders in disabled state', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown 
        value="option1" 
        onChange={handleChange} 
        options={testOptions}
        disabled
      />
    );
    
    // In MUI, the parent div gets the disabled attribute
    const selectWrapper = screen.getByText('Option 1').closest('.MuiInputBase-root');
    expect(selectWrapper).toHaveClass('Mui-disabled');
  });

  test('displays placeholder when provided', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown 
        value="" 
        onChange={handleChange} 
        options={testOptions}
        placeholder="Select an option"
      />
    );
    
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  test('renders in error state with helper text', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown 
        value="option1" 
        onChange={handleChange} 
        options={testOptions}
        error
        helperText="This field is required"
      />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveStyle('color: rgb(211, 47, 47)'); // error color
  });

  test('displays helper text without error', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown 
        value="option1" 
        onChange={handleChange} 
        options={testOptions}
        helperText="Helper information"
      />
    );
    
    expect(screen.getByText('Helper information')).toBeInTheDocument();
    // Should not have error color
    expect(screen.getByText('Helper information')).not.toHaveStyle('color: rgb(211, 47, 47)');
  });

  test('displays start icon when provided', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown 
        value="option1" 
        onChange={handleChange} 
        options={testOptions}
        startIcon={<span data-testid="test-icon">★</span>}
      />
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  test('calls onChange handler when selection changes', async () => {
    const handleChange = jest.fn();
    
    render(
      <Dropdown 
        value="option1" 
        onChange={handleChange} 
        options={testOptions}
      />
    );
    
    // Open the select dropdown
    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);
    
    // Wait for the dropdown to appear in the DOM
    const option2 = await screen.findByText('Option 2');
    fireEvent.click(option2);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders full width when fullWidth is true', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown 
        value="option1" 
        onChange={handleChange} 
        options={testOptions}
        fullWidth={true}
      />
    );
    
    // Find FormControl directly by its class
    const formControl = screen.getByText('Option 1').closest('.MuiFormControl-root');
    expect(formControl).toHaveClass('MuiFormControl-fullWidth');
  });

  test('does not render full width when fullWidth is false', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown 
        value="option1" 
        onChange={handleChange} 
        options={testOptions}
        fullWidth={false}
      />
    );
    
    // Find FormControl directly by its class
    const formControl = screen.getByText('Option 1').closest('.MuiFormControl-root');
    expect(formControl).not.toHaveClass('MuiFormControl-fullWidth');
  });

  test('renders all provided options', async () => {
    const handleChange = jest.fn();
    render(
      <Dropdown 
        value="option1" 
        onChange={handleChange} 
        options={testOptions}
      />
    );
    
    // Open the select dropdown
    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);
    
    // Find options by their role and data-value attributes, which are more specific
    const optionElements = await screen.findAllByRole('option');
    
    // Verify we have the right number of options
    expect(optionElements).toHaveLength(3);
    
    // Verify option texts - find specific options by their data-value attribute
    expect(optionElements[0]).toHaveTextContent('Option 1');
    expect(optionElements[1]).toHaveTextContent('Option 2');
    expect(optionElements[2]).toHaveTextContent('Option 3');
  });
});
