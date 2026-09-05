export const player = {
  name: "Caalaa Bultum",
  initials: "CB",
  level: 5,
  xp: 1302,
  nextLevelXp: 1800,
  streak: 12,
  puzzlesCompleted: 47,
  badges: 9,
  rank: 7,
  region: "Bishoftu",
};

export const octbSourceUrl = "https://www.oromiatourism.gov.et/";

export const featuredQuest = {
  progress: 68,
};

export const moduleIds = ["vocabulary", "tourism", "heritage"] as const;

export const moduleLinks = {
  vocabulary: "/quests",
  tourism: "/map",
  heritage: "/heritage",
} as const;

export const progressTracks = [
  { id: "vocabulary", done: 3, total: 4, link: "/quests" },
  { id: "tourism", done: 2, total: 6, link: "/map" },
  { id: "heritage", done: 4, total: 6, link: "/heritage" },
] as const;

export const progressBadges = [
  { id: "Word Builder", earned: true },
  { id: "Odaa Explorer", earned: true },
  { id: "Lake Walker", earned: true },
  { id: "Trail Scout", earned: true },
  { id: "Storyteller", earned: true },
  { id: "Bale Ranger", earned: true },
  { id: "Irreechaa Guide", earned: true },
  { id: "Odaa Keeper", earned: true },
  { id: "Buna Master", earned: true },
  { id: "Abbaa Gadaa", earned: false },
] as const;

export const puzzles = [
  { id: "welcome", answer: "BAGA NAGAAN DHUFTAN", scrambled: ["NAGAAN", "BAGA", "DHUFTAN"], xp: 40 },
  { id: "thankyou", answer: "GALATOOMAA", scrambled: ["TOO", "GA", "MAA", "LA"], xp: 25 },
  { id: "finfinnee", answer: "FINFINNEE", scrambled: ["FINF", "INN", "EE"], xp: 30 },
  { id: "chafe", answer: "CHAFE", scrambled: ["FE", "CHA"], xp: 25 },
];

export const trivia = [
  { answer: 1 },
  { answer: 0 },
  { answer: 0 },
  { answer: 1 },
  { answer: 0 },
  { answer: 0 },
  { answer: 0 },
  { answer: 0 },
  { answer: 0 },
];

export const FACT_CHECK_XP = 10;

export const factChecks = [
  { id: "gada8", truth: true },
  { id: "unesco", truth: true },
  { id: "sofPalace", truth: false },
  { id: "nyala", truth: true },
  { id: "yayo", truth: true },
  { id: "melkaMall", truth: false },
  { id: "jimma", truth: true },
  { id: "capital", truth: false },
] as const;

export const destinations = [
  { id: "sof-omar", x: 72, y: 68, answer: 0, xp: 60 },
  { id: "bale", x: 66, y: 78, answer: 1, xp: 55 },
  { id: "wenchi", x: 38, y: 42, answer: 1, xp: 45 },
  { id: "melka-kunture", x: 48, y: 36, answer: 0, xp: 50 },
  { id: "abba-jifar", x: 26, y: 58, answer: 0, xp: 45 },
  { id: "babile", x: 86, y: 40, answer: 0, xp: 50 },
];

export const heritageChapterIds = ["gadaa", "sadeetta", "odaa", "irreechaa", "safuu", "craft"] as const;

export const regionIds = ["all", "Finfinnee", "Bishoftu", "Adama", "Jimma"] as const;

export const leaderboard = [
  { rank: 1, name: "Hawi Tolera", region: "Finfinnee", xp: 4820, level: 12, badge: "Abbaa Gadaa" },
  { rank: 2, name: "Lensa Gemechu", region: "Adama", xp: 4415, level: 11, badge: "Odaa Keeper" },
  { rank: 3, name: "Boona Dhaba", region: "Jimma", xp: 4102, level: 11, badge: "Buna Master" },
  { rank: 4, name: "Meti Abdi", region: "Finfinnee", xp: 3870, level: 10, badge: "Irreechaa Guide" },
  { rank: 5, name: "Gadisa Ifa", region: "Bishoftu", xp: 3540, level: 10, badge: "Lake Walker" },
  { rank: 6, name: "Sifan Roba", region: "Adama", xp: 3320, level: 9, badge: "Bale Ranger" },
  { rank: 7, name: "Caalaa Bultum", region: "Bishoftu", xp: 1302, level: 5, badge: "Odaa Explorer" },
  { rank: 8, name: "Ayantu Kebede", region: "Jimma", xp: 1240, level: 5, badge: "Word Builder" },
  { rank: 9, name: "Tolasa Nagawo", region: "Finfinnee", xp: 1180, level: 4, badge: "Storyteller" },
  { rank: 10, name: "Kena Wako", region: "Bishoftu", xp: 1105, level: 4, badge: "Trail Scout" },
];

export const rewards = [
  { id: "irreechaa-badge", cost: 600 },
  { id: "kuriftu-pass", cost: 2400 },
  { id: "certificate", cost: 1500 },
  { id: "bale-trek", cost: 5200 },
  { id: "odaa-badge", cost: 850 },
  { id: "sof-omar-pass", cost: 1900 },
];
