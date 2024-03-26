import { type Writable, writable } from "svelte/store";
import type { UserData } from "./types";
import { browser } from "$app/environment";
import { getLanguage } from "./language";

export const userData: Writable<UserData | undefined> = writable(undefined);

const defaultLang = "US";

const getLanguageFromStorage = () => {
  const validLanguageCodes = navigator.languages.filter((langCode) =>
    langCode.includes("-")
  );

  let preferedLang = validLanguageCodes[0];
  if (preferedLang) preferedLang = preferedLang.split("-")[1];

  const lang = window.localStorage.getItem("lang") ??
    preferedLang;

  return getLanguage(lang)?.code ?? defaultLang;
};

const initialLang = browser
  ? getLanguageFromStorage() ?? navigator.language.toUpperCase()
  : defaultLang;

export const userLanguage = writable(initialLang);
export let currentSelectedLanguage = initialLang;

userLanguage.subscribe((val) => {
  if (browser) {
    currentSelectedLanguage = val;
    window.localStorage.setItem("lang", val);
  }
});
