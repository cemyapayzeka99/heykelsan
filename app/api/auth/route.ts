import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const OAUTH_STATE_COOKIE = "decap_oauth_state";

/**
 * Entry point Decap CMS's github backend opens in a popup (config.yml
 * `base_url` + `auth_endpoint`). Redirects to GitHub's OAuth consent screen.
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "OAUTH_CLIENT_ID ortam değişkeni tanımlı değil." },
      { status: 500 }
    );
  }

  const state = randomUUID();
  const redirectUri = new URL("/api/auth/callback", request.nextUrl.origin).toString();

  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo,user");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
