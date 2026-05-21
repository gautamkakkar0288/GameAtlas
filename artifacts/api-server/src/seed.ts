import {
  db,
  gamesTable,
  achievementsTable,
  reviewsTable,
  usersTable,
  userGameLibraryTable,
  userAchievementsTable,
  notificationsTable,
  postsTable,
  commentsTable,
  userPreferencesTable,
  gamerDNATable,
} from "@workspace/db";
import bcrypt from "bcryptjs";
import { logger } from "./lib/logger.js";

// ── Games ────────────────────────────────────────────────────────────────────

const GAMES_SEED = [
  // ── Existing 10 ──
  {
    slug: "god-of-war-ragnarok",
    title: "God of War: Ragnarök",
    description: "Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc9f04.webp",
    genre: "Action RPG", platform: "PlayStation", developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment", releaseYear: 2022, rating: 4.8, size: 90.0,
    storeUrl: "https://store.playstation.com/en-us/concept/10004011",
  },
  {
    slug: "elden-ring",
    title: "Elden Ring",
    description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc8y4g.webp",
    genre: "Action RPG", platform: "Multi-Platform", developer: "FromSoftware",
    publisher: "Bandai Namco", releaseYear: 2022, rating: 4.9, size: 60.0,
    storeUrl: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
  },
  {
    slug: "the-last-of-us-part-2",
    title: "The Last of Us Part II",
    description: "Five years after their journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming. Living amongst a thriving community of survivors has almost allowed her to forget the horrors of their past.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5x1t.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sczs8a.webp",
    genre: "Action Adventure", platform: "PlayStation", developer: "Naughty Dog",
    publisher: "Sony Interactive Entertainment", releaseYear: 2020, rating: 4.7, size: 78.0,
    storeUrl: "https://store.playstation.com/en-us/product/UP9000-CUSA07820_00-THELASTOFUSPART2",
  },
  {
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    description: "An open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival. Newly updated with the Phantom Liberty expansion.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4a7a.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc8y0b.webp",
    genre: "Action RPG", platform: "Multi-Platform", developer: "CD Projekt Red",
    publisher: "CD Projekt", releaseYear: 2020, rating: 4.4, size: 70.0,
    storeUrl: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
  },
  {
    slug: "red-dead-redemption-2",
    title: "Red Dead Redemption 2",
    description: "America, 1899. The end of the wild west era has begun. After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc4ing.webp",
    genre: "Action Adventure", platform: "Multi-Platform", developer: "Rockstar Games",
    publisher: "Rockstar Games", releaseYear: 2018, rating: 4.9, size: 150.0,
    storeUrl: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
  },
  {
    slug: "hollow-knight",
    title: "Hollow Knight",
    description: "A challenging 2D action-adventure. You'll explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn art style.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc4x1c.webp",
    genre: "Metroidvania", platform: "Multi-Platform", developer: "Team Cherry",
    publisher: "Team Cherry", releaseYear: 2017, rating: 4.8, size: 9.0,
    storeUrl: "https://store.steampowered.com/app/367520/Hollow_Knight/",
  },
  {
    slug: "hades",
    title: "Hades",
    description: "Defy the god of the dead as you hack and slash your way out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion and Transistor.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co52l6.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc7h7q.webp",
    genre: "Roguelike", platform: "Multi-Platform", developer: "Supergiant Games",
    publisher: "Supergiant Games", releaseYear: 2020, rating: 4.9, size: 15.0,
    storeUrl: "https://store.steampowered.com/app/1145360/Hades/",
  },
  {
    slug: "the-witcher-3",
    title: "The Witcher 3: Wild Hunt",
    description: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down the Child of Prophecy — a key to saving or destroying this world.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc9wj5.webp",
    genre: "Action RPG", platform: "Multi-Platform", developer: "CD Projekt Red",
    publisher: "CD Projekt", releaseYear: 2015, rating: 4.9, size: 50.0,
    storeUrl: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
  },
  {
    slug: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power. Mysterious abilities are awakening inside you.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6lmt.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc9g1i.webp",
    genre: "RPG", platform: "Multi-Platform", developer: "Larian Studios",
    publisher: "Larian Studios", releaseYear: 2023, rating: 4.9, size: 122.0,
    storeUrl: "https://store.steampowered.com/app/1086940/Baldurs_Gate_3/",
  },
  {
    slug: "spider-man-2",
    title: "Marvel's Spider-Man 2",
    description: "Peter Parker and Miles Morales must face the ultimate threat as Spider-Man. Both the Symbiote Venom and the ruthless hunter Kraven arrive in New York City, forcing our heroes to confront their greatest personal fears.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co7dda.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scb4s2.webp",
    genre: "Action Adventure", platform: "PlayStation", developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment", releaseYear: 2023, rating: 4.6, size: 98.0,
    storeUrl: "https://store.playstation.com/en-us/concept/10005203",
  },
  // ── 15 new games ──
  {
    slug: "valorant",
    title: "Valorant",
    description: "A 5v5 character-based tactical shooter set on a near-future Earth. Precise gunplay paired with unique agent abilities creates a strategic depth that rewards mastery. Every round counts in this free-to-play competitive FPS from Riot Games.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sco24l.webp",
    genre: "FPS", platform: "Multi-Platform", developer: "Riot Games",
    publisher: "Riot Games", releaseYear: 2020, rating: 4.3, size: 22.0,
    storeUrl: "https://playvalorant.com/en-us/",
  },
  {
    slug: "forza-horizon-5",
    title: "Forza Horizon 5",
    description: "Lead breathtaking expeditions across the vibrant open world landscapes of Mexico with limitless, fun driving action in hundreds of the world's greatest cars. Your Horizon Adventure awaits.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3bcc.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc8dex.webp",
    genre: "Racing", platform: "Xbox/PC", developer: "Playground Games",
    publisher: "Xbox Game Studios", releaseYear: 2021, rating: 4.6, size: 103.0,
    storeUrl: "https://store.steampowered.com/app/1551360/Forza_Horizon_5/",
  },
  {
    slug: "stardew-valley",
    title: "Stardew Valley",
    description: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home?",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1nu9.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc1nhy.webp",
    genre: "Simulation", platform: "Multi-Platform", developer: "ConcernedApe",
    publisher: "ConcernedApe", releaseYear: 2016, rating: 4.9, size: 0.5,
    storeUrl: "https://store.steampowered.com/app/413150/Stardew_Valley/",
  },
  {
    slug: "resident-evil-village",
    title: "Resident Evil Village",
    description: "Set a few years after the horrifying events in Resident Evil 7, Ethan Winters has finally rebuilt his life when tragedy strikes again. Ethan must once again venture into darkness, this time to a mysterious village of horrors.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4ghe.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scbmx4.webp",
    genre: "Survival Horror", platform: "Multi-Platform", developer: "Capcom",
    publisher: "Capcom", releaseYear: 2021, rating: 4.5, size: 35.0,
    storeUrl: "https://store.steampowered.com/app/1196590/Resident_Evil_Village/",
  },
  {
    slug: "grand-theft-auto-v",
    title: "Grand Theft Auto V",
    description: "Los Santos: a vast, sun-soaked metropolis full of self-help gurus, starlets and fading celebrities, once the envy of the Western world, now struggling to stay relevant in an era of economic uncertainty. Play as three unique protagonists across a world of crime and chaos.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc68gt.webp",
    genre: "Open World", platform: "Multi-Platform", developer: "Rockstar North",
    publisher: "Rockstar Games", releaseYear: 2013, rating: 4.7, size: 94.0,
    storeUrl: "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/",
  },
  {
    slug: "dark-souls-iii",
    title: "Dark Souls III",
    description: "As fires fade and the world falls into ruin, journey into a universe filled with more colossal enemies and environments. Players will be immersed into a world of epic atmosphere and darkness through faster gameplay and amplified combat intensity.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1vcj.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc4x8a.webp",
    genre: "Action RPG", platform: "Multi-Platform", developer: "FromSoftware",
    publisher: "Bandai Namco", releaseYear: 2016, rating: 4.7, size: 59.0,
    storeUrl: "https://store.steampowered.com/app/374320/DARK_SOULS_III/",
  },
  {
    slug: "celeste",
    title: "Celeste",
    description: "Help Madeline survive her inner demons on her journey to the top of Celeste Mountain, in this super-tight platformer from the creators of TowerFall. Brave hundreds of hand-crafted challenges, uncover the mountain's dark secrets.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc3wd3.webp",
    genre: "Platformer", platform: "Multi-Platform", developer: "Maddy Makes Games",
    publisher: "Maddy Makes Games", releaseYear: 2018, rating: 4.8, size: 1.4,
    storeUrl: "https://store.steampowered.com/app/504230/Celeste/",
  },
  {
    slug: "doom-eternal",
    title: "DOOM Eternal",
    description: "The DOOM Slayer returns, more powerful than ever before. Speed and power are your tools as you rip and tear until it is done. Discover the origins of the DOOM universe, fight across dimensions, and confront the final ancient evil.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2agb.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc5lx6.webp",
    genre: "FPS", platform: "Multi-Platform", developer: "id Software",
    publisher: "Bethesda Softworks", releaseYear: 2020, rating: 4.6, size: 50.0,
    storeUrl: "https://store.steampowered.com/app/782330/DOOM_Eternal/",
  },
  {
    slug: "zelda-tears-of-the-kingdom",
    title: "The Legend of Zelda: Tears of the Kingdom",
    description: "An epic adventure across the land and skies of Hyrule awaits in this sequel to The Legend of Zelda: Breath of the Wild. Explore the sprawling landscapes of an expanded Hyrule using amazing abilities and new ways to build and craft items.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co63np.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scbvnd.webp",
    genre: "Action Adventure", platform: "Nintendo Switch", developer: "Nintendo EPD",
    publisher: "Nintendo", releaseYear: 2023, rating: 4.8, size: 16.3,
    storeUrl: "https://www.nintendo.com/us/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/",
  },
  {
    slug: "sekiro-shadows-die-twice",
    title: "Sekiro: Shadows Die Twice",
    description: "Carve your own clever path to vengeance in the critically acclaimed action-adventure game from developer FromSoftware. Travel back to Sengoku period Japan, a brutal, bloody period of constant life and death conflict.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1t72.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc4a5v.webp",
    genre: "Action", platform: "Multi-Platform", developer: "FromSoftware",
    publisher: "Activision", releaseYear: 2019, rating: 4.7, size: 13.0,
    storeUrl: "https://store.steampowered.com/app/814380/Sekiro_Shadows_Die_Twice/",
  },
  {
    slug: "disco-elysium",
    title: "Disco Elysium: The Final Cut",
    description: "You're a detective with a unique skill system at your disposal and a whole city to carve your path across. Interrogate unforgettable characters, crack murders or take bribes. Become a hero or an absolute disaster of a human being.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1p0w.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc4v6n.webp",
    genre: "RPG", platform: "Multi-Platform", developer: "ZA/UM",
    publisher: "ZA/UM", releaseYear: 2019, rating: 4.8, size: 22.0,
    storeUrl: "https://store.steampowered.com/app/632470/Disco_Elysium_The_Final_Cut/",
  },
  {
    slug: "returnal",
    title: "Returnal",
    description: "Break the cycle of chaos in this third-person roguelike shooter. After crash-landing on a shape-shifting alien planet, Selene must search through the remains of a previous expedition for answers. Uncover the truth about Selene's story.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2zu4.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc9szj.webp",
    genre: "Roguelike", platform: "Multi-Platform", developer: "Housemarque",
    publisher: "Sony Interactive Entertainment", releaseYear: 2021, rating: 4.4, size: 50.5,
    storeUrl: "https://store.steampowered.com/app/1649240/Returnal/",
  },
  {
    slug: "monster-hunter-world",
    title: "Monster Hunter: World",
    description: "Welcome to a new world! In Monster Hunter: World, the latest installment in the series, you can enjoy the ultimate hunting experience using all your skills to take on more challenging monsters.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wk7.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scbozm.webp",
    genre: "Action RPG", platform: "Multi-Platform", developer: "Capcom",
    publisher: "Capcom", releaseYear: 2018, rating: 4.7, size: 21.0,
    storeUrl: "https://store.steampowered.com/app/582010/Monster_Hunter_World/",
  },
  {
    slug: "among-us",
    title: "Among Us",
    description: "Work together to prepare your spaceship for departure, but beware as one or more random players among the Crew are Impostors bent on killing everyone! Play online with 4-15 players as you try to prep your ship for departure.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2uh7.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scep97.webp",
    genre: "Party", platform: "Multi-Platform", developer: "InnerSloth",
    publisher: "InnerSloth", releaseYear: 2018, rating: 4.0, size: 0.25,
    storeUrl: "https://store.steampowered.com/app/945360/Among_Us/",
  },
  {
    slug: "apex-legends",
    title: "Apex Legends",
    description: "Apex Legends is a free-to-play battle royale-hero shooter game. Choose from a diverse cast of Legends, each with their own unique abilities, and compete in a fast-paced battle royale where 60 players fight to be the last one standing.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qhv.webp",
    bannerImage: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc9v2q.webp",
    genre: "Battle Royale", platform: "Multi-Platform", developer: "Respawn Entertainment",
    publisher: "Electronic Arts", releaseYear: 2019, rating: 4.2, size: 100.0,
    storeUrl: "https://store.steampowered.com/app/1172470/Apex_Legends/",
  },
];

