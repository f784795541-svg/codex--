const API_BASE = window.__HEALTH_API_BASE__ || "/api";
const STORAGE_KEY = "health_manager_current_user";
const PREFERENCES_KEY = "health_manager_preferences";
const DEFAULT_FOOD_IMAGE = "/assets/foods/meal.svg";
const REALISTIC_FOOD_IMAGE_BASE = "/assets/foods/realistic";
const REALISTIC_FOOD_IMAGE_MAP = {
  rice: "rice-photo.webp",
  noodle: "noodle-photo.webp",
  egg: "egg-photo.webp",
  chicken: "chicken-photo.webp",
  beef: "beef-photo.webp",
  seafood: "seafood-photo.webp",
  tofu: "tofu-photo.webp",
  vegetable: "vegetable-photo.webp",
};
const REALISTIC_CATEGORY_IMAGE_MAP = {
  主食: "rice",
  蛋类: "egg",
  肉类: "chicken",
  海鲜: "seafood",
  豆制品: "tofu",
  蔬菜: "vegetable",
  水果: "vegetable",
  轻食: "chicken",
  家常炒菜: "beef",
  湘菜: "beef",
  东北菜: "beef",
  江浙菜: "seafood",
  川菜: "beef",
  广东菜: "seafood",
  卤味: "chicken",
  火锅类: "beef",
  烧烤夜宵: "beef",
};
const REALISTIC_FOOD_IMAGE_RULES = [
  { keywords: ["麻婆豆腐", "砂锅豆腐", "蟹粉豆腐", "锅塌豆腐"], key: "tofu" },
  { keywords: ["番茄牛腩", "红烧牛肉", "杭椒牛柳", "青椒牛肉", "水煮牛肉", "小炒黄牛肉", "土豆牛肉", "黑椒牛柳", "番茄肥牛"], key: "beef" },
  { keywords: ["回锅肉", "红烧排骨", "糖醋排骨", "农家小炒肉", "辣椒炒肉", "梅菜扣肉", "木须肉", "锅包肉", "鱼香肉丝", "蒜苔炒肉", "香干炒肉", "地三鲜", "肉末茄子", "肉末豆角", "香菇滑鸡饭", "黑椒牛肉饭"], key: "beef" },
  { keywords: ["白切鸡", "口水鸡", "辣子鸡", "宫保鸡丁", "照烧鸡腿", "鸡胸肉沙拉", "小鸡炖蘑菇", "叫花鸡", "香菇滑鸡", "奥尔良鸡腿", "照烧鸡排", "鸡腿饭", "鸡排饭"], key: "chicken" },
  { keywords: ["清蒸鲈鱼", "酸菜鱼", "水煮鱼", "西湖醋鱼", "松鼠桂鱼", "剁椒鱼头", "雪菜黄鱼", "响油鳝糊", "鳗鱼饭"], key: "seafood" },
  { keywords: ["小龙虾", "蒜蓉虾", "白灼虾", "西兰花炒虾仁", "清炒虾仁", "龙井虾仁", "油爆虾", "炸虾"], key: "seafood" },
  { keywords: ["羊肉串", "牛肉串", "麻辣烫", "冒菜", "串串香", "火锅肥牛", "毛肚", "黄喉", "鸭肠", "虾滑"], key: "beef" },
  { keywords: ["鸡胸肉沙拉", "凯撒鸡肉沙拉", "金枪鱼沙拉", "鸡肉卷", "鸡肉三明治", "鸡胸肉三明治", "全麦鸡胸三明治"], key: "chicken" },
  { keywords: ["卤豆干"], key: "tofu" },
  { keywords: ["卤海带结"], key: "vegetable" },
  { keywords: ["卤牛肉", "卤鸡腿", "卤鸡爪", "卤鸡胗", "卤蛋", "卤鸭脖", "卤鸭翅", "卤鸭掌"], key: "chicken" },
  { keywords: ["番茄炒蛋", "西红柿炒鸡蛋", "紫菜蛋花汤", "韭菜炒鸡蛋", "外婆菜炒蛋", "擂椒皮蛋", "皮蛋瘦肉粥", "茶叶蛋"], key: "egg" },
  { keywords: ["蒜蓉西兰花", "白灼生菜", "凉拌黄瓜", "手撕包菜", "干锅花菜", "油焖春笋", "雪菜毛豆", "醋溜土豆丝", "青椒土豆丝", "白灼菜心"], key: "vegetable" },
  { keywords: ["煎饼果子", "肉夹馍", "鸡蛋灌饼", "手抓饼", "韭菜盒子", "小笼包", "生煎包", "锅贴", "烧麦", "油条", "豆腐脑", "胡辣汤"], key: "egg" },
  { keywords: ["蛋挞", "可颂", "瑞士卷", "泡芙", "提拉米苏", "奶油蛋糕", "芝士蛋糕", "豆沙面包", "奶黄面包", "肉松面包", "全家 香葱肉松面包", "罗森 巧克力可颂", "罗森 抹茶蛋糕卷"], key: "egg" },
  { keywords: ["7-11 海苔肉松饭团", "盒马 三文鱼寿司"], key: "rice" },
  { keywords: ["7-11 全麦鸡胸三明治", "山姆 烤鸡", "山姆 凯撒鸡肉沙拉", "盒马 鸡胸肉沙拉"], key: "chicken" },
  { keywords: ["苹果", "香蕉", "橙子", "草莓", "蓝莓", "西瓜", "芒果", "菠萝"], key: "vegetable" },
  { keywords: ["米饭", "糙米饭", "寿司饭", "饭团", "炒饭", "便当"], key: "rice" },
  { keywords: ["面", "粉", "米线", "河粉", "意大利面", "馄饨", "宽粉", "魔芋丝", "凉皮"], key: "noodle" },
  { keywords: ["鸡蛋", "鸭蛋", "茶叶蛋"], key: "egg" },
  { keywords: ["鸡胸肉", "鸡腿肉", "鸡翅", "白切鸡", "烤鸡", "鸡肉"], key: "chicken" },
  { keywords: ["牛", "肥牛", "牛肉串", "羊肉串", "麻辣烫", "冒菜", "串串香", "火锅"], key: "beef", exclude: ["牛奶", "酸牛奶", "纯牛奶", "奶茶", "拿铁", "酸奶", "希腊酸奶"] },
  { keywords: ["鱼", "虾", "鱿鱼", "生蚝", "三文鱼", "小龙虾"], key: "seafood" },
  { keywords: ["豆腐", "豆干", "鱼豆腐", "豆浆"], key: "tofu" },
  { keywords: ["菜", "西兰花", "菠菜", "生菜", "黄瓜", "番茄", "茄子", "韭菜", "金针菇", "苹果", "香蕉", "橙子", "草莓", "蓝莓", "西瓜", "芒果", "菠萝"], key: "vegetable" },
  { keywords: ["三明治", "沙拉", "鸡肉卷"], key: "chicken" },
];
const EXACT_FOOD_IMAGE_MAP = {
  菲力牛排: "filet-steak",
  牛里脊: "filet-steak",
  西冷牛排: "sirloin-steak",
  牛西冷: "sirloin-steak",
  肋眼牛排: "ribeye-steak",
  牛眼肉: "ribeye-steak",
  T骨牛排: "tbone-steak",
  牛上脑: "chuck-roll",
  牛板腱: "flat-iron-steak",
  牛肋条: "rib-finger",
  牛小排: "short-rib",
  牛腩: "beef-brisket",
  红彩椒: "bell-pepper-red",
  黄彩椒: "bell-pepper-yellow",
  橙彩椒: "bell-pepper-orange",
  白蘑菇: "button-mushroom",
  香菇: "shiitake-mushroom",
  圆白菜: "cabbage-head",
  百事无糖可乐: "cola-pepsi-zero",
  百事可乐: "cola-pepsi",
  美年达橙味: "mirinda-orange",
  美年达葡萄味: "mirinda-grape",
  雪碧: "sprite-bottle",
  芬达橙味: "fanta-orange",
  芬达葡萄味: "fanta-grape",
  北冰洋橙汽水: "beijing-soda",
  锅包肉: "pepper-pork-stirfry",
  糖醋里脊: "pepper-pork-stirfry",
  鱼香肉丝: "pepper-pork-stirfry",
  小炒黄牛肉: "broccoli-beef-stirfry",
  番茄牛腩: "beef-brisket",
  麻婆豆腐: "tofu-block",
  砂锅豆腐: "tofu-block",
  蘑菇汤: "button-mushroom",
  紫菜蛋花汤: "egg-plate",
  酸辣汤: "meal",
  可口可乐: "cola-pepsi",
  零度可口可乐: "cola-pepsi-zero",
  "元气森林 白桃气泡水": "sprite-bottle",
  "元气森林 青瓜气泡水": "sprite-bottle",
  "东方树叶 青柑普洱": "beijing-soda",
  "东方树叶 茉莉花茶": "beijing-soda",
  "三得利 无糖乌龙茶": "beijing-soda",
  "康师傅 冰红茶": "beijing-soda",
  "统一 阿萨姆奶茶": "yogurt-drink-bottle",
  "维他 柠檬茶": "beijing-soda",
  "农夫山泉": "beijing-soda",
  "农夫山泉 尖叫纤维饮料": "beijing-soda",
  "红牛 维生素牛磺酸饮料": "beijing-soda",
  "东鹏特饮": "beijing-soda",
  "美汁源 果粒橙": "orange-juice-glass",
  "安慕希 原味酸奶": "yogurt-cup",
  "纯甄 原味酸奶": "yogurt-cup",
  "伊利 纯牛奶": "milk-carton",
  "蒙牛 纯牛奶": "milk-carton",
  "光明 莫斯利安原味酸奶": "yogurt-cup",
  "伊利 优酸乳原味": "yogurt-drink-bottle",
  "养乐多 活菌型乳酸菌饮品": "yogurt-drink-bottle",
  "元气森林 冰茶": "beijing-soda",
};

const FOOD_IMAGE_RULES = [
  { keywords: ["米饭", "糙米饭", "寿司饭"], asset: "rice-bowl" },
  { keywords: ["燕麦片"], asset: "oatmeal-bowl" },
  { keywords: ["全麦面包", "白面包", "牛油果吐司"], asset: "bread-toast" },
  { keywords: ["玉米"], asset: "corn-cob", exclude: ["玉米油"] },
  { keywords: ["小米粥", "小米"], asset: "millet-porridge" },
  { keywords: ["土豆", "山药", "南瓜"], asset: "potato" },
  { keywords: ["红薯"], asset: "sweet-potato" },
  { keywords: ["鸡蛋", "水煮蛋", "炒蛋", "鸡蛋白", "鸭蛋"], asset: "egg-plate" },
  { keywords: ["鸡胸肉", "火鸡胸肉", "鸡腿肉", "鸡翅"], asset: "chicken-breast-plate" },
  { keywords: ["牛奶", "低脂牛奶", "豆浆"], asset: "milk-carton" },
  { keywords: ["无糖酸奶", "希腊酸奶"], asset: "yogurt-cup" },
  { keywords: ["豆腐", "北豆腐", "豆干", "腐竹"], asset: "tofu-block" },
  { keywords: ["西兰花"], asset: "broccoli" },
  { keywords: ["圆白菜", "卷心菜"], asset: "cabbage-head" },
  { keywords: ["白蘑菇"], asset: "button-mushroom" },
  { keywords: ["香菇"], asset: "shiitake-mushroom" },
  { keywords: ["红彩椒"], asset: "bell-pepper-red" },
  { keywords: ["黄彩椒"], asset: "bell-pepper-yellow" },
  { keywords: ["橙彩椒"], asset: "bell-pepper-orange" },
  { keywords: ["菠菜", "生菜", "黄瓜", "芦笋", "冬瓜", "芹菜", "莲藕", "紫甘蓝", "海带"], asset: "greens-bowl" },
  { keywords: ["番茄"], asset: "tomato" },
  { keywords: ["苹果"], asset: "apple-fruit", exclude: ["苹果派"] },
  { keywords: ["香蕉"], asset: "banana-bunch" },
  { keywords: ["花生油", "玉米油", "橄榄油", "黄油"], asset: "oil-bottle" },
  { keywords: ["杏仁", "核桃", "花生", "腰果", "开心果", "芝麻"], asset: "nut-mix" },
  { keywords: ["三文鱼"], asset: "salmon-fillet" },
  { keywords: ["虾仁"], asset: "shrimp-bowl" },
  { keywords: ["番茄牛腩"], asset: "beef-brisket" },
  { keywords: ["锅包肉", "糖醋里脊", "鱼香肉丝"], asset: "pepper-pork-stirfry" },
  { keywords: ["小炒黄牛肉", "青椒牛肉"], asset: "broccoli-beef-stirfry" },
  { keywords: ["麻婆豆腐", "砂锅豆腐"], asset: "tofu-block" },
  { keywords: ["紫菜蛋花汤"], asset: "egg-plate" },
  { keywords: ["蘑菇汤"], asset: "button-mushroom" },
  { keywords: ["蛋白粉"], asset: "protein-shake" },
  { keywords: ["啤酒", "白酒", "二锅头", "茅台", "五粮液", "汾酒", "剑南春", "洋河", "泸州老窖", "古井贡"], asset: "beijing-soda" },
  { keywords: ["可口可乐", "零度可口可乐", "元气森林", "东方树叶", "三得利", "冰红茶", "奶茶", "柠檬茶", "红牛", "东鹏", "果粒橙"], asset: "beijing-soda" },
  { keywords: ["烧鹅", "烧鸭", "叉烧", "白切鸡", "卤鸡腿", "卤牛肉", "卤鸭脖", "卤鸡爪", "卤蛋"], asset: "meal" },
  { keywords: ["回锅肉", "夫妻肺片", "水煮牛肉", "辣子鸡", "酸菜鱼", "毛血旺", "麻辣香锅"], asset: "meal" },
  { keywords: ["麻辣烫", "冒菜", "串串香", "毛肚", "黄喉", "鸭肠"], asset: "meal" },
  { keywords: ["虾滑", "小龙虾"], asset: "shrimp-bowl" },
  { keywords: ["鱼豆腐", "烤豆腐"], asset: "tofu-block" },
  { keywords: ["午餐肉"], asset: "ham-slices" },
  { keywords: ["宽粉", "魔芋丝"], asset: "noodle-bowl" },
  { keywords: ["肠粉", "皮蛋瘦肉粥", "豉汁蒸排骨", "清蒸鲈鱼", "蜜汁叉烧饭", "烧鸭饭"], asset: "meal" },
  { keywords: ["红烧排骨", "可乐鸡翅", "糖醋排骨", "蒜苔炒肉", "肉末茄子", "干煸豆角", "韭菜炒鸡蛋", "木须肉", "醋溜土豆丝", "手撕包菜", "香干炒肉"], asset: "meal" },
  { keywords: ["小炒肉", "辣椒炒肉", "剁椒鱼头", "外婆菜炒蛋", "擂椒皮蛋", "腊肉炒蒜苔", "农家一碗香", "干锅花菜"], asset: "meal" },
  { keywords: ["卤豆干", "卤海带结", "卤鸡胗", "卤猪耳朵", "卤鸭翅", "卤鸭掌"], asset: "meal" },
  { keywords: ["便当", "饭团", "三明治", "关东煮", "鸡肉卷", "沙拉"], asset: "meal" },
  { keywords: ["羊肉串", "牛肉串", "烤鸡皮", "烤五花肉", "烤韭菜"], asset: "meal" },
  { keywords: ["鸡翅中 烧烤"], asset: "chicken-wings-real" },
  { keywords: ["烤茄子"], asset: "eggplant-real" },
  { keywords: ["烤金针菇"], asset: "button-mushroom" },
  { keywords: ["烤玉米"], asset: "corn-cob" },
  { keywords: ["生蚝", "烤鱿鱼"], asset: "fish" },
  { keywords: ["烧麦", "小笼包", "生煎包", "韭菜盒子", "鸡蛋灌饼", "手抓饼", "煎饼果子", "肉夹馍", "豆腐脑", "胡辣汤", "油条", "糍饭团", "粢饭糕", "豆沙包", "奶黄包", "叉烧包", "馄饨", "锅贴", "葱油饼", "凉皮", "凉面", "烤冷面", "驴肉火烧"], asset: "grains" },
  { keywords: ["牛肉面", "小面", "酸辣粉", "米粉", "螺蛳粉", "热干面", "炸酱面", "担担面", "刀削面", "油泼面", "拌面", "阳春面", "馄饨面", "米线", "河粉", "炒米粉", "炒面", "豆皮", "伊面"], asset: "noodle-bowl" },
  { keywords: ["小鸡炖蘑菇", "猪肉炖粉条", "东北乱炖", "溜肉段", "杀猪菜", "尖椒干豆腐", "排骨炖豆角", "酸菜白肉", "东北大拉皮", "拔丝地瓜", "锅塌豆腐", "老厨白菜"], asset: "meal" },
  { keywords: ["东坡肉", "糖醋小排", "油爆虾", "西湖醋鱼", "龙井虾仁", "叫花鸡", "红烧狮子头", "扬州炒饭", "松鼠桂鱼", "腌笃鲜", "梅干菜烧肉", "清炒虾仁", "油焖春笋", "响油鳝糊", "蟹粉豆腐", "雪菜毛豆", "杭椒牛柳", "雪菜黄鱼"], asset: "meal" },
  { keywords: ["珍珠奶茶"], asset: "latte-cup" },
  { keywords: ["杨枝甘露"], asset: "orange-juice-glass" },
  { keywords: ["双皮奶"], asset: "yogurt-cup" },
  { keywords: ["芋圆", "仙草冻", "蛋挞", "泡芙", "瑞士卷", "奶油蛋糕", "芝士蛋糕", "提拉米苏"], asset: "snack" },
  { keywords: ["绿豆沙"], asset: "mung-beans-bowl" },
  { keywords: ["红豆沙"], asset: "red-beans-bowl" },
  { keywords: ["可颂", "肉松面包", "豆沙面包", "奶黄面包"], asset: "bread-toast" },
  { keywords: ["美式咖啡"], asset: "coffee-cup" },
  { keywords: ["生椰拿铁"], asset: "latte-cup" },
  { keywords: ["可乐"], asset: "cola-pepsi" },
  { keywords: ["雪碧"], asset: "sprite-bottle" },
  { keywords: ["美年达"], asset: "mirinda-orange" },
  { keywords: ["芬达"], asset: "fanta-orange" },
  { keywords: ["北冰洋"], asset: "beijing-soda" },
];
const CATEGORY_FOOD_IMAGE_MAP = {
  主食: "grains",
  蛋类: "egg-plate",
  肉类: "chicken",
  海鲜: "fish",
  乳制品: "dairy",
  豆制品: "soy",
  水果: "fruit",
  蔬菜: "vegetable",
  坚果: "nut-mix",
  油脂: "oil-bottle",
  调味: "meal",
  零食: "snack",
  补剂: "protein-shake",
  饮品: "meal",
  酒类: "beijing-soda",
  加工食品: "meal",
  轻食: "meal",
  川菜: "meal",
  广东菜: "meal",
  卤味: "meal",
  家常炒菜: "meal",
  湘菜: "meal",
  东北菜: "meal",
  江浙菜: "meal",
  火锅类: "meal",
  烧烤夜宵: "meal",
  甜品烘焙: "snack",
};
const MEAL_RECOMMENDATION_EXCLUDED_CATEGORIES = new Set(["油脂", "坚果", "调味", "零食", "饮品", "补剂", "加工食品", "连锁餐厅"]);
const DEFAULT_PREFERENCES = {
  language: "zh-CN",
  recommendation_mode: "home",
  pantry_items: ["鸡蛋", "米饭", "馒头", "豆腐", "鸡胸肉", "西红柿炒鸡蛋", "菠菜", "黄瓜", "西兰花", "牛奶", "豆浆", "香蕉"],
};
const PANTRY_PRESET_ITEMS = [
  "鸡蛋",
  "米饭",
  "馒头",
  "燕麦片",
  "玉米",
  "红薯",
  "面条",
  "牛奶",
  "豆浆",
  "无糖酸奶",
  "香蕉",
  "苹果",
  "鸡胸肉",
  "鸡腿肉",
  "瘦猪肉",
  "牛里脊",
  "虾仁",
  "豆腐",
  "北豆腐",
  "西红柿炒鸡蛋",
  "青椒肉丝",
  "西兰花",
  "菠菜",
  "黄瓜",
  "番茄",
  "土豆",
  "圆白菜",
  "芹菜",
  "小米粥",
];
const HIGH_RECOGNITION_IMAGE_MAP = {
  米饭: "rice-bowl",
  糙米饭: "rice-bowl",
  面条: "noodle-bowl",
  意大利面: "pasta-plate",
  荞麦面: "noodle-bowl",
  馒头: "mantou-real",
  包子: "baozi-real",
  饺子: "dumpling-plate",
  燕麦片: "oatmeal-bowl",
  小米粥: "millet-porridge",
  小米: "millet-grains",
  玉米: "corn-cob",
  红薯: "sweet-potato",
  土豆: "potato",
  南瓜: "pumpkin-slice",
  山药: "yam-root",
  鸡蛋: "egg-plate",
  鸭蛋: "salted-duck-egg",
  鸡胸肉: "chicken-breast-real",
  鸡腿肉: "chicken-thigh-real",
  鸡翅: "chicken-wings-real",
  牛奶: "milk-carton",
  低脂牛奶: "milk-carton",
  无糖酸奶: "yogurt-cup",
  希腊酸奶: "yogurt-cup",
  奶酪: "cheese-block",
  豆腐: "tofu-block",
  北豆腐: "tofu-block",
  豆浆: "soy-milk-cup",
  毛豆: "edamame-bowl",
  黄豆: "soybeans-bowl",
  红豆: "red-beans-bowl",
  绿豆: "mung-beans-bowl",
  香蕉: "banana-bunch",
  苹果: "apple-fruit",
  橙子: "orange-fruit",
  梨: "pear-fruit",
  葡萄: "grapes-cluster",
  草莓: "strawberry-bowl",
  蓝莓: "blueberry-bowl",
  西瓜: "watermelon-slice",
  猕猴桃: "kiwi-fruit",
  芒果: "mango-fruit",
  菠萝: "pineapple-fruit",
  木瓜: "papaya-half",
  火龙果: "dragon-fruit",
  牛油果: "avocado-half",
  樱桃: "cherry-pair",
  荔枝: "fruit",
  龙眼: "fruit",
  山竹: "fruit",
  榴莲: "fruit",
  哈密瓜: "fruit",
  香瓜: "fruit",
  桃子: "fruit",
  油桃: "fruit",
  李子: "fruit",
  杨梅: "fruit",
  柚子: "fruit",
  橘子: "orange-fruit",
  柠檬: "orange-fruit",
  百香果: "fruit",
  椰子肉: "fruit",
  椰子水: "soy-milk-cup",
  沙糖橘: "orange-fruit",
  圣女果: "tomato-real",
  青提: "grapes-cluster",
  红提: "grapes-cluster",
  西兰花: "broccoli-real",
  西兰花炒虾仁: "shrimp-bowl",
  西兰花炒牛肉: "broccoli-beef-stirfry",
  菠菜: "spinach-bundle",
  生菜: "lettuce-head",
  黄瓜: "cucumber-whole",
  番茄: "tomato-real",
  胡萝卜: "carrot-bunch",
  洋葱: "onion-real",
  青椒: "green-pepper",
  蘑菇: "button-mushroom",
  西红柿炒鸡蛋: "tomato-egg-stirfry",
  宫保鸡丁: "kung-pao-chicken",
  青椒肉丝: "pepper-pork-stirfry",
  锅包肉: "pepper-pork-stirfry",
  糖醋里脊: "pepper-pork-stirfry",
  鱼香肉丝: "pepper-pork-stirfry",
  番茄牛腩: "beef-brisket",
  小炒黄牛肉: "broccoli-beef-stirfry",
  麻婆豆腐: "tofu-block",
  砂锅豆腐: "tofu-block",
  紫菜蛋花汤: "egg-plate",
  酸辣汤: "meal",
  蘑菇汤: "button-mushroom",
  茶叶蛋: "boiled-egg-plate",
  饭团: "rice-bowl",
  三明治: "bread-toast",
  芦笋: "asparagus-bundle",
  卷心菜: "cabbage-head",
  花椰菜: "cauliflower-head",
  茄子: "eggplant-real",
  苦瓜: "bitter-melon",
  冬瓜: "winter-melon",
  芹菜: "celery-bundle",
  菜花: "cauliflower-head",
  莲藕: "lotus-root",
  紫甘蓝: "purple-cabbage",
  海带: "kelp-knot",
  杏仁: "almond-handful",
  核桃: "walnut-handful",
  花生: "peanut-handful",
  腰果: "cashew-handful",
  开心果: "pistachio-handful",
  芝麻: "sesame-bowl",
  橄榄油: "olive-oil-bottle",
  花生油: "peanut-oil-bottle",
  玉米油: "corn-oil-bottle",
  黄油: "butter-block",
  蜂蜜: "honey-jar",
  白砂糖: "sugar-bowl",
  黑巧克力: "dark-chocolate-bar",
  苏打饼干: "cracker-stack",
  薯片: "potato-chips-bag",
  蛋白粉: "protein-shake",
  乳清蛋白饮: "protein-shake",
  豆奶: "soy-milk-cup",
  橙汁: "orange-juice-glass",
  可乐: "cola-pepsi",
  咖啡: "coffee-cup",
  拿铁: "latte-cup",
  酸奶饮品: "yogurt-drink-bottle",
  青岛啤酒: "beijing-soda",
  雪花啤酒: "beijing-soda",
  百威啤酒: "beijing-soda",
  哈尔滨啤酒: "beijing-soda",
  燕京啤酒: "beijing-soda",
  乌苏啤酒: "beijing-soda",
  科罗娜啤酒: "beijing-soda",
  "1664白啤": "beijing-soda",
  福佳白啤: "beijing-soda",
  喜力啤酒: "beijing-soda",
  朝日啤酒: "beijing-soda",
  麒麟一番榨: "beijing-soda",
  茅台: "beijing-soda",
  五粮液: "beijing-soda",
  汾酒: "beijing-soda",
  剑南春: "beijing-soda",
  洋河蓝色经典: "beijing-soda",
  泸州老窖: "beijing-soda",
  古井贡酒: "beijing-soda",
  牛栏山二锅头: "beijing-soda",
  红星二锅头: "beijing-soda",
  牛肉干: "beef-jerky-pack",
  鸡肉肠: "chicken-sausage",
  火腿: "ham-slices",
  培根: "bacon-strips",
  寿司饭: "rice-bowl",
  藜麦: "quinoa-bowl",
  牛油果吐司: "avocado-toast",
  鸡胸肉沙拉: "chicken-salad-bowl",
  金枪鱼沙拉: "tuna-salad-bowl",
  炒蛋: "scrambled-egg-plate",
  水煮蛋: "boiled-egg-plate",
  鸡蛋白: "egg-white-plate",
  豆干: "tofu-dried-block",
  腐竹: "tofu-skin-bundle",
  鹰嘴豆: "chickpea-bowl",
  红烧肉: "meal",
  回锅肉: "pepper-pork-stirfry",
  夫妻肺片: "meal",
  水煮牛肉: "broccoli-beef-stirfry",
  辣子鸡: "meal",
  酸菜鱼: "fish",
  毛血旺: "meal",
  麻辣香锅: "meal",
  白切鸡: "chicken",
  烧鹅: "meal",
  叉烧: "ham-slices",
  豉汁蒸排骨: "meal",
  清蒸鲈鱼: "fish",
  蜜汁叉烧饭: "rice-bowl",
  烧鸭饭: "rice-bowl",
  肠粉: "noodle-bowl",
  皮蛋瘦肉粥: "millet-porridge",
  白灼生菜: "lettuce-head",
  卤鸡腿: "chicken-thigh-real",
  卤鸡爪: "chicken-wings-real",
  卤牛肉: "beef-jerky-pack",
  卤鸭脖: "meal",
  卤蛋: "egg-plate",
  凉拌黄瓜: "cucumber-whole",
  蒜蓉西兰花: "broccoli-real",
  地三鲜: "meal",
  青椒土豆丝: "green-pepper",
  番茄炒蛋: "tomato-egg-stirfry",
  梅菜扣肉: "meal",
  "红烧排骨": "meal",
  "可乐鸡翅": "meal",
  "糖醋排骨": "meal",
  "蒜苔炒肉": "meal",
  "肉末茄子": "eggplant-real",
  "干煸豆角": "greens-bowl",
  "韭菜炒鸡蛋": "egg-plate",
  "木须肉": "meal",
  "醋溜土豆丝": "potato",
  "手撕包菜": "cabbage-head",
  "香干炒肉": "tofu-dried-block",
  "小炒肉": "pepper-pork-stirfry",
  "辣椒炒肉": "pepper-pork-stirfry",
  "剁椒鱼头": "fish",
  "外婆菜炒蛋": "egg-plate",
  "擂椒皮蛋": "egg-plate",
  "腊肉炒蒜苔": "meal",
  "农家一碗香": "meal",
  "干锅花菜": "cauliflower-head",
  "卤豆干": "tofu-dried-block",
  "卤海带结": "kelp-knot",
  "卤鸡胗": "meal",
  "卤猪耳朵": "meal",
  "卤鸭翅": "meal",
  "卤鸭掌": "meal",
  "7-11 照烧鸡腿便当": "rice-bowl",
  "7-11 鸡胸肉沙拉": "chicken-salad-bowl",
  "7-11 关东煮海带结": "kelp-knot",
  "7-11 关东煮魔芋结": "meal",
  "7-11 关东煮鱼豆腐": "tofu-block",
  "全家 奥尔良鸡肉卷": "bread-toast",
  "全家 低糖鸡胸肉沙拉": "chicken-salad-bowl",
  "全家 溏心蛋饭团": "rice-bowl",
  "罗森 火腿鸡蛋三明治": "bread-toast",
  "罗森 日式照烧鸡腿便当": "rice-bowl",
  "罗森 关东煮海带结": "kelp-knot",
  "烧麦": "dumpling-plate",
  "小笼包": "baozi-real",
  "生煎包": "baozi-real",
  "韭菜盒子": "bread-toast",
  "鸡蛋灌饼": "bread-toast",
  "手抓饼": "bread-toast",
  "煎饼果子": "bread-toast",
  "肉夹馍": "bread-toast",
  "豆腐脑": "tofu-block",
  "胡辣汤": "meal",
  "油条": "bread-toast",
  "糍饭团": "rice-bowl",
  "粢饭糕": "rice-bowl",
  "豆沙包": "baozi-real",
  "奶黄包": "baozi-real",
  "叉烧包": "baozi-real",
  "馄饨": "dumpling-plate",
  "鲜肉小馄饨": "dumpling-plate",
  "锅贴": "dumpling-plate",
  "葱油饼": "bread-toast",
  "凉皮": "noodle-bowl",
  "凉面": "noodle-bowl",
  "烤冷面": "noodle-bowl",
  "臭豆腐": "tofu-block",
  "烤面筋": "snack",
  "糖油粑粑": "snack",
  "驴肉火烧": "bread-toast",
  "牛肉馅饼": "bread-toast",
  "鸭血粉丝汤": "noodle-bowl",
  "酒酿圆子": "meal",
  "兰州牛肉面": "noodle-bowl",
  "重庆小面": "noodle-bowl",
  "酸辣粉": "noodle-bowl",
  "桂林米粉": "noodle-bowl",
  "柳州螺蛳粉": "noodle-bowl",
  "热干面": "noodle-bowl",
  "炸酱面": "noodle-bowl",
  "担担面": "noodle-bowl",
  "刀削面": "noodle-bowl",
  "油泼面": "noodle-bowl",
  "葱油拌面": "noodle-bowl",
  "阳春面": "noodle-bowl",
  "红烧牛肉面": "noodle-bowl",
  "雪菜肉丝面": "noodle-bowl",
  "馄饨面": "noodle-bowl",
  "肥肠粉": "noodle-bowl",
  "牛肉粉": "noodle-bowl",
  "排骨米线": "noodle-bowl",
  "砂锅米线": "noodle-bowl",
  "鸡丝凉面": "noodle-bowl",
  "肉酱拌面": "noodle-bowl",
  "过桥米线": "noodle-bowl",
  "云吞面": "noodle-bowl",
  "牛肉河粉": "noodle-bowl",
  "干炒牛河": "noodle-bowl",
  "炒米粉": "noodle-bowl",
  "肉丝炒面": "noodle-bowl",
  "武汉豆皮": "bread-toast",
  "炒方便面": "noodle-bowl",
  "三鲜伊面": "noodle-bowl",
  "小鸡炖蘑菇": "chicken",
  "猪肉炖粉条": "meal",
  "东北乱炖": "meal",
  "溜肉段": "meal",
  "杀猪菜": "meal",
  "尖椒干豆腐": "tofu-dried-block",
  "排骨炖豆角": "meal",
  "酸菜白肉": "meal",
  "东北大拉皮": "meal",
  "拔丝地瓜": "sweet-potato",
  "锅塌豆腐": "tofu-block",
  "老厨白菜": "cabbage-head",
  "东坡肉": "meal",
  "糖醋小排": "meal",
  "油爆虾": "shrimp-bowl",
  "西湖醋鱼": "fish",
  "龙井虾仁": "shrimp-bowl",
  "叫花鸡": "chicken",
  "红烧狮子头": "meal",
  "扬州炒饭": "rice-bowl",
  "松鼠桂鱼": "fish",
  "腌笃鲜": "meal",
  "梅干菜烧肉": "meal",
  "清炒虾仁": "shrimp-bowl",
  "油焖春笋": "greens-bowl",
  "响油鳝糊": "fish",
  "蟹粉豆腐": "tofu-block",
  "雪菜毛豆": "edamame-bowl",
  "杭椒牛柳": "broccoli-beef-stirfry",
  "雪菜黄鱼": "fish",
  "伊利 纯牛奶": "milk-carton",
  "蒙牛 纯牛奶": "milk-carton",
  "光明 莫斯利安原味酸奶": "yogurt-cup",
  "伊利 优酸乳原味": "yogurt-drink-bottle",
  "养乐多 活菌型乳酸菌饮品": "yogurt-drink-bottle",
  "7-11 黑椒牛肉便当": "rice-bowl",
  "7-11 厚切火腿三明治": "bread-toast",
  "全家 金枪鱼三明治": "bread-toast",
  "全家 黑椒牛肉便当": "rice-bowl",
  "全家 关东煮鱼豆腐": "tofu-block",
  "罗森 鸡胸肉沙拉": "chicken-salad-bowl",
  "罗森 海苔肉松饭团": "rice-bowl",
  "罗森 关东煮魔芋结": "meal",
  "罗森 关东煮鱼豆腐": "tofu-block",
  "麻辣烫": "meal",
  "冒菜": "meal",
  "串串香": "meal",
  "火锅肥牛卷": "beef-brisket",
  "毛肚": "meal",
  "黄喉": "meal",
  "鸭肠": "meal",
  "虾滑": "shrimp-bowl",
  "鱼豆腐": "tofu-block",
  "午餐肉": "ham-slices",
  "宽粉": "noodle-bowl",
  "魔芋丝": "noodle-bowl",
  "羊肉串": "meal",
  "牛肉串": "meal",
  "鸡翅中 烧烤": "chicken-wings-real",
  "烤鸡皮": "meal",
  "烤五花肉": "meal",
  "烤茄子": "eggplant-real",
  "烤韭菜": "greens-bowl",
  "烤金针菇": "button-mushroom",
  "烤玉米": "corn-cob",
  "烤豆腐": "tofu-block",
  "生蚝": "fish",
  "烤鱿鱼": "fish",
  "小龙虾 蒜蓉": "shrimp-bowl",
  "小龙虾 麻辣": "shrimp-bowl",
  "珍珠奶茶": "latte-cup",
  "杨枝甘露": "orange-juice-glass",
  "双皮奶": "yogurt-cup",
  "芋圆": "snack",
  "仙草冻": "snack",
  "绿豆沙": "mung-beans-bowl",
  "红豆沙": "red-beans-bowl",
  "蛋挞": "snack",
  "泡芙": "snack",
  "瑞士卷": "snack",
  "奶油蛋糕": "snack",
  "芝士蛋糕": "snack",
  "可颂": "bread-toast",
  "肉松面包": "bread-toast",
  "豆沙面包": "bread-toast",
  "奶黄面包": "bread-toast",
  "提拉米苏": "snack",
  "美式咖啡": "coffee-cup",
  "生椰拿铁": "latte-cup",
  "7-11 全麦鸡胸三明治": "bread-toast",
  "7-11 海苔肉松饭团": "rice-bowl",
  "7-11 低糖希腊酸奶": "yogurt-cup",
  "全家 低糖希腊酸奶": "yogurt-cup",
  "全家 香葱肉松面包": "bread-toast",
  "罗森 巧克力可颂": "bread-toast",
  "罗森 冰美式咖啡": "coffee-cup",
  "全家 冰拿铁": "latte-cup",
  "7-11 冰美式咖啡": "coffee-cup",
  "罗森 抹茶蛋糕卷": "snack",
  "山姆 烤鸡": "chicken",
  "山姆 凯撒鸡肉沙拉": "chicken-salad-bowl",
  "盒马 三文鱼寿司": "rice-bowl",
  "盒马 鸡胸肉沙拉": "chicken-salad-bowl",
  "元气森林 冰茶": "beijing-soda",
  小麦当劳: "meal",
  西红柿炒鸡蛋: "tomato-egg-stirfry",
  宫保鸡丁: "kung-pao-chicken",
  青椒肉丝: "pepper-pork-stirfry",
  西兰花炒牛肉: "broccoli-beef-stirfry",
};

