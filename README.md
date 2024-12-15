# get-hackathons

Get Hackathons is a lightweight & easy to use Javascript library designed for easy retrieval of an accounts hackathons and wins from the Devpost website. It simplifies access to hackathon information, enabling developers to integrate the data in their applications like portfolios, etc.

## Installation

```bash
npm install get-hackathons
```

## Simple Usage

```javascript
const data = await getHackathons("garvsl"); // Desired username

console.log(data);
```

## Sample output

```json
{
  "username": "garvsl",
  "total": 8,
  "wins": 4,
  "rate": "50%",
  "hackathons": [
    {
      "id": "745731",
      "link": "https://devpost.com/software/signlino",
      "title": "Signlingo",
      "tag": "Signlingo is an...",
      "img": "https://d112y698adiu2z...",
      "winner": ["Best AI Application Built with Cloudflare"]
    },
    {
      "id": "639811",
      "link": "https://devpost.com/software/find-my-smile",
      "title": "Find My Smile",
      "tag": "Revolutionize Dental Care...",
      "img": "https://d112y698adiu2z...",
      "winner": false
    }
  ]

  // More...
}
```
