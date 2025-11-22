CREATE TABLE users_data (
    id UUID PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    net_monthly_income INTEGER NOT NULL,
    monthly_investment_amount INTEGER NOT NULL,
    employment TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    completed_onboarding BOOLEAN NOT NULL DEFAULT false,
    knowledge public.knowledge NOT NULL DEFAULT 'beginner',
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.users_data ADD FOREIGN KEY ("id") REFERENCES auth.users ("id");

CREATE TABLE onboarding_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answers TEXT[]
    created_at TIMESTAMP DEFAULT NOW()
);