const state = {
  currentUser: null,
  selectedFood: null,
  foodDatabase: [],
  dashboardDate: new Date().toISOString().slice(0, 10),
  activePanel: "overview",
  mobileScreen: "home",
  mobileRecordTab: "food",
  mobileLayoutActive: false,
  mobileModulesMounted: false,
  lastDashboardSummary: null,
  activeRestaurantBrand: "",
  dashboardRequestId: 0,
  dashboardAbortController: null,
  dashboardLoading: false,
  mobileKeyboardOpen: false,
  mobileViewportBaseHeight: window.visualViewport?.height || window.innerHeight,
  mobileToastTimer: null,
  registerPicker: {
    fieldKey: "",
  },
  authTransitionMode: "",
};

const PANEL_NAMES = new Set(["overview", "food", "activity", "trend", "report", "assessment", "settings", "suggestion"]);
const MOBILE_SCREEN_META = {
  home: { kicker: "健康管理", title: "今日首页" },
  record: { kicker: "快速记录", title: "今日记录" },
  trend: { kicker: "趋势分析", title: "趋势与报告" },
  mine: { kicker: "个人中心", title: "我的资料" },
};
const MOBILE_RECORD_TABS = new Set(["food", "workout", "sleep", "weight"]);
const MOBILE_RECORD_LABELS = {
  food: "饮食",
  workout: "运动",
  sleep: "睡眠",
  weight: "体重",
};
const LIVE_TIMESTAMP_FIELDS = [
  ["food-hour", "food-hour-display", "food-minute", "food-minute-display"],
  ["workout-hour", "workout-hour-display", "workout-minute", "workout-minute-display"],
  ["weight-hour", "weight-hour-display", "weight-minute", "weight-minute-display"],
];
const REGISTER_NUMBER_PICKER_CONFIG = {
  age: {
    inputId: "register-age-input",
    label: "年龄",
    hint: "滑动选择年龄",
    options: buildNumericOptions(12, 80, 1).map((value) => ({ value, label: `${value} 岁` })),
  },
  height: {
    inputId: "register-height-input",
    label: "身高",
    hint: "滑动选择身高",
    options: buildNumericOptions(140, 210, 1).map((value) => ({ value, label: `${value} cm` })),
  },
  weight: {
    inputId: "register-weight-input",
    label: "当前体重",
    hint: "滑动选择当前体重",
    options: buildNumericOptions(35, 150, 0.1, 1).map((value) => ({ value, label: `${value} kg` })),
  },
  targetWeight: {
    inputId: "register-target-weight-input",
    label: "目标体重",
    hint: "滑动选择目标体重",
    options: buildNumericOptions(35, 150, 0.1, 1).map((value) => ({ value, label: `${value} kg` })),
  },
  targetSleep: {
    inputId: "register-target-sleep-input",
    label: "目标睡眠时长",
    hint: "滑动选择睡眠时长",
    options: buildNumericOptions(6, 10, 0.5, 1).map((value) => ({ value, label: `${value} 小时` })),
  },
};
Object.assign(REGISTER_NUMBER_PICKER_CONFIG, {
  assessmentAge: {
    inputId: "assessment-age",
    label: "年龄",
    hint: "滑动选择年龄",
    options: buildNumericOptions(12, 80, 1).map((value) => ({ value, label: `${value} 岁` })),
  },
  assessmentHeight: {
    inputId: "assessment-height",
    label: "身高",
    hint: "滑动选择身高",
    options: buildNumericOptions(140, 210, 1).map((value) => ({ value, label: `${value} cm` })),
  },
  assessmentWeight: {
    inputId: "assessment-weight",
    label: "体重",
    hint: "滑动选择体重",
    options: buildNumericOptions(35, 150, 0.1, 1).map((value) => ({ value, label: `${value} kg` })),
  },
  weightLogWeight: {
    inputId: "weight-kg-input",
    label: "当前体重",
    hint: "滑动选择当前体重",
    options: buildNumericOptions(35, 150, 0.1, 1).map((value) => ({ value, label: `${value} kg` })),
  },
  workoutDuration: {
    inputId: "workout-duration-input",
    label: "运动时长",
    hint: "滑动选择运动时长",
    options: buildNumericOptions(1, 240, 1).map((value) => ({ value, label: `${value} 分钟` })),
  },
  settingsAge: {
    inputId: "settings-age",
    label: "年龄",
    hint: "滑动选择年龄",
    options: buildNumericOptions(12, 80, 1).map((value) => ({ value, label: `${value} 岁` })),
  },
  settingsHeight: {
    inputId: "settings-height",
    label: "身高",
    hint: "滑动选择身高",
    options: buildNumericOptions(140, 210, 1).map((value) => ({ value, label: `${value} cm` })),
  },
  settingsWeight: {
    inputId: "settings-weight",
    label: "体重",
    hint: "滑动选择体重",
    options: buildNumericOptions(35, 150, 0.1, 1).map((value) => ({ value, label: `${value} kg` })),
  },
  settingsTargetWeight: {
    inputId: "settings-target-weight",
    label: "目标体重",
    hint: "滑动选择目标体重",
    options: buildNumericOptions(35, 150, 0.1, 1).map((value) => ({ value, label: `${value} kg` })),
  },
  settingsTargetSleep: {
    inputId: "settings-target-sleep",
    label: "目标睡眠时长",
    hint: "滑动选择睡眠时长",
    options: buildNumericOptions(6, 10, 0.5, 1).map((value) => ({ value, label: `${value} 小时` })),
  },
});
const MOBILE_PANEL_ROUTES = {
  overview: { screen: "home" },
  suggestion: { screen: "home" },
  food: { screen: "record", tab: "food" },
  activity: { screen: "record", tab: "workout" },
  trend: { screen: "trend" },
  report: { screen: "trend" },
  assessment: { screen: "trend" },
  settings: { screen: "mine" },
};
const MOBILE_MODULES = {
  food: {
    selector: "#panel-food > .card",
    host: () => document.querySelector('[data-mobile-record-pane="food"]'),
  },
  workout: {
    selector: "#panel-activity .panel-grid > .card:first-child",
    host: () => document.querySelector('[data-mobile-record-pane="workout"]'),
  },
  sleep: {
    selector: "#panel-activity .panel-grid > .card:last-child",
    host: () => document.querySelector('[data-mobile-record-pane="sleep"]'),
  },
  weight: {
    selector: "#panel-trend .panel-grid > .card:first-child",
    host: () => document.querySelector('[data-mobile-record-pane="weight"]'),
  },
  trend: {
    selector: "#panel-trend .panel-grid > .card:last-child",
    host: () => document.querySelector('[data-mobile-panel-host="trend"]'),
  },
  report: {
    selector: "#panel-report > .card",
    host: () => document.querySelector('[data-mobile-panel-host="report"]'),
  },
  assessment: {
    selector: "#panel-assessment > .panel-grid > .card:last-child",
    host: () => document.querySelector('[data-mobile-panel-host="assessment"]'),
  },
  settings: {
    selector: "#panel-settings > .card",
    host: () => document.querySelector('[data-mobile-panel-host="settings"]'),
  },
};
const mobileModuleRegistry = new Map();
const pickerScrollTimers = new WeakMap();
const PICKER_SCROLL_SETTLE_DELAY = 140;
const PICKER_TAP_MOVE_THRESHOLD = 10;
const BODY_TYPE_OPTIONS = [
  {
    value: "slim",
    label: "外胚",
    face: "outline-ectomorph",
    description: "通常给人四肢偏细、整体更修长的观感，更适合关注稳定饮食与恢复节奏。",
  },
  {
    value: "balanced",
    label: "中胚",
    face: "outline-mesomorph",
    description: "整体线条更均衡，适合直接按常规公式观察饮食、活动与体重趋势。",
  },
  {
    value: "broad",
    label: "内胚",
    face: "outline-endomorph",
    description: "围度观感相对更饱满一些，建议更关注长期趋势而不是单日波动。",
  },
];

const BRAND_HERO_CONFIG = {
  all: {
    title: "餐厅与外卖单品库",
    description: "把常见连锁餐厅、拌饭、盖饭和外卖单品集中展示。餐厅食品默认按 1 份记录，适合快速回填外食数据。",
    image: "/assets/restaurants/mcd-bigmac.svg",
  },
  "麦当劳": {
    title: "麦当劳固定单品",
    description: "优先收录常见汉堡、小食、早餐与甜点，方便你按单品固定值快速记录。",
    image: "/assets/restaurants/mcd-bigmac.svg",
  },
  "肯德基": {
    title: "肯德基固定单品",
    description: "覆盖炸鸡、汉堡、卷、蛋挞和翅类小食，适合外卖或堂食后一键补录。",
    image: "/assets/restaurants/kfc-original-chicken-bucket.svg",
  },
  "赛百味": {
    title: "赛百味固定单品",
    description: "以 6 英寸三明治为主，突出更直观的主食、肉类和酱料组合参考。",
    image: "/assets/restaurants/subway-turkey.svg",
  },
  "味千拉面": {
    title: "味千拉面固定单品",
    description: "以整碗拉面和常见日式配菜为主，更适合记录堂食型正餐。",
    image: "/assets/restaurants/ajisen-tonkotsu.svg",
  },
  "外卖常见": {
    title: "外卖常见高频正餐",
    description: "集中补足更贴近日常点单的盖饭、拌饭和日式饭类，适合快速记录学校、公司和居家外卖。",
    image: "/assets/restaurants/takeaway-tomato-brisket-rice.svg",
  },
  "鱼籽村": {
    title: "鱼籽村拌饭单品",
    description: "以鱼籽拌饭和双拼拌饭为主，适合快速记录重口味外卖拌饭类正餐。",
    image: "/assets/restaurants/yuzicun-signature-roe-rice.svg",
  },
  "米村拌饭": {
    title: "米村拌饭固定单品",
    description: "偏韩式拌饭和石锅饭风格，更适合记录带酱汁和肉类搭配的一人食正餐。",
    image: "/assets/restaurants/micun-feiniu-mixed-rice.svg",
  },
  "南城香": {
    title: "南城香外卖单品",
    description: "以番茄肥牛饭这类更家常的中式快餐为主，适合通勤和工作日正餐记录。",
    image: "/assets/restaurants/nanchengxiang-tomato-beef-rice.svg",
  },
  "吉野家": {
    title: "吉野家固定单品",
    description: "以牛肉饭这类标准化外食主食为主，适合快速回填常见连锁快餐数据。",
    image: "/assets/restaurants/yoshinoya-beef-rice.svg",
  },
  "留学生餐厅": {
    title: "留学生餐厅常见套餐",
    description: "保留更贴近日常学校或留学生餐厅的高频正餐，适合记录本地固定外卖和食堂套餐。",
    image: "/assets/restaurants/international-cafe-black-pepper-beef-rice.svg",
  },
};

function $(id) {
  return document.getElementById(id);
}

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures and keep the app usable.
  }
}

function storageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage failures and keep the app usable.
  }
}

function inferMessageState(message) {
  const text = String(message || "");
  if (!text.trim()) {
    return "idle";
  }
  if (/(成功|已更新|已进入|登录成功|注册成功|记录成功|保存设置)/.test(text)) {
    return "success";
  }
  if (/(失败|错误|不存在|不正确|未启动|不可访问)/.test(text)) {
    return "error";
  }
  if (/(请先|请输入|未选择|重试|同步中)/.test(text)) {
    return "warning";
  }
  return "info";
}

function setMessage(id, message, explicitState = "") {
  const node = $(id);
  if (!node) {
    return;
  }
  const compact = node.classList.contains("compact");
  node.className = `inline-message${compact ? " compact" : ""}`;
  const safeMessage = String(message || "").trim();
  if (!safeMessage) {
    node.textContent = "";
    node.removeAttribute("data-state");
    return;
  }

  const state = explicitState || inferMessageState(safeMessage);
  const lines = safeMessage.split("\n").filter(Boolean);
  const title = escapeHtml(lines[0] || "");
  const details = lines.slice(1);
  node.dataset.state = state;
  node.classList.add("is-active");
  node.innerHTML = `
    <div class="message-shell">
      <span class="message-dot" aria-hidden="true"></span>
      <div class="message-copy">
        <strong>${title}</strong>
        ${details.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}
      </div>
    </div>
  `;
}

function showMobileToast(message, durationMs = 1000) {
  const toast = $("mobile-toast");
  if (!toast) {
    return;
  }
  if (state.mobileToastTimer) {
    window.clearTimeout(state.mobileToastTimer);
    state.mobileToastTimer = null;
  }
  toast.textContent = String(message || "").trim();
  toast.classList.add("is-visible");
  state.mobileToastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    state.mobileToastTimer = null;
  }, durationMs);
}

function getFormData(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  Object.keys(data).forEach((key) => {
    if (data[key] === "") {
      delete data[key];
    }
  });
  return data;
}

const API_ERROR_FIELD_LABELS = {
  username: "用户名",
  password: "密码",
  name: "姓名",
  age: "年龄",
  gender: "性别",
  height_cm: "身高",
  weight_kg: "当前体重",
  target_weight_kg: "目标体重",
  target_sleep_hours: "目标睡眠时长",
  goal: "目标",
  activity_level: "活动水平",
  recommendation_mode: "推荐模式",
  body_type: "体型",
  target_algorithm: "算法",
};

function formatApiValidationDetail(detail) {
  if (!Array.isArray(detail) || !detail.length) {
    return "";
  }
  return detail
    .slice(0, 3)
    .map((item) => {
      const path = Array.isArray(item?.loc) ? item.loc.filter((part) => typeof part === "string" && part !== "body") : [];
      const fieldKey = path[path.length - 1] || "";
      const label = API_ERROR_FIELD_LABELS[fieldKey] || fieldKey || "提交内容";
      const message = typeof item?.msg === "string" ? item.msg.trim() : "";
      if (!message) {
        return `${label}填写有误`;
      }
      if (message.includes("Field required")) {
        return `请先填写${label}`;
      }
      if (message.includes("JSON decode error")) {
        return "提交内容格式不正确，请重新填写后再试";
      }
      if (message.includes("greater than or equal to")) {
        return `${label}低于允许范围`;
      }
      if (message.includes("less than or equal to")) {
        return `${label}超出允许范围`;
      }
      if (message.includes("greater than")) {
        return `${label}需要大于 0`;
      }
      if (message.includes("at least")) {
        return `${label}长度不够`;
      }
      return `${label}：${message}`;
    })
    .filter(Boolean)
    .join("；");
}

async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }
    throw new Error("后端服务未启动或不可访问，请先运行 docker compose up -d database backend frontend");
  }

  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }
  if (!response.ok) {
    const detail =
      typeof body?.detail === "string"
        ? body.detail
        : formatApiValidationDetail(body?.detail) || (typeof body?.message === "string"
          ? body.message
          : response.status === 400
            ? "提交内容有误，请检查后重试"
            : response.status === 401
              ? "用户名或密码不正确"
            : response.status === 404
                ? "请求的内容不存在"
                : response.status === 422
                  ? "注册信息里有未正确填写的字段，请检查后重试"
                : response.status >= 500
                  ? "后端服务处理失败，请稍后重试"
                  : "请求失败");
    throw new Error(detail);
  }
  return body;
}

function isAbortError(error) {
  return error?.name === "AbortError";
}

function setDashboardLoading(isLoading) {
  state.dashboardLoading = isLoading;
  const refreshButton = $("refresh-dashboard-btn");
  const dateInput = $("dashboard-date");
  if (refreshButton) {
    refreshButton.disabled = isLoading;
    refreshButton.dataset.loading = isLoading ? "true" : "false";
    refreshButton.textContent = isLoading ? "刷新中..." : "刷新首页";
  }
  if (dateInput) {
    dateInput.disabled = isLoading;
  }
}

function runSafeRenderStep(label, renderFn, fallbackFn = () => {}) {
  try {
    renderFn();
  } catch (error) {
    console.error(`${label} failed`, error);
    fallbackFn(error);
  }
}

function saveCurrentUser(user) {
  state.currentUser = user;
  storageSet(STORAGE_KEY, JSON.stringify(user));
}

function loadCurrentUser() {
  const raw = storageGet(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    storageRemove(STORAGE_KEY);
    return null;
  }
}

function clearCurrentUser() {
  state.currentUser = null;
  state.selectedFood = null;
  storageRemove(STORAGE_KEY);
}

function loadPreferences() {
  const raw = storageGet(PREFERENCES_KEY);
  if (!raw) {
    return { ...DEFAULT_PREFERENCES };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      pantry_items: Array.isArray(parsed?.pantry_items) ? parsed.pantry_items : DEFAULT_PREFERENCES.pantry_items,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

function savePreferences(preferences) {
  const merged = {
    ...DEFAULT_PREFERENCES,
    ...preferences,
    pantry_items: Array.isArray(preferences?.pantry_items) ? preferences.pantry_items : DEFAULT_PREFERENCES.pantry_items,
  };
  storageSet(PREFERENCES_KEY, JSON.stringify(merged));
  document.documentElement.lang = merged.language || "zh-CN";
}

function resolvePanelFromHash() {
  const panelName = window.location.hash.replace(/^#\/?/, "").trim();
  if (PANEL_NAMES.has(panelName)) {
    return panelName;
  }
  return "overview";
}

function syncPanelHash(panelName) {
  const nextHash = `#/${panelName}`;
  if (window.location.hash !== nextHash) {
    window.history.replaceState(null, "", nextHash);
  }
}

function setShellMode(mode) {
  document.body.dataset.shell = mode;
}

function isMobileAppLayout() {
  return window.matchMedia("(max-width: 860px)").matches;
}

function updateMobileTopbar() {
  const meta = MOBILE_SCREEN_META[state.mobileScreen] || MOBILE_SCREEN_META.home;
  const recordTitle = `${MOBILE_RECORD_LABELS[state.mobileRecordTab] || "记录"}记录`;
  if ($("mobile-kicker")) {
    $("mobile-kicker").textContent = meta.kicker;
  }
  if ($("mobile-title")) {
    $("mobile-title").textContent = state.mobileScreen === "record" ? recordTitle : meta.title;
  }
}

function inferPanelFromMobileState() {
  if (state.mobileScreen === "record") {
    return state.mobileRecordTab === "food" ? "food" : state.mobileRecordTab === "weight" ? "trend" : "activity";
  }
  if (state.mobileScreen === "trend") {
    return state.activePanel === "report" || state.activePanel === "assessment" ? state.activePanel : "trend";
  }
  if (state.mobileScreen === "mine") {
    return "settings";
  }
  return "overview";
}

function showMobileRecordTab(tab = "food", options = {}) {
  const { alignPane = false } = options;
  const safeTab = MOBILE_RECORD_TABS.has(tab) ? tab : "food";
  state.mobileRecordTab = safeTab;
  document.querySelectorAll(".mobile-record-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.mobileRecordTab === safeTab);
  });
  document.querySelectorAll(".mobile-record-pane").forEach((pane) => {
    pane.classList.toggle("active", pane.dataset.mobileRecordPane === safeTab);
  });
  if (state.mobileScreen === "record") {
    state.activePanel = inferPanelFromMobileState();
    syncPanelHash(state.activePanel);
  }
  updateMobileTopbar();
  if (alignPane && state.mobileScreen === "record") {
    queueMobileRecordPaneAlignment(safeTab);
  }
}

function showMobileScreen(screen = "home", options = {}) {
  const { recordTab = state.mobileRecordTab, preserveScroll = false, syncPanel = true, alignRecordPane = false } = options;
  const safeScreen = MOBILE_SCREEN_META[screen] ? screen : "home";
  state.mobileScreen = safeScreen;
  refreshLiveTimestampDefaults();
  document.querySelectorAll(".mobile-screen").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `mobile-screen-${safeScreen}`);
  });
  document.querySelectorAll(".mobile-nav-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.mobileScreen === safeScreen);
  });
  if (safeScreen === "record") {
    showMobileRecordTab(recordTab, { alignPane: alignRecordPane });
  } else {
    updateMobileTopbar();
  }
  if (syncPanel) {
    state.activePanel = inferPanelFromMobileState();
    syncPanelHash(state.activePanel);
  }
  if (safeScreen === "record" && alignRecordPane) {
    syncMobileKeyboardState();
    return;
  }
  if (!preserveScroll) {
    window.scrollTo({ top: 0, behavior: isMobilePerformanceMode() ? "auto" : "smooth" });
  }
  syncMobileKeyboardState();
}

function routeMobilePanel(panelName) {
  const route = MOBILE_PANEL_ROUTES[panelName];
  if (!route) {
    return false;
  }
  showMobileScreen(route.screen, {
    recordTab: route.tab || state.mobileRecordTab,
    preserveScroll: true,
    syncPanel: false,
  });
  return true;
}

function ensureMobileModuleEntry(key) {
  if (mobileModuleRegistry.has(key)) {
    return mobileModuleRegistry.get(key);
  }
  const config = MOBILE_MODULES[key];
  const node = document.querySelector(config?.selector || "");
  if (!config || !node || !node.parentNode) {
    return null;
  }
  const placeholder = document.createComment(`mobile-origin:${key}`);
  node.parentNode.insertBefore(placeholder, node);
  const entry = { node, placeholder };
  mobileModuleRegistry.set(key, entry);
  return entry;
}

function mountMobileModules() {
  Object.keys(MOBILE_MODULES).forEach((key) => {
    ensureMobileModuleEntry(key);
  });
  Object.keys(MOBILE_MODULES).forEach((key) => {
    const entry = ensureMobileModuleEntry(key);
    const host = MOBILE_MODULES[key].host();
    if (!entry || !host || entry.node.parentNode === host) {
      return;
    }
    host.appendChild(entry.node);
  });
  state.mobileModulesMounted = true;
}

