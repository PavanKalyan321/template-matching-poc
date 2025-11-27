# Aviator X Pattern Matcher

A real-time pattern matching system for Aviator X crash game analysis, built with vanilla JavaScript and Supabase integration.

## Features

### Pattern Detection
- **Streak Detection**: Identifies consecutive high, medium, or low crash values
- **Sequence Detection**: Finds repeating patterns in the crash values
- **Range Patterns**: Detects tight ranges and high volatility periods
- **Alternating Patterns**: Identifies alternating high/low sequences
- **Trend Analysis**: Detects ascending and descending trends

### Real-time Analysis
- Live pattern detection as you add new values
- Visual display of recent crash values with color coding
- Statistics tracking (count, average, min, max)
- Pattern filtering and display controls

### Supabase Integration
- Automatic pattern logging to Supabase database
- Manual logging option
- Query historical patterns
- Pattern statistics and analytics

## Project Structure

```
aviator-pattern-matcher/
├── index.html              # Main application interface
├── css/
│   └── styles.css          # Application styles
├── js/
│   ├── patternMatcher.js   # Core pattern detection engine
│   ├── supabaseLogger.js   # Supabase integration
│   └── app.js              # Main application logic
├── config.example.js       # Example configuration file
├── supabase-schema.sql     # Database schema
├── package.json            # Project metadata
└── README.md               # This file
```

## Setup Instructions

### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd aviator-pattern-matcher
```

### 2. Set Up Supabase

#### Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details
5. Wait for the project to be created

#### Create the Database Table
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase-schema.sql`
4. Paste and run the query
5. Verify the `aviator_patterns` table was created in the **Table Editor**

#### Get Your API Credentials
1. Go to **Settings** > **API**
2. Copy your **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy your **anon/public** API key

### 3. Configure the Application

1. Copy the example configuration file:
   ```bash
   cp config.example.js config.js
   ```

2. Edit `config.js` with your Supabase credentials:
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'https://your-project-id.supabase.co',
       anonKey: 'your-anon-key-here'
   };
   ```

### 4. Run the Application

#### Option 1: Using a Local Server (Recommended)

```bash
# Using Python 3
python -m http.server 8080

# Or using Node.js http-server
npx http-server -p 8080

# Or using PHP
php -S localhost:8080
```

Then open your browser to `http://localhost:8080`

#### Option 2: Open Directly
Simply open `index.html` in your web browser. Note that some features may not work correctly due to CORS restrictions.

## Usage Guide

### Adding Crash Values

#### Single Value
1. Enter a crash value (e.g., `1.50`) in the input field
2. Click "Add Value" or press Enter
3. The value will be added and patterns will be detected automatically

#### Bulk Input
1. Enter multiple values separated by commas in the bulk input field
   - Example: `1.50, 2.30, 1.10, 5.20, 1.80`
2. Click "Add Bulk Values"
3. All values will be processed at once

### Understanding Patterns

#### Streak Patterns
- **High Streaks**: Consecutive values ≥ 2.0x
- **Medium Streaks**: Consecutive values between 1.0x and 2.0x
- **Low Streaks**: Consecutive values < 1.0x

Example: `2.5, 2.1, 2.8, 2.3` = High streak of 4 values

#### Sequence Patterns
Repeating patterns where recent values match previous sequences

Example: `1.5, 2.0, 1.8` followed by `1.5, 2.0, 1.9` (similar pattern)

#### Range Patterns
- **Tight Range**: Values stay within a small range (< 30% of average)
- **Volatile Range**: Wide variation in values (> 100% of average)

#### Alternating Patterns
Values that alternate between high and low

Example: `2.5, 1.2, 2.8, 1.1, 2.3, 1.4`

#### Trend Patterns
- **Ascending**: Values consistently increasing
- **Descending**: Values consistently decreasing

### Pattern Controls
- Toggle pattern types on/off using the checkboxes
- Patterns update in real-time
- Only enabled pattern types are displayed

### Supabase Logging

#### Auto-Log (Default)
- Patterns are automatically logged to Supabase as they're detected
- Toggle the "Auto-log detected patterns" checkbox to enable/disable

#### Manual Logging
- Click "Log Current Patterns" to manually save all current patterns
- Useful when auto-log is disabled

### Viewing Logged Data

You can query your logged patterns directly in Supabase:

```sql
-- Get all patterns
SELECT * FROM aviator_patterns ORDER BY detected_at DESC;

-- Get patterns by type
SELECT * FROM aviator_patterns WHERE pattern_type = 'streak';

-- Get pattern statistics
SELECT * FROM pattern_statistics;

-- Get recent high streaks
SELECT * FROM aviator_patterns
WHERE pattern_type = 'streak' AND pattern_subtype = 'high'
ORDER BY detected_at DESC
LIMIT 10;
```

## API Reference

### PatternMatcher Class

```javascript
const matcher = new PatternMatcher();

// Add values
matcher.addValue(1.50);
matcher.addBulkValues([1.50, 2.30, 1.10]);

// Get data
matcher.getRecentValues(10);  // Get last 10 values
matcher.getPatterns();         // Get all detected patterns
matcher.getStats();            // Get statistics

// Manage data
matcher.clear();               // Clear all data
matcher.export();              // Export to JSON
matcher.import(data);          // Import from JSON
```

### SupabaseLogger Class

```javascript
const logger = new SupabaseLogger(config);

// Initialize
await logger.initialize();

// Log patterns
await logger.logPattern(pattern);
await logger.logPatterns(patterns);

// Query patterns
await logger.getRecentPatterns(50);
await logger.getPatternsByType('streak', 50);
await logger.getStatistics();

// Cleanup
await logger.deleteOldPatterns(30);  // Delete patterns older than 30 days
```

## Configuration Options

### Pattern Matcher Thresholds

Edit `js/patternMatcher.js` to customize detection thresholds:

```javascript
this.thresholds = {
    high: 2.0,    // Values >= 2.0x are considered high
    medium: 1.0,  // Values >= 1.0x are considered medium
    low: 1.0      // Values < 1.0x are considered low
};

this.minSequenceLength = 3; // Minimum pattern length
```

## Troubleshooting

### Supabase Connection Issues

**Problem**: "Configuration Missing" or "Connection Failed"

**Solutions**:
1. Verify `config.js` exists and has correct credentials
2. Check that your Supabase project is active
3. Verify the table was created correctly
4. Check browser console for detailed error messages

### Patterns Not Logging

**Problem**: Patterns detected but not saved to Supabase

**Solutions**:
1. Check Supabase connection status (should show green)
2. Verify auto-log is enabled or use manual log button
3. Check RLS (Row Level Security) policies are configured
4. Look for errors in the log status area

### No Patterns Detected

**Problem**: Values added but no patterns showing

**Solutions**:
1. Add more values (minimum 3 required)
2. Check pattern type filters are enabled
3. Try values that form clear patterns (e.g., `2.0, 2.1, 2.2, 2.3`)

## Security Considerations

- Never commit `config.js` to version control (it's in `.gitignore`)
- Use Supabase Row Level Security (RLS) policies in production
- Consider using environment variables for credentials in production
- The anon key is safe for client-side use, but configure RLS properly

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use and modify as needed.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the Supabase documentation: https://supabase.com/docs
3. Check browser console for error messages

## Future Enhancements

Potential features to add:
- Export patterns to CSV/Excel
- Advanced filtering and search
- Pattern prediction using historical data
- Real-time notifications for specific patterns
- Multi-user support with authentication
- Data visualization with charts
- Pattern confidence scoring
- Custom pattern definitions

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
