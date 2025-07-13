import { fetchWithCache, postData, getData } from '../../src/services/api';

// Mock global fetch
global.fetch = jest.fn();

describe('API Service Integration', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
    
    // Mock environment variable for API key
    Object.defineProperty(window, 'import', {
      value: {
        meta: {
          env: {
            VITE_RAPIDAPI_KEY: 'test-api-key'
          }
        }
      },
      writable: true
    });
  });

  // Helper function to mock successful fetch response
  const mockFetchSuccess = (responseData: Record<string, unknown>) => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(responseData)
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    return mockResponse;
  };

  // Helper function to mock fetch error
  const mockFetchError = (status = 500, statusText = 'Server Error') => {
    const mockResponse = {
      ok: false,
      status,
      statusText,
      text: jest.fn().mockResolvedValue('Error message from API')
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    return mockResponse;
  };

  describe('fetchWithCache', () => {
    it('should call fetch with correct URL and headers', async () => {
      const testEndpoint = '/v1/test-endpoint';
      const testData = { message: 'success' };

      mockFetchSuccess(testData);

      const result = await fetchWithCache(testEndpoint);

      // Verify fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(
        'https://sky-scrapper.p.rapidapi.com/api/v1/test-endpoint',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-RapidAPI-Key': 'test-api-key',
            'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
            'Content-Type': 'application/json'
          })
        })
      );

      // Verify response data
      expect(result).toEqual(testData);
    });

    it('should pass additional options to fetch', async () => {
      const testEndpoint = '/v1/test-endpoint';
      const options = { 
        method: 'GET',
        signal: new AbortController().signal,
        headers: { 'Custom-Header': 'value' }
      };

      mockFetchSuccess({ data: 'test' });

      await fetchWithCache(testEndpoint, options);

      // Verify options were passed to fetch
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'GET',
          signal: options.signal,
          headers: expect.objectContaining({
            'Custom-Header': 'value',
            'X-RapidAPI-Key': 'test-api-key'
          })
        })
      );
    });

    it('should throw error for non-OK responses', async () => {
      const testEndpoint = '/v1/test-endpoint';
      const mockResponse = mockFetchError(404, 'Not Found');

      await expect(fetchWithCache(testEndpoint)).rejects.toThrow(/API error with status: 404/);
      expect(mockResponse.text).toHaveBeenCalled();
    });
    
    it('should include error text in thrown error', async () => {
      const testEndpoint = '/v1/test-endpoint';
      mockFetchError(500, 'Server Error');

      await expect(fetchWithCache(testEndpoint)).rejects.toThrow('Error message from API');
    });
  });

  describe('postData', () => {
    it('should call fetchWithCache with POST method and body', async () => {
      const testEndpoint = '/v1/post-endpoint';
      const testRequestData = { key: 'value' };
      const testResponseData = { success: true };

      mockFetchSuccess(testResponseData);

      const result = await postData(testEndpoint, testRequestData);

      // Verify fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(
        'https://sky-scrapper.p.rapidapi.com/api/v1/post-endpoint',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(testRequestData),
          headers: expect.objectContaining({
            'X-RapidAPI-Key': 'test-api-key',
            'Content-Type': 'application/json'
          })
        })
      );

      // Verify response
      expect(result).toEqual(testResponseData);
    });

    it('should handle errors properly', async () => {
      const testEndpoint = '/v1/post-endpoint';
      const testData = { key: 'value' };
      
      mockFetchError(400, 'Bad Request');

      await expect(postData(testEndpoint, testData)).rejects.toThrow(/API error/);
    });
  });

  describe('getData', () => {
    it('should call fetchWithCache with correct endpoint', async () => {
      const testEndpoint = '/v1/get-endpoint';
      const testResponseData = { results: [1, 2, 3] };

      mockFetchSuccess(testResponseData);

      const result = await getData(testEndpoint);

      // Verify fetch was called with correct URL
      expect(global.fetch).toHaveBeenCalledWith(
        'https://sky-scrapper.p.rapidapi.com/api/v1/get-endpoint',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-RapidAPI-Key': 'test-api-key'
          })
        })
      );

      // Verify response
      expect(result).toEqual(testResponseData);
    });

    it('should append query parameters to the URL', async () => {
      const testEndpoint = '/v1/get-endpoint';
      const queryParams = {
        param1: 'value1',
        param2: 'value2'
      };
      const testResponseData = { success: true };

      mockFetchSuccess(testResponseData);

      await getData(testEndpoint, queryParams);

      // Verify URL includes query parameters
      expect(global.fetch).toHaveBeenCalledWith(
        'https://sky-scrapper.p.rapidapi.com/api/v1/get-endpoint?param1=value1&param2=value2',
        expect.any(Object)
      );
    });

    it('should handle errors properly', async () => {
      const testEndpoint = '/v1/get-endpoint';
      
      mockFetchError(500, 'Server Error');

      await expect(getData(testEndpoint)).rejects.toThrow(/API error/);
    });

    it('should correctly URL encode query parameters', async () => {
      const testEndpoint = '/v1/search';
      const queryParams = {
        query: 'New York City',
        filter: 'location=USA&category=hotels'
      };
      
      mockFetchSuccess({ data: [] });

      await getData(testEndpoint, queryParams);

      // Verify parameters are properly URL encoded
      const expectedUrl = 'https://sky-scrapper.p.rapidapi.com/api/v1/search?query=New%20York%20City&filter=location%3DUSA%26category%3Dhotels';
      
      expect(global.fetch).toHaveBeenCalledWith(
        expectedUrl,
        expect.any(Object)
      );
    });
  });
});
