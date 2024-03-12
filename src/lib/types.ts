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

export type UserInfo = {
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
  };
};