// ── Achievements ─────────────────────────────────────────────────────────────

const ACHIEVEMENTS_SEED = [
  // God of War Ragnarök
  { gameSlug: "god-of-war-ragnarok", title: "Collector of Worlds", description: "Fully explore all Nine Realms and discover every hidden secret", rarity: "Legendary", rarityPercent: "2.1", xpReward: 500 },
  { gameSlug: "god-of-war-ragnarok", title: "Spartan Pride", description: "Eliminate 1,000 enemies across your journey", rarity: "Rare", rarityPercent: "18.4", xpReward: 150 },
  { gameSlug: "god-of-war-ragnarok", title: "Father and Son", description: "Complete the main story of Ragnarök", rarity: "Common", rarityPercent: "61.3", xpReward: 100 },
  { gameSlug: "god-of-war-ragnarok", title: "Valkyrie Queen", description: "Defeat Gná, the Valkyrie Queen", rarity: "Epic", rarityPercent: "4.8", xpReward: 300 },
  { gameSlug: "god-of-war-ragnarok", title: "Craftsman", description: "Fully upgrade any armor set", rarity: "Uncommon", rarityPercent: "29.7", xpReward: 100 },
  // Elden Ring
  { gameSlug: "elden-ring", title: "Elden Lord", description: "Achieve the Elden Lord ending by mending the Elden Ring", rarity: "Rare", rarityPercent: "11.2", xpReward: 300 },
  { gameSlug: "elden-ring", title: "Rune Bearer", description: "Collect all eight Great Runes", rarity: "Epic", rarityPercent: "5.7", xpReward: 200 },
  { gameSlug: "elden-ring", title: "Shardbearer Malenia", description: "Defeat Malenia, Blade of Miquella", rarity: "Legendary", rarityPercent: "1.9", xpReward: 500 },
  { gameSlug: "elden-ring", title: "Tarnished", description: "Defeat Margit, the Fell Omen, for the first time", rarity: "Common", rarityPercent: "52.4", xpReward: 50 },
  { gameSlug: "elden-ring", title: "Age of Stars", description: "Achieve Ranni's secret ending", rarity: "Rare", rarityPercent: "8.3", xpReward: 200 },
  // The Last of Us Part II
  { gameSlug: "the-last-of-us-part-2", title: "The Last of Us", description: "Complete the full story of Part II", rarity: "Common", rarityPercent: "49.8", xpReward: 100 },
  { gameSlug: "the-last-of-us-part-2", title: "Survivalist", description: "Craft every item type in the game", rarity: "Uncommon", rarityPercent: "24.7", xpReward: 100 },
  { gameSlug: "the-last-of-us-part-2", title: "Relic of the Sages", description: "Collect all artifacts", rarity: "Rare", rarityPercent: "9.6", xpReward: 200 },
  { gameSlug: "the-last-of-us-part-2", title: "Death Stranding", description: "Complete the game on Grounded+ difficulty", rarity: "Legendary", rarityPercent: "0.8", xpReward: 500 },
  // Cyberpunk 2077
  { gameSlug: "cyberpunk-2077", title: "V for Vendetta", description: "Complete the main story on any difficulty", rarity: "Common", rarityPercent: "41.2", xpReward: 100 },
  { gameSlug: "cyberpunk-2077", title: "Legends Are Made", description: "Reach Street Cred Level 50", rarity: "Uncommon", rarityPercent: "22.3", xpReward: 100 },
  { gameSlug: "cyberpunk-2077", title: "Phantom Liberty", description: "Complete all Phantom Liberty missions", rarity: "Rare", rarityPercent: "14.7", xpReward: 200 },
  { gameSlug: "cyberpunk-2077", title: "The Fool", description: "Complete all gigs for every fixer in Night City", rarity: "Epic", rarityPercent: "3.9", xpReward: 300 },
  // Red Dead Redemption 2
  { gameSlug: "red-dead-redemption-2", title: "The Veteran", description: "Complete Arthur's journey and reach the epilogue", rarity: "Common", rarityPercent: "43.6", xpReward: 100 },
  { gameSlug: "red-dead-redemption-2", title: "Legend of the East", description: "Complete all Challenges and become a true Legend", rarity: "Legendary", rarityPercent: "1.2", xpReward: 500 },
  { gameSlug: "red-dead-redemption-2", title: "Friends in High Places", description: "Complete all Stranger mission strands", rarity: "Rare", rarityPercent: "7.8", xpReward: 200 },
  { gameSlug: "red-dead-redemption-2", title: "Collector's Item", description: "Purchase all weapons from any fence", rarity: "Uncommon", rarityPercent: "18.4", xpReward: 100 },
  // Hollow Knight
  { gameSlug: "hollow-knight", title: "Wielder of Gods", description: "Defeat all Pantheon bosses without taking damage", rarity: "Legendary", rarityPercent: "0.6", xpReward: 500 },
  { gameSlug: "hollow-knight", title: "Pure Vessel", description: "Defeat the Pure Vessel in the Pantheon of the Knight", rarity: "Epic", rarityPercent: "3.4", xpReward: 300 },
  { gameSlug: "hollow-knight", title: "Dream No More", description: "Defeat the Hollow Knight and seal the infection", rarity: "Common", rarityPercent: "38.9", xpReward: 100 },
  { gameSlug: "hollow-knight", title: "True Ending", description: "Free the Hollow Knight and become the vessel", rarity: "Uncommon", rarityPercent: "21.7", xpReward: 150 },
  // Hades
  { gameSlug: "hades", title: "True Escape", description: "Escape the Underworld for the very first time", rarity: "Common", rarityPercent: "45.2", xpReward: 100 },
  { gameSlug: "hades", title: "Heat Seeker", description: "Reach maximum Heat in the Pact of Punishment", rarity: "Epic", rarityPercent: "6.8", xpReward: 250 },
  { gameSlug: "hades", title: "Reunited", description: "Complete the true ending and reunite the family", rarity: "Rare", rarityPercent: "12.4", xpReward: 200 },
  { gameSlug: "hades", title: "Infernal Arms", description: "Unlock all six Infernal Arms", rarity: "Uncommon", rarityPercent: "26.1", xpReward: 100 },
  // The Witcher 3
  { gameSlug: "the-witcher-3", title: "Gwent Master", description: "Defeat all unique Gwent players and collect every card", rarity: "Rare", rarityPercent: "14.3", xpReward: 150 },
  { gameSlug: "the-witcher-3", title: "The Professional", description: "Complete all contracts in the game", rarity: "Epic", rarityPercent: "4.2", xpReward: 300 },
  { gameSlug: "the-witcher-3", title: "Passed the Trial", description: "Finish the game on Death March difficulty", rarity: "Legendary", rarityPercent: "1.7", xpReward: 500 },
  { gameSlug: "the-witcher-3", title: "Family Reunion", description: "Find Ciri and achieve the best possible ending", rarity: "Uncommon", rarityPercent: "27.4", xpReward: 150 },
  // Baldur's Gate 3
  { gameSlug: "baldurs-gate-3", title: "Absolute Power", description: "Complete the game on Tactician difficulty", rarity: "Legendary", rarityPercent: "1.8", xpReward: 500 },
  { gameSlug: "baldurs-gate-3", title: "Guardian of the Grove", description: "Save the Emerald Grove and all its tieflings", rarity: "Uncommon", rarityPercent: "31.8", xpReward: 100 },
  { gameSlug: "baldurs-gate-3", title: "Illithid Wisdom", description: "Become the Illithid and absorb the Absolute", rarity: "Rare", rarityPercent: "8.7", xpReward: 200 },
  { gameSlug: "baldurs-gate-3", title: "Descent into Avernus", description: "Survive the entire game without any companion dying permanently", rarity: "Epic", rarityPercent: "2.3", xpReward: 400 },
  // Spider-Man 2
  { gameSlug: "spider-man-2", title: "Our Friendly Neighborhood", description: "Complete the main story of Spider-Man 2", rarity: "Common", rarityPercent: "47.3", xpReward: 100 },
  { gameSlug: "spider-man-2", title: "With Great Power", description: "Unlock all Skills for both Peter and Miles", rarity: "Rare", rarityPercent: "11.4", xpReward: 200 },
  { gameSlug: "spider-man-2", title: "Collector", description: "Find every collectible in New York City", rarity: "Epic", rarityPercent: "4.1", xpReward: 300 },
  // Valorant
  { gameSlug: "valorant", title: "First Blood", description: "Secure the very first kill in a competitive match", rarity: "Common", rarityPercent: "68.4", xpReward: 50 },
  { gameSlug: "valorant", title: "Ace!", description: "Eliminate all 5 enemies in a single round single-handedly", rarity: "Epic", rarityPercent: "5.2", xpReward: 250 },
  { gameSlug: "valorant", title: "Radiant Born", description: "Achieve Radiant rank in any competitive act", rarity: "Legendary", rarityPercent: "0.8", xpReward: 500 },
  { gameSlug: "valorant", title: "Team Player", description: "Win 100 competitive matches", rarity: "Uncommon", rarityPercent: "22.4", xpReward: 100 },
  // Forza Horizon 5
  { gameSlug: "forza-horizon-5", title: "Speed Demon", description: "Reach 300 mph in any car on any road", rarity: "Uncommon", rarityPercent: "31.2", xpReward: 100 },
  { gameSlug: "forza-horizon-5", title: "Collector's Paradise", description: "Own 50 cars in your garage", rarity: "Rare", rarityPercent: "12.7", xpReward: 200 },
  { gameSlug: "forza-horizon-5", title: "Festival Champion", description: "Win all Festival Playlist events in a single season", rarity: "Epic", rarityPercent: "4.1", xpReward: 300 },
  // Stardew Valley
  { gameSlug: "stardew-valley", title: "Greenhorn", description: "Ship 15 different types of crops", rarity: "Common", rarityPercent: "52.3", xpReward: 50 },
  { gameSlug: "stardew-valley", title: "Skull Cavern Master", description: "Reach floor 100 in the Skull Cavern", rarity: "Rare", rarityPercent: "8.4", xpReward: 200 },
  { gameSlug: "stardew-valley", title: "Junimo Friend", description: "Complete all Community Center bundles", rarity: "Uncommon", rarityPercent: "28.7", xpReward: 100 },
  { gameSlug: "stardew-valley", title: "Legend of the Farm", description: "Catch the legendary fish: Legend", rarity: "Epic", rarityPercent: "6.1", xpReward: 250 },
  // Resident Evil Village
  { gameSlug: "resident-evil-village", title: "Survivor", description: "Complete the game and escape the village", rarity: "Common", rarityPercent: "44.8", xpReward: 100 },
  { gameSlug: "resident-evil-village", title: "Hooligan", description: "Destroy all crystal torsos throughout the game", rarity: "Uncommon", rarityPercent: "26.3", xpReward: 100 },
  { gameSlug: "resident-evil-village", title: "Knife Only", description: "Complete the game using only the knife", rarity: "Legendary", rarityPercent: "1.4", xpReward: 500 },
  { gameSlug: "resident-evil-village", title: "A Masterwork", description: "Fully upgrade any weapon to its maximum level", rarity: "Rare", rarityPercent: "15.7", xpReward: 200 },
  // GTA V
  { gameSlug: "grand-theft-auto-v", title: "Career Criminal", description: "Achieve 100% completion across the entire game", rarity: "Legendary", rarityPercent: "0.9", xpReward: 500 },
  { gameSlug: "grand-theft-auto-v", title: "The Robbery", description: "Complete all main story Heists", rarity: "Rare", rarityPercent: "16.7", xpReward: 200 },
  { gameSlug: "grand-theft-auto-v", title: "San Andreas Legend", description: "Reach level 100 in GTA Online", rarity: "Uncommon", rarityPercent: "19.3", xpReward: 150 },
  // Dark Souls III
  { gameSlug: "dark-souls-iii", title: "The Dark Soul", description: "Collect all trophies and become a true Champion of Ash", rarity: "Legendary", rarityPercent: "0.4", xpReward: 500 },
  { gameSlug: "dark-souls-iii", title: "Heir of Fire Destroyed", description: "Defeat the Soul of Cinder and end the Age of Fire", rarity: "Rare", rarityPercent: "22.1", xpReward: 200 },
  { gameSlug: "dark-souls-iii", title: "Lords of Cinder", description: "Defeat all four Lords of Cinder in sequence", rarity: "Epic", rarityPercent: "8.3", xpReward: 250 },
  { gameSlug: "dark-souls-iii", title: "First Attempt?", description: "Defeat Iudex Gundyr without dying", rarity: "Uncommon", rarityPercent: "30.6", xpReward: 100 },
  // Celeste
  { gameSlug: "celeste", title: "Summit", description: "Reach the summit of Celeste Mountain and complete the game", rarity: "Common", rarityPercent: "48.2", xpReward: 100 },
  { gameSlug: "celeste", title: "Strawberry Jam", description: "Collect all 175 strawberries on the mountain", rarity: "Rare", rarityPercent: "9.7", xpReward: 250 },
  { gameSlug: "celeste", title: "Farewell", description: "Complete the Farewell bonus chapter — the hardest in the game", rarity: "Legendary", rarityPercent: "2.3", xpReward: 400 },
  { gameSlug: "celeste", title: "Full Clear", description: "Achieve a Full Clear on every chapter", rarity: "Epic", rarityPercent: "1.1", xpReward: 500 },
  // DOOM Eternal
  { gameSlug: "doom-eternal", title: "RIP AND TEAR", description: "Perform 100 glory kills on demon kind", rarity: "Common", rarityPercent: "61.2", xpReward: 50 },
  { gameSlug: "doom-eternal", title: "DOOM: Ultra-Nightmare", description: "Complete the campaign on Ultra-Nightmare difficulty with 1 life", rarity: "Legendary", rarityPercent: "0.7", xpReward: 500 },
  { gameSlug: "doom-eternal", title: "Slayer's Arsenal", description: "Fully upgrade and master all weapons", rarity: "Rare", rarityPercent: "11.4", xpReward: 200 },
  // Zelda TOTK
  { gameSlug: "zelda-tears-of-the-kingdom", title: "By Strength of Spirit", description: "Defeat the Demon King and bring peace to Hyrule", rarity: "Common", rarityPercent: "41.3", xpReward: 100 },
  { gameSlug: "zelda-tears-of-the-kingdom", title: "Shrine Seeker", description: "Complete all 152 Shrines across Hyrule", rarity: "Epic", rarityPercent: "7.2", xpReward: 300 },
  { gameSlug: "zelda-tears-of-the-kingdom", title: "Dragon's Tears", description: "Collect all 12 Dragon's Tears and witness the full memory", rarity: "Rare", rarityPercent: "15.6", xpReward: 200 },
  // Sekiro
  { gameSlug: "sekiro-shadows-die-twice", title: "Shura", description: "Choose the path of Shura and experience a dark alternate ending", rarity: "Rare", rarityPercent: "14.3", xpReward: 200 },
  { gameSlug: "sekiro-shadows-die-twice", title: "Return", description: "Achieve the true ending and complete Sekiro's journey", rarity: "Legendary", rarityPercent: "1.2", xpReward: 500 },
  { gameSlug: "sekiro-shadows-die-twice", title: "Height of Skill", description: "Learn all skills from every Skill Tree", rarity: "Epic", rarityPercent: "3.8", xpReward: 300 },
  { gameSlug: "sekiro-shadows-die-twice", title: "Shinobi's Karma: Body", description: "Defeat Genichiro Ashina atop Ashina Castle", rarity: "Common", rarityPercent: "38.7", xpReward: 100 },
  // Disco Elysium
  { gameSlug: "disco-elysium", title: "Chaotique!", description: "Fail a crucial skill check by rolling a 1", rarity: "Common", rarityPercent: "38.4", xpReward: 50 },
  { gameSlug: "disco-elysium", title: "The Law", description: "Complete the game as a hardcore communist cop", rarity: "Rare", rarityPercent: "11.3", xpReward: 200 },
  { gameSlug: "disco-elysium", title: "All Cops Are Bastards", description: "Complete the game after joining the Villareal riot", rarity: "Epic", rarityPercent: "4.9", xpReward: 250 },
  { gameSlug: "disco-elysium", title: "Feld Playback", description: "Discover and experience all 15 lost thoughts", rarity: "Legendary", rarityPercent: "2.7", xpReward: 400 },
  // Returnal
  { gameSlug: "returnal", title: "Prisoner of the White Shadow", description: "Complete Returnal and break the cycle once and for all", rarity: "Rare", rarityPercent: "19.4", xpReward: 200 },
  { gameSlug: "returnal", title: "Icarian", description: "Die 100 times — but keep coming back", rarity: "Common", rarityPercent: "72.3", xpReward: 50 },
  { gameSlug: "returnal", title: "Ixion's Hubris", description: "Defeat Ixion without taking a single hit", rarity: "Legendary", rarityPercent: "2.1", xpReward: 400 },
  // Monster Hunter World
  { gameSlug: "monster-hunter-world", title: "The New World", description: "Arrive in the New World and begin your hunt", rarity: "Common", rarityPercent: "82.1", xpReward: 50 },
  { gameSlug: "monster-hunter-world", title: "Fatalis Slayer", description: "Hunt the ancient black dragon Fatalis", rarity: "Legendary", rarityPercent: "3.4", xpReward: 500 },
  { gameSlug: "monster-hunter-world", title: "The Hunter's Life", description: "Slay a monster of every type in the game", rarity: "Rare", rarityPercent: "17.8", xpReward: 200 },
  // Among Us
  { gameSlug: "among-us", title: "Ejected", description: "Get voted out as an innocent Crewmate", rarity: "Common", rarityPercent: "78.4", xpReward: 50 },
  { gameSlug: "among-us", title: "The Impostor", description: "Win 10 games as the Impostor", rarity: "Uncommon", rarityPercent: "41.2", xpReward: 100 },
  { gameSlug: "among-us", title: "Trust No One", description: "Win 50 games as a Crewmate", rarity: "Rare", rarityPercent: "16.8", xpReward: 150 },
  // Apex Legends
  { gameSlug: "apex-legends", title: "First Win", description: "Win your very first battle royale match", rarity: "Common", rarityPercent: "45.3", xpReward: 100 },
  { gameSlug: "apex-legends", title: "Champion", description: "Become the Champion squad of a battle royale match", rarity: "Uncommon", rarityPercent: "28.9", xpReward: 100 },
  { gameSlug: "apex-legends", title: "Apex Predator", description: "Reach the top 750 Apex Predator rank in any competitive season", rarity: "Legendary", rarityPercent: "0.5", xpReward: 500 },
  { gameSlug: "apex-legends", title: "Win Streak", description: "Win 100 battle royale matches total", rarity: "Rare", rarityPercent: "9.7", xpReward: 200 },
];

