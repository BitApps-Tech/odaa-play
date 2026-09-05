import { hashSeed, seededShuffle } from "@/lib/site-games";

export const WORD_SEARCH_SIZE = 10;
export const WORD_SEARCH_XP = 50;
export const WORD_SEARCH_LETTERS = "ABCDEFGHIJKLMNOQRSTUWXY";

export const WORD_SEARCH_WORDS = [
  "NAGAA",
  "ODAA",
  "GADAA",
  "BUNA",
  "AFAAN",
  "CHAFE",
  "BALE",
  "DHUGAA",
] as const;

export type WordCell = { r: number; c: number };

export type PlacedWord = {
  word: string;
  cells: WordCell[];
};

const DIRS = [
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: -1, dc: 1 },
  { dr: 0, dc: -1 },
  { dr: -1, dc: 0 },
  { dr: -1, dc: -1 },
  { dr: 1, dc: -1 },
] as const;

function rng(seed: string) {
  let h = hashSeed(seed);
  return () => {
    h = Math.imul(h, 1664525) + 1013904223;
    return (h >>> 0) / 4294967296;
  };
}

export function lineCells(start: WordCell, end: WordCell): WordCell[] | null {
  const dr = end.r - start.r;
  const dc = end.c - start.c;
  if (dr === 0 && dc === 0) return [start];
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  const sr = Math.sign(dr);
  const sc = Math.sign(dc);
  const cells: WordCell[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({ r: start.r + sr * i, c: start.c + sc * i });
  }
  return cells;
}

export function cellsKey(cells: WordCell[]) {
  return cells.map((cell) => `${cell.r},${cell.c}`).join(">");
}

function canPlace(grid: (string | null)[][], word: string, r: number, c: number, dr: number, dc: number) {
  for (let i = 0; i < word.length; i++) {
    const rr = r + dr * i;
    const cc = c + dc * i;
    if (rr < 0 || cc < 0 || rr >= WORD_SEARCH_SIZE || cc >= WORD_SEARCH_SIZE) return false;
    const existing = grid[rr]?.[cc];
    const letter = word[i];
    if (existing && existing !== letter) return false;
  }
  return true;
}

function placeWord(grid: (string | null)[][], word: string, r: number, c: number, dr: number, dc: number) {
  const cells: WordCell[] = [];
  for (let i = 0; i < word.length; i++) {
    const rr = r + dr * i;
    const cc = c + dc * i;
    const row = grid[rr];
    const letter = word[i];
    if (!row || !letter) continue;
    row[cc] = letter;
    cells.push({ r: rr, c: cc });
  }
  return cells;
}

export function makeWordSearch(seed = "afaan-search") {
  const next = rng(seed);
  const grid: (string | null)[][] = Array.from({ length: WORD_SEARCH_SIZE }, () =>
    Array.from({ length: WORD_SEARCH_SIZE }, () => null),
  );
  const words = seededShuffle([...WORD_SEARCH_WORDS], seed).sort((a, b) => b.length - a.length);
  const placed: PlacedWord[] = [];

  for (const word of words) {
    const dirs = seededShuffle([...DIRS], `${seed}-${word}`);
    let done = false;
    for (let attempt = 0; attempt < 80 && !done; attempt++) {
      const dir = dirs[attempt % dirs.length];
      if (!dir) continue;
      const r = Math.floor(next() * WORD_SEARCH_SIZE);
      const c = Math.floor(next() * WORD_SEARCH_SIZE);
      if (!canPlace(grid, word, r, c, dir.dr, dir.dc)) continue;
      placed.push({ word, cells: placeWord(grid, word, r, c, dir.dr, dir.dc) });
      done = true;
    }
  }

  const letters = Array.from({ length: WORD_SEARCH_SIZE }, (_, r) =>
    Array.from({ length: WORD_SEARCH_SIZE }, (_, c) => {
      const filled = grid[r]?.[c];
      if (filled) return filled;
      return WORD_SEARCH_LETTERS[Math.floor(next() * WORD_SEARCH_LETTERS.length)] ?? "A";
    }),
  );

  return { letters, placed };
}
