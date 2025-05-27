import { SupportedLanguage } from "@i18n/config";

export interface I18nContextType {
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, options?: any) => string;
}