// ── Users ─────────────────────────────────────────────────────────────────────

const USERS_SEED = [
  {
    email: "demo@gameatlas.gg", username: "ShadowHunterX", displayName: "Shadow Hunter",
    bio: "Veteran gamer | 10,000+ hours across all platforms | God of War & FromSoftware enthusiast | Diamond rank",
    favoriteGenre: "Action RPG", favoriteGame: "God of War: Ragnarök",
    level: 47, xp: 12540, avatarColor: "#8B0000", rankTier: "Diamond",
  },
  {
    email: "nova@gameatlas.gg", username: "NightmareNova", displayName: "Nightmare Nova",
    bio: "Horror games are my therapy 🕯️ RE Village speedrunner. Survival enthusiast. Currently haunting Village for the 7th time.",
    favoriteGenre: "Survival Horror", favoriteGame: "Resident Evil Village",
    level: 32, xp: 8420, avatarColor: "#4B0082", rankTier: "Platinum",
  },
  {
    email: "pixel@gameatlas.gg", username: "PixelWitch", displayName: "Pixel Witch",
    bio: "Indie game collector 🌻 Stardew Valley addict with 2000+ hrs in farming sims. She/her. Cozy games enthusiast.",
    favoriteGenre: "Simulation", favoriteGame: "Stardew Valley",
    level: 28, xp: 7180, avatarColor: "#2D8653", rankTier: "Gold",
  },
  {
    email: "cosmic@gameatlas.gg", username: "CosmicFuryX", displayName: "Cosmic Fury",
    bio: "Radiant-ranked Valorant main 💎 FPS is life. 3000+ hours of fragging. Streaming on Twitch daily. Coaches on weekends.",
    favoriteGenre: "FPS", favoriteGame: "Valorant",
    level: 55, xp: 14920, avatarColor: "#0047AB", rankTier: "Diamond",
  },
  {
    email: "luna@gameatlas.gg", username: "LunaGamer", displayName: "Luna",
    bio: "Casual gamer finding joy one game at a time 🌙 Currently lost in TOTK. I play what I enjoy, no meta required.",
    favoriteGenre: "Action Adventure", favoriteGame: "The Legend of Zelda: Tears of the Kingdom",
    level: 18, xp: 4350, avatarColor: "#C71585", rankTier: "Silver",
  },
  {
    email: "thorn@gameatlas.gg", username: "ThornedKnight", displayName: "Thorned Knight",
    bio: "I've died 10,000 times and I'd do it again ⚔️ Sekiro > Everything. FromSoftware evangelist. Pain is temporary, glory is eternal.",
    favoriteGenre: "Action RPG", favoriteGame: "Sekiro: Shadows Die Twice",
    level: 42, xp: 11230, avatarColor: "#8B4513", rankTier: "Platinum",
  },
  {
    email: "stargazer@gameatlas.gg", username: "StargazerPro", displayName: "Stargazer",
    bio: "Story-driven games and cozy RPGs ✨ BG3 ruined every other RPG for me. Coffee & gaming. Speedrunner-in-training.",
    favoriteGenre: "RPG", favoriteGame: "Baldur's Gate 3",
    level: 24, xp: 6180, avatarColor: "#1A237E", rankTier: "Gold",
  },
  {
    email: "void@gameatlas.gg", username: "VoidWalker99", displayName: "Void Walker",
    bio: "100% completion or nothing 🏆 Every trophy. Every achievement. Every secret. Completionist since 2008. The grind never ends.",
    favoriteGenre: "Action RPG", favoriteGame: "Elden Ring",
    level: 67, xp: 19840, avatarColor: "#212121", rankTier: "Legendary",
  },
];

