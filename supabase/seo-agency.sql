-- SEO Agency tables — run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('he', 'en', 'fr', 'ru', 'es')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  topic TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug, locale)
);

CREATE TABLE IF NOT EXISTS seo_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent TEXT NOT NULL CHECK (agent IN ('competitor', 'auditor', 'keywords', 'writer', 'orchestrator')),
  title TEXT NOT NULL,
  summary TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_posts_public_select" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "blog_posts_service_all" ON blog_posts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "seo_reports_service_all" ON seo_reports
  FOR ALL USING (auth.role() = 'service_role');
