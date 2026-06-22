import en from "./en.json";
import ar from "./ar.json";

export type Language = "en" | "ar";

export const translations: Record<Language, typeof en> = { en, ar };