// ── Library entries [username, gameSlug, playtime, status, favorite] ──────────

const LIBRARY_SEED: Array<{ user: string; game: string; playtime: number; status: string; favorite: boolean }> = [
  // ShadowHunterX
  { user: "ShadowHunterX", game: "god-of-war-ragnarok",      playtime: 120.5, status: "playing",    favorite: true  },
  { user: "ShadowHunterX", game: "elden-ring",               playtime: 210.0, status: "completed",  favorite: true  },
  { user: "ShadowHunterX", game: "the-last-of-us-part-2",    playtime: 18.3,  status: "completed",  favorite: false },
  { user: "ShadowHunterX", game: "hades",                    playtime: 45.7,  status: "playing",    favorite: false },
  { user: "ShadowHunterX", game: "hollow-knight",            playtime: 52.3,  status: "completed",  favorite: false },
  { user: "ShadowHunterX", game: "cyberpunk-2077",           playtime: 78.9,  status: "paused",     favorite: false },
  { user: "ShadowHunterX", game: "baldurs-gate-3",           playtime: 0.0,   status: "wishlist",   favorite: false },
  { user: "ShadowHunterX", game: "the-witcher-3",            playtime: 180.2, status: "completed",  favorite: true  },
  { user: "ShadowHunterX", game: "sekiro-shadows-die-twice", playtime: 24.3,  status: "playing",    favorite: false },
  // NightmareNova
  { user: "NightmareNova", game: "resident-evil-village",    playtime: 28.4,  status: "completed",  favorite: true  },
  { user: "NightmareNova", game: "the-last-of-us-part-2",    playtime: 22.7,  status: "completed",  favorite: false },
  { user: "NightmareNova", game: "spider-man-2",             playtime: 15.3,  status: "playing",    favorite: false },
  { user: "NightmareNova", game: "cyberpunk-2077",           playtime: 94.2,  status: "completed",  favorite: false },
  { user: "NightmareNova", game: "doom-eternal",             playtime: 35.6,  status: "completed",  favorite: false },
  { user: "NightmareNova", game: "returnal",                 playtime: 67.8,  status: "playing",    favorite: true  },
  { user: "NightmareNova", game: "hades",                    playtime: 0.0,   status: "not_started",favorite: false },
  // PixelWitch
  { user: "PixelWitch", game: "stardew-valley",              playtime: 420.5, status: "playing",    favorite: true  },
  { user: "PixelWitch", game: "hades",                       playtime: 88.3,  status: "completed",  favorite: true  },
  { user: "PixelWitch", game: "celeste",                     playtime: 24.7,  status: "completed",  favorite: false },
  { user: "PixelWitch", game: "among-us",                    playtime: 45.2,  status: "completed",  favorite: false },
  { user: "PixelWitch", game: "hollow-knight",               playtime: 18.9,  status: "paused",     favorite: false },
  { user: "PixelWitch", game: "baldurs-gate-3",              playtime: 130.4, status: "playing",    favorite: false },
  { user: "PixelWitch", game: "disco-elysium",               playtime: 42.1,  status: "completed",  favorite: false },
  // CosmicFuryX
  { user: "CosmicFuryX", game: "valorant",                   playtime: 1240.8,status: "playing",    favorite: true  },
  { user: "CosmicFuryX", game: "apex-legends",               playtime: 580.3, status: "playing",    favorite: false },
  { user: "CosmicFuryX", game: "doom-eternal",               playtime: 28.4,  status: "completed",  favorite: false },
  { user: "CosmicFuryX", game: "forza-horizon-5",            playtime: 145.7, status: "playing",    favorite: false },
  { user: "CosmicFuryX", game: "grand-theft-auto-v",         playtime: 320.5, status: "completed",  favorite: false },
  { user: "CosmicFuryX", game: "cyberpunk-2077",             playtime: 0.0,   status: "wishlist",   favorite: false },
  // LunaGamer
  { user: "LunaGamer", game: "zelda-tears-of-the-kingdom",   playtime: 85.3,  status: "playing",    favorite: true  },
  { user: "LunaGamer", game: "stardew-valley",               playtime: 120.7, status: "playing",    favorite: false },
  { user: "LunaGamer", game: "among-us",                     playtime: 32.1,  status: "completed",  favorite: false },
  { user: "LunaGamer", game: "spider-man-2",                 playtime: 0.0,   status: "wishlist",   favorite: false },
  { user: "LunaGamer", game: "god-of-war-ragnarok",          playtime: 0.0,   status: "wishlist",   favorite: false },
  // ThornedKnight
  { user: "ThornedKnight", game: "sekiro-shadows-die-twice", playtime: 280.5, status: "completed",  favorite: true  },
  { user: "ThornedKnight", game: "elden-ring",               playtime: 450.3, status: "completed",  favorite: true  },
  { user: "ThornedKnight", game: "dark-souls-iii",           playtime: 320.8, status: "completed",  favorite: false },
  { user: "ThornedKnight", game: "hollow-knight",            playtime: 68.4,  status: "completed",  favorite: false },
  { user: "ThornedKnight", game: "hades",                    playtime: 156.7, status: "completed",  favorite: false },
  { user: "ThornedKnight", game: "god-of-war-ragnarok",      playtime: 32.4,  status: "playing",    favorite: false },
  { user: "ThornedKnight", game: "baldurs-gate-3",           playtime: 0.0,   status: "wishlist",   favorite: false },
  // StargazerPro
  { user: "StargazerPro", game: "baldurs-gate-3",            playtime: 180.6, status: "playing",    favorite: true  },
  { user: "StargazerPro", game: "the-witcher-3",             playtime: 145.3, status: "completed",  favorite: false },
  { user: "StargazerPro", game: "disco-elysium",             playtime: 28.7,  status: "completed",  favorite: false },
  { user: "StargazerPro", game: "the-last-of-us-part-2",     playtime: 16.4,  status: "completed",  favorite: false },
  { user: "StargazerPro", game: "elden-ring",                playtime: 34.2,  status: "paused",     favorite: false },
  { user: "StargazerPro", game: "stardew-valley",            playtime: 75.9,  status: "playing",    favorite: false },
  // VoidWalker99
  { user: "VoidWalker99", game: "elden-ring",                playtime: 820.7, status: "completed",  favorite: true  },
  { user: "VoidWalker99", game: "dark-souls-iii",            playtime: 412.3, status: "completed",  favorite: false },
  { user: "VoidWalker99", game: "sekiro-shadows-die-twice",  playtime: 380.6, status: "completed",  favorite: false },
  { user: "VoidWalker99", game: "hollow-knight",             playtime: 120.4, status: "completed",  favorite: false },
  { user: "VoidWalker99", game: "hades",                     playtime: 280.9, status: "completed",  favorite: false },
  { user: "VoidWalker99", game: "the-witcher-3",             playtime: 290.5, status: "completed",  favorite: false },
  { user: "VoidWalker99", game: "baldurs-gate-3",            playtime: 340.2, status: "completed",  favorite: false },
  { user: "VoidWalker99", game: "celeste",                   playtime: 48.7,  status: "completed",  favorite: false },
  { user: "VoidWalker99", game: "disco-elysium",             playtime: 56.3,  status: "completed",  favorite: false },
  { user: "VoidWalker99", game: "returnal",                  playtime: 145.8, status: "completed",  favorite: false },
  { user: "VoidWalker99", game: "monster-hunter-world",      playtime: 389.4, status: "completed",  favorite: false },
];

// ── User → Achievement unlocks [username, achievement title, gameSlug] ────────

