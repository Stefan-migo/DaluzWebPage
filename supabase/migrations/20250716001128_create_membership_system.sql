-- Create membership plans table
CREATE TABLE public.membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ARS' NOT NULL,
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly', 'one_time')),
  duration_months INTEGER DEFAULT 7, -- 7-month transformation program
  trial_days INTEGER DEFAULT 0,
  -- Plan features
  features JSONB, -- array of plan features
  max_users INTEGER DEFAULT 1,
  includes_coaching BOOLEAN DEFAULT TRUE,
  includes_materials BOOLEAN DEFAULT TRUE,
  includes_community BOOLEAN DEFAULT TRUE,
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create memberships table (user enrollment in plans)
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.membership_plans(id) ON DELETE RESTRICT NOT NULL,
  -- Membership status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused', 'pending')),
  -- Dates
  start_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  end_date TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  pause_start TIMESTAMPTZ,
  pause_end TIMESTAMPTZ,
  -- Payment integration
  mp_subscription_id TEXT, -- Mercado Pago subscription ID
  payment_method TEXT,
  next_billing_date TIMESTAMPTZ,
  -- Progress tracking
  current_week INTEGER DEFAULT 1,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER,
  -- Member notes and coaching
  coach_notes TEXT,
  member_goals TEXT,
  member_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, plan_id, start_date)
);

-- Create program modules table (7-month structure)
CREATE TABLE public.program_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES public.membership_plans(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  week_number INTEGER NOT NULL,
  duration_days INTEGER DEFAULT 7,
  -- Content
  overview TEXT,
  objectives JSONB, -- array of learning objectives
  key_concepts JSONB, -- array of key concepts
  -- Media
  featured_image TEXT,
  intro_video_url TEXT,
  -- Status
  is_published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(plan_id, week_number)
);

-- Create lessons table (individual lessons within modules)
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.program_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  lesson_number INTEGER NOT NULL,
  -- Content types
  content_type TEXT DEFAULT 'article' CHECK (content_type IN ('article', 'video', 'audio', 'exercise', 'meditation', 'reflection')),
  content TEXT, -- Main lesson content (Markdown)
  video_url TEXT,
  audio_url TEXT,
  duration_minutes INTEGER,
  -- Interactive elements
  exercises JSONB, -- array of exercises/activities
  reflection_questions JSONB, -- array of reflection questions
  resources JSONB, -- array of additional resources
  downloads JSONB, -- array of downloadable files
  -- Progress requirements
  requires_completion BOOLEAN DEFAULT TRUE,
  estimated_time_minutes INTEGER DEFAULT 30,
  -- Media
  featured_image TEXT,
  thumbnails JSONB,
  -- Status
  is_published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(module_id, lesson_number)
);

-- Create lesson progress tracking
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  membership_id UUID REFERENCES public.memberships(id) ON DELETE CASCADE NOT NULL,
  -- Progress status
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  -- Engagement
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  time_spent_minutes INTEGER DEFAULT 0,
  -- User submissions
  exercise_responses JSONB, -- user responses to exercises
  reflection_responses JSONB, -- user reflection responses
  notes TEXT, -- personal notes
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, lesson_id, membership_id)
);

