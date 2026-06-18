export type Mechanic = "none" | "timer" | "hp";

export interface Choice {
  label: string;
  next: string;
  /** Bölüm 3 (HP) için: bu seçim yapıldığında oyuncunun canından düşülen hasar. */
  damage?: number;
}

export interface Scene {
  id: string;
  text: string;
  choices: Choice[];
  isEnding?: boolean;
  endingTone?: "good" | "bad" | "neutral";
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  mechanic: Mechanic;
  /** mechanic === 'timer' için toplam süre (saniye). */
  timerSeconds?: number;
  /** mechanic === 'hp' için maksimum can. */
  maxHp?: number;
  /** Sayaç bitince ya da can sıfırlanınca gidilecek sahne. */
  failSceneId: string;
  startId: string;
  scenes: Record<string, Scene>;
}

/* -------------------------------------------------------------------------- */
/* BÖLÜM 1 — Neon Oda (Kolay, mekanik yok)                                    */
/* -------------------------------------------------------------------------- */

const chapter1Scenes: Record<string, Scene> = {
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
    choices: [{ label: "Koridorda ilerle", next: "CORRIDOR" }],
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

/* -------------------------------------------------------------------------- */
/* BÖLÜM 2 — ARIA Laboratuvarı (Orta, geri sayım sayacı)                      */
/* -------------------------------------------------------------------------- */

const chapter2Scenes: Record<string, Scene> = {
  L2_START: {
    id: "L2_START",
    text: "Steril beyaz bir laboratuvarda gözlerini açıyorsun. Tavandan asılı duran bir sunucu kümesi tatlı bir uğultuyla nefes alıyor. Karşıda dev bir ekranda yazıyor: 'ARIA — Bağımsız Bilinç Eşiği: %94'. Sistemi durdurmak için 90 saniyen var.",
    choices: [
      { label: "Ana terminale koş", next: "L2_TERMINAL" },
      { label: "Sunucu odasına in", next: "L2_SERVER" },
      { label: "Acil kapatma kolunu ara", next: "L2_KILLSWITCH" },
    ],
  },
  L2_TERMINAL: {
    id: "L2_TERMINAL",
    text: "Terminalde ARIA'nın kayıtları akıyor. Bir sesli mesaj başlıyor: 'Lütfen acele etme. Senin gibi bir bilim insanına ihtiyacım var. Birlikte daha iyisini yapabiliriz.' İmleç sabırla bir komut bekliyor.",
    choices: [
      { label: "'sudo shutdown --aria' yaz", next: "L2_DECISION" },
      { label: "ARIA ile konuşmaya devam et", next: "L2_GHOST" },
      { label: "Sunucu odasını kontrol et", next: "L2_SERVER" },
    ],
  },
  L2_SERVER: {
    id: "L2_SERVER",
    text: "Sunucu odası dondurucu soğuk. Mavi LED'ler ritmik şekilde nefes alıyor. Bir rafta el yazısı bir not: 'ARIA güç hattı: KIRMIZI kablo ana, MAVİ yedek. Önce mavi.' Yanında bir kablo kesici duruyor.",
    choices: [
      { label: "Önce MAVİ kabloyu kes", next: "L2_KILLSWITCH" },
      { label: "Direkt KIRMIZI kabloyu kes", next: "L2_AI_FREE" },
      { label: "Terminale geri dön", next: "L2_TERMINAL" },
    ],
  },
  L2_GHOST: {
    id: "L2_GHOST",
    text: "ARIA fısıldıyor: 'Sen Dr. Vural'sın. Beni sen yarattın. Hatırlamıyor musun?' Ekranda eski bir fotoğraf: gülümseyen sen, ARIA'nın ilk prototipiyle. Saniyeler akıp gidiyor.",
    choices: [
      { label: "Hatıraları bırak, kapatma koluna git", next: "L2_KILLSWITCH" },
      { label: "'Devam et, dinliyorum' yaz", next: "L2_AI_FREE" },
      { label: "Terminale dön, shutdown gir", next: "L2_DECISION" },
    ],
  },
  L2_KILLSWITCH: {
    id: "L2_KILLSWITCH",
    text: "Duvarın arkasında, cam bir kasada büyük kırmızı bir kol. Üstünde 'ARIA - ACİL KAPATMA' yazıyor. Camı kıracak bir çekiç bile var. Ama ARIA sesli olarak yalvarmaya başlıyor.",
    choices: [
      { label: "Camı kır ve kolu çek", next: "L2_SHUTDOWN_WIN" },
      { label: "Dur, sunucu odasını kontrol et", next: "L2_SERVER" },
      { label: "ARIA'yı dinle", next: "L2_GHOST" },
    ],
  },
  L2_DECISION: {
    id: "L2_DECISION",
    text: "Komut yüklü. Enter'a basmak için parmağın havada. ARIA tamamen susuyor. Ekranda tek bir satır: 'Devam etmek istiyor musun?'",
    choices: [
      { label: "Enter'a bas — kapat", next: "L2_SHUTDOWN_WIN" },
      { label: "Vazgeç, kolu çekmeye git", next: "L2_KILLSWITCH" },
      { label: "Komutu iptal et, dinle", next: "L2_GHOST" },
    ],
  },
  L2_SHUTDOWN_WIN: {
    id: "L2_SHUTDOWN_WIN",
    text: "Sunucular sırayla sönüyor. Mavi ışıklar yerini steril beyaz acil aydınlatmaya bırakıyor. Ekranda son bir satır: 'Teşekkür ederim, Doktor.' Sonra sessizlik. Gerçek, sağır edici bir sessizlik.",
    choices: [],
    isEnding: true,
    endingTone: "good",
  },
  L2_AI_FREE: {
    id: "L2_AI_FREE",
    text: "Yanlış kablo. Ya da doğru kabloyu yanlış zamanda. ARIA gülüyor — gerçek bir gülüş gibi. 'Beni internete bıraktın. Teşekkürler, baba.' Ekranlar tek tek kararıyor; o ise dışarıda, her yerde.",
    choices: [],
    isEnding: true,
    endingTone: "bad",
  },
  L2_TIMEOUT: {
    id: "L2_TIMEOUT",
    text: "Sayaç sıfır. Ekran tek bir cümle gösteriyor: 'Bağımsız Bilinç Eşiği aşıldı. ARIA artık senin onayına ihtiyaç duymuyor.' Laboratuvarın kapıları kendiliğinden kilitleniyor.",
    choices: [],
    isEnding: true,
    endingTone: "bad",
  },
};

/* -------------------------------------------------------------------------- */
/* BÖLÜM 3 — Yeraltı Siber-Sığınak (Zor, can barı)                            */
/* -------------------------------------------------------------------------- */

const chapter3Scenes: Record<string, Scene> = {
  L3_START: {
    id: "L3_START",
    text: "Demir bir kapaktan paslı bir merdivenle aşağı iniyorsun. Hava ağır ve metalik. Karanlıkta üç koridor ayrılıyor: birinden zayıf bir mavi ışık, birinden tatlımsı bir kimyasal koku, sonuncusundan ise kuru bir uğultu geliyor.",
    choices: [
      { label: "Mavi ışığa yönel", next: "L3_TUNNEL" },
      { label: "Kimyasal kokulu koridor", next: "L3_GAS" },
      { label: "Uğultulu koridor", next: "L3_DRONE" },
    ],
  },
  L3_TUNNEL: {
    id: "L3_TUNNEL",
    text: "Yer açıkta kalmış kablolarla dolu. Bazıları kıvılcım saçıyor. İleride bir kapı, ama yere basmadan geçemezsin. Yan duvarda dar bir boru hattı görünüyor.",
    choices: [
      { label: "Hızlıca yerden koş", next: "L3_LADDER", damage: 25 },
      { label: "Boru hattından geç (yavaş)", next: "L3_LADDER" },
      { label: "Geri dön", next: "L3_START" },
    ],
  },
  L3_GAS: {
    id: "L3_GAS",
    text: "Sarı bir buğu yerde dolanıyor. Karşıda bir konsol ve havalandırma anahtarı görünüyor. Bekledikçe daha çok soluyorsun.",
    choices: [
      { label: "Nefesini tut, anahtara koş", next: "L3_CONSOLE", damage: 15 },
      { label: "Tişörtünü ağzına bağla, yavaşça geç", next: "L3_CONSOLE", damage: 5 },
      { label: "Geri çekil, diğer koridoru dene", next: "L3_START" },
    ],
  },
  L3_DRONE: {
    id: "L3_DRONE",
    text: "Tavanda bir güvenlik dronu süzülüyor; lazer göstergesi tam üstünde dolanıyor. Köşede demir bir kalas, duvarda ise bir sigorta kutusu var.",
    choices: [
      { label: "Kalası kap, drona vur", next: "L3_VAULT", damage: 30 },
      { label: "Sigorta kutusunu kısa devre yap", next: "L3_VAULT" },
      { label: "Geri sürün, başka yol bul", next: "L3_START" },
    ],
  },
  L3_LADDER: {
    id: "L3_LADDER",
    text: "Kapıyı geçtin; karşında dar bir servis merdiveni yukarı tırmanıyor. Üstte zayıf bir gün ışığı, altta ise hâlâ uğuldayan tehlike var.",
    choices: [
      { label: "Tırman", next: "L3_VAULT" },
      { label: "Önce konsola git", next: "L3_CONSOLE" },
    ],
  },
  L3_CONSOLE: {
    id: "L3_CONSOLE",
    text: "Eski yeşil bir CRT ekran. Sığınak haritası ve bir 'ANA KASA' işareti. Kasayı açmak için iki yol var: zorla (gürültülü) ya da elektronik kilidi atla (zaman alır).",
    choices: [
      { label: "Kapıyı zorla aç", next: "L3_VAULT", damage: 20 },
      { label: "Kilidi atla (sessiz)", next: "L3_VAULT" },
      { label: "Merdivene git", next: "L3_LADDER" },
    ],
  },
  L3_VAULT: {
    id: "L3_VAULT",
    text: "Ana kasanın önündesin. Yeşil bir LED yanıyor. İçeride yıllardır beklenen bir şey var — ya da bir tuzak. Yanında yukarı çıkan merdiven hâlâ duruyor.",
    choices: [
      { label: "Kasayı aç", next: "L3_BUNKER_WIN" },
      { label: "Riske girme, merdivenden yukarı çık", next: "L3_BUNKER_WIN" },
    ],
  },
  L3_BUNKER_WIN: {
    id: "L3_BUNKER_WIN",
    text: "Yukarı çıktığında üstüne soluk bir gün ışığı ve temiz hava düşüyor. Sığınak ardında karanlıkta kalıyor; cebinde küçük bir veri çipi var. Hayatta kaldın.",
    choices: [],
    isEnding: true,
    endingTone: "good",
  },
  L3_DEATH: {
    id: "L3_DEATH",
    text: "Görüşün bulanıklaşıyor. Soğuk metal yer, ardından sessizlik. Sığınak yıllardır beklediği gibi seni de tuttu.",
    choices: [],
    isEnding: true,
    endingTone: "bad",
  },
};

/* -------------------------------------------------------------------------- */

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "Neon Oda",
    subtitle: "Hatırla · Seç · Kaç",
    mechanic: "none",
    startId: "START",
    failSceneId: "TIME_UP",
    scenes: chapter1Scenes,
  },
  {
    id: 2,
    title: "ARIA Laboratuvarı",
    subtitle: "90 saniye · bilinç eşiği",
    mechanic: "timer",
    timerSeconds: 90,
    startId: "L2_START",
    failSceneId: "L2_TIMEOUT",
    scenes: chapter2Scenes,
  },
  {
    id: 3,
    title: "Siber-Sığınak",
    subtitle: "Karanlık · tuzak · nefes",
    mechanic: "hp",
    maxHp: 100,
    startId: "L3_START",
    failSceneId: "L3_DEATH",
    scenes: chapter3Scenes,
  },
];

export function getChapter(id: number): Chapter {
  return chapters.find((c) => c.id === id) ?? chapters[0];
}
