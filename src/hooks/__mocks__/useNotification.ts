// Mock implementation of useNotification hook

export const useNotification = () => {
  return {
    showNotification: jest.fn(),
    hideNotification: jest.fn(),
    notification: null,
  };
};

export default useNotification;
