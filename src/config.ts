export const CONFIG = {
  BASE_URL: "https://devpost.com",
  TIMEOUT: 5000,
  HEADERS: {
    cache: "default" as RequestCache,
    credentials: "omit" as RequestCredentials,
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      "Cache-Control": "public, max-age=300",
    },
    method: "GET",
    mode: "cors" as RequestMode,
    redirect: "follow" as RequestRedirect,
    referrerPolicy: "no-referrer-when-downgrade" as ReferrerPolicy,
  } as const,
} as const;
