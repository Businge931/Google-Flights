// Mock of the api.ts module to avoid import.meta.env usage
export const fetchWithCache = jest.fn().mockImplementation(async (url, options) => {
  return {
    status: true,
    data: {}
  };
});

export default { fetchWithCache };
