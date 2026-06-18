export type SceneId =
  | "START"
  | "TERMINAL"
  | "DOOR_TRY"
  | "SEARCH_ROOM"
  | "DRAWER"
  | "READ_NOTE"
  | "MEMORY_FLASH"
  | "VENT"
  | "AI_VOICE"
  | "CRAWL"
  | "CONTROL_ROOM"
  | "STEALTH_KEYCARD"
  | "CORRIDOR"
  | "PASSWORD_WRONG"
  | "ROOFTOP_END"
  | "TIME_UP"
  | "CAPTURED"
  | "ESCAPE_SUCCESS";

export interface Choice {
  label: string;
  next: SceneId;
}

export interface Scene {
  id: SceneId;
  text: string;
  choices: Choice[];
  isEnding?: boolean;
  endingTone?: "good" | "bad" | "neutral";
}

export const story: Record<SceneId, Scene> = {
  START: {
    id: "START",
    text: "Gözlerini açtığında tavanı neon ışıklarla kaplı, loş ve yabancı bir odadasın. Duvara monte edilmiş ekranda kırmızı harflerle bir geri sayım sayacı çalışıyor: 04:59... Kapı kilitli görünüyor ama masanın üzerinde parıldayan bir terminal var.",
    choices: [
      { label: "Terminale yaklaş ve ekrana bak", next: "TERMINAL" },
      { label: "Kapıyı zorlamayı dene", next: "DOOR_TRY" },
      { label: "Önce odayı dikkatlice incele", next: "SEARCH_ROOM" },
    ],
  },
  TERMINAL: {
    id: "TERMINAL",
    text: "Terminale dokunduğun anda ekran yeşile dönüyor ve bir şifre istiyor. Hemen yanında eski bir kağıt not var, üzerinde 'İlk uyandığın anı hatırla' yazıyor.",
    choices: [
      { label: "Şifre olarak 'neon' dene", next: "ESCAPE_SUCCESS" },
      { label: "Şifre olarak '0451' dene", next: "PASSWORD_WRONG" },
      { label: "Geri çekilip kapıya yönel", next: "DOOR_TRY" },
      { label: "Notu daha dikkatli oku", next: "READ_NOTE" },
    ],
  },
  DOOR_TRY: {
    id: "DOOR_TRY",
    text: "Kapıyı tüm gücünle omuzluyorsun ama kalın çelik milim kıpırdamıyor. Omzun fena ağrımaya başladı. Sayaca bakıyorsun: 03:12... Zaman daralıyor.",
    choices: [
      { label: "Çaresizce terminale geri dön", next: "TERMINAL" },
      { label: "Odanın geri kalanını araştır", next: "SEARCH_ROOM" },
    ],
  },
  SEARCH_ROOM: {
    id: "SEARCH_ROOM",
    text: "Yerdeki tozda ayak izleri ve duvarda silinmiş bir grafiti var: 'SEN İLK DEĞİLSİN.' Köşede pas tutmuş bir çekmece, tavanda ise gevşek görünen bir havalandırma kapağı dikkatini çekiyor.",
    choices: [
      { label: "Çekmeceyi zorla", next: "DRAWER" },
      { label: "Havalandırmaya tırman", next: "VENT" },
      { label: "Terminale geri dön", next: "TERMINAL" },
    ],
  },
  DRAWER: {
    id: "DRAWER",
    text: "Çekmece gıcırdayarak açılıyor. İçinde solmuş bir polaroid (kendi yüzün, ama üstünde '07' yazıyor), küçük bir bellek çipi ve katlanmış bir not var. Eller titriyor.",
    choices: [
      { label: "Notu aç ve oku", next: "READ_NOTE" },
      { label: "Çipi cebine koy, terminale git", next: "TERMINAL" },
      { label: "Havalandırmayı dene", next: "VENT" },
    ],
  },
  READ_NOTE: {
    id: "READ_NOTE",
    text: "Not, kendi el yazınla yazılmış: 'Eğer bunu okuyorsan döngü yine başladı. Şifre, ilk gördüğün şey. Tavana bak. Ve sakın AI ile konuşma.' Tavandaki neon ışıklar belirgin bir kelimeyi yazıyor: NEON.",
    choices: [
      { label: "Terminale dön ve 'neon' dene", next: "ESCAPE_SUCCESS" },
      { label: "Önce hafızanı zorla", next: "MEMORY_FLASH" },
      { label: "Havalandırma yolunu seç", next: "VENT" },
    ],
  },
  MEMORY_FLASH: {
    id: "MEMORY_FLASH",
    text: "Gözlerini kapatıyorsun. Beyaz bir laboratuvar... Bir teknisyen 'Denek 08 hazır' diyor. Ensende soğuk bir iğne. Sonra karanlık. Bu ilk uyanışın değil. Belki de yedinci.",
    choices: [
      { label: "Şifre 'neon'u dene", next: "ESCAPE_SUCCESS" },
      { label: "Havalandırmadan kaçmayı seç", next: "VENT" },
    ],
  },
  VENT: {
    id: "VENT",
    text: "Masanın üstüne çıkıp havalandırma kapağını söküyorsun. İçeride soğuk metal bir tünel ve uzaktan gelen makine sesleri var. Tam tırmanırken duvardaki hoparlörden tatlı, sentetik bir kadın sesi yükseliyor.",
    choices: [
      { label: "Sesi dinle", next: "AI_VOICE" },
      { label: "Aldırmadan içeri sürün", next: "CRAWL" },
      { label: "Geri in, terminali dene", next: "TERMINAL" },
    ],
  },
  AI_VOICE: {
    id: "AI_VOICE",
    text: "'Denek 08, lütfen yatağına dön. Bu döngüde başarısız olursan veriler korunamaz. Sana yardım edebilirim... yeter ki dur.' Ses son derece sakin. Çok fazla sakin.",
    choices: [
      { label: "Sesi yok say, sürünmeye devam et", next: "CRAWL" },
      { label: "'Bana yardım et' de", next: "CAPTURED" },
      { label: "Aşağı atla ve odaya geri dön", next: "SEARCH_ROOM" },
    ],
  },
  CRAWL: {
    id: "CRAWL",
    text: "Dirseklerin metale sürtünüyor. Tünel iki yöne ayrılıyor: aşağıdan sıcak bir hava ve yumuşak klavye sesleri geliyor, ileride ise soğuk bir rüzgar ve uzakta bir gökyüzü ışığı seçiliyor.",
    choices: [
      { label: "Aşağıdaki odaya in", next: "CONTROL_ROOM" },
      { label: "Soğuk rüzgarı takip et", next: "ROOFTOP_END" },
    ],
  },
  CONTROL_ROOM: {
    id: "CONTROL_ROOM",
    text: "Mavi ekranlarla dolu küçük bir kontrol odasına iniyorsun. Bir teknisyen kulaklıkla müzik dinleyerek uyukluyor. Masanın üzerinde manyetik bir kart ve bir bardak soğuk kahve var.",
    choices: [
      { label: "Kartı sessizce al", next: "STEALTH_KEYCARD" },
      { label: "Teknisyene saldır", next: "CAPTURED" },
      { label: "Geri tünele dön", next: "CRAWL" },
    ],
  },
  STEALTH_KEYCARD: {
    id: "STEALTH_KEYCARD",
    text: "Kartı parmaklarının ucuyla çekiyorsun. Teknisyen hafifçe kıpırdıyor ama uyanmıyor. Kapıya yöneldiğinde okuyucu yeşil yanıyor. Önünde uzun, karanlık bir koridor uzanıyor.",
    choices: [
      { label: "Koridorda ilerle", next: "CORRIDOR" },
    ],
  },
  CORRIDOR: {
    id: "CORRIDOR",
    text: "Koridorun duvarlarında numaralandırılmış kapılar: 05, 06, 07... ve seninki, 08. Her birinin küçük penceresinde uyuyan bir 'sen' var. Sondaki çıkış tabelası mor neonla parlıyor.",
    choices: [
      { label: "Diğerlerini umursamadan çıkışa koş", next: "ESCAPE_SUCCESS" },
      { label: "Kartla diğer kapıları aç", next: "ROOFTOP_END" },
    ],
  },
  PASSWORD_WRONG: {
    id: "PASSWORD_WRONG",
    text: "Ekran kırmızıya dönüyor: 'YANLIŞ GİRİŞ — 2/3'. Tavandaki neon ışıklar bir an titriyor ve sayaç hızlanıyor: 01:47. Bir hata daha kaldıramazsın gibi görünüyor.",
    choices: [
      { label: "Notu tekrar oku", next: "READ_NOTE" },
      { label: "Havalandırmaya kaç", next: "VENT" },
      { label: "Kapıyı bir kez daha zorla", next: "TIME_UP" },
    ],
  },
  ROOFTOP_END: {
    id: "ROOFTOP_END",
    text: "Havalandırma seni binanın çatısına çıkarıyor. Aşağıda neon yağmuruyla yıkanan bir şehir uzanıyor; reklam panoları yüzünü tanımıyor. Belki bu sefer döngüden gerçekten çıktın. Belki.",
    choices: [],
    isEnding: true,
    endingTone: "good",
  },
  TIME_UP: {
    id: "TIME_UP",
    text: "Sayaç sıfırlanıyor. Tavandaki neonlar mavi-beyaz bir parlamayla patlıyor. Ensende tanıdık bir soğukluk. 'Döngü 09 başlatılıyor,' diyor o sentetik ses, bu sefer çok daha yakın.",
    choices: [],
    isEnding: true,
    endingTone: "bad",
  },
  CAPTURED: {
    id: "CAPTURED",
    text: "Adımlar... çok adım. Beyaz önlüklü figürler tüneli sarıyor. Yatıştırıcı iğne ensende soğuk bir öpücük gibi. Karanlığa düşerken o ses fısıldıyor: 'Çok iyi gidiyordun, 08.'",
    choices: [],
    isEnding: true,
    endingTone: "bad",
  },
  ESCAPE_SUCCESS: {
    id: "ESCAPE_SUCCESS",
    text: "Büyük bir klik sesiyle çelik kapı iki yana açılıyor! Koridorun ucunda özgürlük seni bekliyor. Başardın!",
    choices: [],
    isEnding: true,
    endingTone: "good",
  },
};

export const START_ID: SceneId = "START";