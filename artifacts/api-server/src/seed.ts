import { db, gamesTable, achievementsTable, reviewsTable, usersTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import { logger } from "./lib/logger.js";

const GAMES_SEED = [
  {
    slug: "god-of-war-ragnarok",
    title: "God of War: Ragnarök",
    description: "Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc9f04.webp",
    genre: "Action RPG",
    platform: "PlayStation",
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    releaseYear: 2022,
    rating: 4.8,
    size: 90.0,
  },
  {
    slug: "elden-ring",
    title: "Elden Ring",
    description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc8y4g.webp",
    genre: "Action RPG",
    platform: "Multi-Platform",
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    releaseYear: 2022,
    rating: 4.9,
    size: 60.0,
  },
  {
    slug: "the-last-of-us-part-2",
    title: "The Last of Us Part II",
    description: "Five years after their journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5x1t.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sczs8a.webp",
    genre: "Action Adventure",
    platform: "PlayStation",
    developer: "Naughty Dog",
    publisher: "Sony Interactive Entertainment",
    releaseYear: 2020,
    rating: 4.7,
    size: 78.0,
  },
  {
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    description: "An open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4a7a.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc8y0b.webp",
    genre: "Action RPG",
    platform: "Multi-Platform",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseYear: 2020,
    rating: 4.4,
    size: 70.0,
  },
  {
    slug: "red-dead-redemption-2",
    title: "Red Dead Redemption 2",
    description: "America, 1899. The end of the wild west era has begun. After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc4ing.webp",
    genre: "Action Adventure",
    platform: "Multi-Platform",
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    releaseYear: 2018,
    rating: 4.9,
    size: 150.0,
  },
  {
    slug: "hollow-knight",
    title: "Hollow Knight",
    description: "A challenging 2D action-adventure. You'll explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn art style.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc4x1c.webp",
    genre: "Metroidvania",
    platform: "Multi-Platform",
    developer: "Team Cherry",
    publisher: "Team Cherry",
    releaseYear: 2017,
    rating: 4.8,
    size: 9.0,
  },
  {
    slug: "hades",
    title: "Hades",
    description: "Defy the god of the dead as you hack and slash your way out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion and Transistor.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co52l6.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc7h7q.webp",
    genre: "Roguelike",
    platform: "Multi-Platform",
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    releaseYear: 2020,
    rating: 4.9,
    size: 15.0,
  },
  {
    slug: "the-witcher-3",
    title: "The Witcher 3: Wild Hunt",
    description: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc9wj5.webp",
    genre: "Action RPG",
    platform: "Multi-Platform",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseYear: 2015,
    rating: 4.9,
    size: 50.0,
  },
  {
    slug: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6lmt.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc9g1i.webp",
    genre: "RPG",
    platform: "Multi-Platform",
    developer: "Larian Studios",
    publisher: "Larian Studios",
    releaseYear: 2023,
    rating: 4.9,
    size: 122.0,
  },
  {
    slug: "spider-man-2",
    title: "Marvel's Spider-Man 2",
    description: "Peter Parker and Miles Morales must face the ultimate threat: the Symbiote Venom and the psychopathic Kraven the Hunter — and Peter's new dark powers.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co7dda.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scb4s2.webp",
    genre: "Action Adventure",
    platform: "PlayStation",
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    releaseYear: 2023,
    rating: 4.6,
    size: 98.0,
  },
];

const ACHIEVEMENTS_SEED = [
  { gameSlug: "god-of-war-ragnarok", title: "Collector of Worlds", description: "Fully explore all Nine Realms", rarity: "Legendary", rarityPercent: "2.1", xpReward: 500 },
  { gameSlug: "god-of-war-ragnarok", title: "Spartan Pride", description: "Kill 1,000 enemies", rarity: "Rare", rarityPercent: "18.4", xpReward: 150 },
  { gameSlug: "elden-ring", title: "Elden Lord", description: "Achieve the Elden Lord ending", rarity: "Rare", rarityPercent: "11.2", xpReward: 300 },
  { gameSlug: "elden-ring", title: "Rune Bearer", description: "Collect all Great Runes", rarity: "Epic", rarityPercent: "5.7", xpReward: 200 },
  { gameSlug: "hades", title: "True Escape", description: "Escape the Underworld for the first time", rarity: "Common", rarityPercent: "45.2", xpReward: 100 },
  { gameSlug: "hades", title: "Heat Seeker", description: "Reach maximum Heat in any region", rarity: "Epic", rarityPercent: "6.8", xpReward: 250 },
  { gameSlug: "the-witcher-3", title: "Gwent Master", description: "Beat all unique Gwent players", rarity: "Rare", rarityPercent: "14.3", xpReward: 150 },
  { gameSlug: "baldurs-gate-3", title: "Absolute Power", description: "Complete the game on Tactician difficulty", rarity: "Legendary", rarityPercent: "1.8", xpReward: 500 },
];

async function seed() {
  logger.info("Starting database seed...");

  // Seed games
  logger.info("Seeding games...");
  const insertedGames = await db
    .insert(gamesTable)
    .values(GAMES_SEED)
    .onConflictDoNothing()
    .returning({ id: gamesTable.id, slug: gamesTable.slug });

  const gameMap = new Map(insertedGames.map(g => [g.slug, g.id]));

  // If games already existed, get their IDs
  if (gameMap.size === 0) {
    const existing = await db.select({ id: gamesTable.id, slug: gamesTable.slug }).from(gamesTable);
    existing.forEach(g => gameMap.set(g.slug, g.id));
  } else {
    // Fill in missing IDs for existing games
    const existing = await db.select({ id: gamesTable.id, slug: gamesTable.slug }).from(gamesTable);
    existing.forEach(g => { if (!gameMap.has(g.slug)) gameMap.set(g.slug, g.id); });
  }

  logger.info(`Games seeded: ${gameMap.size} games in database`);

  // Seed achievements
  logger.info("Seeding achievements...");
  const achievementValues = ACHIEVEMENTS_SEED
    .map(a => {
      const gameId = gameMap.get(a.gameSlug);
      if (!gameId) return null;
      return {
        gameId,
        title: a.title,
        description: a.description,
        rarity: a.rarity,
        rarityPercent: a.rarityPercent,
        xpReward: a.xpReward,
      };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  if (achievementValues.length > 0) {
    await db.insert(achievementsTable).values(achievementValues).onConflictDoNothing();
  }

  // Seed a demo user
  logger.info("Seeding demo user...");
  const passwordHash = await bcrypt.hash("demo1234", 12);
  const [demoUser] = await db
    .insert(usersTable)
    .values({
      email: "demo@gameatlas.gg",
      username: "ShadowHunterX",
      displayName: "Shadow Hunter",
      passwordHash,
      bio: "Veteran gamer | 10,000+ hours across all platforms | God of War enthusiast",
      favoriteGenre: "Action RPG",
      favoriteGame: "God of War: Ragnarök",
      level: 47,
      xp: 12540,
      avatarColor: "#8B0000",
      rankTier: "Diamond",
    })
    .onConflictDoNothing()
    .returning({ id: usersTable.id });

  if (demoUser) {
    // Add some reviews from the demo user
    const gorId = gameMap.get("god-of-war-ragnarok");
    const eldenId = gameMap.get("elden-ring");

    if (gorId) {
      await db.insert(reviewsTable).values({
        userId: demoUser.id,
        gameId: gorId,
        rating: 5.0,
        title: "A masterpiece that redefines the action genre",
        reviewText: "Santa Monica Studio has done it again. Ragnarök is not just a sequel — it's a culmination of everything the franchise has been building toward. The combat is fluid and brutal, the story is emotionally devastating, and the world-building is unparalleled. Every realm feels distinct and alive.",
        pros: ["Incredible combat depth", "Emotionally powerful narrative", "Stunning visual fidelity", "Outstanding voice performances"],
        cons: ["Slightly linear compared to the original", "Some padding in the mid-game"],
        recommended: true,
        playtimeBefore: 120.5,
        featured: true,
        likes: 847,
        helpful: 623,
      }).onConflictDoNothing();
    }

    if (eldenId) {
      await db.insert(reviewsTable).values({
        userId: demoUser.id,
        gameId: eldenId,
        rating: 4.5,
        title: "FromSoftware's magnum opus — brutal perfection",
        reviewText: "Elden Ring is what happens when you combine FromSoftware's uncompromising design philosophy with the creative genius of George R.R. Martin. The open world feels genuinely dangerous and rewarding to explore. Every corner hides something unexpected.",
        pros: ["Massive, rewarding open world", "Deep lore and world-building", "Incredible boss design", "Freedom of build expression"],
        cons: ["Late-game difficulty spikes", "Some technical issues at launch"],
        recommended: true,
        playtimeBefore: 210.0,
        likes: 1203,
        helpful: 891,
      }).onConflictDoNothing();
    }
  }

  logger.info("Seed complete!");
}

seed().catch(err => {
  logger.error(err, "Seed failed");
  process.exit(1);
});
