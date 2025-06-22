import {Flower} from "../types";

/**
 * Japanese flowers database with hanakotoba (flower language) meanings
 * Traditional Japanese flower language that assigns symbolic meanings to flowers
 */
export const flowersDatabase: Flower[] = [
  // Spring Flowers
  {
    name: "桜",
    nameEn: "Cherry Blossom",
    meaning: "精神美、優美な女性",
    meaningEn: "Spiritual beauty, elegant woman",
    colors: ["pink", "white"],
    season: "spring",
    rarity: "common",
  },
  {
    name: "菜の花",
    nameEn: "Rapeseed Flower",
    meaning: "快活、明るさ",
    meaningEn: "Cheerfulness, brightness",
    colors: ["yellow"],
    season: "spring",
    rarity: "common",
  },
  {
    name: "チューリップ",
    nameEn: "Tulip",
    meaning: "思いやり、博愛",
    meaningEn: "Compassion, charity",
    colors: ["red", "pink", "yellow", "white", "purple"],
    season: "spring",
    rarity: "common",
  },
  {
    name: "スイートピー",
    nameEn: "Sweet Pea",
    meaning: "門出、別れの言葉",
    meaningEn: "Departure, farewell",
    colors: ["pink", "purple", "white"],
    season: "spring",
    rarity: "common",
  },
  {
    name: "スズラン",
    nameEn: "Lily of the Valley",
    meaning: "再び幸せが訪れる、謙遜",
    meaningEn: "Return of happiness, humility",
    colors: ["white"],
    season: "spring",
    rarity: "rare",
  },

  // Summer Flowers
  {
    name: "バラ",
    nameEn: "Rose",
    meaning: "愛、美",
    meaningEn: "Love, beauty",
    colors: ["red", "pink", "white", "yellow", "orange"],
    season: "summer",
    rarity: "common",
  },
  {
    name: "ひまわり",
    nameEn: "Sunflower",
    meaning: "憧れ、崇拝",
    meaningEn: "Adoration, worship",
    colors: ["yellow"],
    season: "summer",
    rarity: "common",
  },
  {
    name: "カーネーション",
    nameEn: "Carnation",
    meaning: "無垢で深い愛",
    meaningEn: "Pure and deep love",
    colors: ["red", "pink", "white", "yellow"],
    season: "summer",
    rarity: "common",
  },
  {
    name: "ガーベラ",
    nameEn: "Gerbera",
    meaning: "希望、常に前進",
    meaningEn: "Hope, always moving forward",
    colors: ["red", "pink", "yellow", "orange", "white"],
    season: "summer",
    rarity: "common",
  },
  {
    name: "朝顔",
    nameEn: "Morning Glory",
    meaning: "はかない恋、平静",
    meaningEn: "Fleeting love, tranquility",
    colors: ["blue", "purple", "pink", "white"],
    season: "summer",
    rarity: "common",
  },
  {
    name: "百合",
    nameEn: "Lily",
    meaning: "純粋、無垢",
    meaningEn: "Purity, innocence",
    colors: ["white", "pink", "yellow", "orange"],
    season: "summer",
    rarity: "common",
  },
  {
    name: "紫陽花",
    nameEn: "Hydrangea",
    meaning: "移り気、高慢",
    meaningEn: "Fickleness, pride",
    colors: ["blue", "purple", "pink", "white"],
    season: "summer",
    rarity: "common",
  },

  // Autumn Flowers
  {
    name: "コスモス",
    nameEn: "Cosmos",
    meaning: "乙女の真心、調和",
    meaningEn: "Maiden's sincerity, harmony",
    colors: ["pink", "white", "red"],
    season: "autumn",
    rarity: "common",
  },
  {
    name: "菊",
    nameEn: "Chrysanthemum",
    meaning: "高貴、高尚",
    meaningEn: "Nobility, dignity",
    colors: ["yellow", "white", "red", "purple"],
    season: "autumn",
    rarity: "common",
  },
  {
    name: "彼岸花",
    nameEn: "Spider Lily",
    meaning: "悲しい思い出、あきらめ",
    meaningEn: "Sad memories, resignation",
    colors: ["red"],
    season: "autumn",
    rarity: "rare",
  },
  {
    name: "キンモクセイ",
    nameEn: "Osmanthus",
    meaning: "謙遜、気高い人",
    meaningEn: "Modesty, noble person",
    colors: ["orange"],
    season: "autumn",
    rarity: "common",
  },

  // Winter Flowers
  {
    name: "椿",
    nameEn: "Camellia",
    meaning: "控えめな優しさ、誇り",
    meaningEn: "Modest kindness, pride",
    colors: ["red", "pink", "white"],
    season: "winter",
    rarity: "common",
  },
  {
    name: "水仙",
    nameEn: "Narcissus",
    meaning: "うぬぼれ、自己愛",
    meaningEn: "Vanity, self-love",
    colors: ["white", "yellow"],
    season: "winter",
    rarity: "common",
  },
  {
    name: "梅",
    nameEn: "Plum Blossom",
    meaning: "忍耐、高潔",
    meaningEn: "Patience, nobility",
    colors: ["white", "pink", "red"],
    season: "winter",
    rarity: "common",
  },
  {
    name: "シクラメン",
    nameEn: "Cyclamen",
    meaning: "遠慮、気後れ",
    meaningEn: "Restraint, shyness",
    colors: ["pink", "red", "white"],
    season: "winter",
    rarity: "common",
  },
  {
    name: "ポインセチア",
    nameEn: "Poinsettia",
    meaning: "祝福、幸運を祈る",
    meaningEn: "Blessing, wishing good luck",
    colors: ["red", "white", "pink"],
    season: "winter",
    rarity: "common",
  },

  // Year-round Flowers
  {
    name: "かすみ草",
    nameEn: "Baby's Breath",
    meaning: "清らかな心、無邪気",
    meaningEn: "Pure heart, innocence",
    colors: ["white"],
    season: "all",
    rarity: "common",
  },
  {
    name: "トルコキキョウ",
    nameEn: "Lisianthus",
    meaning: "優美、希望",
    meaningEn: "Elegance, hope",
    colors: ["purple", "pink", "white", "yellow"],
    season: "all",
    rarity: "common",
  },
  {
    name: "胡蝶蘭",
    nameEn: "Phalaenopsis Orchid",
    meaning: "幸福が飛んでくる、純粋な愛",
    meaningEn: "Happiness comes flying, pure love",
    colors: ["white", "pink", "purple"],
    season: "all",
    rarity: "exotic",
  },
  {
    name: "アンスリウム",
    nameEn: "Anthurium",
    meaning: "煩悩、恋にもだえる心",
    meaningEn: "Worldly desires, heart suffering from love",
    colors: ["red", "pink", "white"],
    season: "all",
    rarity: "rare",
  },
];

