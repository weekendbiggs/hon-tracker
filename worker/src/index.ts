export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ALLOWED_ORIGIN: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(env) });
    }

    if (request.method !== "POST" || new URL(request.url).pathname !== "/api/token") {
      return error("Not found", 404, env);
    }

    const body = await request.json<{ code: string }>().catch(() => null);
    if (!body?.code) {
      return error("Missing 'code' in request body", 400, env);
    }

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: body.code,
      }),
    });

    if (!tokenRes.ok) {
      return error(`GitHub returned ${tokenRes.status}`, 502, env);
    }

    const data = await tokenRes.json<{
      access_token?: string;
      error?: string;
      error_description?: string;
    }>();

    if (data.error || !data.access_token) {
      return error(data.error_description || data.error || "Unknown error", 400, env);
    }

    return new Response(JSON.stringify({ access_token: data.access_token }), {
      headers: { "Content-Type": "application/json", ...cors(env) },
    });
  },
};

function cors(env: Env): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function error(msg: string, status: number, env: Env): Response {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { "Content-Type": "application/json", ...cors(env) },
  });
}
