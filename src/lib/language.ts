import * as DE from "./languages/DE";

export const supportedLanguages = [
  "US",
  "DE",
];

export const languageNames: { [key: string]: string } = {
  "US": "English",
  "DE": "German",
};

const languages: { [key: string]: { [key: string]: string } } = {
  "DE": DE.phrases,
};

export const __ = (
  key: string,
  lang: string,
  placeholders?: { [key: string]: string | number },
) => {
  let translation = languages[lang]?.[key] ?? key;
  if (placeholders) {
    // Replace placeholders in the translation string
    Object.keys(placeholders).forEach((placeholder) => {
      translation = translation.replace(
        new RegExp(`{{${placeholder}}}`, "g"),
        placeholders[placeholder].toString(),
      );
    });
  }
  return translation;
};
