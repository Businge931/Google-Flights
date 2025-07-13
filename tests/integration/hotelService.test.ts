import {
  searchDestinations,
  searchHotels,
  getHotelDetails,
} from "../../src/services/hotelService";
import { formatDate } from "../../src/utils/dateUtils";
import axios from "axios";

// Mock axios
jest.mock("axios");
const mockAxios = axios as jest.MockedFunction<typeof axios>;

// Create mock functions for axios methods
const mockGet = jest.fn();
const mockPost = jest.fn();

// Setup mock implementation for axios
(axios as unknown as jest.Mock).mockImplementation(() => ({
  get: mockGet,
  post: mockPost,
}));

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    VITE_RAPIDAPI_KEY: "test-api-key",
  };

  // Reset axios mocks
  mockGet.mockClear();
  mockPost.mockClear();
  jest.clearAllMocks();
});

afterEach(() => {
  process.env = originalEnv;
});

describe("Hotel Service Integration", () => {
  describe("searchDestinations", () => {
    it("should call the API with correct parameters", async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          status: true,
          timestamp: Date.now(),
          data: [
            {
              hierarchy: "United Kingdom/England/London",
              location: "London, England",
              score: 99,
              entityName: "London",
              entityId: "27544008",
              entityType: "City",
              suggestItem: "London, England",
              class: "City",
              pois: null,
            },
          ],
        },
      };

      mockAxios.mockResolvedValueOnce(mockResponse);

      // Call the function
      const result = await searchDestinations("London");

      // Verify correct API call
      expect(mockAxios).toHaveBeenCalledTimes(1);
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("/searchDestinationOrHotel"),
          params: { query: "London" },
          headers: expect.objectContaining({
            "X-RapidAPI-Key": "test-api-key",
            "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
          }),
        })
      );

      // Verify response transformation
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API errors", async () => {
      // Mock API error
      mockAxios.mockRejectedValueOnce(new Error("API error"));

      // Call the function and expect it to throw
      await expect(searchDestinations("London")).rejects.toThrow(
        "Destination search failed"
      );

      expect(mockAxios).toHaveBeenCalledTimes(1);
    });
  });

  describe("searchHotels", () => {
    // Define test data
    const mockFormData = {
      destination: "London", // Required parameter
      entityId: "27544008", // Optional parameter
      checkIn: new Date("2025-08-15"),
      checkOut: new Date("2025-08-20"),
      adults: 2,
      rooms: 1,
      children: 0,
    };

    it("should call the API with correct parameters", async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          status: true,
          data: {
            hotels: [
              {
                id: "hotel123",
                name: "Test Hotel",
                photos: ["https://example.com/photo.jpg"],
                price: { current: "$200", original: "$250" },
                rating: 4.5,
              },
            ],
          },
        },
      };

      mockAxios.mockResolvedValueOnce(mockResponse);

      // Call the function
      const result = await searchHotels(mockFormData);

      // Verify correct API call
      expect(mockAxios).toHaveBeenCalledTimes(1);
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("/searchHotels"),
          params: expect.objectContaining({
            entityId: "27544008",
            checkin: formatDate(mockFormData.checkIn),
            checkout: formatDate(mockFormData.checkOut),
            adults: 2,
            rooms: 1,
            children: 0,
          }),
          headers: expect.objectContaining({
            "X-RapidAPI-Key": "test-api-key",
          }),
        })
      );

      // Verify response
      expect(result).toEqual(mockResponse.data);
    });

    it("should use default entityId when not provided", async () => {
      // Create form data without entityId
      const formDataWithoutEntityId = {
        ...mockFormData,
        entityId: undefined,
        destination: "London", // Still need destination
      };

      // Mock successful API response
      const mockResponse = {
        data: {
          status: true,
          data: { hotels: [] },
        },
      };

      mockAxios.mockResolvedValueOnce(mockResponse);

      // Call the function
      await searchHotels(formDataWithoutEntityId);

      // Verify API call used default entityId for London
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            entityId: "27544008", // Default London entityId
          }),
        })
      );
    });

    it("should handle API errors", async () => {
      // Mock API error
      mockAxios.mockRejectedValueOnce(new Error("API error"));

      // Call the function and expect it to throw
      await expect(searchHotels(mockFormData)).rejects.toThrow(
        "Hotel search failed"
      );

      expect(mockAxios).toHaveBeenCalledTimes(1);
    });
  });

  describe("getHotelDetails", () => {
    // Define test data
    const mockDetailsParams = {
      hotelId: "hotel123",
      entityId: "27544008",
      currency: "USD",
      market: "en-US",
      countryCode: "US",
    };

    it("should call the API with correct parameters", async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          status: true,
          data: {
            name: "Test Hotel",
            description: "A luxury hotel in central London",
            address: "123 London St",
            photos: [],
            rating: 4.8,
            reviews: [],
          },
        },
      };

      mockAxios.mockResolvedValueOnce(mockResponse);

      // Call the function
      const result = await getHotelDetails(mockDetailsParams);

      // Verify correct API call
      expect(mockAxios).toHaveBeenCalledTimes(1);
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("/getHotelDetails"),
          params: mockDetailsParams,
          headers: expect.objectContaining({
            "X-RapidAPI-Key": "test-api-key",
            "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
          }),
        })
      );

      // Verify response
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle missing optional parameters", async () => {
      // Create minimal params with only required fields
      const minimalParams = {
        hotelId: "hotel123",
        entityId: "27544008",
      };

      // Mock successful API response
      const mockResponse = {
        data: {
          status: true,
          data: { name: "Test Hotel" },
        },
      };

      mockAxios.mockResolvedValueOnce(mockResponse);

      // Call the function
      await getHotelDetails(minimalParams);

      // Verify API call with default values for optional params
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            hotelId: "hotel123",
            entityId: "27544008",
            currency: "USD",
            market: "en-US",
            countryCode: "US",
          }),
        })
      );
    });

    it("should handle API errors", async () => {
      // Mock API error
      mockAxios.mockRejectedValueOnce(new Error("API error"));

      // Call the function and expect it to throw
      await expect(getHotelDetails(mockDetailsParams)).rejects.toThrow(
        "Hotel details fetch failed"
      );

      expect(mockAxios).toHaveBeenCalledTimes(1);
    });
  });
});
