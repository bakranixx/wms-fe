import { useLanguageStore } from "@/stores/ui-store";
import { getTranslations } from "@/lib/translations";

export function useT() {
  const { language } = useLanguageStore();
  return getTranslations(language);
}
