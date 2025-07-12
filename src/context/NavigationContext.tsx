import React, { createContext, useState } from 'react';
import type { NavigationTab, NavigationContextType } from './navigationTypes';

// Create the navigation context with default values
const NavigationContext = createContext<NavigationContextType>({
  activeTab: 'flights',
  setActiveTab: () => {},
});

interface NavigationProviderProps {
  children: React.ReactNode;
}

// Only export the component from this file to fix Fast Refresh
export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('flights');

  return (
    <NavigationContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Export the context for use in useNavigation hook
export default NavigationContext;
