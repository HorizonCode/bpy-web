export type UserData = {
  id: number;
  username: string;
};

export type LBUser = {
  a_count: number;
  acc: number;
  clan_id: number;
  clan_name: string;
  clan_tag: string;
  country: string;
  max_combo: number;
  name: string;
  player_id: number;
  plays: number;
  playtime: number;
  pp: number;
  rscore: number;
  s_count: number;
  sh_count: number;
  tscore: number;
  x_count: number;
  xh_count: number;
};

export type UserModeStats = {
  tscore: number;
  rscore: number;
  pp: number;
  plays: number;
  playtime: number;
  acc: number;
  max_combo: number;
  xh_count: number;
  x_count: number;
  sh_count: number;
  s_count: number;
  a_count: number;
  replay_views: number;
  rank: number;
  country_rank: number;
};

export type User = {
  status: "success" | string;
  player?: {
    info: {
      id: number;
      name: string;
      safe_name: string;
      creation_time: number;
      latest_activity: number;
      priv: number;
      clan_id: number;
      country: string;
      preferred_mode: number;
      userpage_content: string;
    };
    stats: {
      0: UserModeStats;
      1: UserModeStats;
      2: UserModeStats;
      3: UserModeStats;
      4: UserModeStats;
      5: UserModeStats;
      6: UserModeStats;
      8: UserModeStats;
    };
  };
};
