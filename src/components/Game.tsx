import { useEffect, useMemo, useRef, useState } from "react";
import { chapters, getChapter } from "@/lib/story";
import { Zap, RotateCcw, Sparkles, Timer, Heart, ChevronRight, Skull } from "lucide-react";

const LS_CHAPTER = "cyoa-current-chapter";
const LS_UNLOCKED = "cyoa-unlocked-chapters";
const LS_SCENE = (id: number) => `cyoa-scene-${id}`;

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function Game() {
  const [chapterId, setChapterId] = useState<number>(1);
  const [sceneId, setSceneId] = useState<string>("START");
  const [unlocked, setUnlocked] = useState<number[]>([1]);
  const [hp, setHp] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [visible, setVisible] = useState(true);
  const [stepCount, setStepCount] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  const chapter = useMemo(() => getChapter(chapterId), [chapterId]);
  const scene = chapter.scenes[sceneId] ?? chapter.scenes[chapter.startId];

  // Hydrate from localStorage once
  useEffect(() => {
    const ch = Number(localStorage.getItem(LS_CHAPTER) || "1") || 1;
    const u = loadJSON<number[]>(LS_UNLOCKED, [1]);
    const c = getChapter(ch);
    const s = localStorage.getItem(LS_SCENE(ch)) || c.startId;
    setChapterId(ch);
    setUnlocked(u.includes(1) ? u : [...u, 1]);
    setSceneId(c.scenes[s] ? s : c.startId);
    if (c.mechanic === "timer") setTimeLeft(c.timerSeconds ?? 60);
    if (c.mechanic === "hp") setHp(c.maxHp ?? 100);
    setHydrated(true);
  }, []);

  // Persist scene + chapter
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_CHAPTER, String(chapterId));
    localStorage.setItem(LS_SCENE(chapterId), sceneId);
    localStorage.setItem(LS_UNLOCKED, JSON.stringify(unlocked));
  }, [chapterId, sceneId, unlocked, hydrated]);

  // Timer mechanic
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (!hydrated) return;
    if (chapter.mechanic !== "timer") return;
    if (scene.isEnding) return;
    if (timeLeft <= 0) return;
    tickRef.current = setInterval(() => {
      setTimeLeft((v) => Math.max(0, v - 1));
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [chapter, scene.isEnding, hydrated, timeLeft > 0]);

  // Timer fail
  useEffect(() => {
    if (!hydrated) return;
    if (chapter.mechanic !== "timer") return;
    if (scene.isEnding) return;
    if (timeLeft === 0) {
      transitionTo(chapter.failSceneId);
    }
  }, [timeLeft, hydrated]);

  const transitionTo = (next: string) => {
    setVisible(false);
    setTimeout(() => {
      setSceneId(next);
      setStepCount((c) => c + 1);
      setVisible(true);
    }, 280);
  };

  const handleChoice = (next: string, damage?: number) => {
    if (chapter.mechanic === "hp" && damage) {
      const newHp = Math.max(0, hp - damage);
      setHp(newHp);
      if (newHp <= 0) {
        transitionTo(chapter.failSceneId);
        return;
      }
    }
    transitionTo(next);
  };

  const restartChapter = () => {
    setVisible(false);
    setTimeout(() => {
      setSceneId(chapter.startId);
      setStepCount(1);
      if (chapter.mechanic === "timer") setTimeLeft(chapter.timerSeconds ?? 60);
      if (chapter.mechanic === "hp") setHp(chapter.maxHp ?? 100);
      setVisible(true);
    }, 280);
  };

  const loadChapter = (id: number) => {
    const c = getChapter(id);
    setChapterId(id);
    setSceneId(c.startId);
    setStepCount(1);
    setVisible(true);
    if (c.mechanic === "timer") setTimeLeft(c.timerSeconds ?? 60);
    if (c.mechanic === "hp") setHp(c.maxHp ?? 100);
    setUnlocked((u) => (u.includes(id) ? u : [...u, id]));
  };

  const nextChapter = chapters.find((c) => c.id === chapterId + 1);
  const isWin = scene.isEnding && scene.endingTone === "good";
  const isLose = scene.isEnding && scene.endingTone === "bad";

  // Unlock next chapter on win
  useEffect(() => {
    if (!hydrated) return;
    if (isWin && nextChapter && !unlocked.includes(nextChapter.id)) {
      setUnlocked((u) => [...u, nextChapter.id]);
    }
  }, [isWin, nextChapter, unlocked, hydrated]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerPct = chapter.timerSeconds ? (timeLeft / chapter.timerSeconds) * 100 : 0;
  const hpPct = chapter.maxHp ? (hp / chapter.maxHp) * 100 : 0;
  const timerCritical = chapter.mechanic === "timer" && timeLeft <= 15;
  const hpCritical = chapter.mechanic === "hp" && hpPct <= 30;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md bg-background/40 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="relative w-11 h-11 rounded-lg border border-neon-cyan/40 flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, oklch(0.78 0.14 60 / 0.18), oklch(0.62 0.16 35 / 0.15))",
                boxShadow: "inset 0 0 12px oklch(0.78 0.14 60 / 0.2), 0 0 18px oklch(0.78 0.14 60 / 0.2)",
              }}
            >
              <Zap
                className="w-5 h-5 text-neon-cyan"
                style={{ filter: "drop-shadow(0 0 6px var(--neon-cyan))" }}
              />
              <span
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-magenta animate-pulse"
                style={{ boxShadow: "0 0 8px var(--neon-magenta)" }}
              />
            </div>
            <div className="min-w-0">
              <h1
                className="text-lg md:text-xl font-bold tracking-[0.22em] bg-clip-text text-transparent leading-none"
                style={{ backgroundImage: "var(--gradient-neon)" }}
              >
                SYNAPSE//08
              </h1>
              <p className="mt-1.5 text-[10px] md:text-[11px] text-muted-foreground tracking-[0.28em] uppercase truncate">
                Bölüm {chapter.id} · {chapter.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Chapter dots */}
            <div className="hidden sm:flex items-center gap-1.5">
              {chapters.map((c) => {
                const isCurrent = c.id === chapterId;
                const isUnlocked = unlocked.includes(c.id);
                return (
                  <button
                    key={c.id}
                    disabled={!isUnlocked}
                    onClick={() => loadChapter(c.id)}
                    title={isUnlocked ? `Bölüm ${c.id} — ${c.title}` : "Kilitli"}
                    className={`group flex flex-col items-center gap-1 ${
                      isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-40"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-md border flex items-center justify-center text-[10px] font-mono transition-all ${
                        isCurrent
                          ? "border-neon-cyan/80 text-neon-cyan"
                          : "border-border/60 text-muted-foreground group-hover:text-foreground"
                      }`}
                      style={
                        isCurrent
                          ? { boxShadow: "var(--shadow-neon-cyan)" }
                          : undefined
                      }
                    >
                      {c.id}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={restartChapter}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/60 text-xs text-muted-foreground hover:text-foreground hover:border-neon-cyan/60 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Yeniden Başla</span>
            </button>
          </div>
        </div>

        {/* Mechanic bar */}
        {chapter.mechanic !== "none" && !scene.isEnding && (
          <div className="border-t border-border/40 bg-background/30">
            <div className="max-w-3xl mx-auto px-6 py-2.5 flex items-center gap-4">
              {chapter.mechanic === "timer" && (
                <>
                  <Timer
                    className={`w-4 h-4 ${timerCritical ? "text-destructive animate-pulse" : "text-neon-cyan"}`}
                  />
                  <span
                    className={`font-mono text-sm tabular-nums tracking-wider ${
                      timerCritical ? "text-destructive" : "text-neon-cyan"
                    }`}
                  >
                    {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 ease-linear"
                      style={{
                        width: `${timerPct}%`,
                        background: timerCritical
                          ? "var(--destructive)"
                          : "var(--gradient-neon)",
                        boxShadow: timerCritical
                          ? "0 0 12px var(--destructive)"
                          : "0 0 10px var(--neon-cyan)",
                      }}
                    />
                  </div>
                </>
              )}
              {chapter.mechanic === "hp" && (
                <>
                  <Heart
                    className={`w-4 h-4 ${hpCritical ? "text-destructive animate-pulse" : "text-neon-magenta"}`}
                    style={{ filter: "drop-shadow(0 0 4px currentColor)" }}
                  />
                  <span
                    className={`font-mono text-sm tabular-nums tracking-wider ${
                      hpCritical ? "text-destructive" : "text-neon-magenta"
                    }`}
                  >
                    {hp}/{chapter.maxHp}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 ease-out"
                      style={{
                        width: `${hpPct}%`,
                        background: hpCritical
                          ? "var(--destructive)"
                          : "var(--gradient-neon)",
                        boxShadow: hpCritical
                          ? "0 0 12px var(--destructive)"
                          : "0 0 10px var(--neon-magenta)",
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className={`w-full max-w-2xl transition-all duration-300 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div
            className="relative rounded-2xl border border-border/60 bg-card backdrop-blur-xl p-8 md:p-10"
            style={{
              boxShadow:
                "0 0 60px oklch(0.62 0.16 35 / 0.12), inset 0 1px 0 oklch(1 0 0 / 0.04)",
            }}
          >
            <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
            <div className="absolute -bottom-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-neon-magenta to-transparent" />

            <div className="text-xs tracking-[0.3em] text-neon-cyan mb-4 uppercase flex items-center gap-2">
              <span>// Bölüm {chapter.id}</span>
              <span className="text-muted-foreground">::</span>
              <span>{scene.id}</span>
              <span className="ml-auto text-muted-foreground font-mono">
                #{String(stepCount).padStart(3, "0")}
              </span>
            </div>

            <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-light">
              {scene.text}
            </p>

            <div className="mt-8 space-y-3">
              {scene.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(choice.next, choice.damage)}
                  className="group w-full text-left px-5 py-4 rounded-lg border border-border/60 bg-secondary/40 hover:bg-secondary/70 hover:border-neon-cyan/70 transition-all duration-200 relative overflow-hidden"
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, oklch(0.78 0.14 60 / 0.1), transparent)",
                    }}
                  />
                  <span className="relative flex items-center gap-3">
                    <span className="text-neon-magenta font-mono text-sm">
                      0{i + 1}
                    </span>
                    <span className="text-foreground/90 group-hover:text-foreground flex-1">
                      {choice.label}
                    </span>
                    {choice.damage ? (
                      <span className="text-xs font-mono text-destructive/80 px-1.5 py-0.5 rounded border border-destructive/40">
                        -{choice.damage} HP
                      </span>
                    ) : null}
                    <span className="text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </span>
                </button>
              ))}

              {scene.isEnding && (
                <div className="pt-2 space-y-3">
                  <div
                    className={`flex items-center justify-center gap-2 py-6 ${
                      isWin ? "text-neon-cyan" : "text-destructive"
                    }`}
                  >
                    {isWin ? (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span className="text-xl font-semibold tracking-wide">
                          TEBRİKLER
                        </span>
                        <Sparkles className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <Skull className="w-5 h-5" />
                        <span className="text-xl font-semibold tracking-wide">
                          {chapter.mechanic === "timer" && timeLeft === 0
                            ? "ZAMAN TÜKENDİ"
                            : chapter.mechanic === "hp" && hp === 0
                              ? "ÖLDÜN"
                              : "ELENDİN"}
                        </span>
                        <Skull className="w-5 h-5" />
                      </>
                    )}
                  </div>

                  {isWin && nextChapter && (
                    <button
                      onClick={() => loadChapter(nextChapter.id)}
                      className="w-full py-4 rounded-lg font-semibold text-primary-foreground transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                      style={{
                        background: "var(--gradient-neon)",
                        boxShadow: "var(--shadow-neon-magenta)",
                      }}
                    >
                      Sonraki Bölüme Geç
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  {isWin && !nextChapter && (
                    <div className="text-center text-sm text-muted-foreground py-2">
                      Tüm bölümleri tamamladın. Döngü kırıldı.
                    </div>
                  )}

                  <button
                    onClick={restartChapter}
                    className="w-full py-3 rounded-lg font-medium text-foreground border border-border/60 hover:border-neon-cyan/60 hover:bg-secondary/50 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Bölümü Tekrar Oyna
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
