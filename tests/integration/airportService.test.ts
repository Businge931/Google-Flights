import { searchAirports, getNearbyAirports } from '../../src/services/airportService';
import { fetchWithCache } from '../../src/services/api';

// Mock the api module
jest.mock('../../src/services/api', () => ({
  fetchWithCache: jest.fn(),
}));

describe('Airport Service Integration', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchAirports', () => {
    it('should return empty array for short queries', async () => {
      const result = await searchAirports('a');
      expect(result).toEqual([]);
      // Verify the API was not called
      expect(fetchWithCache).not.toHaveBeenCalled();
    });

    it('should transform airport search results correctly', async () => {
      // Mock the API response
      const mockApiResponse = {
        status: true,
        data: [
          {
            skyId: 'LHR',
            entityId: 'entity123',
            presentation: {
              suggestionTitle: 'London Heathrow (LHR)',
              title: 'London',
              subtitle: 'United Kingdom',
            },
            navigation: {
              entityId: 'entity123',
            },
          },
        ],
      };
      
      (fetchWithCache as jest.Mock).mockResolvedValueOnce(mockApiResponse);
      
      // Call the function
      const result = await searchAirports('London');
      
      // Verify API was called with correct parameters
      expect(fetchWithCache).toHaveBeenCalledWith(
        '/v1/flights/searchAirport?query=London&locale=en-US',
        { signal: undefined }
      );
      
      // Verify the transformation
      expect(result).toEqual([
        {
          label: 'London Heathrow (LHR)',
          value: 'LHR',
          city: 'London',
          country: 'United Kingdom',
          entityId: 'entity123',
        },
      ]);
    });
    
    it('should handle API errors', async () => {
      // Mock the API to throw an error
      (fetchWithCache as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      
      // Expect the function to throw the error
      await expect(searchAirports('London')).rejects.toThrow();
    });
  });

  describe('getNearbyAirports', () => {
    it('should transform nearby airports data correctly', async () => {
      // Mock the complex API response
      const mockApiResponse = {
        status: true,
        timestamp: 1625097600,
        data: {
          current: {
            skyId: 'JFK',
            entityId: 'entity456',
            presentation: {
              title: 'New York',
              suggestionTitle: 'New York JFK (JFK)',
              subtitle: 'United States',
            },
            navigation: {
              entityId: 'entity456',
              entityType: 'airport',
              localizedName: 'JFK',
              relevantFlightParams: {
                skyId: 'JFK',
                entityId: 'entity456',
                flightPlaceType: 'airport',
                localizedName: 'JFK',
              },
            },
          },
          nearby: [
            {
              presentation: {
                title: 'Newark',
                suggestionTitle: 'Newark Liberty (EWR)',
                subtitle: 'United States',
              },
              navigation: {
                entityId: 'entity789',
                entityType: 'airport',
                localizedName: 'EWR',
                relevantFlightParams: {
                  skyId: 'EWR',
                  entityId: 'entity789',
                  flightPlaceType: 'airport',
                  localizedName: 'EWR',
                },
              },
            },
          ],
        },
      };
      
      (fetchWithCache as jest.Mock).mockResolvedValueOnce(mockApiResponse);
      
      // Call the function
      const result = await getNearbyAirports(40.7128, -74.006);
      
      // Verify API was called with correct parameters
      expect(fetchWithCache).toHaveBeenCalledWith(
        '/v1/flights/getNearByAirports?lat=40.7128&lng=-74.006&locale=en-US'
      );
      
      // Verify the transformation
      expect(result).toEqual({
        current: {
          label: 'New York JFK (JFK)',
          value: 'JFK',
          city: 'New York',
          country: 'United States',
          entityId: 'entity456',
        },
        nearby: [
          {
            label: 'Newark Liberty (EWR)',
            value: 'EWR',
            city: 'Newark',
            country: 'United States',
            entityId: 'entity789',
          },
        ],
      });
    });
    
    it('should handle errors when no nearby airports found', async () => {
      // Mock API response with no data
      (fetchWithCache as jest.Mock).mockResolvedValueOnce({ status: false });
      
      // Expect the function to throw an error
      await expect(getNearbyAirports(40.7128, -74.006)).rejects.toThrow('Failed to fetch nearby airports');
    });
  });
});