function restoreMobileModules() {
  mobileModuleRegistry.forEach(({ node, placeholder }) => {
    const parent = placeholder.parentNode;
    if (!parent || node.parentNode === parent) {
      return;
    }
    parent.insertBefore(node, placeholder.nextSibling);
  });
  state.mobileModulesMounted = false;
}

function syncMobileProfile(user = state.lastDashboardSummary?.user || state.currentUser) {
  if (!user) {
    return;
  }
  if ($("mobile-user-name")) {
    $("mobile-user-name").textContent = user.name || user.username || "Health Manager";
  }
  if ($("mobile-user-goal")) {
    $("mobile-user-goal").textContent = `${goalLabel(user.goal)} · ${recommendationModeLabel(resolveRecommendationMode(user))}`;
  }
}

function renderMobileDashboard(summary) {
  if (!summary) {
    return;
  }
  state.lastDashboardSummary = summary;
  syncMobileProfile(summary.user);

  const timeline = computeGoalTimeline(summary);
  const mealRecommendation = safeBuildDynamicMealRecommendations(summary);
  const recommendationMode = recommendationModeLabel(resolveRecommendationMode(summary.user));
  const netBalance = Number(summary.daily_report.net_calorie_balance || 0);
  const balanceCopy =
    netBalance > 200 ? "今天整体摄入略高，优先收一收热量。" : netBalance < -450 ? "今天缺口偏大，注意别吃得过少。" : "今天状态相对平稳，继续按当前节奏执行。";
  const heroPills = [
    { label: "净差", value: `${summary.daily_report.net_calorie_balance} kcal` },
    { label: "睡眠", value: `${summary.daily_report.sleep_hours} h` },
  ];
  const statCards = [
    {
      label: "当前体重",
      value: `${summary.user.weight_kg} kg`,
      note: summary.user.goal === "maintain" ? "当前以稳定维持为主" : "作为趋势判断基准",
    },
    {
      label: "目标体重",
      value: summary.user.target_weight_kg ? `${summary.user.target_weight_kg} kg` : "未设置",
      note: summary.user.target_weight_kg ? "可在我的页继续调整" : "可在我的页设置目标",
    },
    {
      label: "到达日期",
      value: timeline.dateLabel,
      note: timeline.dateNote,
    },
    {
      label: "坚持天数",
      value: timeline.daysLabel,
      note: timeline.daysNote,
    },
    {
      label: "运动消耗",
      value: `${summary.daily_report.total_burned_kcal} kcal`,
      note: `总消耗 ${summary.daily_report.total_expenditure_kcal} kcal`,
    },
    {
      label: "目标总热量",
      value: summary.targets.goal_total_calories ? `${Math.round(summary.targets.goal_total_calories)} kcal` : "无需累计",
      note: summary.targets.goal_total_calories
        ? "按当前体重与目标体重差估算"
        : "维持模式不单独计算总热量差",
    },
  ];
  const goalRows = [
    {
      label: "热量",
      actual: summary.daily_report.total_intake_kcal,
      target: summary.targets.calorie_target,
      unit: "kcal",
    },
    {
      label: "蛋白",
      actual: summary.daily_report.protein.actual,
      target: summary.targets.protein_target,
      unit: "g",
    },
    {
      label: "脂肪",
      actual: summary.daily_report.fat.actual,
      target: summary.targets.fat_target,
      unit: "g",
    },
    {
      label: "碳水",
      actual: summary.daily_report.carbs.actual,
      target: summary.targets.carb_target,
      unit: "g",
    },
  ];
  const suggestions = (summary.daily_report.suggestions || []).slice(0, 3);
  const warnings = (summary.daily_report.warnings || []).slice(0, 2);

  if ($("mobile-hero-title")) {
    $("mobile-hero-title").textContent = summary.daily_report.conclusion || `${summary.user.name} 的今日重点`;
  }
  if ($("mobile-hero-summary")) {
    $("mobile-hero-summary").textContent = `${goalLabel(summary.user.goal)} · ${recommendationMode} · ${balanceCopy} 预计按当前节奏约 ${timeline.daysLabel}。`;
  }
  if ($("mobile-hero-pills")) {
    $("mobile-hero-pills").innerHTML = heroPills
      .map(
        (item) => `
          <article class="mobile-hero-pill">
            <span>${item.label}</span>
            <strong>${item.value}</strong>
          </article>
        `
      )
      .join("");
  }
  if ($("mobile-overview-highlight")) {
    $("mobile-overview-highlight").innerHTML = `
      <div class="mobile-card-head">
        <div>
          <p class="mobile-section-kicker">核心指标</p>
          <h3>先看体重、时间线和目标热量</h3>
        </div>
      </div>
      <div class="mobile-stat-grid">
        ${statCards
          .map(
            (item) => `
              <article class="mobile-stat-card">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
                <small>${item.note}</small>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }
  if ($("mobile-home-goals")) {
    $("mobile-home-goals").innerHTML = `
      <div class="mobile-card-head">
        <div>
          <p class="mobile-section-kicker">目标完成度</p>
          <h3>不用进详情，也能先判断今天差在哪</h3>
        </div>
        <span class="mobile-card-badge">${timeline.dateLabel}</span>
      </div>
      <div class="mobile-goal-list">
        ${goalRows
          .map((item) => {
            const percent = completionPercent(item.actual, item.target);
            return `
              <article class="mobile-goal-row">
                <div class="mobile-goal-copy">
                  <strong>${item.label}</strong>
                  <span>${Math.round(item.actual)} / ${Math.round(item.target)} ${item.unit}</span>
                </div>
                <div class="mobile-progress-track">
                  <div class="mobile-progress-fill" style="width:${Math.min(percent, 100)}%"></div>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    `;
  }
  if ($("mobile-home-recommendation")) {
    $("mobile-home-recommendation").innerHTML = renderMobileMealRecommendation(mealRecommendation);
  }
  if ($("mobile-home-suggestion")) {
    $("mobile-home-suggestion").innerHTML = `
      <div class="mobile-card-head">
        <div>
          <p class="mobile-section-kicker">执行建议</p>
          <h3>${summary.daily_report.conclusion}</h3>
        </div>
        <span class="mobile-card-badge">${summary.daily_report.sleep_status}</span>
      </div>
      <div class="mobile-suggestion-stack">
        ${(suggestions.length ? suggestions : ["先补充今天的饮食、运动或睡眠记录，再回来查看建议。"])
          .map(
            (item) => `
              <div class="mobile-suggestion-item">
                <span class="mobile-suggestion-dot"></span>
                <p>${escapeHtml(item)}</p>
              </div>
            `
          )
          .join("")}
      </div>
      ${
        warnings.length
          ? `
            <div class="mobile-warning-strip">
              ${warnings.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
            </div>
          `
          : ""
      }
      <div class="mobile-home-actions">
        <button type="button" class="ghost-btn mobile-link-btn" data-mobile-screen-link="trend">看完整趋势与报告</button>
        <button type="button" class="primary-btn mobile-link-btn" data-mobile-record-tab="food">现在去记录</button>
      </div>
    `;
  }
}

function renderMobileMealRecommendation(recommendation) {
  if (!recommendation || !recommendation.meals?.length) {
    return `
      <div class="mobile-card-head">
        <div>
          <p class="mobile-section-kicker">今日推荐饮食</p>
          <h3>三餐建议会跟着今天的记录结果刷新</h3>
        </div>
      </div>
      <p class="mobile-meal-empty">先补充今天的饮食、运动或睡眠记录，再回来查看更贴合今天状态的三餐安排。</p>
    `;
  }

  return `
    <div class="mobile-card-head">
      <div>
        <p class="mobile-section-kicker">今日推荐饮食</p>
        <h3>按今天的热量差先把三餐顺下来</h3>
      </div>
    </div>
    <div class="mobile-meal-recommendation-grid">
      ${recommendation.meals
        .map((meal) => {
          const foods = meal.items
            .slice(0, 3)
            .map(
              (item) => `
                <span class="mobile-meal-food-chip">
                  <strong>${escapeHtml(item.name)}</strong>
                  <small>${item.grams} g</small>
                </span>
              `
            )
            .join("");
          const alternatives = meal.alternatives.length
            ? meal.alternatives.slice(0, 2).map((name) => escapeHtml(name)).join(" / ")
            : "同类主食、蛋白或蔬菜都可以替换";
          return `
            <article class="mobile-meal-card">
              <div class="mobile-meal-card-head">
                <span class="mobile-meal-badge">${escapeHtml(meal.label)}</span>
                <strong>${escapeHtml(meal.focus)}</strong>
              </div>
              <p class="mobile-meal-copy">${escapeHtml(meal.structure)}</p>
              <div class="mobile-meal-foods">${foods}</div>
              <div class="mobile-meal-meta">
                <span>${escapeHtml(meal.status)}</span>
                <strong>约 ${meal.totalKcal} kcal</strong>
              </div>
              <p class="mobile-meal-alt">可替换：${alternatives}</p>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function syncResponsiveAppShell(options = {}) {
  const { syncFromPanel = false } = options;
  const mobileShell = $("mobile-app-shell");
  if (!mobileShell) {
    return;
  }
  const mobileActive = isMobileAppLayout();
  const switchedLayout = state.mobileLayoutActive !== mobileActive;
  state.mobileLayoutActive = mobileActive;

  if (document.body.dataset.shell !== "app") {
    mobileShell.classList.add("hidden");
    if (state.mobileModulesMounted) {
      restoreMobileModules();
    }
    syncMobileKeyboardState();
    return;
  }

  mobileShell.classList.toggle("hidden", !mobileActive);
  if (mobileActive) {
    mountMobileModules();
    if (syncFromPanel || switchedLayout) {
      routeMobilePanel(state.activePanel);
    }
    showMobileRecordTab(state.mobileRecordTab);
    showMobileScreen(state.mobileScreen, { recordTab: state.mobileRecordTab, preserveScroll: true });
    syncMobileProfile();
    syncMobileKeyboardState();
    return;
  }

  if (state.mobileModulesMounted) {
    restoreMobileModules();
  }
  if (switchedLayout) {
    showPanel(inferPanelFromMobileState(), { animate: false });
  }
  syncMobileKeyboardState();
}

function goalLabel(goal) {
  const labels = {
    fat_loss: "减脂",
    maintain: "维持",
    muscle_gain: "增肌",
  };
  return labels[goal] || goal;
}

function activityLabel(level) {
  const labels = {
    sedentary: "久坐",
    light: "轻度活动",
    medium: "中等活动",
    high: "高强度活动",
  };
  return labels[level] || level;
}

function genderLabel(gender) {
  return String(gender).toLowerCase() === "male" ? "男性" : "女性";
}

function bodyTypeLabel(value) {
  return getBodyTypeOption(value || "balanced").label;
}

function recommendationModeLabel(mode) {
  const labels = {
    home: "家常模式",
    fitness: "健身模式",
    eat_out: "外食模式",
  };
  return labels[mode] || "家常模式";
}

function resolveRecommendationMode(user) {
  return user?.recommendation_mode || loadPreferences().recommendation_mode || "home";
}

function computeBmiProfile({ age, gender, height_cm, weight_kg }) {
  const safeHeightM = Number(height_cm) / 100;
  const safeWeight = Number(weight_kg);
  const bmi = safeHeightM > 0 ? safeWeight / (safeHeightM * safeHeightM) : 0;
  let status = "正常";
  let description = "体重在推荐区间内，可以继续保持。";
  if (bmi < 18.5) {
    status = "营养不良";
    description = "体重偏低，建议关注能量和蛋白质摄入。";
  } else if (bmi >= 24 && bmi < 28) {
    status = "超重";
    description = "体重已高于推荐区间，建议控制热量并增加活动。";
  } else if (bmi >= 28) {
    status = "肥胖";
    description = "体重明显超出推荐区间，需要更系统地管理饮食和运动。";
  }
  const genderAdjust = gender === "female" ? -161 : 5;
  const bmr = 10 * safeWeight + 6.25 * Number(height_cm) - 5 * Number(age) + genderAdjust;
  return {
    age: Number(age),
    height_cm: Number(height_cm),
    weight_kg: safeWeight,
    bmi: Number(bmi.toFixed(1)),
    bmr: Math.round(bmr),
    status,
    description,
  };
}

function getBodyTypeOption(value) {
  return BODY_TYPE_OPTIONS.find((item) => item.value === value) || BODY_TYPE_OPTIONS[1];
}

function renderBodyTypePicker(containerId, inputId, selectedValue = "balanced") {
  const container = $(containerId);
  const input = $(inputId);
  if (!container || !input) {
    return;
  }

  input.value = selectedValue || "balanced";
  container.innerHTML = BODY_TYPE_OPTIONS
    .map(
      (item) => `
        <button
          type="button"
          class="body-type-card${item.value === input.value ? " active" : ""}"
          data-body-type="${item.value}"
          data-target-input="${inputId}"
        >
          <span class="body-type-face">${renderBodyTypeIcon(item.face)}</span>
          <strong>${item.label}</strong>
          <span>${item.description}</span>
        </button>
      `
    )
    .join("");
}

function renderBodyTypeIcon(iconKey) {
  const icons = {
    "outline-ectomorph": `
      <svg viewBox="0 0 84 84" aria-hidden="true">
        <circle cx="42" cy="11" r="7.5" fill="none" stroke="currentColor" stroke-width="3.6"/>
        <path d="M31 24c-4 2-6 7-6 13v19c0 3 1 5 4 5s4-2 4-5V42" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M53 24c4 2 6 7 6 13v19c0 3-1 5-4 5s-4-2-4-5V42" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M36 23c2-3 4-4 6-4s4 1 6 4c1 2 2 5 2 9v26c0 3-2 5-4 5h-8c-2 0-4-2-4-5V32c0-4 1-7 2-9Z" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linejoin="round"/>
        <path d="M39 63v14c0 3-1 4-3 4s-3-1-3-4V63" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/>
        <path d="M45 63v14c0 3 1 4 3 4s3-1 3-4V63" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/>
      </svg>
    `,
    "outline-mesomorph": `
      <svg viewBox="0 0 84 84" aria-hidden="true">
        <circle cx="42" cy="11" r="7.5" fill="none" stroke="currentColor" stroke-width="3.6"/>
        <path d="M28 24c-6 2-9 7-9 15v18c0 3 2 5 4 5s4-2 4-5V40" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M56 24c6 2 9 7 9 15v18c0 3-2 5-4 5s-4-2-4-5V40" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M31 23c3-3 7-5 11-5s8 2 11 5c2 3 3 6 3 11v24c0 4-3 6-6 6H34c-3 0-6-2-6-6V34c0-5 1-8 3-11Z" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linejoin="round"/>
        <path d="M35 64v13c0 3-2 5-4 5s-4-2-4-5V64" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"/>
        <path d="M49 64v13c0 3 2 5 4 5s4-2 4-5V64" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"/>
      </svg>
    `,
    "outline-endomorph": `
      <svg viewBox="0 0 84 84" aria-hidden="true">
        <circle cx="42" cy="11" r="7.5" fill="none" stroke="currentColor" stroke-width="3.6"/>
        <path d="M23 24c-8 2-13 9-13 17v17c0 3 2 5 5 5s5-2 5-5V41" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M61 24c8 2 13 9 13 17v17c0 3-2 5-5 5s-5-2-5-5V41" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M27 24c4-4 9-6 15-6s11 2 15 6c4 4 5 8 5 13v18c0 6-4 10-10 10H32c-6 0-10-4-10-10V37c0-5 1-9 5-13Z" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linejoin="round"/>
        <path d="M35 65v13c0 4-2 5-5 5s-5-1-5-5V65" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"/>
        <path d="M49 65v13c0 4 2 5 5 5s5-1 5-5V65" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"/>
      </svg>
    `,
  };
  return icons[iconKey] || "";
}

function isSameFoodSelection(foodA, foodB) {
  if (!foodA || !foodB) {
    return false;
  }
  if (foodA.food_id && foodB.food_id) {
    return Number(foodA.food_id) === Number(foodB.food_id);
  }
  return `${foodA.brand || ""}-${foodA.name}` === `${foodB.brand || ""}-${foodB.name}`;
}

function sameFoodIdentity(foodA, foodB) {
  return isSameFoodSelection(foodA, foodB);
}

function renderFoodCard(food, index = 0) {
  const isSelected = isSameFoodSelection(food, state.selectedFood);
  return `
    <article class="food-result-card${isSelected ? " is-selected" : ""}" style="--card-index:${index}">
      <img src="${foodImagePath(food)}" alt="${food.name}" loading="lazy" decoding="async" />
      <div class="food-result-body">
        <h4>${food.name}</h4>
        <p>${food.brand ? `${food.brand} · ` : ""}${food.category} · 每 100g ${food.calories_per_100g} kcal · 蛋白 ${food.protein}g · 脂肪 ${food.fat}g · 碳水 ${food.carbs}g</p>
        <div class="chip-row">
          ${(food.aliases || []).slice(0, 4).map((alias) => `<span class="chip">${alias}</span>`).join("")}
        </div>
        <div class="food-avatar-badge">我是 ${food.name}</div>
        <button type="button" class="secondary-btn select-food-btn" data-food='${JSON.stringify(food)}'>记录这份食物</button>
      </div>
    </article>
  `;
}

function renderBrandHero(brand) {
  const config = BRAND_HERO_CONFIG[brand] || BRAND_HERO_CONFIG.all;
  if (!brand) {
    $("restaurant-brand-hero").innerHTML = "";
    $("restaurant-brand-hero").classList.add("hidden");
    return;
  }
  $("restaurant-brand-hero").classList.remove("hidden");
  $("restaurant-brand-hero").innerHTML = `
    <div class="restaurant-brand-hero-copy">
      <p class="eyebrow">品牌专区</p>
      <h4>${config.title}</h4>
      <p>${config.description}</p>
    </div>
    <img src="${config.image}" alt="${config.title}" />
  `;
}

function updateFoodCookingOptions(food) {
  const cookingBlock = $("food-cooking-block");
  const cookingSelect = $("food-cooking-method");
  const cookingHint = $("food-cooking-hint");
  if (!cookingBlock || !cookingSelect || !cookingHint) {
    return;
  }

  cookingSelect.innerHTML = `<option value="">按基础做法记录</option>`;

  if (!food || isRestaurantFood(food) || !(food.cooking_options || []).length) {
    cookingBlock.classList.add("hidden");
    cookingHint.textContent = "选择食物后，这里会显示不同做法对热量和营养的影响提示。";
    return;
  }

  cookingBlock.classList.remove("hidden");
  food.cooking_options.forEach((option) => {
    const optionNode = document.createElement("option");
    optionNode.value = option.method;
    optionNode.textContent = `${option.method} · ${option.calories_per_100g} kcal/100g`;
    cookingSelect.append(optionNode);
  });
  const firstOption = food.cooking_options[0];
  cookingHint.textContent = `${firstOption.note} 当前可选 ${food.cooking_options.length} 种做法。`;
}

function updateFoodCookingHint(food) {
  const cookingHint = $("food-cooking-hint");
  const cookingSelect = $("food-cooking-method");
  if (!cookingHint || !cookingSelect) {
    return;
  }
  if (!food || !(food.cooking_options || []).length || !cookingSelect.value) {
    return;
  }
  const selectedOption = food.cooking_options.find((option) => option.method === cookingSelect.value);
  if (!selectedOption) {
    return;
  }
  cookingHint.textContent = `${selectedOption.note} 估算值：每 100g 约 ${selectedOption.calories_per_100g} kcal，蛋白 ${selectedOption.protein}g，脂肪 ${selectedOption.fat}g，碳水 ${selectedOption.carbs}g。`;
}

function scrollFoodLogFlow(targetId, block = "start", delayMs = 0) {
  window.setTimeout(() => {
    const target = $(targetId);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: isMobilePerformanceMode() ? "auto" : "smooth", block });
  }, delayMs);
}

function scrollMobileRecordPaneToTop(tab = state.mobileRecordTab, delayMs = 0) {
  const safeTab = MOBILE_RECORD_TABS.has(tab) ? tab : "food";
  window.setTimeout(() => {
    window.requestAnimationFrame(() => {
      const pane = document.querySelector(`[data-mobile-record-pane="${safeTab}"]`);
      const target = pane?.querySelector(".module-head") || pane?.firstElementChild;
      const tabs = document.querySelector("#mobile-screen-record .mobile-record-tabs");
      if (!target || !tabs) {
        return;
      }
      const stickyOffset = tabs.offsetHeight + 14;
      const top = window.scrollY + target.getBoundingClientRect().top - stickyOffset;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: isMobilePerformanceMode() ? "auto" : "smooth",
      });
    });
  }, delayMs);
}

function queueMobileRecordPaneAlignment(tab = state.mobileRecordTab) {
  scrollMobileRecordPaneToTop(tab, 16);
  scrollMobileRecordPaneToTop(tab, 220);
}

function scrollToFoodSearchSummary(delayMs = 0) {
  window.setTimeout(() => {
    const target = $("food-search-state") || $("food-results");
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: isMobilePerformanceMode() ? "auto" : "smooth", block: "start" });
  }, delayMs);
}

function isMobileTextEntryElement(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  if (element instanceof HTMLTextAreaElement) {
    return !element.readOnly && !element.disabled;
  }
  if (!(element instanceof HTMLInputElement)) {
    return false;
  }
  if (element.readOnly || element.disabled) {
    return false;
  }
  const textLikeTypes = new Set(["", "email", "number", "password", "search", "tel", "text", "url"]);
  return textLikeTypes.has((element.type || "").toLowerCase());
}

function setMobileKeyboardState(open) {
  state.mobileKeyboardOpen = Boolean(open) && state.mobileLayoutActive;
  document.body.classList.toggle("mobile-keyboard-open", state.mobileKeyboardOpen);
}

function syncMobileKeyboardState() {
  const hasVisualViewport = Boolean(window.visualViewport);
  const viewportHeight = hasVisualViewport ? window.visualViewport.height : window.innerHeight;
  if (!state.mobileLayoutActive || document.body.dataset.shell !== "app") {
    state.mobileViewportBaseHeight = viewportHeight;
    setMobileKeyboardState(false);
    return;
  }
  if (!hasVisualViewport) {
    state.mobileViewportBaseHeight = viewportHeight;
    setMobileKeyboardState(false);
    return;
  }
  const activeField = document.activeElement;
  state.mobileViewportBaseHeight = Math.max(state.mobileViewportBaseHeight || 0, viewportHeight);
  if (!isMobileTextEntryElement(activeField)) {
    setMobileKeyboardState(false);
    return;
  }
  const baseline = state.mobileViewportBaseHeight || viewportHeight;
  const keyboardOpen = baseline - viewportHeight > 110;
  setMobileKeyboardState(keyboardOpen);
}

function syncSelectedFoodCard() {
  document.querySelectorAll(".food-result-card").forEach((card) => {
    const button = card.querySelector(".select-food-btn");
    if (!button) {
      return;
    }
    const food = JSON.parse(button.dataset.food);
    card.classList.toggle("is-selected", isSameFoodSelection(food, state.selectedFood));
  });
}

function bindFoodSelectButtons() {
  document.querySelectorAll(".select-food-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const food = JSON.parse(button.dataset.food);
      state.selectedFood = food;
      $("selected-food-name").textContent = food.name;
      $("selected-food-meta").textContent = `${food.brand ? `${food.brand} · ` : ""}${food.category} · 每 100g ${food.calories_per_100g} kcal · 蛋白 ${food.protein}g`;
      $("selected-food-image").src = foodImagePath(food);
      $("selected-food-image").classList.remove("hidden");
      $("food-portion-hint").textContent = food.portion_hint || "这类食物还没有录入份量参考，你可以先按包装标注或实际称重填写。";
      updateFoodServingMode(food);
      updateFoodCookingOptions(food);
      syncSelectedFoodCard();
      setMessage("food-log-result", "");
      scrollFoodLogFlow("selected-food", "start", 120);
    });
  });
}

function isRestaurantFood(food) {
  return Boolean(food?.brand || food?.category === "连锁餐厅");
}

function updateFoodServingMode(food) {
  const isRestaurant = isRestaurantFood(food);
  const weightBlock = $("food-weight-block");
  const servingMode = $("food-serving-mode");
  const weightInput = $("food-weight-input");
  const weightPreset = $("food-weight-preset");

  if (!weightBlock || !servingMode || !weightInput || !weightPreset) {
    return;
  }

  if (!food) {
    weightBlock.classList.remove("hidden");
    servingMode.classList.add("hidden");
    weightInput.required = true;
    weightInput.value = "";
    weightPreset.value = "";
    $("food-serving-title").textContent = "按 1 份记录";
    $("food-serving-copy").textContent = "这类餐厅单品按固定份量提交，不需要再手动选择克数。";
    return;
  }

  if (isRestaurant) {
    const servingSize = Number(food.serving_size_g || 0);
    weightBlock.classList.add("hidden");
    servingMode.classList.remove("hidden");
    weightInput.required = false;
    weightInput.value = servingSize ? String(servingSize) : "";
    weightPreset.value = "";
    $("food-serving-title").textContent = `${food.name} 按 1 份记录`;
    $("food-serving-copy").textContent = servingSize
      ? `系统将直接按固定份量 ${servingSize}g 记录，你只需要选择时间并提交。`
      : "这类餐厅单品按固定份量提交，不需要再手动选择克数。";
    return;
  }

  weightBlock.classList.remove("hidden");
  servingMode.classList.add("hidden");
  weightInput.required = true;
  if (!weightInput.value && food.serving_size_g) {
    weightInput.value = String(food.serving_size_g);
  }
}

function updateBodyTypeSelection(inputId, value) {
  const input = $(inputId);
  if (!input) {
    return;
  }
  input.value = value;
  document.querySelectorAll(`[data-target-input="${inputId}"]`).forEach((card) => {
    card.classList.toggle("active", card.dataset.bodyType === value);
  });
}

function formatMacroLine(label, macro) {
  return `${label}：${macro.actual}g / ${macro.target}g（${macro.status}）`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundToStep(value, step = 5) {
  return Math.round(value / step) * step;
}

function normalizeCategory(food) {
  return String(food?.category || "");
}

function isFruitFood(food) {
  return normalizeCategory(food) === "水果" || /苹果|香蕉|橙|葡萄|草莓|蓝莓|猕猴桃|西瓜|芒果|火龙果|木瓜|菠萝|樱桃/.test(food.name);
}

function isVegetableFood(food) {
  return normalizeCategory(food) === "蔬菜" || /西兰花|生菜|菠菜|黄瓜|番茄|胡萝卜|洋葱|蘑菇|芦笋|紫甘蓝|菜花|青椒|苦瓜|冬瓜|海带/.test(food.name);
}

function isProteinFood(food) {
  return ["肉类", "海鲜", "蛋类", "乳制品", "豆制品", "补剂"].includes(normalizeCategory(food)) || Number(food.protein || 0) >= 10;
}

function isCarbFood(food) {
  return normalizeCategory(food) === "主食" || Number(food.carbs || 0) >= 12 || /米|面|燕麦|玉米|小米|土豆|红薯|藜麦|吐司|面包|馒头/.test(food.name);
}

function isFatFood(food) {
  return normalizeCategory(food) === "坚果" || Number(food.fat || 0) >= 10 || /牛油果|花生|杏仁|核桃|腰果|芝麻/.test(food.name);
}

function isBreakfastFriendly(food) {
  return (
    ["主食", "蛋类", "乳制品", "水果", "豆制品"].includes(normalizeCategory(food)) ||
    /鸡蛋|牛奶|酸奶|燕麦|面包|吐司|香蕉|苹果|豆浆|玉米|小米|南瓜/.test(food.name)
  );
}

function includesFoodKeyword(name, keywords) {
  return keywords.some((keyword) => name.includes(keyword));
}

function isChineseHomeStaple(food) {
  return /米饭|糙米饭|馒头|面条|玉米|红薯|小米粥|燕麦片|山药|南瓜|包子/.test(food.name);
}

function isChineseHomeProtein(food) {
  return /鸡蛋|鸡胸肉|鸡腿肉|瘦猪肉|牛里脊|虾仁|豆腐|北豆腐|西红柿炒鸡蛋|青椒肉丝|牛奶|豆浆/.test(food.name);
}

function isChineseHomeVegetable(food) {
  return /菠菜|西兰花|黄瓜|番茄|圆白菜|芹菜|生菜|菜花|花椰菜|西红柿炒鸡蛋|青椒肉丝/.test(food.name);
}

function getAvailablePantryFoods(foods) {
  const preferences = loadPreferences();
  const pantrySet = new Set(preferences.pantry_items || []);
  return foods.filter((food) => pantrySet.has(food.name));
}

function getRecommendationFoods(foods, mode = loadPreferences().recommendation_mode || "home") {
  const pantryFoods = getAvailablePantryFoods(foods);
  const homeFoods = foods.filter((food) => isChineseHomeStaple(food) || isChineseHomeProtein(food) || isChineseHomeVegetable(food));
  const fitnessFoods = foods.filter((food) => /鸡胸肉|火鸡胸肉|虾仁|三文鱼|鸡蛋|鸡蛋白|燕麦片|糙米饭|藜麦|红薯|玉米|西兰花|菠菜|无糖酸奶|希腊酸奶|豆腐|北豆腐|牛里脊|瘦牛肉|鸡胸肉沙拉|金枪鱼沙拉/.test(food.name));
  const eatOutFoods = foods.filter((food) => food.brand || /饭团|三明治|鸡胸肉|茶叶蛋|豆浆|酸奶|沙拉|汤|拉面|米饭|卷|汉堡|鸡蛋/.test(food.name));

  if (mode === "fitness") {
    return pantryFoods.length ? pantryFoods.concat(fitnessFoods.filter((food) => !pantryFoods.some((item) => item.name === food.name))) : fitnessFoods;
  }
  if (mode === "eat_out") {
    return pantryFoods.length
      ? eatOutFoods.concat(pantryFoods.filter((food) => !eatOutFoods.some((item) => sameFoodIdentity(item, food))))
      : eatOutFoods;
  }
  if (pantryFoods.length) {
    return pantryFoods.concat(homeFoods.filter((food) => !pantryFoods.some((item) => item.name === food.name)));
  }
  return homeFoods.length ? homeFoods : foods;
}

function isRestaurantTreatFood(food) {
  return Boolean(food?.brand) && /可乐|冰红茶|冰绿茶|拿铁|曲奇|麦旋风|新地|苹果派|薯片/.test(food.name);
}

function isExcludedMealFood(food, mode = loadPreferences().recommendation_mode || "home") {
  if (mode === "eat_out") {
    return ["油脂", "坚果", "调味", "零食", "饮品", "补剂", "加工食品"].includes(normalizeCategory(food)) || isRestaurantTreatFood(food);
  }
  return MEAL_RECOMMENDATION_EXCLUDED_CATEGORIES.has(normalizeCategory(food)) || /可乐|薯片|曲奇|牛肉干/.test(food.name);
}

function isBreakfastStapleFood(food) {
  return normalizeCategory(food) === "主食" && /燕麦|面包|吐司|玉米|小米粥|小米|红薯|山药|南瓜|馒头|包子|藜麦/.test(food.name);
}

function isBreakfastProteinFood(food) {
  return /鸡蛋|水煮蛋|炒蛋|牛奶|酸奶|豆浆|豆腐|北豆腐/.test(food.name) || ["蛋类", "乳制品", "豆制品"].includes(normalizeCategory(food));
}

function isLunchStapleFood(food) {
  return normalizeCategory(food) === "主食" && /米饭|糙米饭|面条|荞麦面|意大利面|红薯|土豆|藜麦|寿司饭|馒头|饺子/.test(food.name);
}

function isLunchProteinFood(food) {
  return /鸡胸肉|火鸡胸肉|牛里脊|牛上脑|瘦牛肉|牛腱|猪里脊|瘦猪肉|羊腿肉|虾仁|三文鱼|豆腐|北豆腐|鸡蛋/.test(food.name);
}

function isDinnerStapleFood(food) {
  return normalizeCategory(food) === "主食" && /糙米饭|米饭|红薯|土豆|玉米|南瓜|山药|藜麦|小米粥|小米/.test(food.name);
}

function isDinnerProteinFood(food) {
  return /鸡胸肉|火鸡胸肉|虾仁|三文鱼|豆腐|北豆腐|鸡蛋|牛里脊|瘦牛肉/.test(food.name);
}

function isLightDinnerProteinFood(food) {
  return /虾仁|三文鱼|豆腐|北豆腐|鸡蛋|牛奶|酸奶|豆浆/.test(food.name);
}

function isMealVegetableFood(food) {
  return isVegetableFood(food) && !/洋葱|海带/.test(food.name);
}

function isFitnessStapleFood(food) {
  return /燕麦片|糙米饭|米饭|藜麦|红薯|玉米|山药|南瓜|全麦面包|荞麦面|小米粥|小米/.test(food.name);
}

function isFitnessProteinFood(food) {
  return /鸡胸肉|火鸡胸肉|虾仁|三文鱼|牛里脊|瘦牛肉|鸡蛋|鸡蛋白|豆腐|北豆腐|希腊酸奶|无糖酸奶|鸡胸肉沙拉|金枪鱼沙拉/.test(food.name);
}

function isEatOutStapleFood(food) {
  return Boolean(food.brand && /饭团|三明治|汉堡|卷|拉面|咖喱猪排饭|米饭|薯饼|面/.test(food.name))
    || /米饭|糙米饭|面条|寿司饭|荞麦面|馒头|玉米|红薯/.test(food.name);
}

function isEatOutProteinFood(food) {
  return Boolean(food.brand && /鸡胸|鸡腿|原味鸡|鸡翅|鸡块|鸡米花|火鸡|金枪鱼|牛排|牛肉|叉烧|温泉蛋|茶叶蛋|三明治|豆腐/.test(food.name))
    || /鸡胸肉|鸡蛋|豆腐|北豆腐|虾仁|牛里脊|瘦牛肉|猪里脊|鸡腿肉/.test(food.name);
}

function isEatOutVegetableFood(food) {
  return Boolean(food.brand && /沙拉|蔬菜|玉米|蘑菇汤|紫菜蛋花汤|酸辣汤|关东煮萝卜/.test(food.name))
    || /西兰花|黄瓜|生菜|番茄|菠菜|圆白菜|蘑菇汤|紫菜蛋花汤|酸辣汤/.test(food.name);
}

function roleMatchesFood(food, role, mealKey, mode, proteinOverHigh) {
  if (mode === "fitness") {
    switch (role) {
      case "breakfast_staple":
      case "lunch_staple":
      case "dinner_staple":
        return isFitnessStapleFood(food);
      case "breakfast_protein":
      case "lunch_protein":
      case "dinner_protein":
        return proteinOverHigh ? /鸡蛋|鸡蛋白|无糖酸奶|希腊酸奶|豆腐|北豆腐|虾仁/.test(food.name) : isFitnessProteinFood(food);
      case "breakfast_fruit":
        return isFruitFood(food) || /无糖酸奶|希腊酸奶|牛奶|豆浆/.test(food.name);
      case "lunch_vegetable":
      case "dinner_vegetable":
        return isMealVegetableFood(food);
      default:
        return false;
    }
  }

  if (mode === "eat_out") {
    switch (role) {
      case "breakfast_staple":
        return Boolean(food.brand && /饭团|三明治|麦满分|薯饼/.test(food.name)) || /玉米|燕麦片|小米粥|全麦面包|馒头/.test(food.name);
      case "breakfast_protein":
        return Boolean(food.brand && /茶叶蛋|鸡胸|火鸡|金枪鱼|鸡蛋|酸奶|豆浆|麦满分/.test(food.name)) || /鸡蛋|无糖酸奶|希腊酸奶|豆浆|鸡胸肉/.test(food.name);
      case "breakfast_fruit":
        return isFruitFood(food) || /酸奶|豆浆|牛奶/.test(food.name);
      case "lunch_staple":
      case "dinner_staple":
        return isEatOutStapleFood(food);
      case "lunch_protein":
        return proteinOverHigh ? /茶叶蛋|鸡蛋|豆腐|豆浆|鸡胸|火鸡/.test(food.name) : isEatOutProteinFood(food);
      case "dinner_protein":
        return proteinOverHigh ? /汤|茶叶蛋|鸡蛋|豆腐|温泉蛋/.test(food.name) : isEatOutProteinFood(food);
      case "lunch_vegetable":
      case "dinner_vegetable":
        return isEatOutVegetableFood(food);
      default:
        return false;
    }
  }

  switch (role) {
    case "breakfast_staple":
      return isBreakfastStapleFood(food);
    case "breakfast_protein":
      return isBreakfastProteinFood(food);
    case "breakfast_fruit":
      return isFruitFood(food) || /牛奶|酸奶/.test(food.name);
    case "lunch_staple":
      return isLunchStapleFood(food);
    case "lunch_protein":
      return proteinOverHigh ? isLightDinnerProteinFood(food) : isLunchProteinFood(food);
    case "lunch_vegetable":
      return isMealVegetableFood(food);
    case "dinner_staple":
      return isDinnerStapleFood(food);
    case "dinner_protein":
      return proteinOverHigh ? isLightDinnerProteinFood(food) : isDinnerProteinFood(food);
    case "dinner_vegetable":
      return isMealVegetableFood(food);
    default:
      return false;
  }
}

function mealBucketFromTime(timeText = "") {
  const hour = Number(String(timeText).split(":")[0] || 0);
  if (hour < 10) {
    return "breakfast";
  }
  if (hour < 16) {
    return "lunch";
  }
  return "dinner";
}

function buildMacroContext(summary) {
  const proteinTarget = Number(summary.targets.protein_target || 0);
  const fatTarget = Number(summary.targets.fat_target || 0);
  const carbTarget = Number(summary.targets.carb_target || 0);
  const calorieTarget = Number(summary.targets.calorie_target || 0);
  const proteinActual = Number(summary.daily_report.protein.actual || 0);
  const fatActual = Number(summary.daily_report.fat.actual || 0);
  const carbActual = Number(summary.daily_report.carbs.actual || 0);
  const calorieActual = Number(summary.daily_report.total_intake_kcal || 0);

  const remaining = {
    protein: Math.max(proteinTarget - proteinActual, 0),
    fat: Math.max(fatTarget - fatActual, 0),
    carbs: Math.max(carbTarget - carbActual, 0),
    calories: Math.max(calorieTarget - calorieActual, 0),
  };
  const over = {
    protein: Math.max(proteinActual - proteinTarget, 0),
    fat: Math.max(fatActual - fatTarget, 0),
    carbs: Math.max(carbActual - carbTarget, 0),
    calories: Math.max(calorieActual - calorieTarget, 0),
  };

  const orderedNeeds = [
    { key: "protein", label: "蛋白质", value: remaining.protein, ratio: proteinTarget ? remaining.protein / proteinTarget : 0 },
    { key: "fat", label: "脂肪", value: remaining.fat, ratio: fatTarget ? remaining.fat / fatTarget : 0 },
    { key: "carbs", label: "碳水", value: remaining.carbs, ratio: carbTarget ? remaining.carbs / carbTarget : 0 },
  ].sort((a, b) => b.ratio - a.ratio || b.value - a.value);

  return {
    remaining,
    over,
    orderedNeeds,
  };
}

function buildConsumedFoodState(foodItems = []) {
  const consumedCounts = new Map();
  const mealLogs = {
    breakfast: { count: 0, calories: 0 },
    lunch: { count: 0, calories: 0 },
    dinner: { count: 0, calories: 0 },
  };

  foodItems.forEach((item) => {
    consumedCounts.set(item.food_name, (consumedCounts.get(item.food_name) || 0) + 1);
    const bucket = mealBucketFromTime(item.time);
    mealLogs[bucket].count += 1;
    mealLogs[bucket].calories += Number(item.calories || 0);
  });

  return { consumedCounts, mealLogs };
}

function scoreFoodForRole(food, role, mealKey, macroContext, consumedCounts, usedNames, mode = loadPreferences().recommendation_mode || "home") {
  if (!food || usedNames.has(food.name) || isExcludedMealFood(food, mode)) {
    return -Infinity;
  }

  const protein = Number(food.protein || 0);
  const carbs = Number(food.carbs || 0);
  const calories = Number(food.calories_per_100g || 0);
  const consumedPenalty = (consumedCounts.get(food.name) || 0) * 11;
  const proteinOverHigh = macroContext.over.protein >= 15;

  let score = 0;
  score -= macroContext.remaining.calories <= 280 ? calories / 18 : 0;
  score -= consumedPenalty;
  if (mealKey === "dinner" && calories >= 260) {
    score -= 8;
  }
  if (mealKey === "breakfast" && calories >= 320) {
    score -= 6;
  }
  if (mode === "eat_out" && food.brand) {
    score += 8;
  }
  if (mode === "fitness" && /鸡胸肉|火鸡胸肉|虾仁|三文鱼|糙米饭|藜麦|燕麦片|西兰花|无糖酸奶|希腊酸奶/.test(food.name)) {
    score += 9;
  }

  switch (role) {
    case "breakfast_staple":
      if (!roleMatchesFood(food, role, mealKey, mode, proteinOverHigh)) {
        return -Infinity;
      }
      score += carbs * 1.6 + macroContext.remaining.carbs * 0.18;
      break;
    case "breakfast_protein":
      if (!roleMatchesFood(food, role, mealKey, mode, proteinOverHigh)) {
        return -Infinity;
      }
      score += proteinOverHigh ? 8 - protein * 0.35 : protein * 1.75;
      score += /牛奶|酸奶|豆浆/.test(food.name) ? 10 : 0;
      break;
    case "breakfast_fruit":
      if (!roleMatchesFood(food, role, mealKey, mode, proteinOverHigh)) {
        return -Infinity;
      }
      score += isFruitFood(food) ? 24 : 18;
      score -= calories > 120 ? 5 : 0;
      break;
    case "lunch_staple":
      if (!roleMatchesFood(food, role, mealKey, mode, proteinOverHigh)) {
        return -Infinity;
      }
      score += carbs * 1.75 + macroContext.remaining.carbs * 0.2;
      break;
    case "lunch_protein":
      if (!roleMatchesFood(food, role, mealKey, mode, proteinOverHigh)) {
        return -Infinity;
      }
      score += proteinOverHigh ? 12 - protein * 0.25 : protein * 1.9;
      score += macroContext.remaining.fat > 10 && /三文鱼|鸡蛋|瘦牛肉|牛里脊/.test(food.name) ? 8 : 0;
      break;
    case "lunch_vegetable":
      if (!roleMatchesFood(food, role, mealKey, mode, proteinOverHigh)) {
        return -Infinity;
      }
      score += 30;
      break;
    case "dinner_staple":
      if (!roleMatchesFood(food, role, mealKey, mode, proteinOverHigh)) {
        return -Infinity;
      }
      score += carbs * 1.45 + macroContext.remaining.carbs * 0.14;
      score -= calories > 180 ? 4 : 0;
      break;
    case "dinner_protein":
      if (!roleMatchesFood(food, role, mealKey, mode, proteinOverHigh)) {
        return -Infinity;
      }
      score += proteinOverHigh ? 10 - protein * 0.25 : protein * 1.55;
      break;
    case "dinner_vegetable":
      if (!roleMatchesFood(food, role, mealKey, mode, proteinOverHigh)) {
        return -Infinity;
      }
      score += 32;
      break;
    default:
      return -Infinity;
  }

  return score;
}

function pickFoodByRole(foods, role, mealKey, macroContext, consumedCounts, usedNames, mode = loadPreferences().recommendation_mode || "home") {
  let bestFood = null;
  let bestScore = -Infinity;
  foods.forEach((food) => {
    const score = scoreFoodForRole(food, role, mealKey, macroContext, consumedCounts, usedNames, mode);
    if (score > bestScore) {
      bestFood = food;
      bestScore = score;
    }
  });
  return bestFood;
}

function suggestPortion(food, role, mealKey, macroContext, remainingMealCount) {
  let grams = Number(food.serving_size_g || 0);
  const name = food.name;
  const bounds = {
    breakfast_staple: [50, 280],
    breakfast_protein: [80, 260],
    breakfast_fruit: [100, 220],
    lunch_staple: [100, 240],
    lunch_protein: [100, 220],
    lunch_vegetable: [150, 260],
    dinner_staple: [90, 220],
    dinner_protein: [90, 200],
    dinner_vegetable: [160, 260],
  };

  if (grams <= 0) {
    switch (role) {
      case "breakfast_staple":
        if (/燕麦/.test(name)) {
          grams = 55;
        } else if (/面包|吐司/.test(name)) {
          grams = 80;
        } else if (/小米粥/.test(name)) {
          grams = 260;
        } else if (/玉米/.test(name)) {
          grams = 150;
        } else if (/红薯|山药|南瓜/.test(name)) {
          grams = 180;
        } else {
          grams = 120;
        }
        break;
      case "breakfast_protein":
        if (/鸡蛋/.test(name)) {
          grams = 100;
        } else if (/牛奶|豆浆/.test(name)) {
          grams = 250;
        } else if (/酸奶/.test(name)) {
          grams = 180;
        } else {
          grams = 150;
        }
        break;
      case "breakfast_fruit":
        grams = /香蕉/.test(name) ? 120 : /苹果/.test(name) ? 180 : /酸奶/.test(name) ? 160 : 150;
        break;
      case "lunch_staple":
        if (/米饭|糙米饭|寿司饭/.test(name)) {
          grams = 180;
        } else if (/面条|荞麦面|意大利面/.test(name)) {
          grams = 200;
        } else {
          grams = 210;
        }
        break;
      case "lunch_protein":
        if (/鸡胸肉|火鸡胸肉/.test(name)) {
          grams = 150;
        } else if (/三文鱼|牛里脊|瘦牛肉|牛腱|猪里脊|瘦猪肉|羊腿肉/.test(name)) {
          grams = 130;
        } else if (/虾仁/.test(name)) {
          grams = 140;
        } else {
          grams = 180;
        }
        break;
      case "lunch_vegetable":
        grams = 190;
        break;
      case "dinner_staple":
        if (/米饭|糙米饭/.test(name)) {
          grams = 130;
        } else if (/小米粥/.test(name)) {
          grams = 220;
        } else {
          grams = 170;
        }
        break;
      case "dinner_protein":
        if (/鸡胸肉|火鸡胸肉/.test(name)) {
          grams = 120;
        } else if (/虾仁|三文鱼/.test(name)) {
          grams = 130;
        } else if (/鸡蛋/.test(name)) {
          grams = 90;
        } else {
          grams = 160;
        }
        break;
      case "dinner_vegetable":
        grams = 210;
        break;
      default:
        grams = 120;
    }
  }

  if (macroContext.remaining.carbs >= 80 && role.includes("staple")) {
    grams *= 1.1;
  }
  if (macroContext.remaining.protein >= 35 && role.includes("protein")) {
    grams *= 1.08;
  }
  if (macroContext.over.protein >= 15 && role.includes("protein")) {
    grams *= 0.72;
  }
  if (macroContext.remaining.calories < 320 && mealKey === "dinner") {
    grams *= 0.85;
  }

  const [minPortion, maxPortion] = bounds[role] || [40, 260];
  return Math.max(roundToStep(clamp(grams, minPortion, maxPortion), 5), 10);
}

function buildFoodReason(role, macroContext) {
  const messages = {
    breakfast_staple: "早餐先把主食补稳，上午更不容易饿",
    breakfast_protein: macroContext.over.protein > 0 ? "今天蛋白不低，早餐只留更轻的一份" : "用早餐蛋白把开头补完整",
    breakfast_fruit: "加一份水果或奶，早餐会更顺口",
    lunch_staple: "午餐用主食撑住训练和下午活动",
    lunch_protein: macroContext.over.protein > 0 ? "中午保留更轻的蛋白来源，避免继续堆高" : "午餐优先把优质蛋白补到位",
    lunch_vegetable: "午餐带一份蔬菜，整餐会更平衡",
    dinner_staple: "晚餐主食适量收一点，更适合收尾",
    dinner_protein: macroContext.over.protein > 0 ? "晚餐只留轻蛋白做收尾，不再推高蛋白" : "晚餐用更轻的蛋白帮助恢复",
    dinner_vegetable: "晚餐用高纤维蔬菜把饱腹感拉起来",
  };
  return messages[role] || "按今天的数据做一个更平衡的搭配";
}

function buildMealComponents(mealKey, macroContext) {
  if (mealKey === "breakfast") {
    return [{ role: "breakfast_staple" }, { role: "breakfast_protein" }, { role: "breakfast_fruit" }];
  }

  if (mealKey === "lunch") {
    return [{ role: "lunch_staple" }, { role: "lunch_protein" }, { role: "lunch_vegetable" }];
  }

  return [{ role: "dinner_staple" }, { role: "dinner_protein" }, { role: "dinner_vegetable" }];
}

function buildRecommendationHeadline(macroContext) {
  if (macroContext.over.protein >= 12) {
    return "今天蛋白已经偏高，三餐先往碳水、脂肪和蔬菜上补。";
  }
  if (macroContext.orderedNeeds[0]?.key === "protein") {
    return "今天最缺的是蛋白质，三餐会优先安排更稳妥的蛋白来源。";
  }
  if (macroContext.orderedNeeds[0]?.key === "carbs") {
    return "今天主食偏少，建议把碳水补到位，训练和饱腹感会更稳。";
  }
  if (macroContext.orderedNeeds[0]?.key === "fat") {
    return "今天脂肪偏低，推荐里会适度补一些更容易执行的脂肪来源。";
  }
  return "今天整体比较接近目标，下面这版更偏向平衡和好执行。";
}

function buildMealCardCopy(mealKey, mealLog, macroContext, mode) {
  const config = {
    breakfast: {
      label: "早餐",
      structure: mode === "home" ? "家常早餐：主食 + 蛋白 + 水果或奶" : mode === "fitness" ? "健身早餐：稳主食 + 轻蛋白 + 水果或奶" : "外食早餐：饭团/三明治 + 蛋白 + 饮品",
      focus: macroContext.over.protein >= 15 ? "更偏清爽，先把主食和状态补稳" : "先把早餐的主食和蛋白补齐",
    },
    lunch: {
      label: "午餐",
      structure: mode === "home" ? "家常午餐：主食 + 一道肉/蛋/豆腐 + 一道青菜" : mode === "fitness" ? "健身午餐：主食 + 优质蛋白 + 高纤蔬菜" : "外食午餐：主食 + 可见蛋白 + 一份蔬菜或汤",
      focus: macroContext.orderedNeeds[0]?.key === "carbs" ? "中午把主食补到位，下午更稳" : mode === "eat_out" ? "中午优先选更容易买到的外食组合" : "中午按当前目标把一整餐补完整",
    },
    dinner: {
      label: "晚餐",
      structure: mode === "home" ? "家常晚餐：适量主食 + 轻蛋白 + 青菜" : mode === "fitness" ? "健身晚餐：适量主食 + 恢复蛋白 + 蔬菜" : "外食晚餐：轻主食 + 清爽蛋白 + 汤或蔬菜",
      focus: macroContext.over.protein >= 15 ? "晚上收一收蛋白，用更轻的结构结尾" : "晚餐以恢复和饱腹感为主，不必太重",
    },
  };
  const mealConfig = config[mealKey];
  const statusText = mealLog.count > 0 ? `已记录 ${mealLog.count} 项，可按这顿缺口补齐` : "当前还没记录，适合直接照着吃";

  return {
    label: mealConfig.label,
    status: statusText,
    focus: mealConfig.focus,
    structure: mealConfig.structure,
  };
}

function buildDynamicMealRecommendations(summary) {
  const mode = resolveRecommendationMode(summary.user);
  const allFoods = state.foodDatabase.filter((food) => Number(food.calories_per_100g || 0) > 0);
  const regularFoods = allFoods.filter((food) => !food.brand);
  const candidateFoods = getRecommendationFoods(allFoods, mode);
  const fallbackFoods = mode === "eat_out" ? allFoods : regularFoods;
  if (!allFoods.length) {
    return null;
  }

  const macroContext = buildMacroContext(summary);
  const { consumedCounts, mealLogs } = buildConsumedFoodState(summary.daily_report.food_items || []);
  const pendingMeals = Object.values(mealLogs).filter((item) => item.count === 0).length || 1;
  const usedNames = new Set();
  const mealKeys = ["breakfast", "lunch", "dinner"];

  const meals = mealKeys.map((mealKey) => {
    const components = buildMealComponents(mealKey, macroContext);
    const selectedItems = components
      .map(({ role }) => {
        const food = pickFoodByRole(candidateFoods, role, mealKey, macroContext, consumedCounts, usedNames, mode)
          || pickFoodByRole(fallbackFoods, role, mealKey, macroContext, consumedCounts, usedNames, mode);
        if (!food) {
          return null;
        }
        usedNames.add(food.name);
        const grams = suggestPortion(food, role, mealKey, macroContext, pendingMeals);
        const kcal = Math.round((Number(food.calories_per_100g || 0) * grams) / 100);
        return {
          name: food.name,
          grams,
          kcal,
          reason: buildFoodReason(role, macroContext),
          image: foodImagePath(food),
        };
      })
      .filter(Boolean);

    const alternatives = components
      .map(({ role }, index) => {
        const picked = selectedItems[index];
        const pool = candidateFoods
          .filter((food) => food.name !== picked?.name)
          .map((food) => ({ food, score: scoreFoodForRole(food, role, mealKey, macroContext, consumedCounts, new Set(), mode) }))
          .filter((item) => item.score > -Infinity)
          .sort((a, b) => b.score - a.score)
          .slice(0, 2)
          .map((item) => item.food.name);
        return pool;
      })
      .flat()
      .filter((name, index, array) => name && array.indexOf(name) === index)
      .slice(0, 4);

    const copy = buildMealCardCopy(mealKey, mealLogs[mealKey], macroContext, mode);
    return {
      ...copy,
      items: selectedItems,
      alternatives,
      totalKcal: selectedItems.reduce((sum, item) => sum + item.kcal, 0),
      summary: selectedItems.map((item) => `${item.name} ${item.grams}g`).join(" + "),
    };
  });

  const recommendationHeadline = buildRecommendationHeadline(macroContext);
  const noteMap = {
    home: "系统会优先从家里更常见、你已经勾选的常备食材和常见家常菜里做替换，减少专门买食材的压力。",
    fitness: "健身模式会更偏向高蛋白、相对控油、训练前后更好执行的食材组合，蛋白不足时会把优质蛋白放在更靠前的位置。",
    eat_out: "外食模式会优先调用连锁餐厅、便利店和更容易买到的外食单品，并尽量避开甜饮和高重复度的小食。",
  };
  return {
    headline: `${recommendationHeadline} 当前采用${recommendationModeLabel(mode)}。`,
    note: noteMap[mode] || noteMap.home,
    meals,
  };
}

function safeBuildDynamicMealRecommendations(summary) {
  try {
    return buildDynamicMealRecommendations(summary);
  } catch (error) {
    console.error("buildDynamicMealRecommendations failed", error);
    return null;
  }
}

function renderOverviewRecommendation(summary, recommendation = safeBuildDynamicMealRecommendations(summary)) {
  const statusEmoji =
    summary.daily_report.net_calorie_balance <= -500 ? "૮ ˶ᵔ ᵕ ᵔ˶ ა" : summary.daily_report.net_calorie_balance > 200 ? "( •̀ ω •́ )✧" : "(˶ᵔ ᵕ ᵔ˶)";
  const statusCopy =
    summary.daily_report.net_calorie_balance > 0
      ? "今天热量略有富余，下面三餐会更偏向平衡和控制重复摄入。"
      : "今天还有调整空间，下面三餐会优先围绕当前缺口去补齐。";
  const mode = resolveRecommendationMode(summary.user);
  const mealPortionChips = recommendation
    ? recommendation.meals
        .map(
          (meal) => `
            <article class="hero-plan-chip hero-plan-chip-meal">
              <strong>${escapeHtml(meal.label)}</strong>
              <span>${meal.totalKcal} kcal</span>
              <small>${meal.items.map((item) => `${escapeHtml(item.name)} ${item.grams}g`).join(" / ")}</small>
            </article>
          `
        )
        .join("")
    : "";
  if (!recommendation) {
    return `
      <section class="hero-status-card hero-plan-board hero-plan-board-compact">
        <div class="hero-plan-top">
          <div class="hero-plan-title">
            <span class="hero-status-label">今日状态</span>
            <strong>${summary.daily_report.conclusion}</strong>
            <p>${statusCopy}</p>
          </div>
          <button type="button" class="ghost-btn hero-recommendation-btn" data-switch-panel="suggestion" data-scroll-target="overview-recommendation-anchor">查看今日饮食建议</button>
        </div>
        <div class="hero-plan-chip-row">
          <article class="hero-plan-chip hero-plan-chip-status">
            <span class="hero-status-emoji">${statusEmoji}</span>
            <div>
              <strong>${summary.daily_report.conclusion}</strong>
              <span>${statusCopy}</span>
            </div>
          </article>
          <article class="hero-plan-chip">
            <strong>当前目标</strong>
            <span>${goalLabel(summary.user.goal)}</span>
          </article>
          <article class="hero-plan-chip">
            <strong>活动水平</strong>
            <span>${activityLabel(summary.user.activity_level)}</span>
          </article>
          <article class="hero-plan-chip">
            <strong>当前模式</strong>
            <span>${recommendationModeLabel(mode)}</span>
          </article>
          <article class="hero-plan-chip">
            <strong>净热量差</strong>
            <span>${summary.daily_report.net_calorie_balance} kcal</span>
          </article>
        </div>
      </section>
    `;
  }

  return `
    <section class="hero-status-card hero-plan-board hero-plan-board-compact">
      <div class="hero-plan-top">
        <div class="hero-plan-title">
          <span class="hero-status-label">今日状态</span>
          <strong>${summary.daily_report.conclusion}</strong>
          <p>${escapeHtml(recommendation.headline)}</p>
        </div>
        <button type="button" class="ghost-btn hero-recommendation-btn" data-switch-panel="suggestion" data-scroll-target="overview-recommendation-anchor">查看今日饮食建议</button>
      </div>
      <div class="hero-plan-chip-row">
        <article class="hero-plan-chip hero-plan-chip-status">
          <span class="hero-status-emoji">${statusEmoji}</span>
          <div>
            <strong>${summary.daily_report.conclusion}</strong>
            <span>${statusCopy}</span>
          </div>
        </article>
        <article class="hero-plan-chip">
          <strong>当前目标</strong>
          <span>${goalLabel(summary.user.goal)}</span>
        </article>
        <article class="hero-plan-chip">
          <strong>活动水平</strong>
          <span>${activityLabel(summary.user.activity_level)}</span>
        </article>
        <article class="hero-plan-chip">
          <strong>当前模式</strong>
          <span>${recommendationModeLabel(mode)}</span>
        </article>
        <article class="hero-plan-chip">
          <strong>净热量差</strong>
          <span>${summary.daily_report.net_calorie_balance} kcal</span>
        </article>
        ${mealPortionChips}
      </div>
    </section>
  `;
}

function renderOverviewSuggestionSection(summary, recommendation = safeBuildDynamicMealRecommendations(summary)) {
  if (!recommendation) {
    return `
      <div class="section-heading">
        <p class="eyebrow">今日饮食建议</p>
        <h3>按今天记录结果安排三餐</h3>
      </div>
      <p class="muted-text">食物库和今日记录加载完成后，这里会按你今天的热量与营养差值安排早餐、午餐和晚餐。</p>
    `;
  }

  return `
    <div class="section-heading">
      <p class="eyebrow">今日饮食建议</p>
      <h3>三餐建议单独展开，更方便顺着看</h3>
      <p class="muted-text">${escapeHtml(recommendation.note)}</p>
    </div>
    <div class="hero-meal-grid hero-meal-grid-overview">
      ${recommendation.meals
        .map(
          (meal) => `
            <article class="hero-overview-meal-card">
              <div class="hero-overview-meal-head">
                <span class="hero-overview-meal-badge">${escapeHtml(meal.label)}</span>
                <strong>${escapeHtml(meal.focus)}</strong>
                <p>${escapeHtml(meal.structure)}</p>
                <small>${escapeHtml(meal.status)} · 推荐约 ${meal.totalKcal} kcal</small>
              </div>
              <div class="hero-overview-food-grid">
                ${meal.items
                  .map(
                    (item) => `
                      <div class="hero-overview-food-card">
                        <img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" />
                        <div>
                          <strong>${escapeHtml(item.name)}</strong>
                          <span>${item.grams} g · ${item.kcal} kcal</span>
                          <small>${escapeHtml(item.reason)}</small>
                        </div>
                      </div>
                    `
                  )
                  .join("")}
              </div>
              <p class="hero-recommendation-alt">可替换：${meal.alternatives.length ? meal.alternatives.map((name) => escapeHtml(name)).join(" / ") : "家里没有这几样时，优先用同类主食、蛋白或蔬菜替换"}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function resolveRegularFoodImagePath(food) {
  const realisticRule = REALISTIC_FOOD_IMAGE_RULES.find((rule) => {
    const hit = includesFoodKeyword(food.name, rule.keywords);
    const excluded = rule.exclude ? includesFoodKeyword(food.name, rule.exclude) : false;
    return hit && !excluded;
  });
  if (realisticRule) {
    return `${REALISTIC_FOOD_IMAGE_BASE}/${REALISTIC_FOOD_IMAGE_MAP[realisticRule.key]}`;
  }

  const realisticCategory = REALISTIC_CATEGORY_IMAGE_MAP[food.category];
  if (realisticCategory) {
    return `${REALISTIC_FOOD_IMAGE_BASE}/${REALISTIC_FOOD_IMAGE_MAP[realisticCategory]}`;
  }

  const exactRenderAsset = Object.keys(HIGH_RECOGNITION_IMAGE_MAP).find((name) => food.name.includes(name));
  if (exactRenderAsset) {
    return `/assets/foods/${HIGH_RECOGNITION_IMAGE_MAP[exactRenderAsset]}.svg`;
  }

  const exactFoodName = Object.keys(EXACT_FOOD_IMAGE_MAP).find((name) => food.name.includes(name));
  if (exactFoodName) {
    return `/assets/foods/${EXACT_FOOD_IMAGE_MAP[exactFoodName]}.svg`;
  }

  const matchedRule = FOOD_IMAGE_RULES.find((rule) => {
    const hit = includesFoodKeyword(food.name, rule.keywords);
    const excluded = rule.exclude ? includesFoodKeyword(food.name, rule.exclude) : false;
    return hit && !excluded;
  });
  if (matchedRule) {
    return `/assets/foods/${matchedRule.asset}.svg`;
  }

  if (food.image_key && food.image_key !== "meal") {
    return `/assets/foods/${food.image_key}.svg`;
  }

  const categoryAsset = CATEGORY_FOOD_IMAGE_MAP[food.category];
  return categoryAsset ? `/assets/foods/${categoryAsset}.svg` : DEFAULT_FOOD_IMAGE;
}

function foodImagePath(foodOrKey) {
  if (typeof foodOrKey === "object" && foodOrKey?.name) {
    if (foodOrKey.brand) {
      const brandImageMap = {
        "麦当劳 巨无霸": "/assets/restaurants/mcd-bigmac.svg",
        "麦当劳 双层吉士汉堡": "/assets/restaurants/mcd-double-cheeseburger.svg",
        "麦当劳 中薯条": "/assets/restaurants/mcd-fries.svg",
        "麦当劳 麦辣鸡腿堡": "/assets/restaurants/mcd-spicy-chicken-burger.svg",
        "麦当劳 麦辣鸡翅": "/assets/restaurants/mcd-spicy-wings.svg",
        "麦当劳 麦乐鸡块 4块": "/assets/restaurants/mcd-mcnuggets-4.svg",
        "麦当劳 麦乐鸡块 10块": "/assets/restaurants/mcd-mcnuggets-10.svg",
        "麦当劳 麦香鸡": "/assets/restaurants/mcd-mcchicken.svg",
        "麦当劳 双层麦香鸡": "/assets/restaurants/mcd-mcchicken.svg",
        "麦当劳 苹果派": "/assets/restaurants/mcd-apple-pie.svg",
        "麦当劳 双层深海鳕鱼堡": "/assets/restaurants/mcd-fish-burger.svg",
        "麦当劳 板烧鸡腿堡": "/assets/restaurants/mcd-grilled-chicken-burger.svg",
        "麦当劳 脆薯饼": "/assets/restaurants/mcd-hash-brown.svg",
        "麦当劳 奥利奥麦旋风": "/assets/restaurants/mcd-mcflurry.svg",
        "麦当劳 热巧克力新地": "/assets/restaurants/mcd-sundae.svg",
        "麦当劳 猪柳蛋麦满分": "/assets/restaurants/mcd-mcmuffin.svg",
        "麦当劳 可口可乐 中杯": "/assets/restaurants/mcd-coke.svg",
        "麦当劳 无糖冰红茶 中杯": "/assets/restaurants/mcd-iced-tea.svg",
        "麦当劳 薯条 大份": "/assets/restaurants/mcd-fries-large.svg",
        "肯德基 原味鸡": "/assets/restaurants/kfc-original-chicken.svg",
        "肯德基 薯条": "/assets/restaurants/kfc-fries.svg",
        "肯德基 香辣鸡腿堡": "/assets/restaurants/kfc-zinger-burger.svg",
        "肯德基 新奥尔良烤鸡腿堡": "/assets/restaurants/kfc-zinger-burger.svg",
        "肯德基 老北京鸡肉卷": "/assets/restaurants/kfc-wrap.svg",
        "肯德基 葡式蛋挞": "/assets/restaurants/kfc-egg-tart.svg",
        "肯德基 吮指原味鸡 2块": "/assets/restaurants/kfc-original-chicken-bucket.svg",
        "肯德基 新奥尔良烤翅 2块": "/assets/restaurants/kfc-orleans-wings.svg",
        "肯德基 香辣鸡翅 2块": "/assets/restaurants/kfc-spicy-wings.svg",
        "肯德基 土豆泥": "/assets/restaurants/kfc-mashed-potato.svg",
        "肯德基 香甜粟米棒": "/assets/restaurants/kfc-corn.svg",
        "肯德基 劲爆鸡米花": "/assets/restaurants/kfc-popcorn-chicken.svg",
        "肯德基 百事可乐 中杯": "/assets/restaurants/kfc-cola.svg",
        "肯德基 香辣鸡腿堡套餐薯条": "/assets/restaurants/kfc-fries.svg",
        "肯德基 早餐帕尼尼": "/assets/restaurants/kfc-panini.svg",
        "赛百味 火鸡胸三明治 6英寸": "/assets/restaurants/subway-turkey.svg",
        "赛百味 香烤鸡肉三明治 6英寸": "/assets/restaurants/subway-chicken.svg",
        "赛百味 牛油果鸡肉三明治 6英寸": "/assets/restaurants/subway-chicken.svg",
        "赛百味 金枪鱼三明治 6英寸": "/assets/restaurants/subway-tuna.svg",
        "赛百味 意式BMT三明治 6英寸": "/assets/restaurants/subway-bmt.svg",
        "赛百味 蔬菜三明治 6英寸": "/assets/restaurants/subway-veggie.svg",
        "赛百味 经典牛排芝士三明治 6英寸": "/assets/restaurants/subway-steak-cheese.svg",
        "赛百味 巧克力曲奇": "/assets/restaurants/subway-cookie.svg",
        "赛百味 冰拿铁 中杯": "/assets/restaurants/subway-latte.svg",
        "赛百味 双层火鸡胸三明治 12英寸": "/assets/restaurants/subway-turkey-footlong.svg",
        "赛百味 海盐薯片": "/assets/restaurants/subway-chips.svg",
        "味千拉面 招牌豚骨拉面": "/assets/restaurants/ajisen-tonkotsu.svg",
        "味千拉面 辣味叉烧拉面": "/assets/restaurants/ajisen-chashu-spicy.svg",
        "味千拉面 肥牛拉面": "/assets/restaurants/ajisen-beef.svg",
        "味千拉面 日式煎饺 6只": "/assets/restaurants/ajisen-gyoza.svg",
        "味千拉面 炸鸡块": "/assets/restaurants/ajisen-fried-chicken.svg",
        "味千拉面 咖喱猪排饭": "/assets/restaurants/ajisen-curry-cutlet-rice.svg",
        "味千拉面 豚骨叉烧饭": "/assets/restaurants/ajisen-tonkotsu.svg",
        "味千拉面 冰绿茶": "/assets/restaurants/ajisen-iced-tea.svg",
        "味千拉面 温泉蛋": "/assets/restaurants/ajisen-egg.svg",
        "味千拉面 炸虾 3只": "/assets/restaurants/ajisen-fried-shrimp.svg",
        "土豆牛肉饭": "/assets/restaurants/takeaway-potato-beef-rice.svg",
        "黄焖鸡米饭": "/assets/restaurants/takeaway-braised-chicken-rice.svg",
        "黑椒牛柳饭": "/assets/restaurants/takeaway-black-pepper-beef-rice.svg",
        "肉末茄子饭": "/assets/restaurants/takeaway-minced-pork-eggplant-rice.svg",
        "宫保鸡丁饭": "/assets/restaurants/takeaway-kung-pao-chicken-rice.svg",
        "鱼香肉丝饭": "/assets/restaurants/takeaway-yuxiang-pork-rice.svg",
        "麻婆豆腐饭": "/assets/restaurants/takeaway-mapo-tofu-rice.svg",
        "香菇滑鸡饭": "/assets/restaurants/takeaway-mushroom-chicken-rice.svg",
        "照烧鸡腿饭": "/assets/restaurants/takeaway-teriyaki-chicken-rice.svg",
        "鱼籽村 蒜香鱼籽拌饭": "/assets/restaurants/yuzicun-garlic-roe-rice.svg",
        "鱼籽村 招牌鱼籽拌饭": "/assets/restaurants/yuzicun-signature-roe-rice.svg",
        "鱼籽村 双拼鱼籽拌饭": "/assets/restaurants/yuzicun-double-roe-rice.svg",
        "鱼籽村 韩式辣鱼籽拌饭": "/assets/restaurants/yuzicun-korean-spicy-roe-rice.svg",
        "鱼籽村 肥牛鱼籽拌饭": "/assets/restaurants/yuzicun-beef-roe-rice.svg",
        "鱼籽村 芝士鸡排鱼籽拌饭": "/assets/restaurants/yuzicun-cheese-cutlet-roe-rice.svg",
        "鱼籽村 辣白菜鱼籽拌饭": "/assets/restaurants/yuzicun-kimchi-roe-rice.svg",
        "鱼籽村 照烧鸡腿鱼籽拌饭": "/assets/restaurants/yuzicun-teriyaki-chicken-roe-rice.svg",
        "留学生餐厅 蒜香猪排咖喱饭": "/assets/restaurants/international-cafe-garlic-pork-curry-rice.svg",
        "留学生餐厅 黑椒牛肉饭": "/assets/restaurants/international-cafe-black-pepper-beef-rice.svg",
        "留学生餐厅 照烧鸡腿饭": "/assets/restaurants/international-cafe-teriyaki-chicken-rice.svg",
        "留学生餐厅 台式卤肉饭": "/assets/restaurants/international-cafe-braised-pork-rice.svg",
        "留学生餐厅 咖喱牛肉饭": "/assets/restaurants/international-cafe-curry-beef-rice.svg",
        "留学生餐厅 黑椒鸡排饭": "/assets/restaurants/international-cafe-black-pepper-cutlet-rice.svg",
        "留学生餐厅 鱼香肉丝饭": "/assets/restaurants/international-cafe-yuxiang-pork-rice.svg",
        "米村拌饭 肥牛拌饭": "/assets/restaurants/micun-feiniu-mixed-rice.svg",
        "米村拌饭 肥牛泡菜拌饭": "/assets/restaurants/micun-kimchi-beef-rice.svg",
        "米村拌饭 照烧鸡排拌饭": "/assets/restaurants/micun-teriyaki-cutlet-rice.svg",
        "米村拌饭 石锅拌饭": "/assets/restaurants/micun-stone-pot-rice.svg",
        "米村拌饭 金枪鱼拌饭": "/assets/restaurants/micun-tuna-rice.svg",
        "米村拌饭 辣白菜五花肉拌饭": "/assets/restaurants/micun-kimchi-pork-rice.svg",
        "米村拌饭 烤肉拌饭": "/assets/restaurants/micun-bulgogi-rice.svg",
        "米村拌饭 辣牛肉石锅拌饭": "/assets/restaurants/micun-spicy-beef-stone-pot-rice.svg",
        "南城香 番茄肥牛饭": "/assets/restaurants/nanchengxiang-tomato-beef-rice.svg",
        "南城香 农家小炒肉饭": "/assets/restaurants/nanchengxiang-farmhouse-pork-rice.svg",
        "南城香 回锅肉饭": "/assets/restaurants/nanchengxiang-twice-cooked-pork-rice.svg",
        "南城香 宫保鸡丁饭": "/assets/restaurants/nanchengxiang-kung-pao-chicken-rice.svg",
        "南城香 黑椒鸡腿饭": "/assets/restaurants/nanchengxiang-black-pepper-chicken-rice.svg",
        "南城香 梅菜扣肉饭": "/assets/restaurants/nanchengxiang-preserved-pork-rice.svg",
        "南城香 鱼香肉丝饭": "/assets/restaurants/nanchengxiang-yuxiang-pork-rice.svg",
        "南城香 番茄鸡腿饭": "/assets/restaurants/nanchengxiang-tomato-chicken-rice.svg",
        "吉野家 招牌牛肉饭": "/assets/restaurants/yoshinoya-beef-rice.svg",
        "吉野家 照烧牛肉饭": "/assets/restaurants/yoshinoya-teriyaki-beef-rice.svg",
        "吉野家 照烧鸡排饭": "/assets/restaurants/yoshinoya-teriyaki-cutlet-rice.svg",
        "吉野家 双拼牛肉饭": "/assets/restaurants/yoshinoya-double-beef-rice.svg",
        "吉野家 咖喱牛肉饭": "/assets/restaurants/yoshinoya-curry-beef-rice.svg",
        "吉野家 泡菜牛肉饭": "/assets/restaurants/yoshinoya-kimchi-beef-rice.svg",
        "吉野家 芝士牛肉饭": "/assets/restaurants/yoshinoya-cheese-beef-rice.svg",
        "吉野家 温泉蛋牛肉饭": "/assets/restaurants/yoshinoya-onsen-egg-beef-rice.svg",
        "番茄牛腩饭": "/assets/restaurants/takeaway-tomato-brisket-rice.svg",
        "青椒牛肉饭": "/assets/restaurants/takeaway-green-pepper-beef-rice.svg",
        "农家小炒肉饭": "/assets/restaurants/takeaway-farmhouse-pork-rice.svg",
        "回锅肉饭": "/assets/restaurants/takeaway-twice-cooked-pork-rice.svg",
        "红烧排骨饭": "/assets/restaurants/takeaway-braised-ribs-rice.svg",
        "鳗鱼饭": "/assets/restaurants/takeaway-eel-rice.svg",
        "亲子丼": "/assets/restaurants/takeaway-oyakodon.svg",
        "留学生餐厅 番茄牛腩饭": "/assets/restaurants/international-cafe-tomato-brisket-rice.svg",
        "照烧牛肉饭": "/assets/restaurants/takeaway-teriyaki-beef-rice.svg",
        "奥尔良鸡腿饭": "/assets/restaurants/takeaway-orleans-chicken-rice.svg",
        };
      return brandImageMap[foodOrKey.name] || resolveRegularFoodImagePath(foodOrKey);
    }
    return resolveRegularFoodImagePath(foodOrKey);
  }
  return DEFAULT_FOOD_IMAGE;
}

function padTime(value) {
  return String(value).padStart(2, "0");
}

function getSelectValue(id) {
  return $(id).value;
}

function buildTimeValue(hourId, minuteId) {
  return `${getSelectValue(hourId)}:${getSelectValue(minuteId)}`;
}

function setTimeFieldMode(inputId, mode = "auto") {
  const input = $(inputId);
  if (input) {
    input.dataset.timeMode = mode;
  }
}

function refreshLiveTimestampDefaults(force = false) {
  const now = new Date();
  const currentHour = padTime(now.getHours());
  const currentMinute = padTime(now.getMinutes());

  LIVE_TIMESTAMP_FIELDS.forEach(([hourId, hourDisplayId, minuteId, minuteDisplayId]) => {
    const hourInput = $(hourId);
    const minuteInput = $(minuteId);
    const canUpdateHour = force || !hourInput?.value || hourInput.dataset.timeMode !== "manual";
    const canUpdateMinute = force || !minuteInput?.value || minuteInput.dataset.timeMode !== "manual";

    if (canUpdateHour) {
      setPickerInputValue(hourId, currentHour, hourDisplayId, () => currentHour);
      setTimeFieldMode(hourId, "auto");
    }
    if (canUpdateMinute) {
      setPickerInputValue(minuteId, currentMinute, minuteDisplayId, () => currentMinute);
      setTimeFieldMode(minuteId, "auto");
    }
  });
}

function resetLiveTimestampDefaults() {
  LIVE_TIMESTAMP_FIELDS.forEach(([hourId, , minuteId]) => {
    setTimeFieldMode(hourId, "auto");
    setTimeFieldMode(minuteId, "auto");
  });
  refreshLiveTimestampDefaults(true);
}

function fillSelect(select, values, formatter, selectedValue) {
  select.innerHTML = values
    .map((value) => {
      const stringValue = String(value);
      const selected = stringValue === String(selectedValue) ? " selected" : "";
      return `<option value="${stringValue}"${selected}>${formatter(value)}</option>`;
    })
    .join("");
}

function buildWeightPresetValues() {
  const values = [""];
  for (let value = 35; value <= 150; value += 0.5) {
    values.push(value.toFixed(1));
  }
  return values;
}

function buildFoodWeightPresetValues() {
  const values = [""];
  for (let value = 25; value <= 500; value += 25) {
    values.push(String(value));
  }
  return values;
}

function buildNumericOptions(start, end, step, digits = 0) {
  const values = [];
  for (let value = start; value <= end + Number.EPSILON; value += step) {
    values.push(value.toFixed(digits));
  }
  return values;
}

function setPickerInputValue(inputId, value, displayId = "", formatter = null) {
  const input = $(inputId);
  if (input) {
    input.value = value;
  }
  const display = displayId ? $(displayId) : null;
  if (display) {
    display.value = formatter ? formatter(value) : value;
  }
}

function bindTapIntent(node, onTap, options = {}) {
  if (!node || node.dataset.tapIntentBound === "true") {
    return;
  }
  const { shouldHandle = null } = options;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;

  const canHandle = () => (typeof shouldHandle === "function" ? shouldHandle() : true);

  node.dataset.tapIntentBound = "true";
  node.addEventListener(
    "touchstart",
    (event) => {
      if (!canHandle()) {
        return;
      }
      const touch = event.touches?.[0];
      if (!touch) {
        return;
      }
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchMoved = false;
    },
    { passive: true }
  );
  node.addEventListener(
    "touchmove",
    (event) => {
      if (!canHandle()) {
        return;
      }
      const touch = event.touches?.[0];
      if (!touch) {
        return;
      }
      if (
        Math.abs(touch.clientX - touchStartX) > PICKER_TAP_MOVE_THRESHOLD ||
        Math.abs(touch.clientY - touchStartY) > PICKER_TAP_MOVE_THRESHOLD
      ) {
        touchMoved = true;
      }
    },
    { passive: true }
  );
  node.addEventListener(
    "touchend",
    (event) => {
      if (!canHandle() || touchMoved) {
        return;
      }
      event.preventDefault();
      onTap(event);
    },
    { passive: false }
  );
}

function bindPickerTrigger(inputId, panelId) {
  const input = $(inputId);
  if (!input) {
    return;
  }
  const openPicker = () => openPickerPanel(panelId, input.value);
  input.addEventListener("mousedown", (event) => {
    if (input.readOnly) {
      event.preventDefault();
    }
  });
  bindTapIntent(input, () => {
    if (input.readOnly) {
      openPicker();
    }
  }, { shouldHandle: () => input.readOnly });
  input.addEventListener("focus", () => {
    if (!window.matchMedia("(max-width: 640px)").matches || !input.readOnly) {
      openPicker();
    }
  });
  input.addEventListener("click", () => {
    if (!window.matchMedia("(max-width: 640px)").matches || !input.readOnly) {
      openPicker();
    }
  });
}

function bindPickerContainerTrigger(inputId, panelId) {
  const input = $(inputId);
  const trigger = input?.closest(".picker-trigger");
  if (!input || !trigger) {
    return;
  }

  const openPicker = () => openPickerPanel(panelId, input.value);
  const shouldHandleMobilePicker = () => window.matchMedia("(max-width: 640px)").matches && input.readOnly;
  bindTapIntent(trigger, () => {
    if (shouldHandleMobilePicker()) {
      openPicker();
    }
  }, { shouldHandle: shouldHandleMobilePicker });

  trigger.addEventListener("click", (event) => {
    if (!shouldHandleMobilePicker()) {
      return;
    }
    event.preventDefault();
    openPicker();
  });
}

function bindEditablePickerInput(inputId, panelId) {
  const input = $(inputId);
  if (!input) {
    return;
  }
  input.addEventListener("input", () => {
    if (!input.readOnly) {
      closeAllPickerPanels();
    }
  });
  input.addEventListener("keydown", (event) => {
    if (!input.readOnly && (event.key === "Enter" || event.key === "Tab" || event.key === "Escape")) {
      closeAllPickerPanels();
    }
  });
  input.addEventListener("change", () => {
    if (!input.readOnly) {
      closeAllPickerPanels();
    }
  });
  input.addEventListener("blur", () => {
    if (!input.readOnly) {
      window.setTimeout(() => {
        const panel = $(panelId);
        if (panel && !panel.contains(document.activeElement)) {
          closeAllPickerPanels();
        }
      }, 0);
    }
  });
}

function buildPickerOptions(containerId, options, onSelect) {
  const container = $(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = `
    <div class="picker-list-shell">
      <div class="picker-selection-window" aria-hidden="true"></div>
      <div class="picker-gradient picker-gradient-top"></div>
      <div class="picker-options picker-wheel" tabindex="0">
        <div class="picker-spacer" aria-hidden="true"></div>
      ${options
        .map(
          (option, index) => `
            <button
              type="button"
              class="picker-option"
              data-value="${option.value}"
              data-label="${option.label}"
              data-index="${index}"
            >
              ${option.label}
            </button>
          `
        )
        .join("")}
        <div class="picker-spacer" aria-hidden="true"></div>
      </div>
      <div class="picker-gradient picker-gradient-bottom"></div>
    </div>
  `;
  const optionsContainer = container.querySelector(".picker-options");
  if (optionsContainer) {
    optionsContainer.__pickerOnSelect = onSelect;
  }
  container.querySelectorAll(".picker-option").forEach((button) => {
    button.addEventListener("click", () => {
      const owner = button.closest(".picker-options");
      const buttons = owner ? Array.from(owner.querySelectorAll(".picker-option")) : [];
      const index = buttons.indexOf(button);
      if (index >= 0 && owner) {
        snapPickerToIndex(owner, index, { behavior: "smooth", emit: true });
      } else {
        onSelect(button.dataset.value, button.dataset.label);
      }
      closeAllPickerPanels();
    });
  });
  initializePickerDock(container);
}

function getPickerOptionButtons(optionsContainer) {
  return Array.from(optionsContainer?.querySelectorAll(".picker-option") || []);
}

function getPickerOptionValue(option) {
  if (!option) {
    return "";
  }
  return String(option.dataset.registerPickerValue || option.dataset.value || "");
}

function getPickerOptionLabel(option) {
  if (!option) {
    return "";
  }
  return option.dataset.label || option.textContent?.trim() || "";
}

function getPickerOptionMetrics(optionsContainer) {
  const options = getPickerOptionButtons(optionsContainer);
  const first = options[0];
  const second = options[1];
  const optionHeight = first?.offsetHeight || 54;
  const step = second ? second.offsetTop - first.offsetTop : optionHeight;
  return {
    optionHeight,
    step: step > 0 ? step : optionHeight,
  };
}

function findClosestPickerOptionIndex(optionsContainer) {
  const options = getPickerOptionButtons(optionsContainer);
  if (!options.length) {
    return -1;
  }
  const centerLine = optionsContainer.scrollTop + optionsContainer.clientHeight / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;
  options.forEach((option, index) => {
    const optionCenter = option.offsetTop + option.offsetHeight / 2;
    const distance = Math.abs(optionCenter - centerLine);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  return closestIndex;
}

function setPickerDockState(optionsContainer, activeIndex = -1) {
  if (!optionsContainer) {
    return;
  }
  const options = getPickerOptionButtons(optionsContainer);
  if (!options.length) {
    return;
  }
  const isActive = activeIndex >= 0;
  optionsContainer.classList.toggle("is-dock-active", isActive);
  if (isActive) {
    optionsContainer.dataset.activeIndex = String(activeIndex);
  } else {
    delete optionsContainer.dataset.activeIndex;
  }
  options.forEach((option, index) => {
    if (!isActive) {
      option.removeAttribute("data-dock-distance");
      option.style.removeProperty("--dock-scale");
      option.style.removeProperty("--dock-x");
      option.style.removeProperty("--dock-y");
      option.style.removeProperty("--dock-blur");
      option.classList.remove("is-active", "is-selected");
      return;
    }
    const distance = index - activeIndex;
    const absDistance = Math.abs(distance);
    option.dataset.dockDistance = String(distance);
    const scaleMap = [1.08, 1.03, 0.99, 0.96];
    const verticalOffsetMap = [0, 0, 0, 0];
    const horizontalOffsetMap = [0, 0, 0, 0];
    const cappedDistance = Math.min(absDistance, scaleMap.length - 1);
    const scale = scaleMap[cappedDistance] || 1;
    const translateY = verticalOffsetMap[cappedDistance] || 0;
    const direction = distance < 0 ? -1 : 1;
    const translateX = (horizontalOffsetMap[cappedDistance] || 0) * direction;
    option.style.setProperty("--dock-scale", scale.toFixed(3));
    option.style.setProperty("--dock-x", `${translateX}px`);
    option.style.setProperty("--dock-y", `${translateY}px`);
    option.style.setProperty("--dock-blur", "0px");
    option.classList.toggle("is-active", index === activeIndex);
    option.classList.toggle("is-selected", index === activeIndex);
  });
}

function updatePickerGradients(optionsContainer) {
  if (!optionsContainer) {
    return;
  }
  const shell = optionsContainer.closest(".picker-list-shell");
  if (!shell) {
    return;
  }
  const top = shell.querySelector(".picker-gradient-top");
  const bottom = shell.querySelector(".picker-gradient-bottom");
  const { scrollTop, scrollHeight, clientHeight } = optionsContainer;
  const topOpacity = Math.min(scrollTop / 40, 1);
  const bottomDistance = scrollHeight - (scrollTop + clientHeight);
  const bottomOpacity = scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 40, 1);
  if (top) {
    top.style.opacity = String(topOpacity);
  }
  if (bottom) {
    bottom.style.opacity = String(bottomOpacity);
  }
}

function syncRegisterNumberPickerCurrentDisplay(option) {
  const current = $("register-number-picker-current");
  if (!current) {
    return;
  }
  const label = getPickerOptionLabel(option);
  if (label) {
    current.textContent = label;
    current.classList.remove("hidden");
  }
}

function emitPickerSelection(optionsContainer, activeIndex) {
  const options = getPickerOptionButtons(optionsContainer);
  const option = options[activeIndex];
  if (!option) {
    return;
  }
  const nextValue = getPickerOptionValue(option);
  if (optionsContainer.dataset.committedValue === nextValue) {
    syncRegisterNumberPickerCurrentDisplay(option);
    return;
  }
  optionsContainer.dataset.committedValue = nextValue;
  syncRegisterNumberPickerCurrentDisplay(option);
  if (typeof optionsContainer.__pickerOnSelect === "function") {
    optionsContainer.__pickerOnSelect(nextValue, getPickerOptionLabel(option));
  }
}

function snapPickerToIndex(optionsContainer, activeIndex, options = {}) {
  if (!optionsContainer || activeIndex < 0) {
    return;
  }
  const { behavior = "smooth", emit = false } = options;
  const buttons = getPickerOptionButtons(optionsContainer);
  const target = buttons[activeIndex];
  if (!target) {
    return;
  }
  const safeBehavior = behavior === "instant" ? "auto" : behavior;
  const targetTop = Math.max(0, target.offsetTop - (optionsContainer.clientHeight - target.offsetHeight) / 2);
  optionsContainer.scrollTo({
    top: targetTop,
    behavior: safeBehavior,
  });
  setPickerDockState(optionsContainer, activeIndex);
  updatePickerGradients(optionsContainer);
  if (emit) {
    emitPickerSelection(optionsContainer, activeIndex);
  }
}

function scrollPickerToCurrent(panel, currentValue = "") {
  const optionsContainer = panel?.querySelector(".picker-options");
  if (!optionsContainer) {
    return;
  }
  const targetIndex = getPickerOptionButtons(optionsContainer).findIndex(
    (button) => getPickerOptionValue(button) === String(currentValue)
  );
  if (targetIndex >= 0) {
    snapPickerToIndex(optionsContainer, targetIndex, { behavior: "instant", emit: true });
  } else {
    setPickerDockState(optionsContainer, findClosestPickerOptionIndex(optionsContainer));
  }
  updatePickerGradients(optionsContainer);
}

function initializePickerDock(panel) {
  const optionsContainer = panel?.querySelector(".picker-options");
  if (!optionsContainer || optionsContainer.dataset.dockBound === "true") {
    return;
  }
  optionsContainer.dataset.dockBound = "true";
  const settlePicker = () => {
    const activeIndex = findClosestPickerOptionIndex(optionsContainer);
    if (activeIndex < 0) {
      return;
    }
    optionsContainer.classList.remove("is-scrolling");
    snapPickerToIndex(optionsContainer, activeIndex, { behavior: "auto", emit: true });
  };
  const scheduleSettle = () => {
    const timer = pickerScrollTimers.get(optionsContainer);
    if (timer) {
      window.clearTimeout(timer);
    }
    pickerScrollTimers.set(
      optionsContainer,
      window.setTimeout(() => {
        settlePicker();
      }, PICKER_SCROLL_SETTLE_DELAY)
    );
  };
  optionsContainer.addEventListener("pointerdown", () => {
    optionsContainer.classList.add("is-scrolling");
    const timer = pickerScrollTimers.get(optionsContainer);
    if (timer) {
      window.clearTimeout(timer);
    }
  });
  optionsContainer.addEventListener("touchstart", () => {
    optionsContainer.classList.add("is-scrolling");
    const timer = pickerScrollTimers.get(optionsContainer);
    if (timer) {
      window.clearTimeout(timer);
    }
  }, { passive: true });
  optionsContainer.addEventListener("scroll", () => {
    setPickerDockState(optionsContainer, findClosestPickerOptionIndex(optionsContainer));
    updatePickerGradients(optionsContainer);
    optionsContainer.classList.add("is-scrolling");
    scheduleSettle();
  });
  optionsContainer.addEventListener("keydown", (event) => {
    const activeIndex = Number(optionsContainer.dataset.activeIndex || findClosestPickerOptionIndex(optionsContainer));
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = event.key === "ArrowDown" ? activeIndex + 1 : activeIndex - 1;
      const buttons = getPickerOptionButtons(optionsContainer);
      const boundedIndex = Math.max(0, Math.min(buttons.length - 1, nextIndex));
      snapPickerToIndex(optionsContainer, boundedIndex, { behavior: "smooth", emit: true });
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (panel?.id === "register-number-picker-overlay") {
        closeRegisterNumberPicker();
      } else {
        closeAllPickerPanels();
      }
    }
  });
  requestAnimationFrame(() => {
    const activeIndex = findClosestPickerOptionIndex(optionsContainer);
    setPickerDockState(optionsContainer, activeIndex);
    updatePickerGradients(optionsContainer);
  });
  updatePickerGradients(optionsContainer);
}

function clearPickerOpenState() {
  document.body.classList.remove("picker-layer-active");
  document.querySelectorAll(".picker-open").forEach((node) => node.classList.remove("picker-open"));
  document.querySelectorAll(".picker-open-parent").forEach((node) => node.classList.remove("picker-open-parent"));
  document.querySelectorAll(".picker-panel").forEach((panel) => {
    panel.style.removeProperty("--picker-top");
    panel.style.removeProperty("--picker-left");
    panel.style.removeProperty("--picker-width");
  });
}

function markPickerOpenState(panel) {
  clearPickerOpenState();
  document.body.classList.add("picker-layer-active");

  const field = panel?.closest(".picker-field");
  field?.classList.add("picker-open");

  [
    field?.closest(".field-block"),
    field?.closest(".module-form"),
    field?.closest(".auth-grid"),
    field?.closest(".auth-panel"),
    field?.closest(".card"),
    field?.closest(".dashboard-panel"),
  ]
    .filter(Boolean)
    .forEach((node) => node.classList.add("picker-open-parent"));
}

function positionPickerPanel(panel) {
  if (!panel || panel.classList.contains("hidden")) {
    return;
  }
  const field = panel.closest(".picker-field");
  const trigger = field?.querySelector(".picker-trigger") || field;
  if (!trigger) {
    return;
  }

  const rect = trigger.getBoundingClientRect();
  const fieldRect = field.getBoundingClientRect();
  const isTimeField = field?.classList.contains("time-picker-field");
  const viewportPadding = window.innerWidth <= 640 ? 10 : 12;
  const desiredWidth = isTimeField ? 196 : Math.min(Math.max(rect.width, 220), 420);
  const width = Math.min(desiredWidth, Math.max(window.innerWidth - viewportPadding * 2, 160));
  const desiredViewportLeft = isTimeField ? rect.left + rect.width / 2 - width / 2 : rect.left;
  const maxViewportLeft = Math.max(viewportPadding, window.innerWidth - width - viewportPadding);
  const viewportLeft = Math.min(Math.max(viewportPadding, desiredViewportLeft), maxViewportLeft);
  const left = viewportLeft - fieldRect.left;

  panel.style.setProperty("--picker-left", `${left}px`);
  panel.style.setProperty("--picker-width", `${width}px`);

  const panelHeight = panel.offsetHeight || 240;
  const desiredViewportTop =
    rect.bottom + 10 + panelHeight <= window.innerHeight - viewportPadding
      ? rect.bottom + 10
      : rect.top - panelHeight - 10;
  const maxViewportTop = Math.max(viewportPadding, window.innerHeight - panelHeight - viewportPadding);
  const viewportTop = Math.min(Math.max(viewportPadding, desiredViewportTop), maxViewportTop);
  const top = viewportTop - fieldRect.top;
  panel.style.setProperty("--picker-top", `${top}px`);
}

function openPickerPanel(panelId, currentValue = "") {
  closeAllPickerPanels(panelId);
  const panel = $(panelId);
  if (panel) {
    markPickerOpenState(panel);
    panel.classList.remove("hidden");
    requestAnimationFrame(() => {
      positionPickerPanel(panel);
      scrollPickerToCurrent(panel, currentValue);
    });
  }
}

function closeAllPickerPanels(exceptId = "") {
  document.querySelectorAll(".picker-panel").forEach((panel) => {
    if (panel.id !== exceptId) {
      panel.classList.add("hidden");
    }
  });
  if (!exceptId) {
    clearPickerOpenState();
  }
}

function getFieldValidationMessage(field) {
  const fieldLabelMap = {
    username: "用户名",
    password: "密码",
    name: "姓名",
    age: "年龄",
    gender: "性别",
    height_cm: "身高",
    weight_kg: "当前体重",
    target_weight_kg: "目标体重",
    target_sleep_hours: "目标睡眠时长",
    goal: "目标",
    activity_level: "活动水平",
  };
  const label = fieldLabelMap[field.name] || field.getAttribute("aria-label") || field.placeholder || "当前字段";
  if (field.validity.valueMissing) {
    return `请先填写${label}`;
  }
  if (field.validity.tooShort) {
    return `${label}长度还不够`;
  }
  if (field.validity.rangeUnderflow || field.validity.rangeOverflow) {
    return `${label}超出了可填写范围`;
  }
  if (field.validity.typeMismatch || field.validity.badInput) {
    return `${label}格式不正确`;
  }
  if (field.validity.stepMismatch) {
    return `请按正确格式填写${label}`;
  }
  return `请检查${label}`;
}

function bindFormValidationFeedback(formId, messageId) {
  const form = $(formId);
  if (!form) {
    return;
  }

  form.addEventListener(
    "invalid",
    (event) => {
      const field = event.target;
      if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
        return;
      }
      field.classList.add("input-invalid");
      setMessage(messageId, getFieldValidationMessage(field), "error");
    },
    true
  );

  const clearInvalidState = (event) => {
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
      field.classList.remove("input-invalid");
    }
  };

  form.addEventListener("input", clearInvalidState);
  form.addEventListener("change", clearInvalidState);
}

function syncRegisterNumericPickerMode() {
  const useMobilePickerMode = window.matchMedia("(max-width: 640px)").matches;
  [
    "register-age-input",
    "register-height-input",
    "register-weight-input",
    "register-target-weight-input",
    "register-target-sleep-input",
  ].forEach((inputId) => {
    const input = $(inputId);
    const trigger = input?.closest(".picker-trigger");
    if (!input) {
      return;
    }
    input.readOnly = useMobilePickerMode;
    input.type = "text";
    input.inputMode = useMobilePickerMode ? "none" : "decimal";
    input.tabIndex = useMobilePickerMode ? -1 : 0;
    trigger?.classList.toggle("picker-trigger-locked", useMobilePickerMode);
  });
  if (!useMobilePickerMode) {
    closeRegisterNumberPicker();
  }
}

function syncMobileNumericPickerMode() {
  const useMobilePickerMode = window.matchMedia("(max-width: 640px)").matches;
  [
    "assessment-age",
    "assessment-height",
    "assessment-weight",
    "weight-kg-input",
    "workout-duration-input",
    "settings-age",
    "settings-height",
    "settings-weight",
    "settings-target-weight",
    "settings-target-sleep",
  ].forEach((inputId) => {
    const input = $(inputId);
    const trigger = input?.closest(".picker-trigger");
    if (!input) {
      return;
    }
    input.readOnly = useMobilePickerMode;
    input.type = useMobilePickerMode ? "text" : "number";
    input.inputMode = useMobilePickerMode ? "none" : "decimal";
    trigger?.classList.toggle("picker-trigger-locked", useMobilePickerMode);
  });
}

function getNumericPickerFieldKeyByInputId(inputId = "") {
  return Object.entries(REGISTER_NUMBER_PICKER_CONFIG).find(([, config]) => config.inputId === inputId)?.[0] || "";
}

function isMobileRegisterNumberPickerEnabled() {
  return window.matchMedia("(max-width: 640px)").matches;
}

function ensureRegisterNumberPickerOverlay() {
  let overlay = $("register-number-picker-overlay");
  if (overlay) {
    return overlay;
  }
  overlay = document.createElement("div");
  overlay.id = "register-number-picker-overlay";
  overlay.className = "register-number-picker-overlay hidden";
  overlay.innerHTML = `
    <div class="register-number-picker-backdrop" data-register-picker-close="true"></div>
    <div class="register-number-picker-sheet" role="dialog" aria-modal="true" aria-labelledby="register-number-picker-title">
      <div class="register-number-picker-head">
        <div class="register-number-picker-copy">
          <p id="register-number-picker-kicker" class="register-number-picker-kicker"></p>
          <h3 id="register-number-picker-title" class="register-number-picker-title"></h3>
        </div>
        <button
          type="button"
          class="register-number-picker-close"
          aria-label="关闭"
          data-register-picker-close="true"
        >
          关闭
        </button>
      </div>
      <div id="register-number-picker-current" class="register-number-picker-current hidden"></div>
      <div class="register-number-picker-body">
        <div class="picker-list-shell">
          <div class="picker-selection-window" aria-hidden="true"></div>
          <div class="picker-gradient picker-gradient-top"></div>
          <div id="register-number-picker-options" class="picker-options" tabindex="0"></div>
          <div class="picker-gradient picker-gradient-bottom"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function getRegisterNumberPickerConfig(fieldKey = "") {
  return REGISTER_NUMBER_PICKER_CONFIG[fieldKey] || null;
}

function scrollRegisterNumberPickerToCurrent(optionsContainer, currentValue = "") {
  if (!optionsContainer) {
    return;
  }
  const targetIndex = getPickerOptionButtons(optionsContainer).findIndex(
    (button) => getPickerOptionValue(button) === String(currentValue)
  );
  if (targetIndex < 0) {
    setPickerDockState(optionsContainer, findClosestPickerOptionIndex(optionsContainer));
    updatePickerGradients(optionsContainer);
    return;
  }
  snapPickerToIndex(optionsContainer, targetIndex, { behavior: "instant", emit: false });
  syncRegisterNumberPickerCurrentDisplay(getPickerOptionButtons(optionsContainer)[targetIndex]);
}

function renderRegisterNumberPickerOptions(fieldKey) {
  const config = getRegisterNumberPickerConfig(fieldKey);
  const overlay = ensureRegisterNumberPickerOverlay();
  const title = $("register-number-picker-title");
  const kicker = $("register-number-picker-kicker");
  const current = $("register-number-picker-current");
  const optionsContainer = $("register-number-picker-options");
  const input = config ? $(config.inputId) : null;
  if (!config || !overlay || !title || !kicker || !current || !optionsContainer || !input) {
    return;
  }

  title.textContent = config.label;
  kicker.textContent = config.hint;

  if (input.value) {
    const activeOption = config.options.find((option) => String(option.value) === String(input.value));
    current.textContent = activeOption?.label || input.value;
    current.classList.remove("hidden");
  } else {
    current.textContent = "";
    current.classList.add("hidden");
  }

  optionsContainer.__pickerOnSelect = (nextValue, nextLabel) => {
    input.value = nextValue;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    current.textContent = nextLabel;
    current.classList.remove("hidden");
  };

  optionsContainer.innerHTML = `
    <div class="picker-spacer" aria-hidden="true"></div>
    ${config.options
      .map((option, index) => {
        const isSelected = String(option.value) === String(input.value);
        return `
          <button
            type="button"
            class="picker-option register-number-picker-option${isSelected ? " is-selected" : ""}"
            data-register-picker-value="${option.value}"
            data-index="${index}"
            data-field-key="${fieldKey}"
          >
            ${option.label}
          </button>
        `;
      })
      .join("")}
    <div class="picker-spacer" aria-hidden="true"></div>
  `;

  initializePickerDock(overlay);
  requestAnimationFrame(() => {
    let preferredValue = input.value;
    if (!preferredValue && fieldKey === "weight") {
      const gender = $("register-gender-input")?.value || "male";
      preferredValue = gender === "female" ? "60.0" : "80.0";
    }
    if (!preferredValue && fieldKey === "targetWeight") {
      preferredValue = $("register-weight-input")?.value || (($("register-gender-input")?.value || "male") === "female" ? "55.0" : "75.0");
    }
    scrollRegisterNumberPickerToCurrent(optionsContainer, preferredValue);
    window.setTimeout(() => {
      scrollRegisterNumberPickerToCurrent(optionsContainer, preferredValue);
    }, 30);
    const activeIndex = findClosestPickerOptionIndex(optionsContainer);
    if (activeIndex >= 0) {
      const activeOption = getPickerOptionButtons(optionsContainer)[activeIndex];
      syncRegisterNumberPickerCurrentDisplay(activeOption);
    }
    optionsContainer.focus({ preventScroll: true });
  });
}

function openRegisterNumberPicker(fieldKey) {
  if (!isMobileRegisterNumberPickerEnabled()) {
    return;
  }
  const config = getRegisterNumberPickerConfig(fieldKey);
  const overlay = ensureRegisterNumberPickerOverlay();
  if (!config || !overlay) {
    return;
  }
  closeAllPickerPanels();
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  state.registerPicker.fieldKey = fieldKey;
  document.body.classList.add("register-number-picker-active");
  overlay.classList.remove("hidden");
  renderRegisterNumberPickerOptions(fieldKey);
}

function closeRegisterNumberPicker() {
  const overlay = $("register-number-picker-overlay");
  state.registerPicker.fieldKey = "";
  document.body.classList.remove("register-number-picker-active");
  if (overlay) {
    overlay.classList.add("hidden");
  }
}

function setRegisterNumberPickerValue(fieldKey, value) {
  const config = getRegisterNumberPickerConfig(fieldKey);
  const input = config ? $(config.inputId) : null;
  if (!config || !input) {
    return;
  }
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  closeRegisterNumberPicker();
}

function bindRegisterNumberPickers() {
  const overlay = ensureRegisterNumberPickerOverlay();
  if (overlay && overlay.dataset.bound !== "true") {
    overlay.dataset.bound = "true";
    const sheet = overlay.querySelector(".register-number-picker-sheet");
    sheet?.addEventListener("click", (event) => {
      const option = event.target.closest("[data-register-picker-value]");
      if (option) {
        setRegisterNumberPickerValue(option.dataset.fieldKey || "", option.dataset.registerPickerValue || "");
        return;
      }
      if (event.target.closest("[data-register-picker-close]")) {
        closeRegisterNumberPicker();
      }
    });
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.closest(".register-number-picker-backdrop")) {
        closeRegisterNumberPicker();
      }
    });
  }

  Object.entries(REGISTER_NUMBER_PICKER_CONFIG).forEach(([fieldKey, config]) => {
    const input = $(config.inputId);
    const field = input?.closest(".field-block");
    if (!input || !field || field.dataset.registerNumberPickerBound === "true") {
      return;
    }
    field.dataset.registerNumberPickerBound = "true";
    field.dataset.registerNumberField = fieldKey;
    const openHandler = (event) => {
      if (!isMobileRegisterNumberPickerEnabled()) {
        return;
      }
      event.preventDefault();
      openRegisterNumberPicker(fieldKey);
    };
    field.addEventListener("click", openHandler);
    bindTapIntent(
      field,
      (event) => {
        if (isMobileRegisterNumberPickerEnabled()) {
          openHandler(event);
        }
      },
      { shouldHandle: isMobileRegisterNumberPickerEnabled }
    );
    field.addEventListener("keydown", (event) => {
      if (!isMobileRegisterNumberPickerEnabled()) {
        return;
      }
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        openHandler(event);
      }
    });
    input.addEventListener("focus", (event) => {
      if (!isMobileRegisterNumberPickerEnabled()) {
        return;
      }
      if (event.sourceCapabilities?.firesTouchEvents) {
        return;
      }
      event.preventDefault();
      openRegisterNumberPicker(fieldKey);
    });
  });

  if (document.body.dataset.registerNumberPickerEscapeBound !== "true") {
    document.body.dataset.registerNumberPickerEscapeBound = "true";
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.registerPicker.fieldKey) {
        closeRegisterNumberPicker();
      }
    });
  }
}

