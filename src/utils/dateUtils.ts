/**
 * Date utility functions for formatting and manipulation
 */

/**
 * Format a date object to YYYY-MM-DD format required by the API
 * @param date Date object to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

/**
 * Alias for formatDate - used specifically for API requests
 * @param date Date object to format for API requests
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDateForApi(date: Date): string {
  return formatDate(date);
}

/**
 * Format a date string from API (ISO format) to a more readable format
 * @param dateString ISO date string from API
 * @param includeTime Whether to include time in the output
 * @returns Formatted date string (e.g., "Jul 17, 2025")
 */
export function formatDateForDisplay(dateString: string, includeTime = false): string {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  
  if (includeTime) {
    options.hour = 'numeric';
    options.minute = 'numeric';
    options.hour12 = true;
  }
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Calculate and format duration from minutes
 * @param minutes Duration in minutes
 * @returns Formatted duration string (e.g., "8h 25m")
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  }
  
  return `${mins}m`;
}

/**
 * Format time from ISO date string to 12-hour format
 * @param dateString ISO date string
 * @returns Time in 12-hour format (e.g., "11:45 AM")
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}
