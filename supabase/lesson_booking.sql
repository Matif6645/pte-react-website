CREATE TABLE IF NOT EXISTS public.teacher_availability (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     start_time text NOT NULL,
    is_active text NOT NULL DEFAULT true,
    created_at timestamptz  DEFAULT now (),
    UNIQUE (weekday, start_time)
)

CREATE TABLE IF NOT EXISTS public.lesson_bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFFERENCES auth.users(id ) ON DELETE CASCADE,
    student_name text,
    stendent_email text,
    lesson_at timestamptz NOT NULL,
    repeat_weekly boolean DEFAULT false,
    status text DEFAULT 'pending',
    meeting_link text,
    admin_note text,
    created_at timestamptz DEFAULT now ()
)

ALTER TABLE public.lesson_bookings ADD COLUMN IF NOT EXISTS admin_note text;
ALTER TABLE public.lesson_bookings ALTER COLUMN status SET DEFAULT 'pending';

DROP INDEX IF EXISTS public.one_booking_per_slot;
CREATE UNIQUE INDEX one_booking_per_slot
   ON public.lesson_bookings (lesson_at)
   WHERE status IN ('pending' , 'confirmed')

ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read availability" ON public.teacher_availability;
DROP POLICY IF EXISTS "Admin manage availability" ON public.teacher_availability;

CREATE POLICY "Public read availability" ON public.teacher_availability
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin manage availability" ON public.teacher_availability
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Student create own booking" ON public.lesson_bookings;
DROP POLICY IF EXISTS "Student read own bookings" ON public.lesson_bookings;
DROP POLICY IF EXISTS "Admin read bookings" ON public.lesson_bookings;
DROP POLICY IF EXISTS "Admin update bookings" ON public.lesson_bookings;

CREATE POLICY "Student create own booking" ON public.lesson_bookings
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() AND status = 'pending');

CREATE POLICY "Student read own bookings" ON public.lesson_bookings
  FOR SELECT TO authenticated USING (student_id = auth.uid());

  CREATE POLICY "Admin read bookings" ON public.lesson_bookings
  FOR SELECT TO anon USING (true);

CREATE POLICY "Admin update bookings" ON public.lesson_bookings
  FOR UPDATE TO anon USING (true) WITH CHECK (true);


CREATE OR REPLACE FUNCTION public.get_booked_slots(from_ts timestamptz, to_ts timestamptz)
RETURNS TABLE (lesson_at timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.lesson_at
  FROM public.lesson_bookings b
  WHERE b.status IN ('pending', 'confirmed')
    AND b.lesson_at >= from_ts
    AND b.lesson_at < to_ts;
$$;

GRANT EXECUTE ON FUNCTION public.get_booked_slots(timestamptz, timestamptz)
  TO anon, authenticated;
