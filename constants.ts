
import { Recipe } from './types';

export const RECIPES: Recipe[] = [
  {
    id: 'recipe-1',
    name: '台式三杯雞',
    category: 'Traditional',
    description: '經典台式料理，鹹甜交織，香氣逼人，是下飯的最佳選擇。這道菜的靈魂在於三種調味料的黃金比例：麻油、醬油與米酒。',
    duration: '20 Min',
    calories: '421 Cal',
    nutrition: {
      carbs: '15g',
      protein: '45g',
      calories: '421',
      fat: '28g'
    },
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=1000',
    ingredients: [
      { id: 'i1-1', name: '去骨雞腿肉', amount: '600g' },
      { id: 'i1-2', name: '老薑', amount: '10片' },
      { id: 'i1-3', name: '蒜頭', amount: '8瓣' },
      { id: 'i1-4', name: '新鮮九層塔', amount: '1大把' },
      { id: 'i1-5', name: '黑麻油', amount: '2大勺' },
      { id: 'i1-6', name: '醬油/米酒', amount: '各1/4杯' }
    ],
    steps: [
      '起油鍋，倒入黑麻油，用中小火慢慢煸香薑片，直到邊緣呈金黃微捲狀。',
      '放入蒜頭及辣椒炒香，隨即放入雞腿塊大火翻炒至表面金黃。',
      '加入醬油與米酒，蓋上鍋蓋悶煮 5 分鐘，最後收汁並灑入大把九層塔。'
    ],
    tips: '薑片一定要煸到乾扁，香氣才會真正釋放到麻油中。'
  },
  {
    id: 'recipe-2',
    name: '法式松露炒蛋',
    category: 'Luxury',
    description: '享受極致的歐式早餐。選用上等松露油與滑嫩雞蛋，透過低溫慢炒呈現如絲綢般的質地。',
    duration: '12 Min',
    calories: '280 Cal',
    nutrition: {
      carbs: '5g',
      protein: '18g',
      calories: '280',
      fat: '22g'
    },
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=1000',
    ingredients: [
      { id: 'i2-1', name: '有機雞蛋', amount: '3顆' },
      { id: 'i2-2', name: '無鹽奶油', amount: '15g' },
      { id: 'i2-3', name: '黑松露油', amount: '1茶匙' },
      { id: 'i2-4', name: '鮮奶油', amount: '1勺' }
    ],
    steps: [
      '將雞蛋與鮮奶油均勻攪打，過篩以確保質地細緻。',
      '使用平底鍋小火融化奶油，倒入蛋液，全程保持小火攪動。',
      '待蛋液呈現半凝固的膏狀時離火，滴入松露油拌勻即可。'
    ],
    tips: '離火後餘溫會繼續加熱，切記不要炒得太熟，保持 Creamy 感。'
  },
  {
    id: 'recipe-3',
    name: '香煎脆皮鮭魚',
    category: 'Healthy',
    description: '富含 Omega-3 的健康選澤。利用高溫煎出酥脆如紙的魚皮，鎖住內部鮮美的肉汁。',
    duration: '15 Min',
    calories: '350 Cal',
    nutrition: {
      carbs: '2g',
      protein: '32g',
      calories: '350',
      fat: '24g'
    },
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=1000',
    ingredients: [
      { id: 'i3-1', name: '挪威鮭魚菲力', amount: '200g' },
      { id: 'i3-2', name: '蘆筍', amount: '6根' },
      { id: 'i3-3', name: '黃檸檬', amount: '1/2顆' },
      { id: 'i3-4', name: '海鹽/黑胡椒', amount: '適量' }
    ],
    steps: [
      '將鮭魚表面水分徹底擦乾，抹上海鹽與胡椒。',
      '冷鍋下油，魚皮朝下放入，轉中火煎 5 分鐘，切勿翻動直到皮脆。',
      '翻面續煎 2 分鐘，同時放入蘆筍一起加熱。'
    ],
    tips: '魚皮一定要擦乾，那是脆皮的關鍵。'
  },
  {
    id: 'recipe-4',
    name: '菜脯蛋',
    category: 'Home-style',
    description: '經典的台式家常滋味，爽脆的菜脯與軟嫩的煎蛋完美結合。加入少許低筋麵粉能讓蛋皮更加挺拔，是每一口都充滿驚喜的秘密配方。',
    duration: '10 Min',
    calories: '320 Cal',
    nutrition: {
      carbs: '8g',
      protein: '24g',
      calories: '320',
      fat: '22g'
    },
    image: 'Garlic Cauliflower.png',
    ingredients: [
      { id: 'i4-1', name: '雞蛋', amount: '4顆' },
      { id: 'i4-2', name: '菜脯', amount: '適量' },
      { id: 'i4-3', name: '低筋麵粉', amount: '2匙' },
      { id: 'i4-4', name: '烹大師', amount: '1匙' },
      { id: 'i4-5', name: '白胡椒', amount: '少量' }
    ],
    steps: [
      '將4顆蛋打入碗中。',
      '加入低筋麵粉、烹大師及白胡椒。',
      '徹底打勻，確保低筋麵粉完全消融、沒有任何結塊。',
      '加入菜脯攪拌均勻。',
      '熱油鍋，將蛋液倒入，煎至兩面金黃即可熄火。'
    ],
    tips: '徹底打勻麵粉是關鍵，這會讓成品更有厚實的口感且不散開。'
  }
];