-- Create community discussions
CREATE TABLE public.discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.program_modules(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  discussion_type TEXT DEFAULT 'general' CHECK (discussion_type IN ('general', 'question', 'sharing', 'support')),
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create discussion replies
CREATE TABLE public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_reply_id UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create coaching sessions table
CREATE TABLE public.coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  membership_id UUID REFERENCES public.memberships(id) ON DELETE CASCADE NOT NULL,
  coach_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT DEFAULT 'one_on_one' CHECK (session_type IN ('one_on_one', 'group', 'workshop')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  -- Schedule
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  timezone TEXT DEFAULT 'America/Argentina/Buenos_Aires',
  -- Meeting details
  meeting_url TEXT,
  meeting_id TEXT,
  meeting_password TEXT,
  -- Session notes
  preparation_notes TEXT,
  session_notes TEXT,
  follow_up_actions JSONB,
  -- Recordings
  recording_url TEXT,
  resources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create downloadable kits table
CREATE TABLE public.kits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  kit_type TEXT DEFAULT 'general' CHECK (kit_type IN ('general', 'module_specific', 'bonus', 'tool')),
  -- Content
  content TEXT, -- Kit description and instructions
  files JSONB, -- array of downloadable files
  preview_images JSONB, -- array of preview images
  -- Access control
  requires_membership BOOLEAN DEFAULT TRUE,
  required_week INTEGER, -- which week this becomes available
  plan_ids UUID[], -- which membership plans can access this
  -- Media
  featured_image TEXT,
  gallery JSONB,
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create kit downloads tracking
CREATE TABLE public.kit_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kit_id UUID REFERENCES public.kits(id) ON DELETE CASCADE NOT NULL,
  membership_id UUID REFERENCES public.memberships(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  download_date DATE DEFAULT CURRENT_DATE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, kit_id, file_name, download_date)
);

-- Create indexes for performance
CREATE INDEX idx_membership_plans_slug ON public.membership_plans(slug);
CREATE INDEX idx_membership_plans_active ON public.membership_plans(is_active);

CREATE INDEX idx_memberships_user ON public.memberships(user_id);
CREATE INDEX idx_memberships_status ON public.memberships(status);
CREATE INDEX idx_memberships_plan ON public.memberships(plan_id);
CREATE INDEX idx_memberships_billing ON public.memberships(next_billing_date);

CREATE INDEX idx_modules_plan ON public.program_modules(plan_id);
CREATE INDEX idx_modules_week ON public.program_modules(week_number);
CREATE INDEX idx_modules_published ON public.program_modules(is_published);

CREATE INDEX idx_lessons_module ON public.lessons(module_id);
CREATE INDEX idx_lessons_published ON public.lessons(is_published);
CREATE INDEX idx_lessons_type ON public.lessons(content_type);

CREATE INDEX idx_progress_user ON public.lesson_progress(user_id);
CREATE INDEX idx_progress_lesson ON public.lesson_progress(lesson_id);
CREATE INDEX idx_progress_membership ON public.lesson_progress(membership_id);
CREATE INDEX idx_progress_status ON public.lesson_progress(status);

CREATE INDEX idx_discussions_module ON public.discussions(module_id);
CREATE INDEX idx_discussions_lesson ON public.discussions(lesson_id);
CREATE INDEX idx_discussions_user ON public.discussions(user_id);
CREATE INDEX idx_discussions_type ON public.discussions(discussion_type);

CREATE INDEX idx_replies_discussion ON public.discussion_replies(discussion_id);
CREATE INDEX idx_replies_user ON public.discussion_replies(user_id);

CREATE INDEX idx_coaching_membership ON public.coaching_sessions(membership_id);
CREATE INDEX idx_coaching_coach ON public.coaching_sessions(coach_user_id);
CREATE INDEX idx_coaching_scheduled ON public.coaching_sessions(scheduled_at);

CREATE INDEX idx_kits_slug ON public.kits(slug);
CREATE INDEX idx_kits_type ON public.kits(kit_type);
CREATE INDEX idx_kits_active ON public.kits(is_active);
CREATE INDEX idx_kits_week ON public.kits(required_week);

CREATE INDEX idx_downloads_user ON public.kit_downloads(user_id);
CREATE INDEX idx_downloads_kit ON public.kit_downloads(kit_id);

-- Apply updated_at triggers
CREATE TRIGGER update_membership_plans_updated_at
  BEFORE UPDATE ON public.membership_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.program_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussions_updated_at
  BEFORE UPDATE ON public.discussions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_replies_updated_at
  BEFORE UPDATE ON public.discussion_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaching_updated_at
  BEFORE UPDATE ON public.coaching_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kits_updated_at
  BEFORE UPDATE ON public.kits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for membership plans (public viewing)
CREATE POLICY "Anyone can view active membership plans" ON public.membership_plans
  FOR SELECT USING (is_active = TRUE);

-- RLS Policies for memberships (users can only see their own)
CREATE POLICY "Users can view own memberships" ON public.memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own memberships" ON public.memberships
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for program content (members only)
CREATE POLICY "Members can view published modules" ON public.program_modules
  FOR SELECT USING (
    is_published = TRUE AND
    EXISTS (
      SELECT 1 FROM public.memberships 
      WHERE user_id = auth.uid() 
      AND plan_id = program_modules.plan_id 
      AND status = 'active'
    )
  );

CREATE POLICY "Members can view published lessons" ON public.lessons
  FOR SELECT USING (
    is_published = TRUE AND
    EXISTS (
      SELECT 1 FROM public.program_modules pm
      JOIN public.memberships m ON m.plan_id = pm.plan_id
      WHERE pm.id = lessons.module_id
      AND m.user_id = auth.uid()
      AND m.status = 'active'
    )
  );

-- RLS Policies for progress tracking
CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for community discussions
CREATE POLICY "Members can view discussions" ON public.discussions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE user_id = auth.uid()
      AND status = 'active'
    )
  );

CREATE POLICY "Members can create discussions" ON public.discussions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE user_id = auth.uid()
      AND status = 'active'
    )
  );

CREATE POLICY "Users can update own discussions" ON public.discussions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Members can view discussion replies" ON public.discussion_replies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE user_id = auth.uid()
      AND status = 'active'
    )
  );

CREATE POLICY "Members can create replies" ON public.discussion_replies
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE user_id = auth.uid()
      AND status = 'active'
    )
  );

-- RLS Policies for coaching sessions
CREATE POLICY "Users can view own coaching sessions" ON public.coaching_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE id = coaching_sessions.membership_id
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for kits
CREATE POLICY "Members can view accessible kits" ON public.kits
  FOR SELECT USING (
    is_active = TRUE AND
    (
      requires_membership = FALSE OR
      EXISTS (
        SELECT 1 FROM public.memberships
        WHERE user_id = auth.uid()
        AND status = 'active'
        AND (
          plan_ids IS NULL OR
          plan_id = ANY(kits.plan_ids)
        )
        AND (
          required_week IS NULL OR
          current_week >= required_week
        )
      )
    )
  );

CREATE POLICY "Users can track own kit downloads" ON public.kit_downloads
  FOR ALL USING (auth.uid() = user_id);
