import { fetchHackathons, getWins } from "./utils";
import type { UserHackathons } from "./types";

export default async function getHackathons(
  username: string
): Promise<UserHackathons> {
  let res: UserHackathons = {
    username,
    total: 0,
    wins: 0,
    hackathons: [],
  };

  try {
    res = await fetchHackathons(res);
    res["hackathons"] = await getWins(res);

    return res;
  } catch (e) {
    console.error(e);
    return res;
  }
}
