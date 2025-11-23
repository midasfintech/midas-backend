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
  const lessonId = body.lesson_id;
  const answer = body.answer;

  if (!lessonId) {
    return badResponse('Missing lesson_id parameter');
  }

  if (answer == undefined) {
    return badResponse('Missing answer parameter');
  }

  try {
    const supabase = createClient(req);

    const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('id, correct_answer_index')
        .eq('id', lessonId)
        .single();

    if (lessonError) {
      return badResponse('Error fetching lesson');
    }

    if (answer != lessonData.correct_answer_index) {
      return badResponse(`Incorrect answer: ${answer} (${lessonData.correct_answer_index})`);
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return badResponse('User not authenticated');
    }

    const userId = userData.user.id;

    if (!userId) {
      return badResponse('User not authenticated');
    }

    const { error: updateError } = await supabase
      .from('users_lessons')
      .update({ completed_at: new Date() })
      .eq('user_id', userId)
      .eq('lesson_id', lessonId);

    if (updateError) {
      console.error(`Error updating completed_at for user ${userId}: ${updateError.message}`);
    }

    return ok({ body: `User ${userId} completed the lesson` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error assessing user: ${errorMessage}`);
    return badResponse(`Error assessing user: ${errorMessage}`);
  }
});