window.addEventListener("resize", () => {
  document.querySelectorAll(".picker-field.picker-open .picker-panel:not(.hidden)").forEach((panel) => {
    positionPickerPanel(panel);
  });
});

window.addEventListener(
  "scroll",
  () => {
    document.querySelectorAll(".picker-field.picker-open .picker-panel:not(.hidden)").forEach((panel) => {
      positionPickerPanel(panel);
    });
  },
  true
);

function initializeAuthPickers() {
  syncRegisterNumericPickerMode();
  bindRegisterNumberPickers();
  buildPickerOptions(
    "register-age-panel",
    buildNumericOptions(12, 80, 1).map((value) => ({ value, label: `${value} 岁` })),
    (value) => {
      $("register-age-input").value = value;
    }
  );

  buildPickerOptions(
    "register-gender-panel",
    [
      { value: "male", label: "男" },
      { value: "female", label: "女" },
    ],
    (value, label) => {
      $("register-gender-input").value = value;
      $("register-gender-display").value = label;
    }
  );

  buildPickerOptions(
    "register-height-panel",
    buildNumericOptions(140, 210, 1).map((value) => ({ value, label: `${value} cm` })),
    (value) => {
      $("register-height-input").value = value;
    }
  );

  buildPickerOptions(
    "register-weight-panel",
    buildNumericOptions(35, 150, 0.1, 1).map((value) => ({ value, label: `${value} kg` })),
    (value) => {
      $("register-weight-input").value = value;
    }
  );

  buildPickerOptions(
    "register-target-weight-panel",
    buildNumericOptions(35, 150, 0.1, 1).map((value) => ({ value, label: `${value} kg` })),
    (value) => {
      $("register-target-weight-input").value = value;
    }
  );

  buildPickerOptions(
    "register-target-sleep-panel",
    buildNumericOptions(6, 10, 0.5, 1).map((value) => ({ value, label: `${value} 小时` })),
    (value) => {
      $("register-target-sleep-input").value = value;
    }
  );

  $("register-gender-input").value = "male";
  $("register-gender-display").value = "男";

  bindPickerTrigger("register-gender-display", "register-gender-panel");

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".picker-field")) {
      closeAllPickerPanels();
    }
  });

  [
    ["register-age-input", "register-age-panel"],
    ["register-height-input", "register-height-panel"],
    ["register-weight-input", "register-weight-panel"],
    ["register-target-weight-input", "register-target-weight-panel"],
    ["register-target-sleep-input", "register-target-sleep-panel"],
  ].forEach(() => {});
}

