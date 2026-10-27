// Public store listings. VITE_* env values override them if set.
export const APP_STORE_URL =
  (import.meta.env.VITE_APP_STORE_URL as string | undefined) ||
  "https://apps.apple.com/eg/app/rxkhana/id6781658075";

export const PLAY_STORE_URL =
  (import.meta.env.VITE_PLAY_STORE_URL as string | undefined) ||
  "https://play.google.com/store/apps/details?id=com.rx.rxkhana";

// Where computers go from /app. Use "https://rxkhana.com/ar#download" once the
// new landing site (with that section) is deployed.
export const WEBSITE_DOWNLOAD_URL = "https://rxkhana.com";
