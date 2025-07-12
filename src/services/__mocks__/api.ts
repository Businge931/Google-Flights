// Mock API module for Jest tests
export const API_KEY = "mock-api-key";
export const API_HOST = "mock-api-host.com";

export const fetchNearbyAirports = async (lat: number, lon: number) => {
  return Promise.resolve({
    status: 200,
    data: {
      airports: [
        {
          name: "Mock Airport 1",
          city: "Mock City 1",
          country: "Mock Country",
          iata: "MCK",
          lat: lat + 0.1,
          lon: lon + 0.1,
          distance: 10.5,
        },
        {
          name: "Mock Airport 2",
          city: "Mock City 2",
          country: "Mock Country",
          iata: "MCK2",
          lat: lat - 0.1,
          lon: lon - 0.1,
          distance: 15.2,
        },
      ],
    },
  });
};

export const fetchAirports = async (query: string) => {
  return Promise.resolve({
    status: 200,
    data: [
      {
        name: `Mock Airport ${query}`,
        iata: query.substring(0, 3).toUpperCase(),
        city: `Mock City ${query}`,
        country: "Mock Country",
        lat: 0,
        lon: 0,
      },
    ],
  });
};

export const fetchFlights = async () => {
  return Promise.resolve({
    status: 200,
    data: {
      results: [
        {
          id: "mock-flight-1",
          price: 299.99,
          departure: {
            airport: "JFK",
            time: "10:00",
          },
          arrival: {
            airport: "LAX",
            time: "13:00",
          },
          duration: "3h 00m",
          stops: 0,
          airline: "Mock Airlines",
        },
      ],
    },
  });
};

export default {
  fetchNearbyAirports,
  fetchAirports,
  fetchFlights,
};
