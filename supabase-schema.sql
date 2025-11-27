-- Supabase Table Schema for Aviator Pattern Matcher
-- Run this SQL in your Supabase SQL Editor to create the required table

-- Create the aviator_patterns table
CREATE TABLE IF NOT EXISTS aviator_patterns (
    id BIGSERIAL PRIMARY KEY,
    pattern_type VARCHAR(50) NOT NULL,
    pattern_subtype VARCHAR(50),
    description TEXT NOT NULL,
    values JSONB NOT NULL,
    length INTEGER NOT NULL,
    metadata JSONB,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_aviator_patterns_type ON aviator_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_aviator_patterns_detected_at ON aviator_patterns(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_aviator_patterns_created_at ON aviator_patterns(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE aviator_patterns ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read
CREATE POLICY "Allow public read access" ON aviator_patterns
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Create a policy that allows anyone to insert
CREATE POLICY "Allow public insert access" ON aviator_patterns
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Optional: Create a view for pattern statistics
CREATE OR REPLACE VIEW pattern_statistics AS
SELECT
    pattern_type,
    pattern_subtype,
    COUNT(*) as count,
    AVG(length) as avg_length,
    MAX(detected_at) as last_detected
FROM aviator_patterns
GROUP BY pattern_type, pattern_subtype
ORDER BY count DESC;

-- Comment on table
COMMENT ON TABLE aviator_patterns IS 'Stores detected patterns from Aviator X crash game analysis';

-- Comment on columns
COMMENT ON COLUMN aviator_patterns.pattern_type IS 'Type of pattern: streak, sequence, range, alternating, trend';
COMMENT ON COLUMN aviator_patterns.pattern_subtype IS 'Subtype of pattern: high, low, medium, repeating, volatile, etc.';
COMMENT ON COLUMN aviator_patterns.description IS 'Human-readable description of the pattern';
COMMENT ON COLUMN aviator_patterns.values IS 'Array of crash values that form this pattern';
COMMENT ON COLUMN aviator_patterns.length IS 'Number of values in the pattern';
COMMENT ON COLUMN aviator_patterns.metadata IS 'Additional pattern metadata (indexes, ranges, etc.)';
COMMENT ON COLUMN aviator_patterns.detected_at IS 'When the pattern was detected';
