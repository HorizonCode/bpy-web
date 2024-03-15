import type { Mod } from "./types";

export const mods: { [mod: string]: number } = {
  //diff decrease
  EZ: 1 << 1,
  NF: 1 << 0,
  HT: 1 << 8,

  // diff increase
  HR: 1 << 4,
  SD: 1 << 5,
  PF: 1 << 14,
  DT: 1 << 6,
  NC: 1 << 9,
  HD: 1 << 3,
  FL: 1 << 10,

  // other
  SO: 1 << 12,
  TD: 1 << 2,
};

export const modNames: { [mod_short: string]: string } = {
  EZ: "Easy",
  NF: "No Fail",
  HT: "Half Time",
  HR: "Hard Rock",
  SD: "Sudden Death",
  PF: "Perfect",
  DT: "Double Time",
  NC: "Nightcore",
  HD: "Hidden",
  FL: "Flashlight",
  SO: "Spun Out",
  TD: "Touch Device",
};

export const parseModsInt = (modsInt: number) => {
  const activatedMods: Mod[] = [];

  // Check if either DT or SD is present, and if NC or PF is also present
  const hasNC = modsInt & mods.NC;
  const hasPF = modsInt & mods.PF;

  for (const mod in mods) {
    // Exclude DT or SD if NC or PF is present
    if (mod == "DT" && hasNC) {
      continue;
    }
    if (mod == "SD" && hasPF) {
      continue;
    }

    if (modsInt & mods[mod]) {
      activatedMods.push({
        name: modNames[mod],
        short_name: mod,
      });
    }
  }
  return activatedMods;
};
