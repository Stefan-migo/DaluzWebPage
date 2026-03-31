-- Migration: 20260324000001_add_ab_testing_functions.sql
-- Adds RPC function for A/B test tracking

-- =====================================================
-- FUNCTION: Track A/B Experiment Events
-- =====================================================

DROP FUNCTION IF EXISTS track_ab_experiment(VARCHAR, VARCHAR, VARCHAR, VARCHAR);

CREATE OR REPLACE FUNCTION track_ab_experiment(
    p_experiment_name VARCHAR,
    p_variant VARCHAR,
    p_event_type VARCHAR DEFAULT 'view',
    p_goal VARCHAR DEFAULT NULL
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
        user_id
    ) VALUES (
        'ab_experiment_' || p_event_type,
        'experimentation',
        jsonb_build_object(
            'experiment_name', p_experiment_name,
            'variant', p_variant,
            'goal', p_goal,
            'timestamp', NOW()::TEXT
        ),
        auth.uid()
    )
    RETURNING id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$;

COMMENT ON FUNCTION track_ab_experiment IS 'RPC function to track A/B experiment views and conversions';

-- =====================================================
-- TABLE: A/B Test Configurations (for server-side experiments)
-- =====================================================

CREATE TABLE IF NOT EXISTS ab_test_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    hypothesis TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    traffic_percentage INTEGER DEFAULT 100 CHECK (traffic_percentage >= 0 AND traffic_percentage <= 100),
    variant_control JSONB DEFAULT '{}',
    variant_test JSONB DEFAULT '{}',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for active experiments
CREATE INDEX IF NOT EXISTS idx_ab_test_configs_status ON ab_test_configs(status);
CREATE INDEX IF NOT EXISTS idx_ab_test_configs_name ON ab_test_configs(experiment_name);

-- RLS Policies
ALTER TABLE ab_test_configs ENABLE ROW LEVEL SECURITY;

-- Anyone can read active experiments
DROP POLICY IF EXISTS "ab_test_configs_read" ON ab_test_configs;
CREATE POLICY "ab_test_configs_read" ON ab_test_configs
    FOR SELECT TO anon, authenticated USING (status = 'running');

-- Only admins can modify
DROP POLICY IF EXISTS "ab_test_configs_admin_all" ON ab_test_configs;
CREATE POLICY "ab_test_configs_admin_all" ON ab_test_configs
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- TABLE: A/B Test Assignments
-- Stores which variant each user was assigned to
-- =====================================================

CREATE TABLE IF NOT EXISTS ab_test_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    variant VARCHAR(20) NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    converted BOOLEAN DEFAULT FALSE,
    conversion_goal VARCHAR(100),
    converted_at TIMESTAMPTZ,
    UNIQUE(experiment_name, user_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_experiment ON ab_test_assignments(experiment_name);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_user ON ab_test_assignments(user_id);

-- RLS - Users can only read their own assignments
ALTER TABLE ab_test_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ab_test_assignments_read_own" ON ab_test_assignments;
CREATE POLICY "ab_test_assignments_read_own" ON ab_test_assignments
    FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "ab_test_assignments_insert_own" ON ab_test_assignments;
CREATE POLICY "ab_test_assignments_insert_own" ON ab_test_assignments
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "ab_test_assignments_update_own" ON ab_test_assignments;
CREATE POLICY "ab_test_assignments_update_own" ON ab_test_assignments
    FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- =====================================================
-- VIEW: A/B Test Results Summary
-- =====================================================

CREATE OR REPLACE VIEW ab_test_results AS
SELECT 
    a.experiment_name,
    a.variant,
    COUNT(*) as total_assignments,
    COUNT(a.converted) as total_conversions,
    ROUND(COUNT(a.converted)::NUMERIC / COUNT(*) * 100, 2) as conversion_rate,
    MIN(a.assigned_at) as first_assignment,
    MAX(a.assigned_at) as last_assignment
FROM ab_test_assignments a
GROUP BY a.experiment_name, a.variant;

COMMENT ON VIEW ab_test_results IS 'Aggregated A/B test results for analysis';

-- =====================================================
-- FUNCTION: Assign user to experiment
-- =====================================================

DROP FUNCTION IF EXISTS assign_user_to_experiment(VARCHAR, UUID);

CREATE OR REPLACE FUNCTION assign_user_to_experiment(
    p_experiment_name VARCHAR,
    p_user_id UUID
) RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_variant VARCHAR(20);
    v_existing VARCHAR(20);
BEGIN
    -- Check if user already assigned
    SELECT variant INTO v_existing
    FROM ab_test_assignments
    WHERE experiment_name = p_experiment_name AND user_id = p_user_id;
    
    IF v_existing IS NOT NULL THEN
        RETURN v_existing;
    END IF;
    
    -- Deterministic assignment based on user_id hash
    -- Same user always gets same variant for same experiment
    v_variant := CASE 
        WHEN (hashtext(p_user_id::TEXT || p_experiment_name) % 2) = 0 
        THEN 'control' 
        ELSE 'variant' 
    END;
    
    -- Check if experiment is active and user is in traffic percentage
    -- For simplicity, we'll assign if experiment exists and is running
    IF EXISTS (
        SELECT 1 FROM ab_test_configs 
        WHERE experiment_name = p_experiment_name 
        AND status = 'running'
    ) THEN
        INSERT INTO ab_test_assignments (experiment_name, user_id, variant)
        VALUES (p_experiment_name, p_user_id, v_variant)
        ON CONFLICT (experiment_name, user_id) DO NOTHING;
    END IF;
    
    RETURN v_variant;
END;
$$;

COMMENT ON FUNCTION assign_user_to_experiment IS 'Assigns a user to an A/B test variant deterministically';
