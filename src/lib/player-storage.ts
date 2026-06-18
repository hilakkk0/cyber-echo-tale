import { getChapter } from "@/lib/story";

export interface PlayerSave {
  chapterId: number;
  sceneId: string;
  unlocked: number[];
  hp: number;
  timeLeft: number;
  stepCount: number;
}

export interface PlayerRecord {
  id: string;
  displayName: string;
  lastPlayed: number;
}

const LS_ACTIVE = "cyoa-active-player";
const LS_PLAYERS = "cyoa-players";

function saveKey(id: string) {
  return `cyoa-save:${id}`;
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function normalizePlayerId(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isValidPlayerName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 24 && /^[\p{L}\p{N} _-]+$/u.test(trimmed);
}

export function getActivePlayer(): PlayerRecord | null {
  return loadJSON<PlayerRecord | null>(LS_ACTIVE, null);
}

export function setActivePlayer(record: PlayerRecord): void {
  try {
    localStorage.setItem(LS_ACTIVE, JSON.stringify(record));
  } catch (e) {
    console.error("Failed to set active player in localStorage:", e);
  }
}

export function clearActivePlayer(): void {
  try {
    localStorage.removeItem(LS_ACTIVE);
  } catch (e) {
    console.error("Failed to clear active player from localStorage:", e);
  }
}

export function getKnownPlayers(): PlayerRecord[] {
  return loadJSON<PlayerRecord[]>(LS_PLAYERS, []).sort((a, b) => b.lastPlayed - a.lastPlayed);
}

export function registerPlayer(displayName: string): PlayerRecord {
  const id = normalizePlayerId(displayName);
  const now = Date.now();
  const record: PlayerRecord = { id, displayName: displayName.trim(), lastPlayed: now };

  const players = getKnownPlayers().filter((p) => p.id !== id);
  players.unshift(record);
  try {
    localStorage.setItem(LS_PLAYERS, JSON.stringify(players.slice(0, 12)));
  } catch (e) {
    console.error("Failed to save players list in localStorage:", e);
  }
  setActivePlayer(record);

  return record;
}

export function touchPlayer(id: string): void {
  const players = getKnownPlayers();
  const idx = players.findIndex((p) => p.id === id);
  if (idx === -1) return;
  players[idx] = { ...players[idx], lastPlayed: Date.now() };
  try {
    localStorage.setItem(LS_PLAYERS, JSON.stringify(players));
  } catch (e) {
    console.error("Failed to touch player in localStorage:", e);
  }
}

export function deletePlayer(id: string): void {
  const players = getKnownPlayers().filter((p) => p.id !== id);
  try {
    localStorage.setItem(LS_PLAYERS, JSON.stringify(players));
    localStorage.removeItem(saveKey(id));
  } catch (e) {
    console.error("Failed to delete player from localStorage:", e);
  }

  const active = getActivePlayer();
  if (active && active.id === id) {
    clearActivePlayer();
  }
}


export function defaultSave(chapterId = 1): PlayerSave {
  const chapter = getChapter(chapterId);
  return {
    chapterId,
    sceneId: chapter.startId,
    unlocked: [1],
    hp: chapter.maxHp ?? 100,
    timeLeft: chapter.timerSeconds ?? 0,
    stepCount: 1,
  };
}

export function loadPlayerSave(id: string): PlayerSave {
  const saved = loadJSON<Partial<PlayerSave> | null>(saveKey(id), null);
  if (!saved) return defaultSave();

  const chapterId = Number(saved.chapterId) || 1;
  const chapter = getChapter(chapterId);
  const sceneId =
    saved.sceneId && chapter.scenes[saved.sceneId] ? saved.sceneId : chapter.startId;

  return {
    chapterId,
    sceneId,
    unlocked: Array.isArray(saved.unlocked) && saved.unlocked.includes(1) ? saved.unlocked : [1],
    hp: typeof saved.hp === "number" ? saved.hp : (chapter.maxHp ?? 100),
    timeLeft: typeof saved.timeLeft === "number" ? saved.timeLeft : (chapter.timerSeconds ?? 0),
    stepCount: typeof saved.stepCount === "number" ? saved.stepCount : 1,
  };
}

export function savePlayerSave(id: string, save: PlayerSave): void {
  try {
    localStorage.setItem(saveKey(id), JSON.stringify(save));
  } catch (e) {
    console.error("Failed to save player progress in localStorage:", e);
  }
}
