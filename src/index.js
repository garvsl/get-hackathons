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
    const split = result.split(`data-software-id`);
    split.shift();
    const hackathons = split.map(async (e) => {
      const hack = e.slice(0, e.indexOf("<!-- cache end -->"));

      let title = hack.indexOf("<h5");
      title = hack
        .slice(hack.indexOf(">", title) + 1, hack.indexOf("</h5>", title))
        .trim();

      let tag = hack.indexOf("<p");
      tag = hack
        .slice(hack.indexOf(">", tag) + 1, hack.indexOf("</p>", tag))
        .trim();

      let link = e.indexOf("href");
      link = e.slice(link + 6, e.indexOf(`">`, link + 5));

      let image = hack.indexOf(`src="`);
      image = hack.slice(image + 5, hack.indexOf("/>", image) - 2);

      const winner = hack.includes("Winner");
      let wins = new Promise(async (resolve, reject) => {
        if (winner) {
          const software = await fetch(link, headers);
          const software_result = await software.text();
          let awards = software_result.split("Winner");
          awards.shift();
          awards = awards.map((win) => {
            const award_name = win.slice(8, win.indexOf("</li>")).trim();
            return award_name.replace(/&quot;/g, '"');
          });
          resolve(awards);
        } else {
          resolve([]);
        }
      });

      return {
        id: e.slice(2, e.indexOf(`">`)),
        link,
        title,
        tag,
        image,
        // TODO tech stack
        winner,
        awards: await wins,
      };
    });

    return Promise.all(hackathons);
  } catch (e) {
    console.error(e);
  }
}

console.log(await main("garvsl"));
