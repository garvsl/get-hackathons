export type UserHackathons = {
  username: string;
  total: number;
  wins: number;
  hackathons: Hackathon[];
};

type Hackathon = {
  id: string;
  link: string;
  title: string;
  tag: string;
  img: string;
  winner: boolean | string[];
};