function initializeProfilePickers() {
  [
    ["assessment-age-panel", "assessment-age", 12, 80, 1, 0, "岁"],
    ["assessment-height-panel", "assessment-height", 140, 210, 1, 0, "cm"],
    ["assessment-weight-panel", "assessment-weight", 35, 150, 0.1, 1, "kg"],
    ["weight-kg-panel", "weight-kg-input", 35, 150, 0.1, 1, "kg"],
    ["workout-duration-panel", "workout-duration-input", 1, 240, 1, 0, "分钟"],
    ["settings-age-panel", "settings-age", 12, 80, 1, 0, "岁"],
    ["settings-height-panel", "settings-height", 140, 210, 1, 0, "cm"],
    ["settings-weight-panel", "settings-weight", 35, 150, 0.1, 1, "kg"],
    ["settings-target-weight-panel", "settings-target-weight", 35, 150, 0.1, 1, "kg"],
    ["settings-target-sleep-panel", "settings-target-sleep", 6, 10, 0.5, 1, "小时"],
  ].forEach(([panelId, inputId, start, end, step, digits, unit]) => {
    buildPickerOptions(
      panelId,
      buildNumericOptions(start, end, step, digits).map((value) => ({ value, label: `${value} ${unit}` })),
      (value) => {
        $(inputId).value = value;
      }
    );

    const input = $(inputId);
    if (input) {
      input.addEventListener("focus", () => {
        if (!window.matchMedia("(max-width: 640px)").matches) {
          openPickerPanel(panelId);
        }
      });
      input.addEventListener("click", () => {
        if (!window.matchMedia("(max-width: 640px)").matches) {
          openPickerPanel(panelId);
        }
      });
      if (inputId === "workout-duration-input") {
        input.addEventListener("input", refreshWorkoutEstimate);
      }
      if (!input.readOnly) {
        bindEditablePickerInput(inputId, panelId);
      }
    }
  });

  buildPickerOptions(
    "assessment-gender-panel",
    [
      { value: "male", label: "男" },
      { value: "female", label: "女" },
    ],
    (value, label) => {
      setPickerInputValue("assessment-gender", value, "assessment-gender-display", () => label);
    }
  );
  bindPickerTrigger("assessment-gender-display", "assessment-gender-panel");
  setPickerInputValue("assessment-gender", "male", "assessment-gender-display", () => "男");
}

