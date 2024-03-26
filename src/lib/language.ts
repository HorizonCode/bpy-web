import DE from "./languages/DE";
import US from "./languages/US";

export type Language = {
  name: string;
  code: string;
  translator: string;
  phrases: { [key: string]: string };
};

export const languages: { [code: string]: Language } = {
  "US": US,
  "DE": DE,
};

export const __ = (
  key: string,
  lang: string,
  placeholders?: { [key: string]: string | number },
) => {
  let translation = languages[lang]?.phrases[key] ?? key;
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
