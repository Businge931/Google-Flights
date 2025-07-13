import { getFlightDetails } from "../../src/services/flightDetailsService";
import { fetchWithCache } from "../../src/services/api";

// Mock the api module
jest.mock("../../src/services/api", () => ({
  fetchWithCache: jest.fn(),
}));

describe("Flight Details Service Integration", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFlightDetails", () => {
    // Define test data
    const mockLeg = {
      origin: "LHR",
      destination: "JFK",
      date: "2025-07-15",
    };

    const mockDetailsParams = {
      legs: [mockLeg],
      sessionId: "session-123",
      itineraryId: "itinerary-456",
      adults: 2,
      currency: "USD",
      locale: "en-US",
      market: "US",
      cabinClass: "economy",
      countryCode: "US",
    };

    it("should correctly call API with flight details parameters", async () => {
      // Mock successful API response
      const mockResponse = {
        status: true,
        data: {
          details: {
            itinerary: {
              id: "itinerary-456",
              price: { raw: 450, formatted: "$450" },
            },
            legs: [],
          },
        },
      };

      (fetchWithCache as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the function
      const result = await getFlightDetails(mockDetailsParams);

      // Check API was called correctly
      expect(fetchWithCache).toHaveBeenCalledTimes(1);

      // Verify the API endpoint call
      const apiCall = (fetchWithCache as jest.Mock).mock.calls[0][0];
      expect(apiCall).toContain("/v1/flights/getFlightDetails");
      expect(apiCall).toContain("legs=");
      expect(apiCall).toContain("sessionId=session-123");

      // Verify optional parameters were included
      expect(apiCall).toContain("itineraryId=itinerary-456");
      expect(apiCall).toContain("adults=2");
      expect(apiCall).toContain("currency=USD");
      expect(apiCall).toContain("locale=en-US");
      expect(apiCall).toContain("market=US");
      expect(apiCall).toContain("cabinClass=ECONOMY");
      expect(apiCall).toContain("countryCode=US");

      // Verify the response
      expect(result).toEqual(mockResponse);
    });

    it("should work with minimal required parameters", async () => {
      // Create minimal params with only required fields
      const minimalParams = {
        legs: [mockLeg],
        sessionId: "session-123",
      };

      const mockResponse = {
        status: true,
        data: { details: { legs: [] } },
      };

      (fetchWithCache as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the function
      await getFlightDetails(minimalParams);

      // Verify the API call
      const apiCall = (fetchWithCache as jest.Mock).mock.calls[0][0];
      expect(apiCall).toContain("sessionId=session-123");
      expect(apiCall).toContain("legs=");

      // Optional params should NOT be present
      expect(apiCall).not.toContain("itineraryId=");
      expect(apiCall).not.toContain("adults=");
    });

    it("should properly encode legs as JSON string", async () => {
      // Mock response
      const mockResponse = {
        status: true,
        data: { details: { legs: [] } },
      };

      (fetchWithCache as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the function
      await getFlightDetails(mockDetailsParams);

      // Get the API call and extract the legs parameter
      const apiCall = (fetchWithCache as jest.Mock).mock.calls[0][0];

      // The legs parameter should be a URL-encoded JSON string
      // Extract it from the URL and decode
      const legsParam = apiCall.match(/legs=([^&]+)/)[1];
      const decodedLegs = JSON.parse(decodeURIComponent(legsParam));

      // Verify the legs structure
      expect(decodedLegs).toEqual([mockLeg]);
    });

    it("should handle API errors gracefully", async () => {
      // Mock API error
      const mockError = new Error("API error");
      (fetchWithCache as jest.Mock).mockRejectedValueOnce(mockError);

      // Call function and expect it to throw
      await expect(getFlightDetails(mockDetailsParams)).rejects.toThrow(
        "API error"
      );
      expect(fetchWithCache).toHaveBeenCalledTimes(1);
    });

    it("should handle signal for aborting requests", async () => {
      // Create abort controller
      const controller = new AbortController();
      const signal = controller.signal;

      // Mock successful response
      const mockResponse = {
        status: true,
        data: { details: { legs: [] } },
      };

      (fetchWithCache as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call function with signal
      await getFlightDetails(mockDetailsParams, signal);

      // Verify signal was passed to fetchWithCache
      expect(fetchWithCache).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ signal })
      );
    });
  });
});
