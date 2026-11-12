-- ============================================
-- PTE ACADEMY - SPEAKING QUESTION TABLES
-- ============================================


-- 1. READ ALOUD

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


-- 2. REPEAT SENTENCE

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


-- 3. DESCRIBE IMAGE

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


-- 4. RETELL LECTURE

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


-- 5. ANSWER SHORT QUESTION

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
-- PTE ACADEMY - WRITING QUESTION TABLES
-- ============================================


-- 1. SUMMARIZE WRITTEN TEXT

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


-- 2. WRITE ESSAY

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
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.speaking_read_aloud
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.speaking_repeat_sentence
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.speaking_describe_image
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.speaking_retell_lecture
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.speaking_answer_short_question
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.writing_summarize_written_text
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.writing_write_essay
ENABLE ROW LEVEL SECURITY;


-- ============================================
-- PUBLIC READ POLICIES
-- Allows students to retrieve practice questions.
-- ============================================

CREATE POLICY "Public read read aloud"
ON public.speaking_read_aloud
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public read repeat sentence"
ON public.speaking_repeat_sentence
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public read describe image"
ON public.speaking_describe_image
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public read retell lecture"
ON public.speaking_retell_lecture
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public read answer short question"
ON public.speaking_answer_short_question
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public read summarize written text"
ON public.writing_summarize_written_text
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public read write essay"
ON public.writing_write_essay
FOR SELECT
TO anon, authenticated
USING (true);


-- ============================================
-- AUTOMATIC UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION public.set_speaking_writing_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


CREATE TRIGGER update_read_aloud_timestamp
BEFORE UPDATE ON public.speaking_read_aloud
FOR EACH ROW
EXECUTE FUNCTION public.set_speaking_writing_updated_at();


CREATE TRIGGER update_repeat_sentence_timestamp
BEFORE UPDATE ON public.speaking_repeat_sentence
FOR EACH ROW
EXECUTE FUNCTION public.set_speaking_writing_updated_at();


CREATE TRIGGER update_describe_image_timestamp
BEFORE UPDATE ON public.speaking_describe_image
FOR EACH ROW
EXECUTE FUNCTION public.set_speaking_writing_updated_at();


CREATE TRIGGER update_retell_lecture_timestamp
BEFORE UPDATE ON public.speaking_retell_lecture
FOR EACH ROW
EXECUTE FUNCTION public.set_speaking_writing_updated_at();


CREATE TRIGGER update_answer_short_question_timestamp
BEFORE UPDATE ON public.speaking_answer_short_question
FOR EACH ROW
EXECUTE FUNCTION public.set_speaking_writing_updated_at();


CREATE TRIGGER update_summarize_written_text_timestamp
BEFORE UPDATE ON public.writing_summarize_written_text
FOR EACH ROW
EXECUTE FUNCTION public.set_speaking_writing_updated_at();


CREATE TRIGGER update_write_essay_timestamp
BEFORE UPDATE ON public.writing_write_essay
FOR EACH ROW
EXECUTE FUNCTION public.set_speaking_writing_updated_at();

DO $$
DECLARE
    t text;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'fill_blanks_dropdown','fill_blanks_drag_drop','reorder_paragraphs',
        'multiple_choice_multiple','multiple_choice_single',
        'listening_summarize_spoken_text','listening_mcq_multiple','listening_fill_blanks',
        'listening_highlight_correct_summary','listening_mcq_single',
        'listening_select_missing_word','listening_highlight_incorrect_words',
        'listening_write_from_dictation'
    ]
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Admin insert" ON public.%I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Admin update" ON public.%I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Admin delete" ON public.%I', t);

        EXECUTE format('CREATE POLICY "Admin insert" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (true)', t);
        EXECUTE format('CREATE POLICY "Admin update" ON public.%I FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true)', t);
        EXECUTE format('CREATE POLICY "Admin delete" ON public.%I FOR DELETE TO anon, authenticated USING (true)', t);
    END LOOP;
END;
$$;
