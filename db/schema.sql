CREATE TABLE users_data (
    id UUID PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    net_monthly_income INTEGER NOT NULL,
    monthly_investment_amount INTEGER NOT NULL,
    employment TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    knowledge public.knowledge DEFAULT 'beginner',
    ethical_investing boolean NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.users_data ADD FOREIGN KEY ("id") REFERENCES auth.users ("id") ON DELETE CASCADE;

CREATE TABLE assessment_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answers TEXT[] NOT NULL,
    correct_answer_index INTEGER NOT NULL
);

CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,

    -- First page
    description TEXT NOT NULL,

    -- Second page
    real_life_example TEXT NOT NULL,

    -- Third page
    question TEXT NOT NULL,
    answers TEXT[] NOT NULL,
    correct_answer_index INTEGER NOT NULL,

    chapter_index INTEGER NOT NULL,
    chapter_id SERIAL NOT NULL
);
ALTER TABLE lessons ADD FOREIGN KEY ("chapter_id") REFERENCES chapters ("id") ON DELETE CASCADE;

CREATE TABLE users_lessons (
    user_id UUID NOT NULL,
    lesson_id UUID NOT NULL,
    unlocked_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,

    PRIMARY KEY (user_id, lesson_id)
);
ALTER TABLE users_lessons ADD FOREIGN KEY ("user_id") REFERENCES auth.users ("id") ON DELETE CASCADE;
ALTER TABLE users_lessons ADD FOREIGN KEY ("lesson_id") REFERENCES lessons ("id") ON DELETE CASCADE;
