import { en } from "./en";
import { id } from "./id";

export const languages = {
  en: "English",
  id: "Bahasa Indonesia",
} as const;

export type Language = keyof typeof languages;

const dictionaries = { en, id } as const;

export function getTranslations(lang: Language) {
  return dictionaries[lang];
}

export type Translations = ReturnType<typeof getTranslations>;
