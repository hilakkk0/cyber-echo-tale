import { useEffect, useState } from "react";
import { story, START_ID, type SceneId } from "@/lib/story";
import { Zap, RotateCcw, Sparkles } from "lucide-react";

const STORAGE_KEY = "cyoa-current-scene";

export function Game() {
  const [sceneId, setSceneId] = useState<SceneId>(START_ID);
  const [visible, setVisible] = useState(true);
  const [stepCount, setStepCount] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as SceneId | null;
    if (saved && story[saved]) setSceneId(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sceneId);
  }, [sceneId]);

  const scene = story[sceneId];

  const goTo = (next: SceneId) => {
    setVisible(false);
    setTimeout(() => {
      setSceneId(next);
      setStepCount((c) => c + 1);
      setVisible(true);
    }, 280);
  };

  const restart = () => {
    setVisible(false);
    setTimeout(() => {
      setSceneId(START_ID);
      setStepCount(1);
      setVisible(true);
    }, 280);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md bg-background/30 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="relative w-11 h-11 rounded-lg border border-neon-cyan/40 flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, oklch(0.78 0.2 195 / 0.15), oklch(0.7 0.28 330 / 0.15))",
                boxShadow: "inset 0 0 12px oklch(0.78 0.2 195 / 0.2), 0 0 18px oklch(0.78 0.2 195 / 0.25)",
              }}
            >
              <Zap
                className="w-5 h-5 text-neon-cyan"
                style={{ filter: "drop-shadow(0 0 6px var(--neon-cyan))" }}
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-magenta animate-pulse" style={{ boxShadow: "0 0 8px var(--neon-magenta)" }} />
            </div>
            <div className="min-w-0">
              <h1
                className="text-xl md:text-2xl font-bold tracking-[0.25em] bg-clip-text text-transparent leading-none"
                style={{ backgroundImage: "var(--gradient-neon)" }}
              >
                SYNAPSE//08
              </h1>
              <p className="mt-1.5 text-[10px] md:text-[11px] text-muted-foreground tracking-[0.3em] uppercase truncate">
                Hatırla · Seç · Kaç
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground tracking-[0.25em] uppercase">Döngü</span>
              <span className="font-mono text-sm text-neon-cyan tabular-nums">
                {String(stepCount).padStart(3, "0")}
              </span>
            </div>
            <button
              onClick={restart}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/60 text-xs text-muted-foreground hover:text-foreground hover:border-neon-cyan/60 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Yeniden Başla</span>
            </button>
          </div>
        </div>
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
            style={{ boxShadow: "0 0 60px oklch(0.7 0.28 330 / 0.15), inset 0 1px 0 oklch(1 0 0 / 0.05)" }}
          >
            {/* glow corners */}
            <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
            <div className="absolute -bottom-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-neon-magenta to-transparent" />

            <div className="text-xs tracking-[0.3em] text-neon-cyan mb-4 uppercase">
              // Sahne :: {scene.id}
            </div>

            <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-light">
              {scene.text}
            </p>

            <div className="mt-8 space-y-3">
              {scene.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => goTo(choice.next)}
                  className="group w-full text-left px-5 py-4 rounded-lg border border-border/60 bg-secondary/40 hover:bg-secondary/70 hover:border-neon-cyan/70 transition-all duration-200 relative overflow-hidden"
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(90deg, transparent, oklch(0.78 0.2 195 / 0.1), transparent)" }} />
                  <span className="relative flex items-center gap-3">
                    <span className="text-neon-magenta font-mono text-sm">0{i + 1}</span>
                    <span className="text-foreground/90 group-hover:text-foreground">{choice.label}</span>
                    <span className="ml-auto text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </span>
                </button>
              ))}

              {scene.isEnding && (
                <div className="pt-2">
                  <div className="flex items-center justify-center gap-2 py-6 text-neon-cyan">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xl font-semibold tracking-wide">TEBRİKLER</span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <button
                    onClick={restart}
                    className="w-full py-4 rounded-lg font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                    style={{ background: "var(--gradient-neon)", boxShadow: "var(--shadow-neon-magenta)" }}
                  >
                    Yeniden Başla
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