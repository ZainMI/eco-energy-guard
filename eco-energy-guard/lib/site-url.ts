export const PRODUCTION_SITE_URL = "https://www.ecoenergyguard.com";

export function getAuthSiteUrl(currentOrigin?: string): string {
  if (currentOrigin) {
    const hostname = new URL(currentOrigin).hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return currentOrigin;
    }
  }

  return PRODUCTION_SITE_URL;
}