const USER_ACHIEVEMENTS_SEED = [
  { user: "ShadowHunterX", achTitle: "Father and Son",          gameSlug: "god-of-war-ragnarok" },
  { user: "ShadowHunterX", achTitle: "Spartan Pride",           gameSlug: "god-of-war-ragnarok" },
  { user: "ShadowHunterX", achTitle: "Tarnished",               gameSlug: "elden-ring" },
  { user: "ShadowHunterX", achTitle: "Elden Lord",              gameSlug: "elden-ring" },
  { user: "ShadowHunterX", achTitle: "Dream No More",           gameSlug: "hollow-knight" },
  { user: "ShadowHunterX", achTitle: "True Escape",             gameSlug: "hades" },
  { user: "ShadowHunterX", achTitle: "Family Reunion",          gameSlug: "the-witcher-3" },
  { user: "ShadowHunterX", achTitle: "The Last of Us",          gameSlug: "the-last-of-us-part-2" },

  { user: "NightmareNova", achTitle: "Survivor",                gameSlug: "resident-evil-village" },
  { user: "NightmareNova", achTitle: "Hooligan",                gameSlug: "resident-evil-village" },
  { user: "NightmareNova", achTitle: "A Masterwork",            gameSlug: "resident-evil-village" },
  { user: "NightmareNova", achTitle: "The Last of Us",          gameSlug: "the-last-of-us-part-2" },
  { user: "NightmareNova", achTitle: "RIP AND TEAR",            gameSlug: "doom-eternal" },
  { user: "NightmareNova", achTitle: "Slayer's Arsenal",        gameSlug: "doom-eternal" },
  { user: "NightmareNova", achTitle: "Icarian",                 gameSlug: "returnal" },

  { user: "PixelWitch",    achTitle: "Greenhorn",               gameSlug: "stardew-valley" },
  { user: "PixelWitch",    achTitle: "Junimo Friend",           gameSlug: "stardew-valley" },
  { user: "PixelWitch",    achTitle: "True Escape",             gameSlug: "hades" },
  { user: "PixelWitch",    achTitle: "Reunited",                gameSlug: "hades" },
  { user: "PixelWitch",    achTitle: "Summit",                  gameSlug: "celeste" },
  { user: "PixelWitch",    achTitle: "Ejected",                 gameSlug: "among-us" },
  { user: "PixelWitch",    achTitle: "Chaotique!",              gameSlug: "disco-elysium" },

  { user: "CosmicFuryX",  achTitle: "First Blood",             gameSlug: "valorant" },
  { user: "CosmicFuryX",  achTitle: "Team Player",             gameSlug: "valorant" },
  { user: "CosmicFuryX",  achTitle: "Ace!",                    gameSlug: "valorant" },
  { user: "CosmicFuryX",  achTitle: "First Win",               gameSlug: "apex-legends" },
  { user: "CosmicFuryX",  achTitle: "Champion",                gameSlug: "apex-legends" },
  { user: "CosmicFuryX",  achTitle: "RIP AND TEAR",            gameSlug: "doom-eternal" },
  { user: "CosmicFuryX",  achTitle: "The Robbery",             gameSlug: "grand-theft-auto-v" },
  { user: "CosmicFuryX",  achTitle: "Speed Demon",             gameSlug: "forza-horizon-5" },

  { user: "LunaGamer",    achTitle: "By Strength of Spirit",   gameSlug: "zelda-tears-of-the-kingdom" },
  { user: "LunaGamer",    achTitle: "Greenhorn",               gameSlug: "stardew-valley" },
  { user: "LunaGamer",    achTitle: "Ejected",                 gameSlug: "among-us" },
  { user: "LunaGamer",    achTitle: "The Impostor",            gameSlug: "among-us" },

  { user: "ThornedKnight", achTitle: "Shinobi's Karma: Body",  gameSlug: "sekiro-shadows-die-twice" },
  { user: "ThornedKnight", achTitle: "Return",                 gameSlug: "sekiro-shadows-die-twice" },
  { user: "ThornedKnight", achTitle: "Tarnished",              gameSlug: "elden-ring" },
  { user: "ThornedKnight", achTitle: "Elden Lord",             gameSlug: "elden-ring" },
  { user: "ThornedKnight", achTitle: "Shardbearer Malenia",    gameSlug: "elden-ring" },
  { user: "ThornedKnight", achTitle: "First Attempt?",         gameSlug: "dark-souls-iii" },
  { user: "ThornedKnight", achTitle: "Heir of Fire Destroyed", gameSlug: "dark-souls-iii" },
  { user: "ThornedKnight", achTitle: "Dream No More",          gameSlug: "hollow-knight" },
  { user: "ThornedKnight", achTitle: "True Ending",            gameSlug: "hollow-knight" },
  { user: "ThornedKnight", achTitle: "True Escape",            gameSlug: "hades" },

  { user: "StargazerPro", achTitle: "Guardian of the Grove",   gameSlug: "baldurs-gate-3" },
  { user: "StargazerPro", achTitle: "Family Reunion",          gameSlug: "the-witcher-3" },
  { user: "StargazerPro", achTitle: "Chaotique!",              gameSlug: "disco-elysium" },
  { user: "StargazerPro", achTitle: "The Law",                 gameSlug: "disco-elysium" },
  { user: "StargazerPro", achTitle: "The Last of Us",          gameSlug: "the-last-of-us-part-2" },

  { user: "VoidWalker99", achTitle: "Tarnished",               gameSlug: "elden-ring" },
  { user: "VoidWalker99", achTitle: "Elden Lord",              gameSlug: "elden-ring" },
  { user: "VoidWalker99", achTitle: "Age of Stars",            gameSlug: "elden-ring" },
  { user: "VoidWalker99", achTitle: "Shardbearer Malenia",     gameSlug: "elden-ring" },
  { user: "VoidWalker99", achTitle: "The Dark Soul",           gameSlug: "dark-souls-iii" },
  { user: "VoidWalker99", achTitle: "Return",                  gameSlug: "sekiro-shadows-die-twice" },
  { user: "VoidWalker99", achTitle: "Height of Skill",         gameSlug: "sekiro-shadows-die-twice" },
  { user: "VoidWalker99", achTitle: "Wielder of Gods",         gameSlug: "hollow-knight" },
  { user: "VoidWalker99", achTitle: "Full Clear",              gameSlug: "celeste" },
  { user: "VoidWalker99", achTitle: "Strawberry Jam",          gameSlug: "celeste" },
  { user: "VoidWalker99", achTitle: "Absolute Power",          gameSlug: "baldurs-gate-3" },
  { user: "VoidWalker99", achTitle: "Fatalis Slayer",          gameSlug: "monster-hunter-world" },
  { user: "VoidWalker99", achTitle: "Prisoner of the White Shadow", gameSlug: "returnal" },
];

// ── Reviews ───────────────────────────────────────────────────────────────────

