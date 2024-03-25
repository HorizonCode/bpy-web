import { type Writable, writable } from "svelte/store";
import type { UserData } from "./types";
import { browser } from "$app/environment";
import { supportedLanguages } from "./language";

export const userData: Writable<UserData | undefined> = writable(undefined);

const defaultLang = "US";

const getLanguageFromStorage = () => {
  const lang = window.localStorage.getItem("lang") ?? defaultLang;
  return supportedLanguages.includes(lang) ? lang : defaultLang;
};

const initialLang = browser
  ? getLanguageFromStorage() ?? defaultLang
  : defaultLang;

export const userLanguage = writable(initialLang);
export let currentSelectedLanguage = initialLang;

userLanguage.subscribe((val) => {
  if (browser) {
    currentSelectedLanguage = val;
    window.localStorage.setItem("lang", val);
  }
});
