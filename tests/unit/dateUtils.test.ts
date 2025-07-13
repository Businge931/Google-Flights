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
    
    it('should handle single-digit month and day', () => {
      const testDate = new Date('2025-01-05T12:30:00');
      expect(formatDate(testDate)).toBe('2025-01-05');
    });
    
    it('should handle leap year date', () => {
      const testDate = new Date('2024-02-29T12:30:00');
      expect(formatDate(testDate)).toBe('2024-02-29');
    });
    
    it('should handle timezone differences correctly', () => {
      // Create a date that's right at midnight UTC
      const testDateUTC = new Date(Date.UTC(2025, 6, 15, 0, 0, 0));
      // The result should always use the date in UTC time, not local time
      expect(formatDate(testDateUTC)).toBe('2025-07-15');
    });
  });

  describe('formatDateForApi', () => {
    it('should format a date for API use', () => {
      const testDate = new Date('2025-07-15T12:30:00');
      expect(formatDateForApi(testDate)).toBe('2025-07-15');
    });
    
    it('should handle date at end of month', () => {
      const testDate = new Date('2025-01-31T23:59:59');
      expect(formatDateForApi(testDate)).toBe('2025-01-31');
    });
    
    it('should handle year boundary correctly', () => {
      const testDate = new Date('2025-12-31T23:59:59');
      expect(formatDateForApi(testDate)).toBe('2025-12-31');
    });
    
    it('should use the same format as formatDate', () => {
      const testDate = new Date('2025-07-15T12:30:00');
      expect(formatDateForApi(testDate)).toBe(formatDate(testDate));
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
    
    it('should handle single-digit day correctly', () => {
      const result = formatDateForDisplay('2025-07-05T12:30:00');
      expect(result).toBe('Jul 5, 2025');
    });
    
    it('should handle different months correctly', () => {
      expect(formatDateForDisplay('2025-01-15T12:30:00')).toBe('Jan 15, 2025');
      expect(formatDateForDisplay('2025-02-15T12:30:00')).toBe('Feb 15, 2025');
      expect(formatDateForDisplay('2025-03-15T12:30:00')).toBe('Mar 15, 2025');
      expect(formatDateForDisplay('2025-04-15T12:30:00')).toBe('Apr 15, 2025');
      expect(formatDateForDisplay('2025-05-15T12:30:00')).toBe('May 15, 2025');
      expect(formatDateForDisplay('2025-06-15T12:30:00')).toBe('Jun 15, 2025');
      // July already tested in other tests
      expect(formatDateForDisplay('2025-08-15T12:30:00')).toBe('Aug 15, 2025');
      expect(formatDateForDisplay('2025-09-15T12:30:00')).toBe('Sep 15, 2025');
      expect(formatDateForDisplay('2025-10-15T12:30:00')).toBe('Oct 15, 2025');
      expect(formatDateForDisplay('2025-11-15T12:30:00')).toBe('Nov 15, 2025');
      expect(formatDateForDisplay('2025-12-15T12:30:00')).toBe('Dec 15, 2025');
    });
    
    it('should handle noon correctly when includeTime is true', () => {
      const result = formatDateForDisplay('2025-07-15T12:00:00', true);
      expect(result).toMatch(/Jul 15, 2025, 12:00 PM/);
    });
    
    it('should handle midnight correctly when includeTime is true', () => {
      const result = formatDateForDisplay('2025-07-15T00:00:00', true);
      expect(result).toMatch(/Jul 15, 2025, 12:00 AM/);
    });
    
    it('should gracefully handle invalid date strings', () => {
      // This will result in an "Invalid Date" which gets formatted using the locale rules
      // Just checking that it doesn't throw an exception
      expect(() => formatDateForDisplay('invalid-date')).not.toThrow();
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
    
    it('should handle long durations (>24 hours)', () => {
      expect(formatDuration(1500)).toBe('25h ');
      expect(formatDuration(2000)).toBe('33h 20m');
    });
    
    it('should handle duration of 0 minutes', () => {
      expect(formatDuration(0)).toBe('0m');
    });
    
    it('should handle single digit minutes', () => {
      expect(formatDuration(61)).toBe('1h 1m');
      expect(formatDuration(62)).toBe('1h 2m');
    });
    
    it('should handle edge cases of almost an hour', () => {
      expect(formatDuration(59)).toBe('59m');
      expect(formatDuration(60)).toBe('1h ');
      expect(formatDuration(61)).toBe('1h 1m');
    });
    
    it('should handle fractional minutes as-is (preserving decimals)', () => {
      // The implementation preserves decimal portions of minutes
      expect(formatDuration(90.75)).toBe('1h 30.75m');
      expect(formatDuration(90.25)).toBe('1h 30.25m');
    });
  });

  describe('formatTime', () => {
    it('should format time to 12-hour format', () => {
      const result = formatTime('2025-07-15T14:30:00');
      // Using a regex to match the expected format since the exact output may vary based on locale
      expect(result).toMatch(/\d{1,2}:\d{2} [AP]M/);
    });
    
    it('should format PM times correctly', () => {
      expect(formatTime('2025-07-15T13:30:00')).toBe('1:30 PM');
      expect(formatTime('2025-07-15T14:30:00')).toBe('2:30 PM');
      expect(formatTime('2025-07-15T23:59:00')).toBe('11:59 PM');
    });
    
    it('should format AM times correctly', () => {
      expect(formatTime('2025-07-15T00:30:00')).toBe('12:30 AM');
      expect(formatTime('2025-07-15T01:30:00')).toBe('1:30 AM');
      expect(formatTime('2025-07-15T11:59:00')).toBe('11:59 AM');
    });
    
    it('should handle noon and midnight edge cases', () => {
      expect(formatTime('2025-07-15T00:00:00')).toBe('12:00 AM'); // Midnight
      expect(formatTime('2025-07-15T12:00:00')).toBe('12:00 PM'); // Noon
    });
    
    it('should ignore seconds in the output', () => {
      expect(formatTime('2025-07-15T12:30:45')).toBe('12:30 PM');
    });
    
    it('should gracefully handle invalid date strings', () => {
      // This will result in an "Invalid Date" which gets formatted using the locale rules
      // Just checking that it doesn't throw an exception
      expect(() => formatTime('invalid-date')).not.toThrow();
    });
  });
});