const REVIEWS_SEED = [
  {
    user: "ShadowHunterX", game: "god-of-war-ragnarok",
    rating: 5.0, featured: true,
    title: "A masterpiece that redefines the action genre",
    reviewText: "Santa Monica Studio has done it again. Ragnarök is not just a sequel — it's a culmination of everything the franchise has been building toward. The combat is fluid and brutal, the story is emotionally devastating, and the world-building is unparalleled. Every realm feels distinct and alive. Atreus's growth from a child learning his place to a young man carving his own destiny is handled with remarkable nuance. The final act had me genuinely in tears.",
    pros: ["Incredible combat depth and variety", "Emotionally powerful, layered narrative", "Stunning visual fidelity across all Nine Realms", "Outstanding voice performances from Mimir to Freya"],
    cons: ["Slightly more linear than God of War 2018", "Some mid-game pacing issues during the realm-hopping"],
    recommended: true, playtimeBefore: 120.5, likes: 847, helpful: 623,
  },
  {
    user: "ShadowHunterX", game: "elden-ring",
    rating: 4.5, featured: false,
    title: "FromSoftware's magnum opus — brutal, beautiful perfection",
    reviewText: "Elden Ring is what happens when you combine FromSoftware's uncompromising design philosophy with the creative genius of George R.R. Martin. The open world feels genuinely dangerous and rewarding to explore. Every corner hides something unexpected — a hidden dungeon, a terrifying boss, a piece of lore that reshapes everything you thought you knew. The moment you step into Limgrave for the first time and see the sheer scale of the Lands Between, you know you're in something special.",
    pros: ["Massive, rewarding open world that respects player agency", "Deep lore and intricate world-building", "Incredible boss design — diverse and memorable", "Unparalleled freedom of build expression"],
    cons: ["Late-game difficulty spikes feel unbalanced at times", "Some technical issues remain even post-patch"],
    recommended: true, playtimeBefore: 210.0, likes: 1203, helpful: 891,
  },
  {
    user: "ThornedKnight", game: "sekiro-shadows-die-twice",
    rating: 5.0, featured: true,
    title: "The most satisfying combat system ever created",
    reviewText: "Sekiro demands everything from you and gives back tenfold when you finally click with its rhythm. The posture-breaking system is genius — combat feels like a deadly dance where reading your opponent is as important as your reflexes. Every boss is a masterclass in design. Genichiro teaches you aggression. Lady Butterfly teaches you patience. Isshin teaches you everything. After 280 hours I still feel excitement replaying it. Nothing compares.",
    pros: ["Posture system creates uniquely satisfying combat", "Boss fights are among gaming's greatest", "Atmosphere and setting are breathtaking", "Perfect difficulty — hard but always fair"],
    cons: ["Very little build variety compared to other FromSoft games", "Multiplayer absence will disappoint some fans"],
    recommended: true, playtimeBefore: 280.5, likes: 934, helpful: 712,
  },
  {
    user: "ThornedKnight", game: "elden-ring",
    rating: 4.8, featured: false,
    title: "A love letter to open-world exploration done right",
    reviewText: "450 hours in and the Lands Between still surprises me. FromSoftware took every lesson learned from Dark Souls and applied it to an open world in a way no other developer has managed. The verticality of the world design is astonishing — every cliffside might hide a cave, every cave might lead to a boss arena, every boss might drop an item that opens a questline you didn't know existed. It's endlessly rewarding.",
    pros: ["World exploration is endlessly rewarding", "Boss variety is the best in the series", "Art direction is stunning throughout"],
    cons: ["Performance on PC at launch was a disaster", "Some areas feel rushed compared to the first half"],
    recommended: true, playtimeBefore: 450.3, likes: 674, helpful: 521,
  },
  {
    user: "PixelWitch", game: "stardew-valley",
    rating: 5.0, featured: true,
    title: "420 hours in — still finding new things. This game is alive.",
    reviewText: "I have named every single chicken on my farm. I know the daily schedule of every villager. I have memorized Willy's fish shop hours. And yet somehow, 420 hours in, I still discovered a dialogue option I'd never seen and a secret note I'd missed. ConcernedApe created something that shouldn't be possible — a game that feels handcrafted and intimate at any scale. There are no microtransactions, no battle passes, no artificial engagement hooks. Just a beautiful, generous world waiting for you.",
    pros: ["Infinite replayability — every run feels different", "Incredibly peaceful and genuinely therapeutic", "Rich character development for every NPC", "Priced fairly and content-complete — no DLC scams", "Regular free content updates for years"],
    cons: ["Combat in the mines is quite basic and could be deeper"],
    recommended: true, playtimeBefore: 420.5, likes: 1847, helpful: 1423,
  },
  {
    user: "PixelWitch", game: "celeste",
    rating: 5.0, featured: false,
    title: "More than a platformer — a meditation on mental health",
    reviewText: "Celeste snuck up on me. I came for tight platforming mechanics and left with something I didn't expect — a story about anxiety, self-doubt, and the courage it takes to keep climbing even when every part of you wants to stop. Madeline's journey up the mountain is a metaphor that never feels heavy-handed. The controls are absolutely perfect: responsive, precise, and fair. Every death is your fault and you know it. Every success feels earned. The Farewell chapter is the hardest thing I've ever played and the most rewarding.",
    pros: ["Perfect, butter-smooth controls", "Beautiful hand-crafted pixel art with incredible variety", "Narrative tackles mental health with empathy and authenticity", "Lena Raine's soundtrack is one of gaming's best"],
    cons: ["Some strawberry placements in later chapters are genuinely brutal", "Farewell chapter may frustrate casual players"],
    recommended: true, playtimeBefore: 24.7, likes: 1124, helpful: 987,
  },
  {
    user: "CosmicFuryX", game: "valorant",
    rating: 4.5, featured: false,
    title: "The best tactical FPS in years — once you click, you cannot stop",
    reviewText: "I came from CS:GO and I was skeptical about abilities in a competitive shooter. After 1200 hours and a Radiant rank, I can confidently say Riot got the balance right. The gunplay is crisp and precise — abilities complement it rather than replace it. A perfectly placed smokes can be as impactful as an ace. The agent roster keeps growing with creative designs that change the meta meaningfully. The ranked climb is one of the most addictive progressions in gaming.",
    pros: ["Tight, precise gunplay that rewards mechanical skill", "Agent abilities add strategic depth without overpowering", "Consistent ranked updates keep the meta fresh", "Excellent anti-cheat and competitive infrastructure"],
    cons: ["Steep learning curve — expect 200 hours before feeling competent", "Ranked toxicity can be a significant problem", "Some maps feel unbalanced for attackers"],
    recommended: true, playtimeBefore: 1240.8, likes: 892, helpful: 734,
  },
  {
    user: "CosmicFuryX", game: "apex-legends",
    rating: 4.2, featured: false,
    title: "The most mechanically polished battle royale available",
    reviewText: "Apex's movement system is simply unmatched. Bunny hopping, wall-running, the ping system — Respawn clearly thought deeply about what makes a battle royale feel good to play. The legend abilities add genuine team composition strategy. The problem is monetization: cosmetics are expensive, the battle pass feels rushed, and ranked matchmaking has serious issues at higher tiers. But the core gameplay loop? Still the best in the genre.",
    pros: ["Movement system is best-in-class", "Legend synergies create genuine team strategy", "Ping communication system revolutionized FPS teamplay", "Regular seasonal content drops"],
    cons: ["Predatory cosmetic pricing", "Ranked matchmaking needs significant work", "Server stability issues in some regions"],
    recommended: true, playtimeBefore: 580.3, likes: 643, helpful: 498,
  },
  {
    user: "NightmareNova", game: "resident-evil-village",
    rating: 4.5, featured: false,
    title: "Lady Dimitrescu alone is worth the price of admission",
    reviewText: "Village is Capcom firing on all cylinders. It takes the first-person horror foundation of RE7 and adds a fairytale gothic atmosphere that's completely unique. The House Beneviento sequence gave me the most genuine terror I've experienced in years — I'm talking heart-rate-spiking, I-had-to-put-the-controller-down fear. Lady Dimitrescu is iconic for good reason: she's threatening, theatrical, and beautifully designed. My only complaint is that the third act shifts tone too dramatically.",
    pros: ["Stunning Gothic atmosphere dripping with personality", "Each area has its own horror identity and design", "Village is gorgeous — some of the best lighting in games", "Lady Dimitrescu is one of gaming's greatest villains"],
    cons: ["Final act shifts from horror to action too abruptly", "Boss fight against Miranda feels anticlimactic"],
    recommended: true, playtimeBefore: 28.4, likes: 567, helpful: 423,
  },
  {
    user: "StargazerPro", game: "baldurs-gate-3",
    rating: 5.0, featured: false,
    title: "BG3 cancelled my social life for four months. Zero regrets.",
    reviewText: "I don't know how Larian Studios made a game this dense. 180 hours in and I'm on my fourth playthrough discovering dialogue trees, hidden quests, and character interactions I've never seen before. The level of reactivity in the world is staggering — the game remembers everything, responds to everything, judges you for everything. Playing as a Dark Urge Paladin who falls from grace is one of the most emotionally impactful gaming experiences I've ever had. This is what RPGs can be.",
    pros: ["Unmatched reactivity — the world responds to every choice", "Companion writing is exceptional across the board", "Turn-based combat rewards creative thinking", "Endless replayability across wildly different builds"],
    cons: ["Act 3 performance issues in Baldur's Gate city", "Some companion arcs feel rushed in the final act"],
    recommended: true, playtimeBefore: 180.6, likes: 923, helpful: 784,
  },
  {
    user: "StargazerPro", game: "disco-elysium",
    rating: 5.0, featured: false,
    title: "The most unique RPG ever made — nothing else comes close",
    reviewText: "Disco Elysium is a 40-hour interactive novel where your character is a detective with amnesia who might be a communist, a fascist, or an apolitical failure depending on your choices. Your skills are literal voices in your head giving conflicting advice. The writing is extraordinary — funny, tragic, politically sharp, and endlessly quotable. I went in expecting a detective game and came out having thought more deeply about capitalism, memory, and identity than I have in years.",
    pros: ["Writing that rivals the best literary fiction", "Skills-as-personality system is genuinely brilliant", "World-building is rich with history and texture", "Every political ideology gets a thoughtful, complex treatment"],
    cons: ["Very text-heavy — not for everyone", "Some skill check outcomes can feel arbitrary early on"],
    recommended: true, playtimeBefore: 28.7, likes: 734, helpful: 612,
  },
  {
    user: "VoidWalker99", game: "elden-ring",
    rating: 5.0, featured: false,
    title: "820 hours. Every ending. Every secret. Still in awe.",
    reviewText: "820 hours. I have seen every ending, found every quest, defeated every optional boss, and built every viable archetype from faith caster to strength bleed to pure dex. Elden Ring is the closest a game has come to justifying the 'masterpiece' label without qualification. The world design is FromSoftware at its absolute peak — every inch of the map has been considered with extraordinary care. Malenia took me 87 attempts. It was worth every single one.",
    pros: ["Most meticulously designed open world in gaming", "Boss roster is the most diverse and memorable in the soulslike genre", "Build variety is virtually infinite", "Multiple endings reward deep engagement with the lore"],
    cons: ["Late-game areas (Farum Azula, Haligtree) feel rushed", "Co-op implementation is still unnecessarily complex"],
    recommended: true, playtimeBefore: 820.7, likes: 2341, helpful: 1876,
  },
  {
    user: "VoidWalker99", game: "hollow-knight",
    rating: 4.9, featured: false,
    title: "Team Cherry made a Metroidvania that may never be surpassed",
    reviewText: "Hollow Knight has no right to be this good. A two-person team created a game with more content, atmosphere, and polish than most AAA studios deliver in a decade. The Forgotten Crossroads alone is more thoughtfully designed than entire games. The Pantheon of Hallownest — the final ultimate challenge — is a gauntlet of pure mastery that took me 15 hours of attempts. Clearing it remains my proudest gaming achievement. The silence before each Pantheon boss spawns is perfect tension design.",
    pros: ["Atmospheric world-building is peerless in the genre", "Combat is deceptively deep with enormous mechanical ceiling", "Godmaster DLC adds incredible endgame challenge", "Lore told entirely through environment and implication"],
    cons: ["Map system is obtuse and can frustrate newcomers", "Backtracking becomes tedious in later hours without fast travel"],
    recommended: true, playtimeBefore: 120.4, likes: 987, helpful: 834,
  },
];

// ── Community Posts ────────────────────────────────────────────────────────────

const POSTS_SEED = [
  {
    user: "ShadowHunterX", type: "text", gameTag: "Elden Ring", likes: 234, commentsCount: 28, shares: 15,
    content: "Just defeated Malenia for the first time after 47 attempts. She Who Fights and Wins? More like She Who I Finally Beat. 🗡️ My hands are literally shaking. 47 deaths, 6 different builds, one very tired me. Anyone else have this experience with a specific boss?",
  },
  {
    user: "CosmicFuryX", type: "achievement", gameTag: "Valorant", likes: 892, commentsCount: 67, shares: 43,
    content: "Finally hit Radiant rank after 1,200 hours of grinding 💎 Diamond → Radiant in a single act. The last 50 RR were the most stressful gaming sessions of my life. But we're here. If you're stuck in Gold or Plat, keep grinding — the improvement curve is real. Happy to do free coaching sessions this week. Drop your Discord below. 🙏",
    imageUrl: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sco24l.webp",
  },
  {
    user: "PixelWitch", type: "screenshot", gameTag: "Stardew Valley", likes: 567, commentsCount: 45, shares: 89,
    content: "Year 12 on my farm. I've named every chicken (Francesca, Margot, Duchess, Biscuit, and Crumble). I know every villager's full daily schedule. I have filled the museum. I have caught the Legend fish. Send help. Or don't — I'm genuinely thriving. 🌻🐓",
    imageUrl: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc1nhy.webp",
  },
  {
    user: "ThornedKnight", type: "text", gameTag: "Sekiro", likes: 345, commentsCount: 52, shares: 28,
    content: "Sekiro is the pinnacle of action game design and I will die on this hill. No builds. No cheese. No damage-sponge bosses. Just you, your blade, and the patience to unlearn every bad habit you picked up from other games. Three playthroughs in and I still feel something new every time the katana clicks. This is what 'mastery' means.",
  },
  {
    user: "StargazerPro", type: "recommendation", gameTag: "Disco Elysium", likes: 423, commentsCount: 38, shares: 72,
    content: "If you haven't played Disco Elysium: The Final Cut, you are missing what is genuinely one of the most remarkable creative achievements in games. It is a detective RPG where your skills are voices in your head. The writing is extraordinary — sharp, political, tragic, and hilarious simultaneously. I thought about it for two weeks after finishing it. Highest possible recommendation. 📚",
  },
  {
    user: "LunaGamer", type: "text", gameTag: "Zelda TOTK", likes: 789, commentsCount: 93, shares: 124,
    content: "Spent 3 hours building a flying machine in TOTK only for it to immediately flip upside down and fling me 200 meters into the ocean. No regrets whatsoever. The Ultrahand building system is genuinely magical — it shouldn't work but it absolutely does. Every cursed contraption that fails is still a story worth telling. 🛸",
  },
  {
    user: "NightmareNova", type: "clip", gameTag: "Resident Evil Village", likes: 234, commentsCount: 31, shares: 19,
    content: "Speedrun attempt going perfectly until Mother Miranda decided she wasn't finished with me 💀 New personal best though: 1:23:47. The routing for this game is still evolving and I think we can go sub 1:20 soon. Happy to share notes with other RE runners!",
    imageUrl: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scbmx4.webp",
  },
  {
    user: "VoidWalker99", type: "achievement", gameTag: "Elden Ring", likes: 1847, commentsCount: 142, shares: 267,
    content: "820+ hours. Every quest completed. Every boss defeated. All six endings witnessed. Every weapon upgraded to +25. The 100% completion of Elden Ring is finally, officially done. This game gave me everything and asked for everything back. Whatever comes next from FromSoftware — I'm ready. 🏆",
    imageUrl: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc8y4g.webp",
  },
  {
    user: "CosmicFuryX", type: "text", gameTag: "Apex Legends", likes: 1234, commentsCount: 178, shares: 89,
    content: "PSA for Apex players: please learn to fight indoors. Found perfect cover in a building during final ring and my squadmate refused to leave the hilltop 500m away — in the open — while the ring closed on them. We lost. The terrain awareness gap between Diamond and below is enormous. Learn positioning before everything else. Aim can be trained; positioning requires a mindset shift.",
  },
  {
    user: "ThornedKnight", type: "text", gameTag: "Dark Souls III", likes: 678, commentsCount: 94, shares: 45,
    content: "Hot take incoming: Nameless King is the single best boss FromSoftware has ever designed. The dragon phase teaches spacing and aerial tracking. The King of the Storm phase is a pure test of aggression and patience simultaneously. The visual design — gold armour, lightning, the wyvern — is iconic. Fight me. (I will parry you.) ⚡",
  },
  {
    user: "StargazerPro", type: "recommendation", gameTag: "Baldur's Gate 3", likes: 923, commentsCount: 87, shares: 156,
    content: "BG3 update: I'm on playthrough 4. 180 hours in. I just found a quest I've never seen before involving a merchant I walked past three times. Larian built this game with a level of depth that almost feels unfair to every other RPG. 2023 was already stacked but BG3 is in a different category entirely. Play it. Play it now. 🎲",
  },
  {
    user: "PixelWitch", type: "screenshot", gameTag: "Stardew Valley", likes: 445, commentsCount: 37, shares: 63,
    content: "The museum is complete. Every artifact. Every mineral. Every fish donated. Gunther said thank you. I said it was nothing. It was 400 hours. Worth it. 🏛️✨",
    imageUrl: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc1nhy.webp",
  },
];

