ALTER TABLE public.agents
ADD COLUMN IF NOT EXISTS vapi_assistant_id TEXT,
ADD COLUMN IF NOT EXISTS first_message TEXT NOT NULL DEFAULT 'Hello, how can I help you today?';