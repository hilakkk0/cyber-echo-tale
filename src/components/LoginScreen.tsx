import { useState } from "react";
import { Zap, User, ChevronRight, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getKnownPlayers,
  isValidPlayerName,
  registerPlayer,
  loadPlayerSave,
  deletePlayer,
  type PlayerRecord,
} from "@/lib/player-storage";

interface LoginScreenProps {
  onLogin: (player: PlayerRecord) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [players, setPlayers] = useState<PlayerRecord[]>(() => getKnownPlayers());

  const handleDelete = (id: string) => {
    deletePlayer(id);
    setPlayers(getKnownPlayers());
  };

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!isValidPlayerName(trimmed)) {
      setError("Geçerli bir isim gir (2–24 karakter, harf/rakam).");
      return;
    }
    setError("");
    onLogin(registerPlayer(trimmed));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-md rounded-2xl border border-border/60 bg-card backdrop-blur-xl p-8 md:p-10"
        style={{
          boxShadow:
            "0 0 60px oklch(0.62 0.16 35 / 0.12), inset 0 1px 0 oklch(1 0 0 / 0.04)",
        }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-11 h-11 rounded-lg border border-neon-cyan/40 flex items-center justify-center shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.14 60 / 0.18), oklch(0.62 0.16 35 / 0.15))",
              boxShadow: "inset 0 0 12px oklch(0.78 0.14 60 / 0.2), 0 0 18px oklch(0.78 0.14 60 / 0.2)",
            }}
          >
            <Zap className="w-5 h-5 text-neon-cyan" />
          </div>
          <div>
            <h1
              className="text-xl font-bold tracking-[0.22em] bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-neon)" }}
            >
              SYNAPSE//08
            </h1>
            <p className="text-[11px] text-muted-foreground tracking-[0.28em] uppercase mt-1">
              Operatör Kimliği
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Devam etmek için operatör adını gir. İlerlemen yalnızca senin profiline kaydedilir.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(name);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label htmlFor="player-name" className="text-xs tracking-widest uppercase text-neon-cyan">
              Operatör Adı
            </label>
            <Input
              id="player-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Adını yaz..."
              autoComplete="off"
              autoFocus
              className="h-11 border-border/60 bg-secondary/30 focus-visible:ring-neon-cyan/50"
            />
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>

          <Button
            type="submit"
            className="w-full h-11 font-semibold text-primary-foreground"
            style={{
              background: "var(--gradient-neon)",
              boxShadow: "var(--shadow-neon-magenta)",
            }}
          >
            Giriş Yap
            <ChevronRight className="w-4 h-4" />
          </Button>
        </form>

        {players.length > 0 ? (
          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
              Son Operatörler
            </p>
            <div className="space-y-2">
              {players.map((player) => {
                const save = loadPlayerSave(player.id);
                return (
                  <div
                    key={player.id}
                    className="group flex items-center justify-between rounded-lg border border-border/60 bg-secondary/30 hover:bg-secondary/50 transition-all overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => onLogin(registerPlayer(player.displayName))}
                      className="flex-1 flex items-center gap-3 px-4 py-3 text-left min-w-0"
                    >
                      <User className="w-4.5 h-4.5 text-neon-magenta shrink-0" />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-semibold text-foreground/90 truncate">
                          {player.displayName}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Bölüm {save.chapterId} · Adım {save.stepCount}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-neon-cyan transition-colors" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(
                            `"${player.displayName}" operatör profilini ve tüm ilerlemesini silmek istediğine emin misin?`
                          )
                        ) {
                          handleDelete(player.id);
                        }
                      }}
                      className="p-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0 border-l border-border/40"
                      title="Profili Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