// ── Comments [postIndex, username, content] ────────────────────────────────────

const COMMENTS_SEED: Array<{ postIdx: number; user: string; content: string }> = [
  { postIdx: 0, user: "PixelWitch",    content: "47 attempts is incredible patience honestly. I gave up at attempt 12 and watched a YouTube guide. No shame in it though — she's optional!" },
  { postIdx: 0, user: "ThornedKnight", content: "Malenia is designed to be felt, not just beaten. Every death teaches you something. Congratulations on experiencing the full design philosophy." },
  { postIdx: 0, user: "VoidWalker99",  content: "87 attempts for me. She's genuinely the hardest optional boss in Souls history. The Waterfowl Dance requires muscle memory that doesn't exist elsewhere." },
  { postIdx: 1, user: "ShadowHunterX", content: "Incredible grind. What agent is your main for ranked? Congrats on Radiant — top 500 is genuinely elite." },
  { postIdx: 1, user: "LunaGamer",     content: "I'm Silver and watching people hit Radiant is so inspiring omg. Gives me hope that I might one day escape Silver 👀" },
  { postIdx: 2, user: "StargazerPro",  content: "Year 12 is insane commitment. I barely made it to year 3 before starting a new farm. The upgrade itch is real." },
  { postIdx: 2, user: "CosmicFuryX",  content: "I tried Stardew once. Lost 8 hours in a single session and woke up at 4am having forgotten to eat dinner. Uninstalled immediately to protect myself." },
  { postIdx: 3, user: "VoidWalker99",  content: "280 hours in Sekiro, exactly. Every single hour justified. The L2 timing on Isshin's thrust attacks is burned into my muscle memory forever." },
  { postIdx: 3, user: "StargazerPro",  content: "The moment I beat Genichiro on the rooftop after finally internalizing deflection... I understood exactly what you mean. Nothing else feels like that." },
  { postIdx: 5, user: "VoidWalker99",  content: "The physics engine in TOTK is so good it loops back around to being chaotic art. Your failed contraptions have more character than most games' successes." },
  { postIdx: 5, user: "PixelWitch",    content: "Flying machines in TOTK are like jazz improvisation — you know roughly what you're aiming for but the execution is always a delightful surprise." },
  { postIdx: 7, user: "ShadowHunterX", content: "820 hours is absolutely legendary. I felt pride at 210h. You are on a different plane of existence entirely." },
  { postIdx: 7, user: "ThornedKnight", content: "The dedication. The commitment. The controlled madness. All of it respected and admired from afar." },
  { postIdx: 7, user: "CosmicFuryX",  content: "Okay this actually makes my 1,200 hours in Valorant look completely reasonable and balanced. Well played, sir." },
  { postIdx: 9, user: "VoidWalker99",  content: "Nameless King is exceptional but Elden Ring's Malenia pushed the design philosophy further. Both deserve the top tier conversation." },
  { postIdx: 9, user: "ShadowHunterX", content: "Agreed completely. The two-phase design synergy of Nameless King is unmatched — the wyvern teaches you for the fight you're about to have." },
  { postIdx: 9, user: "NightmareNova", content: "The atmosphere of the Nameless King fight — the storm, the music, the arena — is FromSoftware at their absolute cinematic best." },
];

// ── Notifications [username, type, title, message, avatarInitials, avatarColor] ─

const NOTIFICATIONS_SEED = [
  { user: "ShadowHunterX", type: "achievement", read: false, avatarInitials: "SH", avatarColor: "#8B0000",
    title: "Achievement Unlocked: Spartan Pride", message: "You eliminated 1,000 enemies in God of War: Ragnarök. Keep fighting, Spartan." },
  { user: "ShadowHunterX", type: "review_helpful", read: false, avatarInitials: "GA", avatarColor: "#DC2626",
    title: "Your review is blowing up!", message: "847 players found your God of War: Ragnarök review helpful this week. Top reviewer status achieved." },
  { user: "ShadowHunterX", type: "new_follower", read: true, avatarInitials: "CF", avatarColor: "#0047AB",
    title: "CosmicFuryX started following you", message: "You've gained a new follower! Check out their profile." },
  { user: "ShadowHunterX", type: "review_like", read: true, avatarInitials: "TK", avatarColor: "#8B4513",
    title: "ThornedKnight liked your Elden Ring review", message: '"FromSoftware\'s magnum opus" received 1,203 likes total. It\'s your most popular review!' },
  { user: "ShadowHunterX", type: "game_update", read: false, avatarInitials: "GA", avatarColor: "#DC2626",
    title: "New: Hades II Early Access", message: "Hades II has entered Early Access! Based on your 45 hours in Hades, we think you'll love it." },
  { user: "NightmareNova", type: "achievement", read: false, avatarInitials: "NN", avatarColor: "#4B0082",
    title: "Achievement Unlocked: A Masterwork", message: "You fully upgraded a weapon in Resident Evil Village. The Duke is impressed." },
  { user: "NightmareNova", type: "review_helpful", read: true, avatarInitials: "GA", avatarColor: "#DC2626",
    title: "Your RE Village review is trending", message: "567 players found your Resident Evil Village review helpful. Lady Dimitrescu approves." },
  { user: "PixelWitch", type: "achievement", read: false, avatarInitials: "PW", avatarColor: "#2D8653",
    title: "Achievement Unlocked: Legend of the Farm", message: "You caught the Legendary Fish in Stardew Valley. Even Willy is speechless." },
  { user: "PixelWitch", type: "milestone", read: false, avatarInitials: "GA", avatarColor: "#DC2626",
    title: "400 Hours in Stardew Valley!", message: "You've officially spent 400 hours in Stardew Valley. Your farm is a masterpiece. 🌻" },
  { user: "CosmicFuryX", type: "achievement", read: false, avatarInitials: "CF", avatarColor: "#0047AB",
    title: "Achievement Unlocked: Radiant Born", message: "You've reached Radiant rank in Valorant. You are in the top 500 players. Legendary." },
  { user: "ThornedKnight", type: "achievement", read: false, avatarInitials: "TK", avatarColor: "#8B4513",
    title: "Achievement Unlocked: Return", message: "You completed Sekiro's true ending. The Sculptor is proud. 280 hours well spent." },
  { user: "VoidWalker99", type: "milestone", read: false, avatarInitials: "GA", avatarColor: "#DC2626",
    title: "800 Hours in Elden Ring!", message: "You have dedicated 800 hours to the Lands Between. You are a true Elden Lord." },
  { user: "VoidWalker99", type: "achievement", read: false, avatarInitials: "VW", avatarColor: "#212121",
    title: "Achievement Unlocked: Absolute Power", message: "Baldur's Gate 3 completed on Tactician difficulty. A feat only 1.8% of players have achieved." },
  { user: "StargazerPro", type: "review_like", read: false, avatarInitials: "PW", avatarColor: "#2D8653",
    title: "PixelWitch liked your BG3 review", message: "Your Baldur's Gate 3 review has 923 total likes. Top Reviewer badge incoming!" },
  { user: "LunaGamer", type: "achievement", read: false, avatarInitials: "LG", avatarColor: "#C71585",
    title: "Achievement Unlocked: By Strength of Spirit", message: "You defeated the Demon King in Tears of the Kingdom. Hyrule is saved. For now." },
];

// ── User Preferences ──────────────────────────────────────────────────────────

const PREFERENCES_SEED = [
  { user: "ShadowHunterX", favoriteGenres: ["Action RPG", "Action Adventure", "Roguelike"], playStyle: "hardcore" },
  { user: "NightmareNova",  favoriteGenres: ["Survival Horror", "Action Adventure", "FPS"],  playStyle: "competitive" },
  { user: "PixelWitch",     favoriteGenres: ["Simulation", "Roguelike", "Platformer", "RPG"],playStyle: "casual" },
  { user: "CosmicFuryX",   favoriteGenres: ["FPS", "Battle Royale", "Racing"],              playStyle: "competitive" },
  { user: "LunaGamer",     favoriteGenres: ["Action Adventure", "Simulation", "Party"],     playStyle: "casual" },
  { user: "ThornedKnight", favoriteGenres: ["Action RPG", "Action", "Metroidvania"],        playStyle: "hardcore" },
  { user: "StargazerPro",  favoriteGenres: ["RPG", "Action RPG", "Action Adventure"],       playStyle: "story" },
  { user: "VoidWalker99",  favoriteGenres: ["Action RPG", "Roguelike", "Metroidvania"],     playStyle: "completionist" },
];

// ── Gamer DNA ──────────────────────────────────────────────────────────────────

