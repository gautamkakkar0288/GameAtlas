const { Client } = require('pg');

const GAMES = [
  { slug: "god-of-war-ragnarok", storeUrl: "https://store.steampowered.com/app/1593500/God_of_War/" },
  { slug: "elden-ring", storeUrl: "https://store.steampowered.com/app/1245620/ELDEN_RING/" },
  { slug: "the-last-of-us-part-2", storeUrl: "https://store.playstation.com/en-us/product/UP9000-CUSA07820_00-THELASTOFUSPART2" },
  { slug: "cyberpunk-2077", storeUrl: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/" },
  { slug: "red-dead-redemption-2", storeUrl: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/" },
  { slug: "hollow-knight", storeUrl: "https://store.steampowered.com/app/367520/Hollow_Knight/" },
  { slug: "hades", storeUrl: "https://store.steampowered.com/app/1145360/Hades/" },
  { slug: "the-witcher-3", storeUrl: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/" },
  { slug: "baldurs-gate-3", storeUrl: "https://store.steampowered.com/app/1086940/Baldurs_Gate_3/" },
  { slug: "spider-man-2", storeUrl: "https://store.playstation.com/en-us/concept/10002456" },
  { slug: "grand-theft-auto-v", storeUrl: "https://store.epicgames.com/p/grand-theft-auto-v" },
];

async function update() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  for (const game of GAMES) {
    await client.query('UPDATE games SET store_url = $1 WHERE slug = $2', [game.storeUrl, game.slug]);
    console.log(`Updated ${game.slug}`);
  }
  await client.end();
}

update().catch(console.error);
