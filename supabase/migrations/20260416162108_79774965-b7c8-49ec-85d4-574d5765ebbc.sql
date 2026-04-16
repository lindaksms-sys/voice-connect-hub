
-- Add user_id to agents
ALTER TABLE public.agents ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to call_logs
ALTER TABLE public.call_logs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to sms_logs
ALTER TABLE public.sms_logs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to branding_settings
ALTER TABLE public.branding_settings ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow all access to agents" ON public.agents;
DROP POLICY IF EXISTS "Allow all access to call_logs" ON public.call_logs;
DROP POLICY IF EXISTS "Allow all access to sms_logs" ON public.sms_logs;
DROP POLICY IF EXISTS "Allow all access to branding_settings" ON public.branding_settings;

-- Agents policies
CREATE POLICY "Users manage own agents" ON public.agents FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Call logs policies
CREATE POLICY "Users manage own call_logs" ON public.call_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SMS logs policies
CREATE POLICY "Users manage own sms_logs" ON public.sms_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Branding settings policies
CREATE POLICY "Users manage own branding" ON public.branding_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
