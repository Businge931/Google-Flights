// Navigation type definitions and constants

// Define the navigation tabs we'll use
export type NavigationTab = 'flights' | 'hotels' | 'cars';

// Type for the navigation context
export interface NavigationContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}
