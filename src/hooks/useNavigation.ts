import { useContext } from 'react';
import NavigationContext from '../context/NavigationContext';

// Custom hook for accessing navigation context
const useNavigation = () => useContext(NavigationContext);

export default useNavigation;