function initializePickerOptions() {
  const hourValues = Array.from({ length: 24 }, (_, index) => padTime(index));
  const minuteValues = Array.from({ length: 60 }, (_, index) => padTime(index));
  const buildTimePicker = (panelId, inputId, displayId, values, suffix) => {
    buildPickerOptions(
      panelId,
      values.map((value) => ({ value, label: `${value}${suffix}` })),
      (value) => {
        setPickerInputValue(inputId, value, displayId, () => value);
        setTimeFieldMode(inputId, "manual");
      }
    );
    bindPickerTrigger(displayId, panelId);
  };

  [
    ["food-hour-panel", "food-hour", "food-hour-display"],
    ["workout-hour-panel", "workout-hour", "workout-hour-display"],
    ["sleep-start-hour-panel", "sleep-start-hour", "sleep-start-hour-display"],
    ["sleep-end-hour-panel", "sleep-end-hour", "sleep-end-hour-display"],
    ["weight-hour-panel", "weight-hour", "weight-hour-display"],
  ].forEach(([panelId, inputId, displayId]) => {
    buildTimePicker(panelId, inputId, displayId, hourValues, " 时");
  });

  [
    ["food-minute-panel", "food-minute", "food-minute-display"],
    ["workout-minute-panel", "workout-minute", "workout-minute-display"],
    ["sleep-start-minute-panel", "sleep-start-minute", "sleep-start-minute-display"],
    ["sleep-end-minute-panel", "sleep-end-minute", "sleep-end-minute-display"],
    ["weight-minute-panel", "weight-minute", "weight-minute-display"],
  ].forEach(([panelId, inputId, displayId]) => {
    buildTimePicker(panelId, inputId, displayId, minuteValues, " 分");
  });

  const workoutTypes = [
    ["running_easy", "慢跑"],
    ["running", "跑步"],
    ["walking", "步行"],
    ["brisk_walking", "快走"],
    ["cycling_leisure", "骑行（休闲）"],
    ["cycling_vigorous", "骑行（高强度）"],
    ["strength_training", "力量训练"],
    ["crossfit", "功能训练"],
    ["swimming", "游泳"],
    ["basketball", "篮球"],
    ["badminton", "羽毛球"],
    ["tennis", "网球"],
    ["table_tennis", "乒乓球"],
    ["football", "足球"],
    ["hiking", "徒步"],
    ["elliptical", "椭圆机"],
    ["rowing_machine", "划船机"],
    ["stair_climber", "爬楼机"],
    ["jump_rope", "跳绳"],
    ["yoga", "瑜伽"],
    ["pilates", "普拉提"],
    ["dance", "跳舞"],
    ["aerobics", "健身操"],
    ["hiit", "HIIT"],
  ];
  buildPickerOptions(
    "workout-type-panel",
    workoutTypes.map(([value, label]) => ({ value, label })),
    (value, label) => {
      setPickerInputValue("workout-type-input", value, "workout-type-display", () => label);
      refreshWorkoutEstimate();
    }
  );
  bindPickerTrigger("workout-type-display", "workout-type-panel");
  setPickerInputValue("workout-type-input", "running_easy", "workout-type-display", () => "慢跑");

  const weightPresets = buildFoodWeightPresetValues();
  buildPickerOptions(
    "food-weight-preset-panel",
    weightPresets
      .filter((value) => value)
      .map((value) => ({ value, label: `${value} g` })),
    (value, label) => {
      setPickerInputValue("food-weight-preset", value, "food-weight-preset-display", () => label);
      $("food-weight-input").value = value;
    }
  );
  bindPickerTrigger("food-weight-preset-display", "food-weight-preset-panel");

  setPickerInputValue("workout-duration-input", "30");
}

function bindInteractiveGlow(scope = document) {
  if (isMobilePerformanceMode()) {
    return;
  }
  const selector = [
    ".auth-stat-card",
    ".point-card",
    ".metric-card",
    ".goal-orb-card",
    ".food-result-card",
    ".dashboard-tab",
    ".hero-overview-meal-card",
    ".hero-plan-chip",
    ".rule-card",
    ".card",
    ".selected-food",
    ".report-panel",
    ".report-stat-card",
  ].join(", ");

  scope.querySelectorAll(selector).forEach((node) => {
    if (node.dataset.glowBound === "true") {
      return;
    }
    node.dataset.glowBound = "true";
    node.classList.add("interactive-glow");
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty("--mx", `${x}%`);
      node.style.setProperty("--my", `${y}%`);
    });
    node.addEventListener("pointerenter", () => {
      node.classList.add("is-hovered");
    });
    node.addEventListener("pointerleave", () => {
      node.classList.remove("is-hovered");
    });
  });
}

let dashboardTabIndicatorFrame = 0;
let dashboardTabScrollFrame = 0;
let authTransitionTimer = 0;

function syncAuthStageHeight() {
  const stage = $("auth-form-stage");
  const authShell = $("auth-shell");
  if (!stage || !authShell || authShell.dataset.authMode !== "register" && authShell.dataset.authMode !== "login") {
    return;
  }
  const activeForm = authShell.dataset.authMode === "register" ? $("register-form") : $("login-form");
  if (!activeForm) {
    return;
  }
  const targetHeight = activeForm.offsetHeight;
  if (!targetHeight) {
    return;
  }
  stage.style.height = `${targetHeight}px`;
}

function isMobilePerformanceMode() {
  return window.matchMedia("(max-width: 860px), (hover: none) and (pointer: coarse)").matches;
}

function ensureDashboardTabIndicator() {
  const nav = document.querySelector(".dashboard-tabs");
  if (!nav) {
    return null;
  }
  let indicator = nav.querySelector(".dashboard-tab-indicator");
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.className = "dashboard-tab-indicator";
    nav.prepend(indicator);
  }
  return indicator;
}

function updateDashboardTabIndicator() {
  const nav = document.querySelector(".dashboard-tabs");
  const active = nav?.querySelector(".dashboard-tab.active");
  const indicator = ensureDashboardTabIndicator();
  if (!nav || !active || !indicator) {
    return;
  }
  if (isMobilePerformanceMode()) {
    indicator.style.opacity = "0";
    return;
  }
  const navRect = nav.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const x = activeRect.left - navRect.left;
  const y = activeRect.top - navRect.top;
  indicator.style.width = `${activeRect.width}px`;
  indicator.style.height = `${activeRect.height}px`;
  indicator.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  indicator.style.opacity = "1";
}

function scheduleDashboardTabIndicatorUpdate() {
  if (dashboardTabIndicatorFrame) {
    return;
  }
  dashboardTabIndicatorFrame = window.requestAnimationFrame(() => {
    dashboardTabIndicatorFrame = 0;
    updateDashboardTabIndicator();
  });
}