/**
 * Get flowers by emotion category
 */
export function getFlowersByEmotion(emotion: string): Flower[] {
  const emotionFlowerMap: Record<string, string[]> = {
    joy: ["ひまわり", "ガーベラ", "菜の花", "チューリップ"],
    love: ["バラ", "カーネーション", "胡蝶蘭"],
    sadness: ["彼岸花", "スイートピー", "紫陽花"],
    gratitude: ["かすみ草", "カーネーション", "ガーベラ"],
    hope: ["ガーベラ", "トルコキキョウ", "スズラン"],
    peace: ["百合", "朝顔", "スズラン"],
    beauty: ["バラ", "桜", "椿"],
    purity: ["百合", "かすみ草", "カーネーション"],
    farewell: ["スイートピー", "彼岸花"],
    celebration: ["ポインセチア", "ひまわり", "ガーベラ"],
  };

  const flowerNames = emotionFlowerMap[emotion.toLowerCase()] || [];
  return flowersDatabase.filter((flower) => 
    flowerNames.includes(flower.name)
  );
}

/**
 * Get flowers by season
 */
export function getFlowersBySeason(season: "spring" | "summer" | "autumn" | "winter" | "all"): Flower[] {
  if (season === "all") {
    return flowersDatabase;
  }
  return flowersDatabase.filter((flower) => 
    flower.season === season || flower.season === "all"
  );
}

/**
 * Get random flowers
 */
export function getRandomFlowers(count: number = 5): Flower[] {
  const shuffled = [...flowersDatabase].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}