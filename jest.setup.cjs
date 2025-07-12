// Import jest-dom utilities to extend jest's expect
require('@testing-library/jest-dom');

// Add TextEncoder/TextDecoder polyfills for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Environment variables are now mocked via moduleNameMapper

// Global mocks and setup can go here
// For example, if you need to mock fetch:
/*
global.fetch = jest.fn();
*/

// You can also set up global beforeEach/afterEach hooks for all tests
beforeAll(() => {
  // Setup code that runs before all tests
});

afterAll(() => {
  // Cleanup code that runs after all tests
});
