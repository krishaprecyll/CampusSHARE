import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", "admin@gmail.com")
      .maybeSingle();

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Admin user already exists",
          email: "admin@gmail.com",
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: "admin@gmail.com",
        password: "admin123",
        user_metadata: {
          full_name: "Administrator",
        },
      });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Failed to create auth user");
    }

    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: "admin@gmail.com",
      university_id: "ADMIN001",
      password_hash: "managed_by_auth",
      full_name: "Administrator",
      role: "admin",
      phone: "+1234567890",
      verified: true,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin user created successfully",
        email: "admin@gmail.com",
        userId: authData.user.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});