function syncActiveDashboardTabIntoView() {
  if (dashboardTabScrollFrame) {
    return;
  }
  dashboardTabScrollFrame = window.requestAnimationFrame(() => {
    dashboardTabScrollFrame = 0;
    const nav = document.querySelector(".dashboard-tabs");
    const active = nav?.querySelector(".dashboard-tab.active");
    if (!nav || !active) {
      return;
    }
    if (window.innerWidth > 1180) {
      return;
    }
    active.scrollIntoView({
      behavior: isMobilePerformanceMode() ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  });
}

function supportsViewTransition() {
  return !isMobilePerformanceMode() && typeof document.startViewTransition === "function";
}

function scrollMobileRegisterFormToTop(form) {
  if (!form) {
    return;
  }
  const alignForm = () => {
    const formTop = form.getBoundingClientRect().top + window.scrollY - 10;
    window.scrollTo({
      top: Math.max(formTop, 0),
      behavior: isMobilePerformanceMode() ? "auto" : "smooth",
    });
  };
  window.setTimeout(alignForm, 80);
  window.setTimeout(alignForm, 220);
}

function showAuth(mode = "login") {
  closeRegisterNumberPicker();
  setShellMode("auth");
  const authShell = $("auth-shell");
  const loginForm = $("login-form");
  const registerForm = $("register-form");
  const nextForm = mode === "register" ? registerForm : loginForm;
  const previousForm = mode === "register" ? loginForm : registerForm;
  const lastMode = authShell?.dataset.authMode || state.authTransitionMode || "login";
  const transitionMode = mode === lastMode ? "" : mode === "register" ? "forward" : "backward";
  if (authTransitionTimer) {
    window.clearTimeout(authTransitionTimer);
    authTransitionTimer = 0;
  }
  authShell.classList.remove("hidden");
  authShell.dataset.authMode = mode;
  authShell.dataset.authTransition = transitionMode;
  authShell.style.setProperty("--auth-page-shift", transitionMode === "forward" ? "18px" : transitionMode === "backward" ? "-18px" : "0px");
  authShell.style.setProperty("--auth-tab-shift", mode === "register" ? "100%" : "0%");
  window.requestAnimationFrame(() => {
    authShell.style.setProperty("--auth-page-shift", "0px");
  });
  state.authTransitionMode = mode;
  $("app-shell").classList.add("hidden");
  if (transitionMode && previousForm && nextForm && previousForm !== nextForm) {
    previousForm.classList.remove("hidden");
    nextForm.classList.remove("hidden");
  } else {
    registerForm.classList.toggle("hidden", mode !== "register");
    loginForm.classList.toggle("hidden", mode !== "login");
  }
  $("show-register-btn").classList.toggle("active", mode === "register");
  $("show-login-btn").classList.toggle("active", mode === "login");
  if (previousForm && nextForm && previousForm !== nextForm && transitionMode) {
    previousForm.classList.remove("form-exit", "form-exit-forward", "form-exit-backward", "form-enter", "form-enter-forward", "form-enter-backward");
    nextForm.classList.remove("form-exit", "form-exit-forward", "form-exit-backward", "form-enter", "form-enter-forward", "form-enter-backward");
    previousForm.classList.add("form-exit", transitionMode === "forward" ? "form-exit-backward" : "form-exit-forward");
    nextForm.classList.add(transitionMode === "forward" ? "form-enter-forward" : "form-enter-backward");
  }
  const activeForm = nextForm;
  if (activeForm) {
    activeForm.classList.remove("form-enter");
    void activeForm.offsetWidth;
    if (!transitionMode) {
      activeForm.classList.add("form-enter");
    }
  }
  requestAnimationFrame(syncAuthStageHeight);
  window.setTimeout(syncAuthStageHeight, 120);
  authTransitionTimer = window.setTimeout(() => {
    authShell.dataset.authTransition = "";
    authShell.style.setProperty("--auth-page-shift", "0px");
    if (previousForm) {
      previousForm.classList.remove("form-exit", "form-exit-forward", "form-exit-backward");
      previousForm.classList.toggle("hidden", previousForm !== nextForm);
    }
    if (nextForm) {
      nextForm.classList.remove("form-enter-forward", "form-enter-backward");
      nextForm.classList.remove("hidden");
    }
    syncAuthStageHeight();
    authTransitionTimer = 0;
  }, 520);
  if (window.matchMedia("(max-width: 640px)").matches) {
    if (mode === "register" && activeForm) {
      scrollMobileRegisterFormToTop(activeForm);
    } else {
      window.scrollTo({ top: 0, behavior: isMobilePerformanceMode() ? "auto" : "smooth" });
    }
  }
  syncResponsiveAppShell();
}

function showApp() {
  setShellMode("app");
  $("auth-shell").classList.add("hidden");
  $("app-shell").classList.remove("hidden");
  syncResponsiveAppShell({ syncFromPanel: true });
}

function showPanel(panelName, options = {}) {
  const { animate = true } = options;
  const requestedPanel = PANEL_NAMES.has(panelName) ? panelName : "overview";
  const safePanel = requestedPanel === "suggestion" ? "overview" : requestedPanel;
  const previousPanel = state.activePanel;
  const mobilePerformanceMode = isMobilePerformanceMode();
  const shouldAnimate = !mobilePerformanceMode && animate && previousPanel && previousPanel !== requestedPanel;

  const applyPanelState = () => {
    state.activePanel = requestedPanel;
    document.querySelectorAll(".dashboard-tab").forEach((button) => {
      button.classList.toggle("active", button.dataset.panel === requestedPanel);
    });
    scheduleDashboardTabIndicatorUpdate();
    syncActiveDashboardTabIntoView();
    document.querySelectorAll(".dashboard-panel").forEach((panel) => {
      const isActive = panel.id === `panel-${safePanel}`;
      panel.classList.toggle("active", isActive);
      if (isActive && !supportsViewTransition() && !mobilePerformanceMode) {
        panel.classList.remove("panel-enter");
        void panel.offsetWidth;
        panel.classList.add("panel-enter");
      }
    });
    if ($("settings-btn")) {
      $("settings-btn").classList.toggle("active", safePanel === "settings");
    }
    syncPanelHash(safePanel);
    if (isMobileAppLayout()) {
      routeMobilePanel(safePanel);
    }
  };

  if (shouldAnimate && supportsViewTransition()) {
    return document.startViewTransition(() => {
      applyPanelState();
    }).finished.catch(() => {});
  }

  applyPanelState();
  return Promise.resolve();
}

function scrollToTarget(targetId) {
  if (!targetId) {
    return;
  }
  const target = $(targetId) || document.querySelector(`[data-panel-anchor="${targetId}"]`) || document.querySelector(`.${targetId}`);
  if (!target) {
    return;
  }
  target.scrollIntoView({ behavior: isMobilePerformanceMode() ? "auto" : "smooth", block: "start" });
}

function navigateToPanel(panelName, scrollTarget) {
  if (isMobileAppLayout()) {
    Promise.resolve(showPanel(panelName, { animate: false })).finally(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: isMobilePerformanceMode() ? "auto" : "smooth" });
      });
    });
    return;
  }
  Promise.resolve(showPanel(panelName)).finally(() => {
    const fallbackTarget =
      panelName === "overview" || panelName === "suggestion"
        ? panelName === "suggestion"
          ? "overview-recommendation-anchor"
          : "overview-target-anchor"
        : `panel-${panelName}`;
    window.requestAnimationFrame(() => {
      scrollToTarget(scrollTarget || fallbackTarget);
    });
  });
}

function fillDefaultDates() {
  $("dashboard-date").value = state.dashboardDate;
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    if (!input.value) {
      input.value = state.dashboardDate;
    }
  });
  resetLiveTimestampDefaults();
  if (!$("sleep-start-hour").value) {
    setPickerInputValue("sleep-start-hour", "23", "sleep-start-hour-display", () => "23");
  }
  if (!$("sleep-start-minute").value) {
    setPickerInputValue("sleep-start-minute", "30", "sleep-start-minute-display", () => "30");
  }
  if (!$("sleep-end-hour").value) {
    setPickerInputValue("sleep-end-hour", "07", "sleep-end-hour-display", () => "07");
  }
  if (!$("sleep-end-minute").value) {
    setPickerInputValue("sleep-end-minute", "30", "sleep-end-minute-display", () => "30");
  }
}

function renderOverview(summary) {
  const recommendation = safeBuildDynamicMealRecommendations(summary);
  const latestWeight = `${summary.user.weight_kg} kg`;
  const targetSleep = summary.user.target_sleep_hours || 8;
  const timeline = computeGoalTimeline(summary);
  const calorieFloor = Number(summary.targets.calorie_floor || 0);
  const proteinPerKg = Number(summary.targets.protein_per_kg || 0);
  const fatRatio = Math.round(Number(summary.targets.fat_ratio || 0) * 100);
  const carbRatio = Math.round(Number(summary.targets.carb_ratio || 0) * 100);
  const bodyAdjustment = Number(summary.targets.body_type_adjustment || 0);
  const modeAdjustment = Number(summary.targets.mode_adjustment || 0);
  const isBodyTypeMode = (summary.user.target_algorithm || "classic") === "body_type_adjusted";
  const recommendationMode = resolveRecommendationMode(summary.user);

  $("hero-status-grid").innerHTML = `
    ${renderOverviewRecommendation(summary, recommendation)}
  `;
  $("overview-recommendation-anchor").innerHTML = renderOverviewSuggestionSection(summary, recommendation);

  $("overview-grid").innerHTML = `
    <div class="metric-card metric-card-action metric-card--accent" role="button" tabindex="0" data-switch-panel="report" data-scroll-target="panel-report">
      <span>今日目标热量</span>
      <strong>${summary.targets.calorie_target} kcal</strong>
      <span>BMR / TDEE 规则计算后的今日控制范围</span>
    </div>
    <div class="metric-card metric-card-action metric-card--neutral" role="button" tabindex="0" data-switch-panel="settings" data-scroll-target="panel-settings">
      <span>目标体重</span>
      <strong>${summary.user.target_weight_kg ? `${summary.user.target_weight_kg} kg` : "未设置"}</strong>
      <span>${summary.user.goal === "maintain" ? "维持模式默认按当前体重维持" : `当前与目标相差 ${Math.abs(summary.targets.goal_gap_kg || 0)} kg`}</span>
    </div>
    <div class="metric-card metric-card-action metric-card--calm" role="button" tabindex="0" data-switch-panel="activity" data-scroll-target="panel-activity">
      <span>目标睡眠时长</span>
      <strong>${targetSleep} 小时</strong>
      <span>今天已睡 ${summary.daily_report.sleep_hours} 小时，睡眠状态：${summary.daily_report.sleep_status}</span>
    </div>
    <div class="metric-card metric-card-action metric-card--warm" role="button" tabindex="0" data-switch-panel="food" data-scroll-target="panel-food">
      <span>净热量差</span>
      <strong>${summary.daily_report.net_calorie_balance} kcal</strong>
      <span>总摄入 ${summary.daily_report.total_intake_kcal} / 总消耗 ${summary.daily_report.total_expenditure_kcal}</span>
    </div>
    <div class="metric-card metric-card-action metric-card--sport" role="button" tabindex="0" data-switch-panel="food" data-scroll-target="panel-food">
      <span>今日运动消耗</span>
      <strong>${summary.daily_report.total_burned_kcal} kcal</strong>
      <span>记录运动后会同步更新，帮助判断当天净热量差</span>
    </div>
    <div class="metric-card metric-card-action metric-card--trend" role="button" tabindex="0" data-switch-panel="trend" data-scroll-target="panel-trend">
      <span>最新体重</span>
      <strong>${latestWeight}</strong>
      <span>上传一次最新体重，这里就会同步刷新</span>
    </div>
    <div class="metric-card metric-card-action metric-card--timeline" role="button" tabindex="0" data-switch-panel="settings" data-scroll-target="panel-settings">
      <span>预计坚持天数</span>
      <strong>${timeline.daysLabel}</strong>
      <span>${timeline.daysNote}</span>
    </div>
    <div class="metric-card metric-card-action metric-card--date" role="button" tabindex="0" data-switch-panel="report" data-scroll-target="panel-report">
      <span>预计达标日期</span>
      <strong>${timeline.dateLabel}</strong>
      <span>${timeline.dateNote}</span>
    </div>
  `;

  $("rules-detail-grid").innerHTML = `
    <article class="rule-card">
      <strong>热量缺口规则</strong>
      <span>减脂会先按性别给基础缺口，再结合目标体重差、年龄系数和当前模式微调。当前 ${genderLabel(summary.user.gender)}基础缺口参考约 ${summary.targets.gender_deficit_baseline} kcal，最低热量保护线约 ${calorieFloor} kcal，${recommendationModeLabel(recommendationMode)}额外修正约 ${modeAdjustment > 0 ? "+" : ""}${modeAdjustment} kcal。</span>
    </article>
    <article class="rule-card">
      <strong>增肌与维持</strong>
      <span>增肌会在 TDEE 上叠加温和盈余，维持模式默认贴近 TDEE；如果设置了目标体重，系统会按体重差把盈余或缺口做得更细。健身模式会更偏向训练恢复，外食模式会把隐藏油盐与执行难度考虑得更保守。</span>
    </article>
    <article class="rule-card">
      <strong>蛋白目标</strong>
      <span>蛋白按每公斤体重细化：当前约 ${proteinPerKg} g/kg。三个模式不会共用同一个值，家常模式更稳，健身模式会明显抬高训练日蛋白，外食模式会在可执行范围内维持相对高蛋白；年龄越大也会保留更稳妥的蛋白下限。</span>
    </article>
    <article class="rule-card">
      <strong>脂肪目标</strong>
      <span>脂肪优先按总热量占比估算，当前约占 ${fatRatio}% 热量。系统会避免压得过低，尽量给日常激素和饱腹感留出空间。</span>
    </article>
    <article class="rule-card">
      <strong>碳水目标</strong>
      <span>碳水用剩余热量反推，当前约占 ${carbRatio}% 热量。减脂会略收一点，增肌会略放一点；健身模式会更照顾训练与恢复所需的主食安排，外食模式会更偏向容易买到、波动较小的主食组合。</span>
    </article>
    <article class="rule-card">
      <strong>年龄与性别</strong>
      <span>年龄会影响缺口/盈余幅度与蛋白建议，性别会影响基础热量下限和减脂缺口范围，所以不是所有人都用同一个固定数值。</span>
    </article>
    <article class="rule-card">
      <strong>体型参考模式</strong>
      <span>${isBodyTypeMode ? `当前已开启${bodyTypeLabel(summary.user.body_type)}参考模式，本次热量微调约 ${bodyAdjustment > 0 ? "+" : ""}${bodyAdjustment} kcal。` : "当前默认使用经典公式。体型参考模式只做轻微微调，不会替代核心热量公式。"} 这部分更偏帮助观察与执行，不作为医学诊断。</span>
    </article>
    <article class="rule-card">
      <strong>规则引擎输出</strong>
      <span>报告里的“蛋白不足、脂肪偏高、碳水偏高、睡眠不足”等结论，都来自本地数据库、固定公式和 if/else 阈值判断，不含任何 AI 生成。</span>
    </article>
  `;
}

function formatDateLabel(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "按当前节奏";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function computeGoalTimeline(summary) {
  const totalCalories = Number(summary.targets.goal_total_calories || 0);
  const tdee = Number(summary.targets.tdee || 0);
  const calorieTarget = Number(summary.targets.calorie_target || 0);
  const reportDate = summary.daily_report?.date || state.dashboardDate;
  const goal = summary.user?.goal || "fat_loss";
  const suggestedGap = Math.max(Math.abs(tdee - calorieTarget), goal === "muscle_gain" ? 250 : 400);

  if (!totalCalories || goal === "maintain") {
    return {
      daysLabel: "无需倒计时",
      daysNote: "维持模式以长期稳定为主，不单独计算坚持天数",
      dateLabel: "维持观察",
      dateNote: "维持模式建议按周观察体重和状态变化",
    };
  }

  const estimatedDays = Math.max(Math.ceil(totalCalories / Math.max(suggestedGap, 1)), 1);
  const date = new Date(reportDate);
  if (!Number.isNaN(date.getTime())) {
    date.setDate(date.getDate() + estimatedDays);
  }

  return {
    daysLabel: `${estimatedDays} 天`,
    daysNote: `按当前目标热量结构估算，建议先稳定坚持 ${estimatedDays} 天左右`,
    dateLabel: formatDateLabel(date),
    dateNote: `按当前目标热量差约 ${Math.round(suggestedGap)} kcal / 天推算`,
  };
}

function formatTargetValue(value, unit = "g") {
  if (unit === "kcal") {
    return `${Math.round(value)} kcal`;
  }
  return `${Number(value).toFixed(1)} ${unit}`;
}

function completionPercent(actual, target) {
  if (!target || target <= 0) {
    return 0;
  }
  return Math.max(0, Math.min((actual / target) * 100, 140));
}

function renderGoalTargets(summary) {
  const items = [
    {
      label: "热量目标",
      actual: summary.daily_report.total_intake_kcal,
      target: summary.targets.calorie_target,
      unit: "kcal",
      note: "当前摄入 / 今日目标",
    },
    {
      label: "蛋白目标",
      actual: summary.daily_report.protein.actual,
      target: summary.targets.protein_target,
      unit: "g",
      note: "维持肌肉和恢复",
    },
    {
      label: "脂肪目标",
      actual: summary.daily_report.fat.actual,
      target: summary.targets.fat_target,
      unit: "g",
      note: "控制过高也避免过低",
    },
    {
      label: "碳水目标",
      actual: summary.daily_report.carbs.actual,
      target: summary.targets.carb_target,
      unit: "g",
      note: "剩余热量分配",
    },
    {
      label: "目标体重",
      actual: summary.user.weight_kg,
      target: summary.targets.target_weight_kg || summary.user.weight_kg,
      unit: "kg",
      note: "作为减脂/增肌能量目标参考",
    },
    {
      label: "达到目标总热量",
      actual: summary.daily_report.total_expenditure_kcal,
      target: summary.targets.goal_total_calories || 0,
      unit: "kcal",
      note: "按当前体重与目标体重的差值估算总热量差",
    },
  ];
  const cardClasses = ["energy", "protein", "fat", "carb", "weight", "timeline"];

  $("goal-targets").innerHTML = `
    <div>
      <p class="eyebrow">当前目标</p>
      <h3>六个椭圆目标卡，快速看清今天的重点</h3>
    </div>
    <div class="goal-orb-grid">
      ${items
        .map(
          (item, index) => `
            <article class="goal-orb-card goal-orb-card--${cardClasses[index] || "default"}" role="button" tabindex="0" data-switch-panel="${index === 0 ? "report" : index >= 4 ? "settings" : "food"}" data-scroll-target="panel-${index === 0 ? "report" : index >= 4 ? "settings" : "food"}">
              <span class="goal-orb-label">${item.label}</span>
              <strong>${formatTargetValue(item.target, item.unit)}</strong>
              <span class="goal-orb-compare">${formatTargetValue(item.actual, item.unit)} / ${formatTargetValue(item.target, item.unit)}</span>
              <span class="goal-orb-note">${item.note}</span>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderCompletionCurve(summary) {
  const metrics = [
    { label: "热量", percent: completionPercent(summary.daily_report.total_intake_kcal, summary.targets.calorie_target) },
    { label: "蛋白", percent: completionPercent(summary.daily_report.protein.actual, summary.targets.protein_target) },
    { label: "脂肪", percent: completionPercent(summary.daily_report.fat.actual, summary.targets.fat_target) },
    { label: "碳水", percent: completionPercent(summary.daily_report.carbs.actual, summary.targets.carb_target) },
  ];
  const average = metrics.reduce((sum, item) => sum + Math.min(item.percent, 100), 0) / metrics.length;
  const width = 420;
  const height = 170;
  const padding = 28;
  const points = metrics
    .map((metric, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(metrics.length - 1, 1);
      const y = height - padding - (Math.min(metric.percent, 120) / 120) * (height - padding * 2);
      return { x, y, label: metric.label, percent: metric.percent };
    });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const labels = points
    .map(
      (point) =>
        `<text x="${point.x}" y="${height - 8}" fill="#6e5d50" font-size="12" text-anchor="middle">${point.label}</text>`
    )
    .join("");
  const circles = points
    .map(
      (point) =>
        `<circle cx="${point.x}" cy="${point.y}" r="6" fill="#c15f3f"></circle><text x="${point.x}" y="${point.y - 12}" fill="#94472c" font-size="11" text-anchor="middle">${point.percent.toFixed(0)}%</text>`
    )
    .join("");

  $("completion-curve").innerHTML = `
    <h4>目标完成度曲线</h4>
    <p class="muted-text">把热量、蛋白、脂肪、碳水的今日完成度放在当前目标下面。综合完成度约 ${average.toFixed(0)}%。</p>
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="目标完成度曲线">
      <rect x="0" y="0" width="${width}" height="${height}" rx="20" fill="rgba(255,248,241,0.72)"></rect>
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="rgba(96,73,47,0.16)" stroke-width="2"></line>
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(96,73,47,0.16)" stroke-width="2"></line>
      <polyline fill="none" stroke="#c15f3f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${polyline}"></polyline>
      ${circles}
      ${labels}
      <text x="${padding}" y="${padding - 8}" fill="#6e5d50" font-size="11">120%</text>
      <text x="${padding}" y="${height - padding - 4}" fill="#6e5d50" font-size="11">0%</text>
    </svg>
  `;
}

function renderDailyReport(report) {
  const warnings = report.warnings.length
    ? report.warnings.map((item) => `<div class="report-list-item"><span class="report-list-bullet"></span><span>${item}</span></div>`).join("")
    : `<div class="report-list-item"><span class="report-list-bullet"></span><span>今天整体比较平稳，暂时没有额外提醒。</span></div>`;
  const suggestions = report.suggestions
    .map((item) => `<div class="report-list-item"><span class="report-list-bullet"></span><span>${item}</span></div>`)
    .join("");

  return `
    <section class="report-hero">
      <div class="report-hero-copy">
        <p class="eyebrow">今日健康报告</p>
        <h3>${report.conclusion}</h3>
        <p class="muted-text">今天的饮食、运动和睡眠数据已经按固定公式重新汇总，下面可以直接看重点。</p>
      </div>
      <div class="report-patrick" aria-hidden="true">
        <div class="patrick-bubble"></div>
        <div class="patrick-face">
          <span class="patrick-eye left"></span>
          <span class="patrick-eye right"></span>
          <span class="patrick-smile"></span>
        </div>
      </div>
    </section>
    <div class="report-stat-grid">
      <article class="report-stat-card report-stat-card--intake"><span>总摄入</span><strong>${report.total_intake_kcal} kcal</strong></article>
      <article class="report-stat-card report-stat-card--burn"><span>总消耗</span><strong>${report.total_expenditure_kcal} kcal</strong></article>
      <article class="report-stat-card report-stat-card--balance"><span>净热量差</span><strong>${report.net_calorie_balance} kcal</strong></article>
      <article class="report-stat-card report-stat-card--sleep"><span>睡眠状态</span><strong>${report.sleep_hours} h</strong><small>${report.sleep_status}</small></article>
    </div>
    <div class="report-section-grid">
      <article class="report-panel report-panel--macro">
        <h4>营养完成度</h4>
        <div class="report-list">
          <div>${formatMacroLine("蛋白质", report.protein)}</div>
          <div>${formatMacroLine("脂肪", report.fat)}</div>
          <div>${formatMacroLine("碳水", report.carbs)}</div>
        </div>
      </article>
      <article class="report-panel report-panel--warning">
        <h4>温和提醒</h4>
        <div class="report-list">${warnings}</div>
      </article>
      <article class="report-panel report-panel-wide report-panel--suggestion">
        <h4>建议与结论</h4>
        <div class="report-list">${suggestions}</div>
      </article>
    </div>
  `;
}

function renderWeeklyReport(report) {
  const dailyCards = report.daily_reports
    .map(
      (item) =>
        `<div class="rule-card"><strong>${item.date}</strong><span>摄入 ${item.total_intake_kcal} kcal / 消耗 ${item.total_expenditure_kcal} kcal / 净热量 ${item.net_calorie_balance} kcal<br>${item.conclusion}</span></div>`
    )
    .join("");

  return `
    <section class="report-hero weekly">
      <div class="report-hero-copy">
        <p class="eyebrow">每周健康报告</p>
        <h3>${report.start_date} 至 ${report.end_date}</h3>
        <p class="muted-text">把本周的摄入、运动、睡眠和净热量走势集中放在这里。</p>
      </div>
    </section>
    <div class="report-stat-grid">
      <article class="report-stat-card report-stat-card--intake"><span>平均摄入</span><strong>${report.average_intake_kcal} kcal</strong></article>
      <article class="report-stat-card report-stat-card--burn"><span>平均运动消耗</span><strong>${report.average_burned_kcal} kcal</strong></article>
      <article class="report-stat-card report-stat-card--sleep"><span>平均睡眠</span><strong>${report.average_sleep_hours} h</strong></article>
      <article class="report-stat-card report-stat-card--balance"><span>平均净热量</span><strong>${report.average_net_balance} kcal</strong></article>
    </div>
    <div class="rules-grid">${dailyCards}</div>
  `;
}

function renderReportEmptyState(title = "日报和周报会显示在这里", description = "点击“刷新日报”或“查看周报”后，这里会集中展示固定公式和规则引擎生成的结果。") {
  return `
    <section class="report-empty-state">
      <div class="report-empty-badge">待生成</div>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(description)}</p>
    </section>
  `;
}

function renderWeightChart(weights) {
  if (!weights.length) {
    $("weight-chart").innerHTML = `
      <section class="chart-empty-state">
        <div class="chart-empty-icon">○</div>
        <strong>还没有体重记录</strong>
        <p>先在左侧提交一条体重数据，这里会自动生成最近趋势和波动区间。</p>
      </section>
    `;
    return;
  }

  const data = weights.slice(-14);
  const values = data.map((item) => item.weight_kg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const latest = values[values.length - 1];
  const first = values[0];
  const delta = latest - first;
  const deltaLabel = `${delta > 0 ? "+" : ""}${delta.toFixed(1)} kg`;
  const width = 640;
  const height = 220;
  const padding = 30;
  const span = Math.max(max - min, 1);

  const points = data
    .map((item, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y = height - padding - ((item.weight_kg - min) / span) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const circles = data
    .map((item, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y = height - padding - ((item.weight_kg - min) / span) * (height - padding * 2);
      return `<circle cx="${x}" cy="${y}" r="6" fill="#c15f3f"></circle>`;
    })
    .join("");

  const fillArea = `${points} ${width - padding},${height - padding} ${padding},${height - padding}`;

  const labels = data.map((item) => `<span>${item.record_date.slice(5)}</span>`).join("");

  $("weight-chart").innerHTML = `
    <div class="chart-head">
      <div class="chart-stat-pill">
        <span>最新体重</span>
        <strong>${latest.toFixed(1)} kg</strong>
      </div>
      <div class="chart-stat-pill">
        <span>阶段变化</span>
        <strong>${deltaLabel}</strong>
      </div>
      <div class="chart-stat-pill">
        <span>区间波动</span>
        <strong>${(max - min).toFixed(1)} kg</strong>
      </div>
    </div>
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="体重曲线">
      <rect x="0" y="0" width="${width}" height="${height}" rx="20" fill="rgba(255,255,255,0.76)"></rect>
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="rgba(96,73,47,0.18)" stroke-width="2"></line>
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(96,73,47,0.18)" stroke-width="2"></line>
      <polygon points="${fillArea}" fill="rgba(208,106,71,0.10)"></polygon>
      <polyline fill="none" stroke="#c15f3f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${points}"></polyline>
      ${circles}
      <text x="${padding}" y="${padding - 8}" fill="#6e5d50" font-size="12">${max.toFixed(1)} kg</text>
      <text x="${padding}" y="${height - 10}" fill="#6e5d50" font-size="12">${min.toFixed(1)} kg</text>
    </svg>
    <div class="chart-labels">${labels}</div>
  `;
}

function renderAssessment(profile) {
  const bodyType = getBodyTypeOption($("assessment-body-type-input")?.value || state.currentUser?.body_type || "balanced");
  $("assessment-cards").innerHTML = `
    <article class="metric-card">
      <span>BMI 指数</span>
      <strong>${profile.bmi}</strong>
      <span>依据中国常用成人 BMI 区间判断</span>
    </article>
    <article class="metric-card">
      <span>身体状态</span>
      <strong>${profile.status}</strong>
      <span>${profile.description}</span>
    </article>
    <article class="metric-card">
      <span>基础代谢</span>
      <strong>${profile.bmr} kcal</strong>
      <span>结合年龄、身高、体重和性别估算</span>
    </article>
    <article class="metric-card">
      <span>当前参数</span>
      <strong>${profile.weight_kg} kg</strong>
      <span>${profile.height_cm} cm · ${profile.age} 岁</span>
    </article>
  `;

  const rawMarkerPercent = ((profile.bmi - 14) / (32 - 14)) * 100;
  const markerPercent = Math.max(7, Math.min(rawMarkerPercent, 93));
  $("bmi-range-chart").innerHTML = `
    <div class="bmi-range">
      <div class="bmi-segment bmi-under">营养不良</div>
      <div class="bmi-segment bmi-normal">正常</div>
      <div class="bmi-segment bmi-over">超重</div>
      <div class="bmi-segment bmi-obese">肥胖</div>
      <div class="bmi-marker" style="left: ${markerPercent}%;">
        <span>${profile.bmi}</span>
      </div>
    </div>
    <div class="bmi-scale">
      <span>14</span>
      <span>18.5</span>
      <span>24</span>
      <span>28</span>
      <span>32+</span>
    </div>
  `;

  $("assessment-summary").innerHTML = `
    <section class="summary-stack">
      <div class="summary-stack-head">
        <span class="summary-kicker">身体评估</span>
        <strong>${profile.status}</strong>
      </div>
      <div class="summary-stack-list">
        <div><span>BMI 指数</span><strong>${profile.bmi}</strong></div>
        <div><span>基础代谢</span><strong>${profile.bmr} kcal</strong></div>
      </div>
      <p>${profile.description}</p>
    </section>
  `;

  $("body-type-summary").innerHTML = `
    <section class="summary-stack">
      <div class="summary-stack-head">
        <span class="summary-kicker">体型参考</span>
        <strong>${bodyType.label}</strong>
      </div>
      <div class="summary-stack-list">
        <div><span>当前模式</span><strong>${bodyType.face}</strong></div>
        <div><span>定位</span><strong>说明性参考</strong></div>
      </div>
      <p>${bodyType.description}</p>
      <small>这个模块主要用于帮助你理解记录习惯与观察重点，默认热量公式仍以经典算法为主。</small>
    </section>
  `;
}

function fillAssessmentForm(user) {
  $("assessment-age").value = user.age;
  $("assessment-height").value = user.height_cm;
  $("assessment-weight").value = user.weight_kg;
  setPickerInputValue("assessment-gender", user.gender, "assessment-gender-display", () => (user.gender === "female" ? "女" : "男"));
  renderBodyTypePicker("assessment-body-type", "assessment-body-type-input", user.body_type || "balanced");
  renderAssessment(computeBmiProfile(user));
}

function fillSettingsForm(user) {
  const preferences = loadPreferences();
  $("settings-language").value = preferences.language || "zh-CN";
  $("settings-recommendation-mode").value = user.recommendation_mode || preferences.recommendation_mode || "home";
  $("settings-username").value = user.username || "";
  $("settings-name").value = user.name || "";
  $("settings-age").value = user.age;
  $("settings-gender").value = user.gender;
  $("settings-height").value = user.height_cm;
  $("settings-weight").value = user.weight_kg;
  $("settings-target-weight").value = user.target_weight_kg || "";
  $("settings-target-sleep").value = user.target_sleep_hours || "";
  $("settings-goal").value = user.goal;
  $("settings-activity").value = user.activity_level;
  $("settings-target-algorithm").value = user.target_algorithm || "classic";
  renderBodyTypePicker("settings-body-type", "settings-body-type-input", user.body_type || "balanced");
  renderPantryChips(preferences.pantry_items || DEFAULT_PREFERENCES.pantry_items);
  $("settings-current-password").value = "";
  $("settings-new-password").value = "";
}

function renderPantryChips(selectedItems = []) {
  renderPantryChipsFor("settings-pantry-chips", selectedItems);
}

function renderPantryChipsFor(containerId, selectedItems = []) {
  const container = $(containerId);
  if (!container) {
    return;
  }
  const selectedSet = new Set(selectedItems);
  container.innerHTML = PANTRY_PRESET_ITEMS.map(
    (item) => `
      <button type="button" class="pantry-chip${selectedSet.has(item) ? " active" : ""}" data-pantry-item="${item}">
        ${item}
      </button>
    `
  ).join("");

  container.querySelectorAll(".pantry-chip").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
    });
  });
}

function fillRegisterPreferences() {
  const preferences = loadPreferences();
  if ($("register-recommendation-mode")) {
    $("register-recommendation-mode").value = preferences.recommendation_mode || "home";
  }
  renderPantryChipsFor("register-pantry-chips", preferences.pantry_items || DEFAULT_PREFERENCES.pantry_items);
}

async function refreshWorkoutEstimate() {
  if (!state.currentUser) {
    return;
  }
  const type = $("workout-type-input")?.value;
  const duration = Number($("workout-duration-input")?.value || 30);
  if (!type || !duration) {
    return;
  }
  try {
    const result = await apiRequest(
      `/workout/estimate?user_id=${state.currentUser.id}&type=${encodeURIComponent(type)}&duration_min=${duration}`
    );
    $("workout-calories-input").value = result.estimated_calories;
  } catch {
    // Ignore estimate failures and keep manual entry usable.
  }
}

function renderFoodResults(foods) {
  if (!foods.length) {
    $("food-results").innerHTML = "<p class=\"muted-text\">没有找到匹配食物，可以换个关键词继续搜。</p>";
    return;
  }
  const grouped = new Map();
  foods.forEach((food) => {
    const groupKey = food.brand || "常见食物";
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, []);
    }
    grouped.get(groupKey).push(food);
  });

  $("food-results").innerHTML = Array.from(grouped.entries())
    .map(
      ([groupName, items]) => `
        <section class="food-brand-group">
          <div class="food-brand-heading">
            <h4>${groupName}</h4>
            <span>${items.length} 项</span>
          </div>
          <div class="food-brand-grid">
            ${items.map((food, index) => renderFoodCard(food, index)).join("")}
          </div>
        </section>
      `
    )
    .join("");

  bindFoodSelectButtons();
  bindInteractiveGlow($("food-results"));
}

