export type SceneId = "START" | "TERMINAL" | "DOOR_TRY" | "ESCAPE_SUCCESS";

export interface Choice {
  label: string;
  next: SceneId;
}

export interface Scene {
  id: SceneId;
  text: string;
  choices: Choice[];
  isEnding?: boolean;
}

export const story: Record<SceneId, Scene> = {
  START: {
    id: "START",
    text: "Gözlerini açtığında tavanı neon ışıklarla kaplı, loş ve yabancı bir odadasın. Duvara monte edilmiş ekranda kırmızı harflerle bir geri sayım sayacı çalışıyor: 04:59... Kapı kilitli görünüyor ama masanın üzerinde parıldayan bir terminal var.",
    choices: [
      { label: "Terminale yaklaş ve ekrana bak", next: "TERMINAL" },
      { label: "Kapıyı zorlamayı dene", next: "DOOR_TRY" },
    ],
  },
  TERMINAL: {
    id: "TERMINAL",
    text: "Terminale dokunduğun anda ekran yeşile dönüyor ve bir şifre istiyor. Hemen yanında eski bir kağıt not var, üzerinde 'İlk uyandığın anı hatırla' yazıyor.",
    choices: [
      { label: "Şifre olarak 'neon' dene", next: "ESCAPE_SUCCESS" },
      { label: "Geri çekilip kapıya yönel", next: "DOOR_TRY" },
    ],
  },
  DOOR_TRY: {
    id: "DOOR_TRY",
    text: "Kapıyı tüm gücünle omuzluyorsun ama kalın çelik milim kıpırdamıyor. Omzun fena ağrımaya başladı. Sayaca bakıyorsun: 03:12... Zaman daralıyor.",
    choices: [{ label: "Çaresizce terminale geri dön", next: "TERMINAL" }],
  },
  ESCAPE_SUCCESS: {
    id: "ESCAPE_SUCCESS",
    text: "Büyük bir klik sesiyle çelik kapı iki yana açılıyor! Koridorun ucunda özgürlük seni bekliyor. Başardın!",
    choices: [],
    isEnding: true,
  },
};

export const START_ID: SceneId = "START";