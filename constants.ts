
import { Recipe } from './types';

export const RECIPES: Recipe[] = [
  {
    id: 'recipe-1',
    name: '台式三杯雞',
    category: '肉類料理',
    description: '經典台式料理，鹹甜交織，香氣逼人，是下飯的最佳選擇。這道菜的靈魂在於三種調味料的黃金比例：麻油、醬油與米酒。',
    duration: '20 Min',
    calories: '421 Cal',
    nutrition: { carbs: '15g', protein: '45g', calories: '421', fat: '28g' },
    image: '',
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
    id: 'recipe-7',
    name: '川味麻婆豆腐',
    category: '豆腐料理',
    description: '重慶風味的靈魂料理，講究麻、辣、燙、鮮、香。選用滑嫩豆腐搭配豆瓣醬的陳年香氣，每一口都是對味蕾的極致挑逗。',
    duration: '15 Min',
    calories: '310 Cal',
    nutrition: { carbs: '12g', protein: '20g', calories: '310', fat: '18g' },
    image: '',
    ingredients: [
      { id: 'i7-1', name: '嫩豆腐', amount: '1盒' },
      { id: 'i7-2', name: '豬絞肉', amount: '100g' },
      { id: 'i7-3', name: '郫縣豆瓣醬', amount: '1大勺' },
      { id: 'i7-4', name: '大紅袍花椒粉', amount: '適量' },
      { id: 'i7-5', name: '青蒜苗', amount: '1根' }
    ],
    steps: [
      '豆腐切塊放入鹽水中汆燙去除豆腥味，撈起備用。',
      '煸炒豬絞肉至酥香吐油，加入豆瓣醬、蒜末炒出紅油。',
      '加入適量高湯，放入豆腐小火煨煮入味，最後勾薄芡並灑上青蒜苗與花椒粉。'
    ],
    tips: '豆腐入鍋後切忌過度攪拌，應用鍋鏟背輕輕推動。'
  },
  {
    id: 'recipe-14',
    name: '金沙豆腐',
    category: '豆腐料理',
    description: '外酥內嫩的鹹蛋黃料理。濃郁的金沙緊緊包裹住每一塊豆腐，鹹香與豆香在口中完美交織。',
    duration: '12 Min',
    calories: '350 Cal',
    nutrition: { carbs: '18g', protein: '22g', calories: '350', fat: '25g' },
    image: '',
    ingredients: [
      { id: 'i14-1', name: '雞蛋豆腐', amount: '1盒' },
      { id: 'i14-2', name: '熟鹹蛋黃', amount: '3顆' },
      { id: 'i14-3', name: '蒜末/蔥花', amount: '少許' },
      { id: 'i14-4', name: '玉米粉', amount: '適量' }
    ],
    steps: [
      '豆腐切塊均勻沾上玉米粉，下油鍋炸至金黃酥脆撈起。',
      '鹹蛋黃壓碎，起油鍋小火炒至蛋黃起泡。',
      '放入蒜末炒香，倒入豆腐快速翻炒，讓金沙均勻掛上後灑蔥花。'
    ],
    tips: '炒蛋黃時火一定要小，避免焦糊，泡泡越多口感越綿密。'
  },
  {
    id: 'recipe-8',
    name: '松露奶油寬麵',
    category: '麵類料理',
    description: '奢華歐陸風味。質地豐厚的帕瑪森起司與黑松露醬完美融合，包裹在有嚼勁的寬麵上，散發迷人香氣。',
    duration: '18 Min',
    calories: '520 Cal',
    nutrition: { carbs: '55g', protein: '15g', calories: '520', fat: '30g' },
    image: '',
    ingredients: [
      { id: 'i8-1', name: '義大利寬麵', amount: '200g' },
      { id: 'i8-2', name: '黑松露醬', amount: '2茶匙' },
      { id: 'i8-3', name: '動物性鮮奶油', amount: '100ml' },
      { id: 'i8-4', name: '帕瑪森起司粉', amount: '20g' },
      { id: 'i8-5', name: '新鮮蘑菇', amount: '6朵' }
    ],
    steps: [
      '滾水加鹽，放入寬麵煮至 Al dente (彈牙) 狀態。',
      '平底鍋炒香蘑菇片，倒入鮮奶油與少許煮麵水煮至濃稠。',
      '放入麵條、起司粉與黑松露醬快速拌勻，確保醬汁掛在麵上。'
    ],
    tips: '松露醬最後熄火再加，能保留最完整的蕈菇香氣。'
  },
  {
    id: 'recipe-15',
    name: '台式紅燒牛肉麵',
    category: '麵類料理',
    description: '慢燉數小時的濃厚滋味。選用上等牛腱肉，湯頭帶有淡淡的中藥與豆瓣香氣，是台灣人心目中的家鄉味。',
    duration: '120 Min',
    calories: '680 Cal',
    nutrition: { carbs: '60g', protein: '45g', calories: '680', fat: '22g' },
    image: '',
    ingredients: [
      { id: 'i15-1', name: '牛腱肉', amount: '800g' },
      { id: 'i15-2', name: '陽春麵條', amount: '2份' },
      { id: 'i15-3', name: '滷包/豆瓣醬', amount: '1份/2勺' },
      { id: 'i15-4', name: '白蘿蔔', amount: '半根' }
    ],
    steps: [
      '牛肉切大塊汆燙，蘿蔔切塊備用。',
      '炒香豆瓣醬、薑片與蔥段，加入牛肉與醬油翻炒，倒入水與滷包。',
      '大火煮沸後轉小火燉煮 1.5 小時直到肉質軟糯，最後淋在煮好的麵條上。'
    ],
    tips: '滷汁中加入一片昆布能提升湯頭的層次與鮮度。'
  },
  {
    id: 'recipe-9',
    name: '櫻花蝦油飯',
    category: '飯類料理',
    description: '節慶級的古早味料理。選用特級長糯米，吸收了乾香菇與櫻花蝦的鮮美精華，米粒晶瑩剔透，Ｑ彈入味。',
    duration: '45 Min',
    calories: '580 Cal',
    nutrition: { carbs: '70g', protein: '12g', calories: '580', fat: '25g' },
    image: '',
    ingredients: [
      { id: 'i9-1', name: '長糯米', amount: '2杯' },
      { id: 'i9-2', name: '櫻花蝦', amount: '15g' },
      { id: 'i9-3', name: '乾香菇', amount: '5朵' },
      { id: 'i9-4', name: '豬肉絲', amount: '100g' },
      { id: 'i9-5', name: '紅蔥頭', amount: '5瓣' }
    ],
    steps: [
      '糯米洗淨浸泡 3 小時，放入蒸籠蒸 25 分鐘。',
      '炒香紅蔥頭、櫻花蝦、香菇與肉絲，加入醬油、胡椒、香油調味。',
      '將蒸好的糯米飯與炒好的料均勻拌合，再略蒸 5 分鐘使風味融合。'
    ],
    tips: '糯米一定要充分浸泡，蒸出的口感才會Ｑ而不硬。'
  },
  {
    id: 'recipe-16',
    name: '泰式鳳梨炒飯',
    category: '飯類料理',
    description: '色香味俱全的熱帶盛宴。新鮮鳳梨的酸甜搭配黃金咖哩，每一口都能吃出南洋風情。',
    duration: '25 Min',
    calories: '450 Cal',
    nutrition: { carbs: '65g', protein: '15g', calories: '450', fat: '12g' },
    image: '',
    ingredients: [
      { id: 'i16-1', name: '隔夜飯', amount: '2碗' },
      { id: 'i16-2', name: '新鮮鳳梨塊', amount: '1/2顆' },
      { id: 'i16-3', name: '肉鬆/腰果', amount: '適量' },
      { id: 'i16-4', name: '咖哩粉', amount: '1勺' }
    ],
    steps: [
      '鳳梨挖空留殼備用。肉丁與蝦仁炒熟盛起。',
      '炒蛋後加入白飯大火翻炒，加入咖哩粉與魚露調味。',
      '最後放入鳳梨塊與其他配料快速拌勻，裝入鳳梨殼中灑上肉鬆。'
    ],
    tips: '一定要用隔夜飯炒，才能保持米粒分明不濕軟。'
  },
  {
    id: 'recipe-10',
    name: '極致黑芝麻糊',
    category: '中式甜點',
    description: '傳承古法的養生甜品。將芝麻深度烘焙後細火慢磨，質地如絲緞般滑順，甜而不膩，暖胃亦暖心。',
    duration: '30 Min',
    calories: '280 Cal',
    nutrition: { carbs: '35g', protein: '8g', calories: '280', fat: '15g' },
    image: '',
    ingredients: [
      { id: 'i10-1', name: '黑芝麻', amount: '150g' },
      { id: 'i10-2', name: '白米', amount: '30g' },
      { id: 'i10-3', name: '冰糖', amount: '適量' },
      { id: 'i10-4', name: '水', amount: '800ml' }
    ],
    steps: [
      '芝麻與米洗淨，放入果汁機加入水打至極細。',
      '倒入鍋中用中小火不停攪拌加熱，防止底部焦糊。',
      '煮至濃稠狀後加入冰糖，待完全溶解即可趁熱享用。'
    ],
    tips: '加入少許白米是讓口感細膩滑順的關鍵秘訣。'
  },
  {
    id: 'recipe-17',
    name: '冰糖燉雪梨',
    category: '中式甜點',
    description: '潤燥生津的古法甜品。梨香清新，糖液黏稠而不膩，是換季時節最佳的舒緩美味。',
    duration: '40 Min',
    calories: '180 Cal',
    nutrition: { carbs: '45g', protein: '0g', calories: '180', fat: '0g' },
    image: '',
    ingredients: [
      { id: 'i17-1', name: '雪梨', amount: '2顆' },
      { id: 'i17-2', name: '冰糖', amount: '30g' },
      { id: 'i17-3', name: '枸杞/紅棗', amount: '適量' }
    ],
    steps: [
      '雪梨洗淨，橫向切開頂部作為蓋子，挖去核心。',
      '在梨心放入冰糖、枸杞與紅棗，注入八分滿的水。',
      '蓋上梨蓋呈現透明軟爛，即可享用。'
    ],
    tips: '梨皮不要削掉，營養精華都在皮與果肉之間。'
  },
  {
    id: 'recipe-11',
    name: '經典提拉米蘇',
    category: '西式甜點',
    description: '帶我走！義大利最具代表性的甜點。濃縮咖啡與馬斯卡彭起司的層疊魅力，不需要烤箱也能完成的優雅之作。',
    duration: '40 Min',
    calories: '450 Cal',
    nutrition: { carbs: '40g', protein: '7g', calories: '450', fat: '32g' },
    image: '',
    ingredients: [
      { id: 'i11-1', name: '馬斯卡彭起司', amount: '250g' },
      { id: 'i11-2', name: '手指餅乾', amount: '12條' },
      { id: 'i11-3', name: '濃縮咖啡', amount: '100ml' },
      { id: 'i11-4', name: '可可粉', amount: '適量' },
      { id: 'i11-5', name: '動物性鮮奶油', amount: '200ml' }
    ],
    steps: [
      '鮮奶油打發，加入馬斯卡彭起司與糖拌勻。',
      '手指餅乾快速沾取濃縮咖啡（不要泡軟），鋪於模具底部。',
      '填入起司糊，重複層疊，最後冷藏至少 4 小時，食用前灑上可可粉。'
    ],
    tips: '餅乾沾咖啡的速度要快，中心保留微脆感是正宗做法。'
  },
  {
    id: 'recipe-18',
    name: '熔岩巧克力蛋糕',
    category: '西式甜點',
    description: '流動的濃郁幸福。外皮輕薄，中心則是溫熱的苦甜巧克力岩漿，配上一球香草冰淇淋簡直完美。',
    duration: '20 Min',
    calories: '420 Cal',
    nutrition: { carbs: '35g', protein: '5g', calories: '420', fat: '28g' },
    image: '',
    ingredients: [
      { id: 'i18-1', name: '70%黑巧克力', amount: '100g' },
      { id: 'i18-2', name: '無鹽奶油', amount: '50g' },
      { id: 'i18-3', name: '雞蛋', amount: '2顆' },
      { id: 'i18-4', name: '低筋麵粉', amount: '30g' }
    ],
    steps: [
      '巧克力與奶油隔水加熱熔化，與糖混勻。',
      '分次加入全蛋液攪拌均勻，最後篩入麵粉拌成滑順麵糊。',
      '倒入抹了油的模型，200度烤 8-10 分鐘，取出稍放涼後脫模。'
    ],
    tips: '烤箱預熱一定要足夠，烘烤時間視烤箱強度微調，以中心微震動為準。'
  },
  {
    id: 'recipe-12',
    name: '伯爵紅茶抹醬',
    category: '自製醬料',
    description: '早午餐的優雅良伴。濃郁乳香中透出伯爵茶特有的佛手柑清香，無論抹在吐司或是司康上都令人陶醉。',
    duration: '35 Min',
    calories: '150 Cal',
    nutrition: { carbs: '25g', protein: '2g', calories: '150', fat: '6g' },
    image: '',
    ingredients: [
      { id: 'i12-1', name: '全脂牛奶', amount: '500ml' },
      { id: 'i12-2', name: '動物性鮮奶油', amount: '200ml' },
      { id: 'i12-3', name: '伯爵茶葉', amount: '15g' },
      { id: 'i12-4', name: '細砂糖', amount: '80g' }
    ],
    steps: [
      '所有材料放入厚底鍋，中火煮滾後轉小火。',
      '持續慢火熬煮並不斷攪拌，直到水分蒸發、體積剩餘約 1/3。',
      '待呈現如煉乳般的濃稠度後，濾掉茶渣，裝入消毒過的玻璃瓶。'
    ],
    tips: '冷卻後抹醬會更濃稠，所以煮到流動感稍強時即可離火。'
  },
  {
    id: 'recipe-19',
    name: '秘密黃金奶酥醬',
    category: '自製醬料',
    description: '超越市售的手工層次。精選奶油與高品質奶粉的黃金比例，烤過之後酥脆香甜，勾起童年回憶。',
    duration: '10 Min',
    calories: '120 Cal',
    nutrition: { carbs: '15g', protein: '3g', calories: '120', fat: '10g' },
    image: '',
    ingredients: [
      { id: 'i19-1', name: '軟化無鹽奶油', amount: '100g' },
      { id: 'i19-2', name: '全脂奶粉', amount: '60g' },
      { id: 'i19-3', name: '糖粉', amount: '35g' },
      { id: 'i19-4', name: '海鹽', amount: '1小撮' }
    ],
    steps: [
      '奶油室溫軟化後，加入糖粉與鹽打至顏色變白蓬鬆。',
      '分次拌入奶粉，用刮刀按壓均勻直到完全混合。',
      '裝入容器保存，塗抹於吐司上後用 180度烤至表面焦黃。'
    ],
    tips: '加入一丁點海鹽能引出奶香味，平衡甜度。'
  },
  {
    id: 'recipe-13',
    name: '秘密莊園水果茶',
    category: '飲品',
    description: 'Vault 招待貴賓的專屬配方。以錫蘭紅茶為底，融合了熱帶水果的酸甜與薄荷的清新，每一口都是莊園午后的氣息。',
    duration: '10 Min',
    calories: '120 Cal',
    nutrition: { carbs: '30g', protein: '0g', calories: '120', fat: '0g' },
    image: '',
    ingredients: [
      { id: 'i13-1', name: '新鮮柳橙', amount: '1顆' },
      { id: 'i13-2', name: '百香果', amount: '2顆' },
      { id: 'i13-3', name: '錫蘭紅茶包', amount: '2包' },
      { id: 'i13-4', name: '新鮮薄荷葉', amount: '3-4片' },
      { id: 'i13-5', name: '蜂蜜', amount: '適量' }
    ],
    steps: [
      '紅茶包用 90度熱水沖泡 3 分鐘，取出茶包備用。',
      '將柳橙汁、百香果肉與蜂蜜加入茶液中充分攪拌。',
      '放入冰塊與薄荷葉，點綴新鮮水果片即可上桌。'
    ],
    tips: '茶葉不要浸泡過久，以免釋放出苦澀味。'
  },
  {
    id: 'recipe-20',
    name: '手作濃郁抹茶拿鐵',
    category: '飲品',
    description: '如雲朵般的綿密體驗。選用宇治一番茶，層次分明的苦後回甘，與絲滑牛奶完美交織的視覺盛宴。',
    duration: '5 Min',
    calories: '160 Cal',
    nutrition: { carbs: '15g', protein: '6g', calories: '160', fat: '8g' },
    image: '',
    ingredients: [
      { id: 'i20-1', name: '抹茶粉', amount: '5g' },
      { id: 'i20-2', name: '全脂鮮乳', amount: '200ml' },
      { id: 'i20-3', name: '熱水', amount: '30ml' },
      { id: 'i20-4', name: '糖漿', amount: '適量' }
    ],
    steps: [
      '抹茶粉過篩加入熱水，使用茶筅或奶泡機打出均勻細緻的茶沫。',
      '杯中先倒入牛奶與糖漿攪拌均勻，可加入冰塊。',
      '緩緩將抹茶液淋在牛奶上方，形成迷人的漸層效果。'
    ],
    tips: '抹茶粉一定要過篩，且水的溫度約在 80度最能帶出香氣。'
  },
  {
    id: 'recipe-21',
    name: '蛋黃酥',
    category: '中式甜點',
    description: '【此配方可製作 20 顆】\n金黃酥脆的千層外皮，包裹著綿密豆沙與油潤半熟鹹蛋黃。這份來自呂昇達廚師的秘密配方，追求的是奶油香氣與鹹甜之間的完美平衡。',
    duration: '90 Min',
    calories: '285 Cal',
    nutrition: { carbs: '32g', protein: '6g', calories: '285', fat: '15g' },
    image: '',
    youtubeUrl: 'https://youtu.be/wxSzrGQiwU4?si=l6Z8C3aF1lssOGGg',
    ingredients: [
      { id: 'i21-1', name: '〔油皮〕低筋麵粉', amount: '150g' },
      { id: 'i21-2', name: '〔油皮〕19號澄清無水奶油', amount: '65g' },
      { id: 'i21-3', name: '〔油皮〕糖粉/鹽/水', amount: '25g/1g/60g' },
      { id: 'i21-4', name: '〔油酥〕低筋麵粉', amount: '165g' },
      { id: 'i21-5', name: '〔油酥〕19號澄清無水奶油', amount: '75g' },
      { id: 'i21-6', name: '〔內餡〕依思尼奶油烏豆沙餡', amount: '600g' },
      { id: 'i21-7', name: '〔內餡〕鹹蛋黃 (半熟烘烤)', amount: '20顆' },
      { id: 'i21-8', name: '〔裝飾〕蛋黃液/黑芝麻', amount: '適量' }
    ],
    steps: [
      '【預處理】鹹蛋黃噴灑米酒，180度烘烤 8 分鐘至半熟冒油。將豆沙分割為 20 份（每份 30g）並包入蛋黃備用。',
      '【製作油皮】將油皮材料拌勻揉至表面光滑且出筋（可拉出薄膜），密封鬆弛 30 分鐘後分割為 20 份。',
      '【製作油酥】將麵粉與奶油拌勻捏成團即可，分割為 20 份。',
      '【包酥與捲擀】油皮包入油酥，收口捏緊。進行第一次捲擀後鬆弛 15 分鐘，再進行第二次捲擀鬆弛 15 分鐘。',
      '【包餡與成型】將麵糰對摺擀成圓片，包入豆沙蛋黃餡，由底部收口封緊，揉成飽滿圓形。',
      '【烘烤】表面刷上兩次純蛋黃液，頂端灑上黑芝麻，180度烘烤 25-30 分鐘至表面呈現金黃焦香。'
    ],
    tips: '1. 19號澄清無水奶油能提供比一般奶油更酥脆的口感與香氣。兩次刷蛋黃液（間隔 5 分鐘）是讓成品色澤亮麗飽滿的關鍵。\n2. 烏豆沙餡可依喜好替換口味。（可購買呂昇達監製的依思尼內餡系列）'
  }
];
