export type UserHackathons = {
  username: string;
  total: number;
  wins: number;
  hackathons: {
    id: string | null | undefined;
    link: string | undefined;
    title: string | undefined;
    tag: string | undefined;
    img: string | undefined;
    winner: boolean | string[];
  }[];
};
