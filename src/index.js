import { JSDOM } from "jsdom";

async function main(user) {
  const headers = {
    cache: "default",
    credentials: "omit",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      "Cache-Control": "public, max-age=300",
    },
    method: "GET",
    mode: "cors",
    redirect: "follow",
    referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const response = await fetch(`https://devpost.com/${user}`, headers);
    const result = await response.text();

    const dom = new JSDOM(result);

    let hackathons_split =
      dom.window.document.querySelectorAll("[data-software-id]");
    let res = {
      username: "",
      total: 0,
      wins: 0,
      hackathons: [],
    };

    res["username"] = user;

    hackathons_split.forEach((hackathon) => {
      const id =
        hackathon.attributes.getNamedItem("data-software-id").textContent;
      const title = hackathon.querySelector("h5").textContent.trim();
      const link = hackathon.querySelector("a").href;
      const tag = hackathon.querySelector("p").textContent.trim();
      const img = hackathon.querySelector("img").src;
      let winner = hackathon.contains(
        hackathon.querySelector('img[alt="Winner"]')
      );
      res["wins"] += winner ? 1 : 0;
      res["total"] += 1;
      res["hackathons"].push({ id, link, title, tag, img, winner });
    });

    const modified_hackathons = Promise.all(
      res["hackathons"].map(async (hackathon) => {
        if (hackathon.winner) {
          const software = await fetch(hackathon.link, headers);
          const software_result = await software.text();
          const software_dom = new JSDOM(software_result);
          const wins_split = software_dom.window.document.querySelectorAll(
            "div.software-list-content > ul > li"
          );
          let wins = [];
          wins_split.forEach((e) => {
            wins.push(e.textContent.split("Winner")[1].trim());
          });
          hackathon.winner = wins;
        }
        return hackathon;
      })
    );

    res["hackathons"] = await modified_hackathons;

    return res;
  } catch (e) {
    console.error(e);
  }
}

console.log((await main("garvsl")).hackathons);
