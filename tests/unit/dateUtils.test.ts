import { 
  formatDate, 
  formatDateForApi, 
  formatDateForDisplay, 
  formatDuration,
  formatTime
} from '../../src/utils/dateUtils';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format a date to YYYY-MM-DD format', () => {
      const testDate = new Date('2025-07-15T12:30:00');
      expect(formatDate(testDate)).toBe('2025-07-15');
    });
  });

  describe('formatDateForApi', () => {
    it('should format a date for API use', () => {
      const testDate = new Date('2025-07-15T12:30:00');
      expect(formatDateForApi(testDate)).toBe('2025-07-15');
    });
  });

  describe('formatDateForDisplay', () => {
    it('should format a date string for display without time', () => {
      const result = formatDateForDisplay('2025-07-15T12:30:00');
      expect(result).toBe('Jul 15, 2025');
    });

    it('should format a date string for display with time when includeTime is true', () => {
      const result = formatDateForDisplay('2025-07-15T12:30:00', true);
      // Using a regex to match the expected format since the exact output may vary based on locale
      expect(result).toMatch(/Jul 15, 2025, \d{1,2}:\d{2} [AP]M/);
    });
  });

  describe('formatDuration', () => {
    it('should format duration with hours and minutes', () => {
      expect(formatDuration(125)).toBe('2h 5m');
    });

    it('should format duration with only hours if minutes is 0', () => {
      expect(formatDuration(120)).toBe('2h ');
    });

    it('should format duration with only minutes if less than an hour', () => {
      expect(formatDuration(45)).toBe('45m');
    });
  });

  describe('formatTime', () => {
    it('should format time to 12-hour format', () => {
      const result = formatTime('2025-07-15T14:30:00');
      // Using a regex to match the expected format since the exact output may vary based on locale
      expect(result).toMatch(/\d{1,2}:\d{2} [AP]M/);
    });
  });
});
