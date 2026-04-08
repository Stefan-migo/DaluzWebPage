import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from '@/lib/auth/helpers';

// GET: List all experiments with results
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    // Get experiments with results
    const { data: experiments, error } = await supabase
      .from("research_metrics")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Get aggregated results from ab_test_results view
    const { data: results } = await supabase
      .from("ab_test_results")
      .select("*");

    // Combine experiments with their results
    const experimentsWithResults = experiments?.map((exp) => {
      const expResults = results?.filter(
        (r) => r.experiment_name === exp.experiment_name,
      );
      return {
        ...exp,
        results: expResults,
      };
    });

    return NextResponse.json({ experiments: experimentsWithResults });
  } catch (error) {
    console.error("Error fetching A/B tests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST: Create new experiment
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    const {
      experiment_name,
      hypothesis,
      variant_control,
      variant_test,
      traffic_percentage = 100,
      start_date,
      end_date,
    } = body;

    // Validate required fields
    if (!experiment_name) {
      return NextResponse.json(
        { error: "experiment_name is required" },
        { status: 400 },
      );
    }

    // Create experiment config
    const { data: config, error: configError } = await supabase
      .from("ab_test_configs")
      .insert({
        experiment_name,
        hypothesis,
        description: hypothesis,
        status: "draft",
        traffic_percentage,
        variant_control: variant_control || {},
        variant_test: variant_test || {},
        start_date: start_date || null,
        end_date: end_date || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (configError) throw configError;

    // Create initial research_metrics entry for tracking
    const { error: metricsError } = await supabase
      .from("research_metrics")
      .insert({
        experiment_name,
        hypothesis,
        variant: "control",
        status: "draft",
        created_by: user.id,
      });

    if (metricsError)
      console.error("Error creating metrics entry:", metricsError);

    return NextResponse.json({ experiment: config }, { status: 201 });
  } catch (error) {
    console.error("Error creating A/B test:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
