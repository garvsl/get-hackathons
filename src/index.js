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
    const hackathons = split.map((e) => {
      const hack = e.slice(0, e.indexOf("<!-- cache end -->"));

      const title = hack
        .slice(hack.indexOf("<h5>") + 4, hack.indexOf("</h5>"))
        .trim();

      let image = hack.indexOf(`src="`);
      image = hack.slice(image + 5, hack.indexOf("/>", image) - 2);

      const winner = hack.includes("Winner");

      return {
        id: e.slice(2, e.indexOf(`">`)),
        link: e.slice(
          e.indexOf("href") + 6,
          e.indexOf(`">`, e.indexOf("href") + 5)
        ),
        title,
        image,
        winner,
      };
    });

    console.log(hackathons);
  } catch (e) {
    console.error(e);
  }
}

main("garvsl");
