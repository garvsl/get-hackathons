import { JSDOM } from "jsdom";
import { UserHackathons } from "./types";
import { CONFIG } from "./config";

export async function fetchHackathons(
  res: UserHackathons
): Promise<UserHackathons> {
  const response = await fetch(
    `${CONFIG.BASE_URL}/${res.username}`,
    CONFIG.HEADERS
  );
  if (response.status != 200) {
    throw new Error(`Hackathon Retrieval Error! ${response.status}`);
  }
  const result = await response.text();

  const dom = new JSDOM(result);

  let hackathons_split =
    dom.window.document.querySelectorAll("[data-software-id]");

  hackathons_split.forEach((hackathon) => {
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
        hackathon.winner = wins;
      }
      return hackathon;
    })
  );
}
