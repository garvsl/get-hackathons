import { JSDOM } from "jsdom";
import { UserHackathons } from "./types";
import { CONFIG } from "./config";

export async function getHackathons(username: string): Promise<UserHackathons> {
  let res: UserHackathons = {
    username,
    total: 0,
    wins: 0,
    rate: "0%",
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

function calculateWinRate(total: number, wins: number): number {
  return Math.floor((wins / total) * 100);
}

function processHackathons(
  hackathons: NodeListOf<Element>,
  res: UserHackathons
) {
  hackathons.forEach((hackathon) => {
    const id =
      hackathon.attributes.getNamedItem("data-software-id")?.textContent || "";
    const title = hackathon.querySelector("h5")?.textContent?.trim() || "";
    const link = hackathon.querySelector("a")?.href || "";
    const tag = hackathon.querySelector("p")?.textContent?.trim() || "";
    const img = hackathon.querySelector("img")?.src || "";
    let winner = hackathon.contains(
      hackathon.querySelector('img[alt="Winner"]')
    );
    res["wins"] += winner ? 1 : 0;
    res["total"] += 1;
    res["hackathons"].push({ id, link, title, tag, img, winner });
  });

  return res;
}

export async function fetchHackathons(
  res: UserHackathons,
  page = 1
): Promise<UserHackathons> {
  const response = await fetch(
    `${CONFIG.BASE_URL}/${res.username}?page=${page}`,
    CONFIG.HEADERS
  );
  if (response.status != 200) {
    throw new Error(`Hackathon Retrieval Error! ${response.status}`);
  }
  const result = await response.text();

  const dom = new JSDOM(result);

  let hackathons_split =
    dom.window.document.querySelectorAll("[data-software-id]");

  res = processHackathons(hackathons_split, res);

  const next_page = dom.window.document.querySelector(
    "ul.pagination > li.next_page"
  );
  const available = dom.window.document.querySelector(
    "ul.pagination > li.next_page:not(.unavailable)"
  );

  if (next_page && available) {
    res = await fetchHackathons(res, page + 1);
  }
  res["rate"] = `${calculateWinRate(res["total"], res["wins"])}%`;

  return res;
}

export async function getWins(
  res: UserHackathons
): Promise<UserHackathons["hackathons"]> {
  return Promise.all(
    res["hackathons"].map(async (hackathon) => {
      if (hackathon.winner) {
        const software = await fetch(hackathon.link!, CONFIG.HEADERS);
        if (software.status != 200) {
          throw new Error(`Software Retrieval Error! ${software.status}`);
        }
        const software_result = await software.text();
        const software_dom = new JSDOM(software_result);
        const wins_split = software_dom.window.document.querySelectorAll(
          "div.software-list-content > ul > li"
        );
        let wins: string[] = [];
        wins_split.forEach((e) => {
          wins.push(e.textContent!.split("Winner")[1].trim());
        });
        // TODO techstack
        // TODO add project bio
        hackathon.winner = wins;
      }
      return hackathon;
    })
  );
}