async function handleRestaurantBrandFilter(brand) {
  state.activeRestaurantBrand = brand;
  document.querySelectorAll(".brand-filter-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.brandFilter === brand);
  });
  renderBrandHero(brand);

  const keywordMap = {
    all: "麦当劳",
    "麦当劳": "麦当劳",
    "肯德基": "肯德基",
    "赛百味": "赛百味",
    "味千拉面": "味千拉面",
    "外卖常见": "外卖常见",
    "鱼籽村": "鱼籽村",
    "米村拌饭": "米村拌饭",
    "南城香": "南城香",
    "吉野家": "吉野家",
    "留学生餐厅": "留学生餐厅",
  };
  const keyword = keywordMap[brand] || brand;
  $("food-search-input").value = brand === "all" ? "" : keyword;

  try {
    let foods;
    if (brand === "all") {
      const allFoods = await apiRequest("/food/database?limit=400&offset=0");
      foods = allFoods.filter((food) => food.brand);
      setMessage("food-search-state", `当前展示 ${foods.length} 条餐厅与外卖单品`);
    } else {
      foods = await apiRequest(`/food/search?q=${encodeURIComponent(keyword)}&limit=40`);
      foods = foods.filter((food) => food.brand === brand);
      setMessage("food-search-state", `当前展示 ${brand} ${foods.length} 条单品`);
    }
    renderFoodResults(foods);
    scrollToFoodSearchSummary(120);
  } catch (error) {
    setMessage("food-search-state", error.message);
  }
}

async function loadDashboard() {
  if (!state.currentUser) {
    return;
  }

  const dateValue = $("dashboard-date").value || state.dashboardDate;
  state.dashboardDate = dateValue;
  state.dashboardRequestId += 1;
  const requestId = state.dashboardRequestId;
  state.dashboardAbortController?.abort();
  const controller = new AbortController();
  state.dashboardAbortController = controller;
  setDashboardLoading(true);

  try {
    const summaryPromise = apiRequest(
      `/dashboard/summary?user_id=${state.currentUser.id}&report_date=${encodeURIComponent(dateValue)}`,
      { signal: controller.signal }
    );
    const foodDatabasePromise = state.foodDatabase.length
      ? Promise.resolve(state.foodDatabase)
      : apiRequest("/food/database?limit=500", { signal: controller.signal }).catch((error) => {
          if (isAbortError(error)) {
            throw error;
          }
          console.error("food database preload failed", error);
          return [];
        });

    const [summary, foodDatabase] = await Promise.all([summaryPromise, foodDatabasePromise]);
    if (requestId !== state.dashboardRequestId) {
      return;
    }

    if (Array.isArray(foodDatabase) && foodDatabase.length) {
      state.foodDatabase = foodDatabase;
    }

    saveCurrentUser(summary.user);
    savePreferences({
      ...loadPreferences(),
      recommendation_mode: summary.user.recommendation_mode || "home",
    });
    $("welcome-title").textContent = `${summary.user.name} 的健康首页`;
    $("user-pill").textContent = `${summary.user.username || summary.user.name} · ${goalLabel(summary.user.goal)}`;
    $("hero-goal-line").textContent = "根据固定公式和记录结果，快速查看今天的执行重点";

    runSafeRenderStep("renderGoalTargets", () => {
      renderGoalTargets(summary);
    }, () => {
      $("goal-targets").innerHTML = "";
    });

    runSafeRenderStep("renderOverview", () => {
      renderOverview(summary);
    }, () => {
      $("hero-status-grid").innerHTML = "";
      $("overview-grid").innerHTML = "";
      $("overview-recommendation-anchor").innerHTML = `
        <div class="section-heading">
          <p class="eyebrow">今日饮食建议</p>
          <h3>建议模块暂时没有生成出来</h3>
          <p class="muted-text">当前数据已经加载完成，你可以先继续记录饮食和运动，稍后刷新首页再试。</p>
        </div>
      `;
      $("rules-detail-grid").innerHTML = "";
    });

    runSafeRenderStep("renderCompletionCurve", () => {
      renderCompletionCurve(summary);
    }, () => {
      $("completion-curve").innerHTML = "";
    });

    runSafeRenderStep("renderWeightChart", () => {
      renderWeightChart(summary.recent_weights || []);
    }, () => {
      $("weight-chart").innerHTML = `
        <section class="chart-empty-state">
          <div class="chart-empty-icon">○</div>
          <strong>体重曲线暂时没有生成出来</strong>
          <p>体重记录数据还在，但这张图刚才渲染失败了。你可以刷新首页后再看。</p>
        </section>
      `;
    });

    runSafeRenderStep("fillAssessmentForm", () => {
      fillAssessmentForm(summary.user);
    });

    runSafeRenderStep("fillSettingsForm", () => {
      fillSettingsForm(summary.user);
    });

    runSafeRenderStep("renderDailyReport", () => {
      $("report-result").innerHTML = renderDailyReport(summary.daily_report);
    }, () => {
      $("report-result").innerHTML = renderReportEmptyState("报告模块暂时没有生成出来", "基础数据还在，刷新首页后会重新尝试生成日报。");
    });

    runSafeRenderStep("renderMobileDashboard", () => {
      renderMobileDashboard(summary);
    });

    bindInteractiveGlow(document);
    scheduleDashboardTabIndicatorUpdate();
    syncResponsiveAppShell();
  } catch (error) {
    if (isAbortError(error)) {
      return;
    }
    throw error;
  } finally {
    if (state.dashboardAbortController === controller) {
      state.dashboardAbortController = null;
    }
    if (requestId === state.dashboardRequestId) {
      setDashboardLoading(false);
    }
  }
}

async function handleRegister(event) {
  event.preventDefault();
  closeAllPickerPanels();
  closeRegisterNumberPicker();
  const payload = getFormData(event.currentTarget);
  payload.age = Number(payload.age);
  payload.height_cm = Number(payload.height_cm);
  payload.weight_kg = Number(payload.weight_kg);
  if (payload.target_weight_kg) {
    payload.target_weight_kg = Number(payload.target_weight_kg);
  }
  if (payload.target_sleep_hours) {
    payload.target_sleep_hours = Number(payload.target_sleep_hours);
  }

  try {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const pantryItems = Array.from(document.querySelectorAll("#register-pantry-chips .pantry-chip.active")).map((node) => node.dataset.pantryItem);
    savePreferences({
      ...loadPreferences(),
      recommendation_mode: data.user.recommendation_mode || payload.recommendation_mode || "home",
      pantry_items: pantryItems.length ? pantryItems : DEFAULT_PREFERENCES.pantry_items,
    });
    saveCurrentUser(data.user);
    setMessage("register-result", `${data.message}，正在进入系统。`);
    showApp();
    showPanel("overview");
    fillDefaultDates();
    try {
      await loadDashboard();
      setMessage("register-result", `${data.message}，已进入首页。`);
    } catch (dashboardError) {
      $("welcome-title").textContent = `${data.user.name} 的健康首页`;
      $("user-pill").textContent = `${data.user.username || data.user.name} · ${goalLabel(data.user.goal)}`;
      setMessage("register-result", `注册成功，已进入系统。首页数据正在同步，请点一次“刷新首页”重试。`);
      console.error(dashboardError);
    }
  } catch (error) {
    setMessage("register-result", error.message);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const payload = getFormData(event.currentTarget);

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    saveCurrentUser(data.user);
    savePreferences({
      ...loadPreferences(),
      recommendation_mode: data.user.recommendation_mode || loadPreferences().recommendation_mode || "home",
    });
    setMessage("login-result", `${data.message}，正在进入首页。`);
    showApp();
    showPanel("overview");
    fillDefaultDates();
    try {
      await loadDashboard();
    } catch (dashboardError) {
      $("welcome-title").textContent = `${data.user.name} 的健康首页`;
      $("user-pill").textContent = `${data.user.username || data.user.name} · ${goalLabel(data.user.goal)}`;
      setMessage("login-result", `登录成功，但首页数据暂时没有刷新出来，请点一次“刷新首页”。`);
      console.error(dashboardError);
    }
  } catch (error) {
    setMessage("login-result", error.message);
  }
}

async function handleFoodSearch() {
  const keyword = $("food-search-input").value.trim();
  if (!keyword) {
    setMessage("food-search-state", "请输入食物关键词");
    return;
  }

  try {
    const foods = await apiRequest(`/food/search?q=${encodeURIComponent(keyword)}`);
    setMessage("food-search-state", `找到 ${foods.length} 条匹配数据`);
    renderFoodResults(foods);
    scrollToFoodSearchSummary(120);
  } catch (error) {
    setMessage("food-search-state", error.message);
  }
}

async function handleFoodLog(event) {
  event.preventDefault();
  if (!state.currentUser) {
    setMessage("food-log-result", "请先登录");
    return;
  }
  if (!state.selectedFood) {
    setMessage("food-log-result", "请先从搜索结果里选择一个食物");
    return;
  }

  const form = event.currentTarget;
  const payload = getFormData(form);
  refreshLiveTimestampDefaults();
  payload.user_id = state.currentUser.id;
  payload.food_id = state.selectedFood.food_id;
  payload.weight_g = isRestaurantFood(state.selectedFood)
    ? Number(state.selectedFood.serving_size_g || payload.weight_g)
    : Number(payload.weight_g);
  payload.time = buildTimeValue("food-hour", "food-minute");
  if (!payload.cooking_method) {
    delete payload.cooking_method;
  }

  try {
    const data = await apiRequest("/food/log", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const recordedFoodName = state.selectedFood.name;
    const successMessage = `记录成功\n${recordedFoodName}${data.cooking_method ? ` · ${data.cooking_method}` : ""} ${data.weight_g}g · ${data.time}\n热量 ${data.nutrition.calories} kcal，蛋白 ${data.nutrition.protein}g，脂肪 ${data.nutrition.fat}g，碳水 ${data.nutrition.carbs}g`;
    setMessage(
      "food-log-result",
      successMessage
    );
    resetLiveTimestampDefaults();
    clearFoodSearchFlow(true);
    await loadDashboard();
    if (isMobileAppLayout()) {
      showMobileToast(`${recordedFoodName} ${data.weight_g}g 已记录成功`, 1100);
      showMobileScreen("record", {
        recordTab: "food",
        preserveScroll: true,
        alignRecordPane: true,
      });
    } else {
      scrollFoodLogFlow("food-search-input", "start", 1000);
    }
  } catch (error) {
    setMessage("food-log-result", error.message);
  }
}

async function handleWorkoutLog(event) {
  event.preventDefault();
  if (!state.currentUser) {
    setMessage("workout-result", "请先登录");
    return;
  }

  const payload = getFormData(event.currentTarget);
  refreshLiveTimestampDefaults();
  payload.user_id = state.currentUser.id;
  payload.duration_min = Number(payload.duration_min);
  payload.calories_burned = Number(payload.calories_burned);
  payload.workout_time = buildTimeValue("workout-hour", "workout-minute");

  try {
    const data = await apiRequest("/workout/log", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setMessage(
      "workout-result",
      `记录成功\n${data.type} ${data.duration_min} 分钟 · ${data.workout_time || payload.workout_time}\n消耗 ${data.calories_burned} kcal`
    );
    resetLiveTimestampDefaults();
    await loadDashboard();
  } catch (error) {
    setMessage("workout-result", error.message);
  }
}

async function handleSleepLog(event) {
  event.preventDefault();
  if (!state.currentUser) {
    setMessage("sleep-result", "请先登录");
    return;
  }

  const payload = getFormData(event.currentTarget);
  payload.user_id = state.currentUser.id;
  payload.sleep_start = buildTimeValue("sleep-start-hour", "sleep-start-minute");
  payload.sleep_end = buildTimeValue("sleep-end-hour", "sleep-end-minute");

  try {
    const data = await apiRequest("/sleep/log", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setMessage("sleep-result", `记录成功\n${payload.sleep_start} - ${payload.sleep_end}\n睡眠时长 ${data.duration_hours} 小时`);
    await loadDashboard();
  } catch (error) {
    setMessage("sleep-result", error.message);
  }
}

async function handleWeightLog(event) {
  event.preventDefault();
  if (!state.currentUser) {
    setMessage("weight-result", "请先登录");
    return;
  }

  const payload = getFormData(event.currentTarget);
  refreshLiveTimestampDefaults();
  payload.user_id = state.currentUser.id;
  payload.weight_kg = Number(payload.weight_kg);
  payload.record_time = buildTimeValue("weight-hour", "weight-minute");

  try {
    const data = await apiRequest("/weight/log", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setMessage("weight-result", `体重记录成功\n${data.record_date} · ${data.weight_kg} kg · ${payload.record_time}`);
    resetLiveTimestampDefaults();
    await loadDashboard();
  } catch (error) {
    setMessage("weight-result", error.message);
  }
}

async function handleAssessmentSubmit(event) {
  event.preventDefault();
  const payload = getFormData(event.currentTarget);
  const profilePayload = {
    age: Number(payload.age),
    gender: payload.gender,
    height_cm: Number(payload.height_cm),
    weight_kg: Number(payload.weight_kg),
  };

  renderAssessment(computeBmiProfile(profilePayload));

  if (!state.currentUser) {
    setMessage("assessment-result", "已更新当前评估预览\n登录后可把这组身体评估同步到首页和设置中。", "info");
    return;
  }

  try {
    const data = await apiRequest("/user/update", {
      method: "POST",
      body: JSON.stringify({
        user_id: state.currentUser.id,
        age: profilePayload.age,
        gender: profilePayload.gender,
        height_cm: profilePayload.height_cm,
        weight_kg: profilePayload.weight_kg,
        body_type: payload.body_type || "balanced",
      }),
    });
    saveCurrentUser(data.user);
    fillAssessmentForm(data.user);
    fillSettingsForm(data.user);
    setMessage("assessment-result", "身体评估已更新\n首页概览和个人资料已按最新数据刷新。", "success");
    await loadDashboard();
    navigateToPanel("overview", "overview-target-anchor");
  } catch (error) {
    console.error("handleAssessmentSubmit failed", error);
    setMessage("assessment-result", error.message, "error");
  }
}

async function handleSettingsSave(event) {
  event.preventDefault();
  if (!state.currentUser) {
    setMessage("settings-result", "请先登录");
    return;
  }

  const payload = getFormData(event.currentTarget);
  payload.user_id = state.currentUser.id;
  payload.age = Number(payload.age);
  payload.height_cm = Number(payload.height_cm);
  payload.weight_kg = Number(payload.weight_kg);
  if (payload.target_weight_kg) {
    payload.target_weight_kg = Number(payload.target_weight_kg);
  }
  if (payload.target_sleep_hours) {
    payload.target_sleep_hours = Number(payload.target_sleep_hours);
  }

  try {
    const data = await apiRequest("/user/update", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    saveCurrentUser(data.user);
    const pantryItems = Array.from(document.querySelectorAll(".pantry-chip.active")).map((node) => node.dataset.pantryItem);
    savePreferences({
      language: payload.language || "zh-CN",
      recommendation_mode: data.user.recommendation_mode || payload.recommendation_mode || "home",
      pantry_items: pantryItems.length ? pantryItems : DEFAULT_PREFERENCES.pantry_items,
    });
    fillSettingsForm(data.user);
    fillAssessmentForm(data.user);
    setMessage("settings-result", data.message);
    await loadDashboard();
    navigateToPanel("overview", "overview-target-anchor");
  } catch (error) {
    setMessage("settings-result", error.message);
  }
}

async function showWeeklyReport() {
  if (!state.currentUser) {
    return;
  }
  const dateValue = $("dashboard-date").value || state.dashboardDate;
  try {
    const report = await apiRequest(
      `/report/weekly?user_id=${state.currentUser.id}&start_date=${encodeURIComponent(dateValue)}`
    );
    $("report-result").innerHTML = renderWeeklyReport(report);
  } catch (error) {
    setMessage("report-result", error.message);
  }
}

function syncPresetToInput(selectId, inputId) {
  const select = $(selectId);
  const input = $(inputId);
  if (!select || !input) {
    return;
  }
  select.addEventListener("change", (event) => {
    if (event.target.value) {
      input.value = event.target.value;
    }
  });
}

function resetFoodSelection() {
  state.selectedFood = null;
  state.activeRestaurantBrand = "";
  document.querySelectorAll(".brand-filter-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.brandFilter === "all");
  });
  $("food-results").innerHTML = "";
  $("selected-food-name").textContent = "还未选择食物";
  $("selected-food-meta").textContent = "搜索后点击卡片中的“记录这份食物”";
  $("selected-food-image").src = DEFAULT_FOOD_IMAGE;
  $("selected-food-image").classList.add("hidden");
  $("food-portion-hint").textContent = "选择食物后，这里会给出更贴近家中或餐厅份量的参考。";
  updateFoodCookingOptions(null);
  setMessage("food-search-state", "");
  renderBrandHero("");
  updateFoodServingMode(null);
}

function clearFoodSearchFlow(clearKeyword = false) {
  resetFoodSelection();
  if (clearKeyword && $("food-search-input")) {
    $("food-search-input").value = "";
  }
}

function bindEvents() {
  $("show-register-btn").addEventListener("click", () => showAuth("register"));
  $("show-login-btn").addEventListener("click", () => showAuth("login"));
  $("register-form").addEventListener("submit", handleRegister);
  bindFormValidationFeedback("register-form", "register-result");
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (!event.target.closest(".picker-field")) {
        closeAllPickerPanels();
      }
      if (
        state.registerPicker.fieldKey &&
        !event.target.closest(".register-number-picker-sheet") &&
        !event.target.closest("[data-register-number-field]")
      ) {
        closeRegisterNumberPicker();
      }
    },
    true
  );
  $("toggle-register-pantry-btn")?.addEventListener("click", () => {
    const panel = $("register-pantry-panel");
    if (!panel) {
      return;
    }
    const isHidden = panel.classList.contains("hidden");
    panel.classList.toggle("hidden");
    requestAnimationFrame(syncAuthStageHeight);
    window.setTimeout(syncAuthStageHeight, 120);
    if (isHidden) {
      requestAnimationFrame(() => {
        const submitButton = document.querySelector("#register-form .auth-action-btn");
        (submitButton || panel).scrollIntoView({ behavior: isMobilePerformanceMode() ? "auto" : "smooth", block: "end" });
      });
    }
  });
  $("login-form").addEventListener("submit", handleLogin);
  $("food-search-btn").addEventListener("click", handleFoodSearch);
  $("food-search-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleFoodSearch();
    }
  });
  document.querySelectorAll(".brand-filter-btn").forEach((button) => {
    button.addEventListener("click", () => handleRestaurantBrandFilter(button.dataset.brandFilter));
  });
  $("food-cooking-method").addEventListener("change", () => updateFoodCookingHint(state.selectedFood));
  $("food-log-form").addEventListener("focusin", refreshLiveTimestampDefaults);
  $("food-log-form").addEventListener("submit", handleFoodLog);
  $("workout-form").addEventListener("focusin", refreshLiveTimestampDefaults);
  $("workout-form").addEventListener("submit", handleWorkoutLog);
  $("sleep-form").addEventListener("submit", handleSleepLog);
  $("weight-form").addEventListener("focusin", refreshLiveTimestampDefaults);
  $("weight-form").addEventListener("submit", handleWeightLog);
  $("assessment-form").addEventListener("submit", handleAssessmentSubmit);
  $("settings-form").addEventListener("submit", handleSettingsSave);
  $("refresh-dashboard-btn").addEventListener("click", loadDashboard);
  $("daily-report-btn").addEventListener("click", async () => {
    await loadDashboard();
    navigateToPanel("report", "panel-report");
  });
  $("weekly-report-btn").addEventListener("click", showWeeklyReport);
  $("dashboard-date").addEventListener("change", loadDashboard);
  $("settings-btn").addEventListener("click", () => navigateToPanel("settings", "panel-settings"));
  $("logout-btn").addEventListener("click", () => {
    clearCurrentUser();
    resetFoodSelection();
    $("report-result").innerHTML = renderReportEmptyState();
    showAuth("login");
  });
  $("mobile-settings-btn")?.addEventListener("click", () => showMobileScreen("mine"));
  $("mobile-logout-btn")?.addEventListener("click", () => {
    clearCurrentUser();
    resetFoodSelection();
    $("report-result").innerHTML = renderReportEmptyState();
    showAuth("login");
  });
  document.querySelectorAll(".mobile-nav-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const screen = button.dataset.mobileScreen;
      showMobileScreen(screen, {
        alignRecordPane: screen === "record",
      });
    });
  });
  document.querySelectorAll(".mobile-record-tab").forEach((button) => {
    button.addEventListener("click", () => {
      showMobileRecordTab(button.dataset.mobileRecordTab, {
        alignPane: true,
      });
    });
  });

  syncPresetToInput("weight-kg-preset", "weight-kg-input");

  document.querySelectorAll(".dashboard-tab").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.panel === "overview") {
        navigateToPanel("overview", "overview-target-anchor");
        return;
      }
      if (button.dataset.panel === "suggestion") {
        navigateToPanel("suggestion", "overview-recommendation-anchor");
        return;
      }
      navigateToPanel(button.dataset.panel, `panel-${button.dataset.panel}`);
    });
  });

  document.addEventListener("click", (event) => {
    const mobileRecordTrigger = event.target.closest("[data-mobile-record-tab]");
    if (mobileRecordTrigger) {
      showMobileScreen("record", {
        recordTab: mobileRecordTrigger.dataset.mobileRecordTab,
        alignRecordPane: true,
      });
      return;
    }
    const mobileScreenTrigger = event.target.closest("[data-mobile-screen-link]");
    if (mobileScreenTrigger) {
      const screen = mobileScreenTrigger.dataset.mobileScreenLink;
      showMobileScreen(screen, {
        alignRecordPane: screen === "record",
      });
      return;
    }
    const trigger = event.target.closest("[data-switch-panel]");
    if (!trigger) {
      const bodyTypeCard = event.target.closest("[data-body-type]");
      if (bodyTypeCard) {
        updateBodyTypeSelection(bodyTypeCard.dataset.targetInput, bodyTypeCard.dataset.bodyType);
        if (bodyTypeCard.dataset.targetInput === "assessment-body-type-input") {
          const payload = getFormData($("assessment-form"));
          renderAssessment(
            computeBmiProfile({
              age: Number(payload.age),
              gender: payload.gender,
              height_cm: Number(payload.height_cm),
              weight_kg: Number(payload.weight_kg),
            })
          );
        }
      }
      return;
    }
    navigateToPanel(trigger.dataset.switchPanel, trigger.dataset.scrollTarget || `panel-${trigger.dataset.switchPanel}`);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    const trigger = event.target.closest("[data-switch-panel]");
    if (!trigger) {
      return;
    }
    event.preventDefault();
    navigateToPanel(trigger.dataset.switchPanel, trigger.dataset.scrollTarget || `panel-${trigger.dataset.switchPanel}`);
  });

  window.addEventListener("hashchange", () => {
    const nextPanel = resolvePanelFromHash();
    if (nextPanel !== state.activePanel) {
      showPanel(nextPanel);
    }
  });
  document.addEventListener("focusin", (event) => {
    if (isMobileTextEntryElement(event.target)) {
      window.setTimeout(syncMobileKeyboardState, 80);
    }
  });
  document.addEventListener(
    "focus",
    (event) => {
      if (isMobileTextEntryElement(event.target)) {
        window.setTimeout(syncMobileKeyboardState, 80);
      }
    },
    true
  );
  document.addEventListener("focusout", () => {
    window.setTimeout(syncMobileKeyboardState, 120);
  });
  window.visualViewport?.addEventListener("resize", syncMobileKeyboardState);
}

function initialize() {
  savePreferences(loadPreferences());
  initializePickerOptions();
  initializeAuthPickers();
  syncMobileNumericPickerMode();
  fillRegisterPreferences();
  initializeProfilePickers();
  bindEvents();
  fillDefaultDates();
  bindInteractiveGlow(document);
  state.activePanel = resolvePanelFromHash();
  showPanel(state.activePanel);
  updateMobileTopbar();
  scheduleDashboardTabIndicatorUpdate();
  syncActiveDashboardTabIntoView();
  window.addEventListener(
    "resize",
    () => {
      syncRegisterNumericPickerMode();
      syncMobileNumericPickerMode();
      syncResponsiveAppShell();
      syncMobileKeyboardState();
      scheduleDashboardTabIndicatorUpdate();
      syncActiveDashboardTabIntoView();
    },
    { passive: true }
  );
  const user = loadCurrentUser();
  if (user) {
    saveCurrentUser(user);
    showApp();
    loadDashboard().catch((error) => {
      clearCurrentUser();
      showAuth("login");
      setMessage("login-result", error.message);
    });
    refreshWorkoutEstimate();
    return;
  }
  showAuth("login");
}

initialize();
