import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { badResponse, ok } from '../_shared/response-helpers.ts';
import { createClient } from '../_shared/supabase-helpers.ts';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return ok(null, corsHeaders);
  }

  if (req.method != "POST") {
      return badResponse("Method not allowed");
  }

  const body = await req.json();
  const answers = body.answers;

  if (!answers) {
    return badResponse('Missing user_id parameter');
  }

  if (!answers.every(answer => answer >= 0 && answer <= 3)) {
    return badResponse('Invalid answers');
  }

  try {
    const supabase = createClient(req);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return badResponse('User not authenticated');
    }

    const userId = userData.user.id;

    if (!userId) {
      return badResponse('User not authenticated');
    }

    console.log(`Assessment for user ${userId}`);

    const { data: correctAnswers, error: correctAnswersError } = await supabase
        .from('assessment_questions')
        .select('id, correct_answer_index')
        .order('id');

    if (correctAnswersError) {
      return badResponse('Error fetching correct answers');
    }

    console.log(`Correct answers: ${JSON.stringify(correctAnswers)}`);

    if (answers.length != correctAnswers.length) {
      return badResponse(`There should be ${correctAnswers.length} answers`);
    }

    const countCorrectAnswers = correctAnswers.reduce((acc, answer) => {
      return acc + (answer.correct_answer_index == answers[answer.id] ? 1 : 0);
    }, 0);

    const knowledge = countCorrectAnswers < 8 ? 'beginner' :
      countCorrectAnswers < 14 ? 'intermediate' :
      'expert';

    const { error: updateError } = await supabase
      .from('users_data')
      .update({ knowledge })
      .eq('id', userId);

    if (updateError) {
      console.error(`Error updating knowledge for user ${userId}: ${updateError.message}`);
    }

    return ok({ body: `User ${userId} had ${countCorrectAnswers} correct answers` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error assessing user: ${errorMessage}`);
    return badResponse(`Error assessing user: ${errorMessage}`);
  }
});
