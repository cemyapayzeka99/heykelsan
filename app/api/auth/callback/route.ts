import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const OAUTH_STATE_COOKIE = "decap_oauth_state";

/**
 * Decap CMS's postMessage handshake: the popup announces itself, waits for
 * the opener (the /admin window) to acknowledge, then sends the token back
 * to that acknowledged origin only — never broadcasts the token via "*".
 */
function renderPostMessagePage(status: "success" | "error", payload: unknown) {
  const message =
    status === "success"
      ? `authorization:github:success:${JSON.stringify(payload)}`
      : `authorization:github:error:${JSON.stringify(payload)}`;

  return `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage(
            ${JSON.stringify(message)},
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;
}

function htmlResponse(body: string) {
  return new NextResponse(body, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return htmlResponse(
      renderPostMessagePage("error", {
        message: "OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET tanımlı değil.",
      })
    );
  }

  if (!code || !state || !storedState || state !== storedState) {
    return htmlResponse(
      renderPostMessagePage("error", {
        message: "Geçersiz veya süresi dolmuş yetkilendirme isteği.",
      })
    );
  }

  const redirectUri = new URL("/api/auth/callback", url.origin).toString();

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenResponse.json();

  const page = tokenData.access_token
    ? renderPostMessagePage("success", {
        token: tokenData.access_token,
        provider: "github",
      })
    : renderPostMessagePage("error", {
        message: tokenData.error_description ?? "Erişim anahtarı alınamadı.",
      });

  const response = htmlResponse(page);
  response.cookies.delete(OAUTH_STATE_COOKIE);
  return response;
}
