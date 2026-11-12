-- ============================================
-- PTE ACADEMY - ALL QUESTION TABLES (one-shot setup)
-- Safe to run more than once.
-- Run this whole file in Supabase > SQL Editor.
-- ============================================


-- ============================================
-- READING
-- ============================================

CREATE TABLE IF NOT EXISTS public.fill_blanks_dropdown (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'fill-blanks-dropdown',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.fill_blanks_drag_drop (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'fill-blanks-drag',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.reorder_paragraphs (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'reorder-paragraphs',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.multiple_choice_multiple (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'mcq-multiple',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    question_text text NOT NULL DEFAULT '',
    option_a text NOT NULL DEFAULT '',
    option_b text NOT NULL DEFAULT '',
    option_c text NOT NULL DEFAULT '',
    option_d text NOT NULL DEFAULT '',
    option_e text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.multiple_choice_single (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'mcq-single',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    question_text text NOT NULL DEFAULT '',
    option_a text NOT NULL DEFAULT '',
    option_b text NOT NULL DEFAULT '',
    option_c text NOT NULL DEFAULT '',
    option_d text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);


-- ============================================
-- SPEAKING
-- ============================================

CREATE TABLE IF NOT EXISTS public.speaking_read_aloud (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'read-aloud',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:40',
    passage text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.speaking_repeat_sentence (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'repeat-sentence',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:15',
    audio_url text NOT NULL DEFAULT '',
    transcript text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.speaking_describe_image (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'describe-image',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:40',
    image_url text NOT NULL DEFAULT '',
    sample_answer text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.speaking_retell_lecture (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'retell-lecture',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:40',
    audio_url text NOT NULL DEFAULT '',
    image_url text NOT NULL DEFAULT '',
    transcript text NOT NULL DEFAULT '',
    sample_answer text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.speaking_answer_short_question (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'answer-short-question',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:10',
    question_text text NOT NULL DEFAULT '',
    audio_url text NOT NULL DEFAULT '',
    correct_answer text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);


-- ============================================
-- WRITING
-- ============================================

CREATE TABLE IF NOT EXISTS public.writing_summarize_written_text (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'summarize-written-text',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '10:00',
    passage text NOT NULL DEFAULT '',
    sample_answer text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.writing_write_essay (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'write-essay',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '20:00',
    question_text text NOT NULL DEFAULT '',
    sample_answer text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);


-- ============================================
-- LISTENING
-- ============================================

CREATE TABLE IF NOT EXISTS public.listening_summarize_spoken_text (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'listening-sst',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    question_text text NOT NULL DEFAULT '',
    audio_url text NOT NULL DEFAULT '',
    transcript text NOT NULL DEFAULT '',
    correct_answer text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.listening_mcq_multiple (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'listening-mcq-multiple',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    question_text text NOT NULL DEFAULT '',
    audio_url text NOT NULL DEFAULT '',
    option_a text NOT NULL DEFAULT '',
    option_b text NOT NULL DEFAULT '',
    option_c text NOT NULL DEFAULT '',
    option_d text NOT NULL DEFAULT '',
    option_e text NOT NULL DEFAULT '',
    option_f text NOT NULL DEFAULT '',
    correct_answers jsonb NOT NULL DEFAULT '[]'::jsonb,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.listening_fill_blanks (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'listening-fib',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    question_text text NOT NULL DEFAULT '',
    audio_url text NOT NULL DEFAULT '',
    transcript text NOT NULL DEFAULT '',
    blanks jsonb NOT NULL DEFAULT '[]'::jsonb,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.listening_highlight_correct_summary (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'listening-hcs',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    question_text text NOT NULL DEFAULT '',
    audio_url text NOT NULL DEFAULT '',
    option_a text NOT NULL DEFAULT '',
    option_b text NOT NULL DEFAULT '',
    option_c text NOT NULL DEFAULT '',
    option_d text NOT NULL DEFAULT '',
    correct_answer text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.listening_mcq_single (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'listening-mcq-single',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    question_text text NOT NULL DEFAULT '',
    audio_url text NOT NULL DEFAULT '',
    option_a text NOT NULL DEFAULT '',
    option_b text NOT NULL DEFAULT '',
    option_c text NOT NULL DEFAULT '',
    option_d text NOT NULL DEFAULT '',
    correct_answer text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.listening_select_missing_word (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'listening-smw',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    question_text text NOT NULL DEFAULT '',
    audio_url text NOT NULL DEFAULT '',
    option_a text NOT NULL DEFAULT '',
    option_b text NOT NULL DEFAULT '',
    option_c text NOT NULL DEFAULT '',
    option_d text NOT NULL DEFAULT '',
    correct_answer text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.listening_highlight_incorrect_words (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'listening-hiw',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    question_text text NOT NULL DEFAULT '',
    audio_url text NOT NULL DEFAULT '',
    transcript text NOT NULL DEFAULT '',
    incorrect_words jsonb NOT NULL DEFAULT '[]'::jsonb,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.listening_write_from_dictation (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type text NOT NULL DEFAULT 'listening-wfd',
    title text NOT NULL,
    difficulty text NOT NULL DEFAULT 'Easy',
    category text NOT NULL,
    time text NOT NULL DEFAULT '00:20',
    question_text text NOT NULL DEFAULT '',
    audio_url text NOT NULL DEFAULT '',
    transcript text NOT NULL DEFAULT '',
    correct_answer text NOT NULL DEFAULT '',
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);


-- ============================================
-- UPDATED_AT FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.set_question_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


-- ============================================
-- RLS + POLICIES + TRIGGERS FOR ALL 20 TABLES
-- (anon included because admin login is localStorage-only)
-- ============================================

DO $$
DECLARE
    t text;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'fill_blanks_dropdown','fill_blanks_drag_drop','reorder_paragraphs',
        'multiple_choice_multiple','multiple_choice_single',
        'speaking_read_aloud','speaking_repeat_sentence','speaking_describe_image',
        'speaking_retell_lecture','speaking_answer_short_question',
        'writing_summarize_written_text','writing_write_essay',
        'listening_summarize_spoken_text','listening_mcq_multiple','listening_fill_blanks',
        'listening_highlight_correct_summary','listening_mcq_single',
        'listening_select_missing_word','listening_highlight_incorrect_words',
        'listening_write_from_dictation'
    ]
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

        EXECUTE format('DROP POLICY IF EXISTS "Public read" ON public.%I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Admin insert" ON public.%I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Admin update" ON public.%I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Admin delete" ON public.%I', t);

        EXECUTE format('CREATE POLICY "Public read" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t);
        EXECUTE format('CREATE POLICY "Admin insert" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (true)', t);
        EXECUTE format('CREATE POLICY "Admin update" ON public.%I FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true)', t);
        EXECUTE format('CREATE POLICY "Admin delete" ON public.%I FOR DELETE TO anon, authenticated USING (true)', t);

        EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
        EXECUTE format(
            'CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I
             FOR EACH ROW EXECUTE FUNCTION public.set_question_updated_at()',
            t
        );
    END LOOP;
END;
$$;
