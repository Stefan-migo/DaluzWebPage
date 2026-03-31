-- Migration: 20260324000000_create_analytics_system.sql
-- Creates analytics_events and research_metrics tables for tracking and experimentation
-- Part of Phase 1: Analytics Infrastructure

-- =====================================================
-- ANALYTICS EVENTS TABLE
-- Tracks all user interactions for funnel analysis
-- =====================================================

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    device_type VARCHAR(20),
    browser VARCHAR(50),
    os VARCHAR(50),
    country VARCHAR(50),
    city VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    page_url TEXT,
    referrer_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_category ON analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);

-- Comments
COMMENT ON TABLE analytics_events IS 'Tracks all user interaction events for funnel and conversion analysis';
COMMENT ON COLUMN analytics_events.event_name IS 'Event identifier: page_view, product_view, add_to_cart, checkout_start, purchase, etc.';
COMMENT ON COLUMN analytics_events.event_category IS 'Event group: navigation, commerce, engagement, conversion';
COMMENT ON COLUMN analytics_events.event_data IS 'Additional event-specific data in JSON format';

-- =====================================================
-- RESEARCH METRICS TABLE
-- Stores A/B test results and experiments
-- =====================================================

CREATE TABLE IF NOT EXISTS research_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_name VARCHAR(100) NOT NULL,
    hypothesis TEXT,
    variant VARCHAR(50) NOT NULL,
    control_value DECIMAL(10,4),
    variant_value DECIMAL(10,4),
    sample_size_control INTEGER DEFAULT 0,
    sample_size_variant INTEGER DEFAULT 0,
    conversion_rate_control DECIMAL(6,4),
    conversion_rate_variant DECIMAL(6,4),
    statistical_significance DECIMAL(5,4),
    p_value DECIMAL(8,6),
    confidence_level DECIMAL(4,2) DEFAULT 95.00,
    status VARCHAR(20) DEFAULT 'draft',
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    winner VARCHAR(20),
    learnings TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_research_metrics_experiment_name ON research_metrics(experiment_name);
CREATE INDEX IF NOT EXISTS idx_research_metrics_status ON research_metrics(status);
CREATE INDEX IF NOT EXISTS idx_research_metrics_created_at ON research_metrics(created_at);

-- Comments
COMMENT ON TABLE research_metrics IS 'Stores A/B test configurations and results for data-driven decision making';
COMMENT ON COLUMN research_metrics.status IS 'Experiment status: draft, running, completed, paused';
COMMENT ON COLUMN research_metrics.winner IS 'Result: control, variant, or inconclusive';

-- =====================================================
-- ANALYTICS FUNNEL SUMMARY VIEW
-- Aggregated funnel metrics for dashboard
-- =====================================================

CREATE OR REPLACE VIEW analytics_funnel_summary AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    event_name,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as sessions
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE_TRUNC('day', created_at), event_name;

COMMENT ON VIEW analytics_funnel_summary IS 'Aggregated daily funnel metrics for analytics dashboard';

-- =====================================================
-- FUNCTION: Track Analytics Event (RPC)
-- Inserts events with automatic session/user detection
-- =====================================================

DROP FUNCTION IF EXISTS track_event(VARCHAR, VARCHAR, JSONB, UUID, VARCHAR);

CREATE OR REPLACE FUNCTION track_event(
    p_event_name VARCHAR,
    p_event_category VARCHAR,
    p_event_data JSONB DEFAULT '{}',
    p_user_id UUID DEFAULT NULL,
    p_session_id VARCHAR DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO analytics_events (
        event_name,
        event_category,
        event_data,
        user_id,
        session_id
    ) VALUES (
        p_event_name,
        p_event_category,
        p_event_data,
        COALESCE(p_user_id, NULL),
        COALESCE(p_session_id, gen_random_uuid()::VARCHAR)
    )
    RETURNING id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$;

COMMENT ON FUNCTION track_event IS 'RPC function to track analytics events from frontend';

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_metrics ENABLE ROW LEVEL SECURITY;

-- Analytics events: anyone can insert, only admins can read
DROP POLICY IF EXISTS "analytics_events_insert" ON analytics_events;
CREATE POLICY "analytics_events_insert" ON analytics_events
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "analytics_events_admin_read" ON analytics_events;
CREATE POLICY "analytics_events_admin_read" ON analytics_events
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Research metrics: only admins can manage
DROP POLICY IF EXISTS "research_metrics_admin_all" ON research_metrics;
CREATE POLICY "research_metrics_admin_all" ON research_metrics
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- UPDATE UPDATED_AT TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_research_metrics_updated_at ON research_metrics;
CREATE TRIGGER update_research_metrics_updated_at
    BEFORE UPDATE ON research_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
