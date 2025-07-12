// Mock for Vite's import.meta.env
module.exports = {
  MODE: 'test',
  BASE_URL: '/',
  PROD: false,
  DEV: true,
  SSR: false,
  NODE_ENV: 'test',
  VITE_RAPIDAPI_KEY: 'mock-api-key',
  VITE_RAPIDAPI_HOST: 'mock-api-host.com',
};