const DNA_SEED = [
  {
    user: "ShadowHunterX", archetype: "Story Explorer", topGenre: "Action RPG", rarity: "Rare",
    description: "You live for narratives that challenge your assumptions. Combat is the canvas, but story is the masterpiece.",
    genreAffinityJson: JSON.stringify({ "Action RPG": 92, "Action Adventure": 74, "Roguelike": 58, "Metroidvania": 45 }),
  },
  {
    user: "NightmareNova", archetype: "Competitive Grinder", topGenre: "Survival Horror", rarity: "Legendary",
    description: "You don't just play games — you master them. Speedruns, high scores, optimal routes. You push every system to its limit.",
    genreAffinityJson: JSON.stringify({ "Survival Horror": 97, "FPS": 71, "Action Adventure": 63 }),
  },
  {
    user: "PixelWitch", archetype: "Indie Hunter", topGenre: "Simulation", rarity: "Rare",
    description: "You find the diamonds where others walk past. Indie games are your territory — handcrafted, sincere, and alive.",
    genreAffinityJson: JSON.stringify({ "Simulation": 95, "Roguelike": 78, "Platformer": 71, "RPG": 60 }),
  },
  {
    user: "CosmicFuryX", archetype: "Competitive Grinder", topGenre: "FPS", rarity: "Legendary",
    description: "Rank is everything. The climb is the game. You exist in the space between Diamond and Radiant, grinding until the gap closes.",
    genreAffinityJson: JSON.stringify({ "FPS": 99, "Battle Royale": 84, "Racing": 52 }),
  },
  {
    user: "LunaGamer", archetype: "Casual Arcade Player", topGenre: "Action Adventure", rarity: "Common",
    description: "Gaming is joy and relaxation. You play what feels good, explore freely, and never let a difficulty setting ruin your evening.",
    genreAffinityJson: JSON.stringify({ "Action Adventure": 78, "Simulation": 71, "Party": 65 }),
  },
  {
    user: "ThornedKnight", archetype: "Achievement Addict", topGenre: "Action RPG", rarity: "Epic",
    description: "Every death is a lesson. Every boss is a puzzle. You don't quit until the credits roll and the platinum pops.",
    genreAffinityJson: JSON.stringify({ "Action RPG": 98, "Action": 91, "Metroidvania": 72, "Roguelike": 68 }),
  },
  {
    user: "StargazerPro", archetype: "Story Explorer", topGenre: "RPG", rarity: "Rare",
    description: "For you, the destination matters more than the journey. Every dialogue choice, every companion bond, every emotional beat is where the real game lives.",
    genreAffinityJson: JSON.stringify({ "RPG": 94, "Action RPG": 80, "Action Adventure": 67 }),
  },
  {
    user: "VoidWalker99", archetype: "Completionist", topGenre: "Action RPG", rarity: "Epic",
    description: "100% or nothing. You cannot leave a game unfinished. The hidden achievements, the obscure trophies, the missable collectibles — they call to you.",
    genreAffinityJson: JSON.stringify({ "Action RPG": 99, "Roguelike": 88, "Metroidvania": 85, "Platformer": 72, "RPG": 69 }),
  },
];

// ── Seed Function ─────────────────────────────────────────────────────────────

async function seed() {
  logger.info("═══════════════════════════════════════");
  logger.info("  GameAtlas Comprehensive Seed Starting");
  logger.info("═══════════════════════════════════════");

  // ── 1. Games ──────────────────────────────────────────────────────────────
  logger.info("Seeding 25 games...");
  const insertedGames = await db.insert(gamesTable).values(GAMES_SEED)
    .onConflictDoNothing().returning({ id: gamesTable.id, slug: gamesTable.slug });

  const gameMap = new Map(insertedGames.map(g => [g.slug, g.id]));
  const allGames = await db.select({ id: gamesTable.id, slug: gamesTable.slug }).from(gamesTable);
  allGames.forEach(g => { if (!gameMap.has(g.slug)) gameMap.set(g.slug, g.id); });
  logger.info(`Games in database: ${gameMap.size}`);

  // ── 2. Achievements ───────────────────────────────────────────────────────
  logger.info("Seeding achievements...");
  const achValues = ACHIEVEMENTS_SEED.map(a => {
    const gameId = gameMap.get(a.gameSlug);
    if (!gameId) { logger.warn(`No game found for slug: ${a.gameSlug}`); return null; }
    return { gameId, title: a.title, description: a.description, rarity: a.rarity, rarityPercent: a.rarityPercent, xpReward: a.xpReward };
  }).filter((a): a is NonNullable<typeof a> => a !== null);

  await db.insert(achievementsTable).values(achValues).onConflictDoNothing();

  // Build achievementMap: "gameId-title" → achievementId
  const allAchs = await db.select({ id: achievementsTable.id, gameId: achievementsTable.gameId, title: achievementsTable.title }).from(achievementsTable);
  const achMap = new Map(allAchs.map(a => [`${a.gameId}-${a.title}`, a.id]));
  logger.info(`Achievements in database: ${allAchs.length}`);

  // ── 3. Users ─────────────────────────────────────────────────────────────
  logger.info("Seeding 8 users...");
  const password = await bcrypt.hash("demo1234", 12);
  const userInserts = USERS_SEED.map(u => ({ ...u, passwordHash: password }));
  const insertedUsers = await db.insert(usersTable).values(userInserts)
    .onConflictDoNothing().returning({ id: usersTable.id, username: usersTable.username });

  const userMap = new Map(insertedUsers.map(u => [u.username, u.id]));
  const allUsers = await db.select({ id: usersTable.id, username: usersTable.username }).from(usersTable);
  allUsers.forEach(u => { if (!userMap.has(u.username)) userMap.set(u.username, u.id); });
  logger.info(`Users in database: ${userMap.size}`);

  // ── 4. User Preferences ──────────────────────────────────────────────────
  logger.info("Seeding user preferences...");
  const prefValues = PREFERENCES_SEED.map(p => {
    const userId = userMap.get(p.user);
    if (!userId) return null;
    return { userId, onboardingCompleted: true, favoriteGenres: p.favoriteGenres, playStyle: p.playStyle };
  }).filter((p): p is NonNullable<typeof p> => p !== null);
  await db.insert(userPreferencesTable).values(prefValues).onConflictDoNothing();

  // ── 5. Library Entries ───────────────────────────────────────────────────
  logger.info("Seeding library entries...");
  const libValues = LIBRARY_SEED.map(l => {
    const userId = userMap.get(l.user);
    const gameId = gameMap.get(l.game);
    if (!userId || !gameId) return null;
    const lastPlayed = l.playtime > 0 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null;
    return { userId, gameId, playtime: l.playtime, status: l.status, favorite: l.favorite, lastPlayed };
  }).filter((l): l is NonNullable<typeof l> => l !== null);
  await db.insert(userGameLibraryTable).values(libValues).onConflictDoNothing();
  logger.info(`Library entries seeded: ${libValues.length}`);

  // ── 6. User Achievements ─────────────────────────────────────────────────
  logger.info("Seeding user achievement unlocks...");
  const uaValues = USER_ACHIEVEMENTS_SEED.map(ua => {
    const userId = userMap.get(ua.user);
    const gameId = gameMap.get(ua.gameSlug);
    if (!userId || !gameId) return null;
    const achId = achMap.get(`${gameId}-${ua.achTitle}`);
    if (!achId) { logger.warn(`Achievement not found: "${ua.achTitle}" for ${ua.gameSlug}`); return null; }
    const unlockedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    return { userId, achievementId: achId, unlockedAt };
  }).filter((ua): ua is NonNullable<typeof ua> => ua !== null);
  await db.insert(userAchievementsTable).values(uaValues).onConflictDoNothing();
  logger.info(`User achievement unlocks seeded: ${uaValues.length}`);

  // ── 7. Reviews ───────────────────────────────────────────────────────────
  logger.info("Seeding reviews...");
  const revValues = REVIEWS_SEED.map(r => {
    const userId = userMap.get(r.user);
    const gameId = gameMap.get(r.game);
    if (!userId || !gameId) return null;
    return {
      userId, gameId, rating: r.rating, title: r.title, reviewText: r.reviewText,
      pros: r.pros, cons: r.cons, recommended: r.recommended, playtimeBefore: r.playtimeBefore,
      likes: r.likes, helpful: r.helpful, featured: r.featured,
    };
  }).filter((r): r is NonNullable<typeof r> => r !== null);
  await db.insert(reviewsTable).values(revValues).onConflictDoNothing();
  logger.info(`Reviews seeded: ${revValues.length}`);

  // ── 8. Community Posts ───────────────────────────────────────────────────
  logger.info("Seeding community posts...");
  const postValues = POSTS_SEED.map(p => {
    const userId = userMap.get(p.user);
    if (!userId) return null;
    return { userId, type: p.type, content: p.content, imageUrl: p.imageUrl ?? null, gameTag: p.gameTag ?? null, likes: p.likes, commentsCount: p.commentsCount, shares: p.shares };
  }).filter((p): p is NonNullable<typeof p> => p !== null);
  const insertedPosts = await db.insert(postsTable).values(postValues).returning({ id: postsTable.id });
  logger.info(`Posts seeded: ${insertedPosts.length}`);

  // ── 9. Comments ──────────────────────────────────────────────────────────
  logger.info("Seeding comments...");
  const commentValues = COMMENTS_SEED.map(c => {
    const userId = userMap.get(c.user);
    const post = insertedPosts[c.postIdx];
    if (!userId || !post) return null;
    return { userId, postId: post.id, content: c.content };
  }).filter((c): c is NonNullable<typeof c> => c !== null);
  if (commentValues.length > 0) {
    await db.insert(commentsTable).values(commentValues);
  }
  logger.info(`Comments seeded: ${commentValues.length}`);

  // ── 10. Notifications ────────────────────────────────────────────────────
  logger.info("Seeding notifications...");
  const notifValues = NOTIFICATIONS_SEED.map(n => {
    const userId = userMap.get(n.user);
    if (!userId) return null;
    return { userId, type: n.type, title: n.title, message: n.message, read: n.read, avatarInitials: n.avatarInitials, avatarColor: n.avatarColor };
  }).filter((n): n is NonNullable<typeof n> => n !== null);
  await db.insert(notificationsTable).values(notifValues).onConflictDoNothing();
  logger.info(`Notifications seeded: ${notifValues.length}`);

  // ── 11. Gamer DNA ─────────────────────────────────────────────────────────
  logger.info("Seeding Gamer DNA profiles...");
  const dnaValues = DNA_SEED.map(d => {
    const userId = userMap.get(d.user);
    if (!userId) return null;
    return { userId, archetype: d.archetype, topGenre: d.topGenre, rarity: d.rarity, description: d.description, genreAffinityJson: d.genreAffinityJson };
  }).filter((d): d is NonNullable<typeof d> => d !== null);
  await db.insert(gamerDNATable).values(dnaValues).onConflictDoNothing();

  logger.info("═══════════════════════════════════════");
  logger.info("  Seed Complete! Summary:");
  logger.info(`  Games: ${gameMap.size}`);
  logger.info(`  Achievements: ${allAchs.length} definitions, ${uaValues.length} unlocked`);
  logger.info(`  Users: ${userMap.size} (password: demo1234)`);
  logger.info(`  Library entries: ${libValues.length}`);
  logger.info(`  Reviews: ${revValues.length}`);
  logger.info(`  Posts: ${insertedPosts.length}, Comments: ${commentValues.length}`);
  logger.info(`  Notifications: ${notifValues.length}`);
  logger.info("═══════════════════════════════════════");
}

seed().catch(err => {
  logger.error(err, "Seed failed");
  process.exit(1);
});
