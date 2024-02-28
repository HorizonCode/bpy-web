import { type Writable, writable } from "svelte/store";
import type { UserData } from "./types";

export const userData: Writable<UserData | undefined> = writable(undefined);
