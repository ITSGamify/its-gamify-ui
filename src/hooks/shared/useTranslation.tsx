import { useTranslation as useI18nTranslation } from "react-i18next";
import { SupportedLanguage } from "@i18n/config";

export const useCustomTranslation = (namespace?: string) => {
  const { t, i18n } = useI18nTranslation(namespace);

  const changeLanguage = (language: SupportedLanguage) => {
    i18n.changeLanguage(language);
  };

  return {
    t,
    language: i18n.language as SupportedLanguage,
    changeLanguage,
    isLoading: !i18n.isInitialized,
  };
};

export default useCustomTranslation;
