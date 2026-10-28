from __future__ import annotations

from collections.abc import Iterable
import re


EXACT_IMAGE_KEYS = {
    "乐事原味薯片": "potato-chips-bag",
    "乐事番茄味薯片": "potato-chips-bag",
    "乐事黄瓜味薯片": "potato-chips-bag",
    "乐事烧烤味薯片": "potato-chips-bag",
    "百事 原味薯片": "pepsi-lays-original",
    "百事 黄瓜味薯片": "pepsi-lays-cucumber",
    "百事 番茄味薯片": "pepsi-lays-tomato",
    "品客原味薯片": "pringles-original",
    "妙脆角原味玉米脆片": "bugles-corn-snack",
    "旺旺仙贝": "cracker-stack",
    "旺旺雪饼": "cracker-stack",
    "奥利奥夹心饼干": "cracker-stack",
    "沙县小吃 香菇鸡腿饭": "chicken-thigh-real",
    "沙县小吃 卤鸡腿饭": "chicken-thigh-real",
    "沙县小吃 扁肉": "wonton-bowl",
    "沙县小吃 扁肉拌面": "dry-noodle-plate",
    "沙县小吃 花生酱拌面": "dry-noodle-plate",
    "沙县小吃 蒸饺": "dumpling-plate",
    "沙县小吃 鸡腿炖罐": "soup-bowl",
    "沙县小吃 乌鸡炖罐": "soup-bowl",
    "沙县小吃 茶树菇炖罐": "soup-bowl",
    "沙县小吃 卤肉饭": "rice-bowl",
    "伊利 小布丁牛奶口味雪糕": "yili-qiaolezi-classic",
    "伊利 老冰棍": "yili-qiaolezi-classic",
    "伊利 苦咖啡雪糕": "yili-qiaolezi-classic",
    "蒙牛 蒂兰圣雪香草冰淇淋": "mengniu-suibian-chocolate",
    "蒙牛 随变白桃乌龙雪糕": "mengniu-suibian-chocolate",
    "蒙牛 绿色心情绿豆冰棍": "mengniu-greenmood-mungbean",
    "和路雪 梦龙经典香草冰淇淋": "walls-magnum-truffle-chocolate",
    "和路雪 可爱多香草甜筒冰淇淋": "walls-cornetto-vanilla-cone",
    "和路雪 千层雪巧克力冰淇淋": "walls-layersnow-vanilla-peach",
    "天冰 奶砖雪糕": "yili-qiaolezi-classic",
    "索菲亚 大板奶雪糕": "yili-qiaolezi-classic",
    "红豆沙冰棍": "red-beans-bowl",
    "绿豆沙冰棍": "mung-beans-bowl",
    "雀巢 8次方巧克力冰淇淋": "walls-magnum-truffle-chocolate",
    "八喜 香草冰淇淋": "baxi-vanilla-tub",
    "八喜 巧克力冰淇淋": "baxi-chocolate-tub",
    "八喜 草莓冰淇淋": "baxi-strawberry-tub",
    "和路雪 可爱多草莓甜筒冰淇淋": "walls-cornetto-strawberry-cone",
    "常见茶饮料（含糖）": "tea-drink-generic",
    "喜茶 多肉葡萄": "heytea-grape",
    "奈雪 芋泥宝藏茶": "nayuki-taro-tea",
    "兰州拉面 牛肉面": "lanzhou-beef-noodle",
    "玉米油": "corn-oil-bottle",
    "宫保鸡丁": "kung-pao-chicken",
    "西红柿炒鸡蛋": "tomato-egg-stirfry",
    "番茄炒蛋": "tomato-egg-stirfry",
    "麦当劳 无糖冰红茶 中杯": "iced-tea-cup",
    "味千拉面 冰绿茶": "iced-tea-cup",
    "味千拉面 温泉蛋": "boiled-egg-plate",
    "肯德基 葡式蛋挞": "egg-tart",
    "赛百味 巧克力曲奇": "cookie",
    "东方树叶 茉莉花茶": "tea-bottle",
    "东方树叶 青柑普洱": "tea-bottle",
    "三得利 无糖乌龙茶": "tea-bottle",
    "7-11 无糖乌龙茶": "tea-bottle",
    "罗森 无糖茉莉花茶": "tea-bottle",
    "元气森林 冰茶": "iced-tea-cup",
    "康师傅 冰红茶": "iced-tea-cup",
    "古茗 云岭茉莉白": "iced-tea-cup",
    "古茗 百香双重奏": "fruit-tea-cup",
    "瑞幸 茉莉轻乳茶 标准杯": "milk-tea-cup",
    "南城香 鸡蛋灌饼": "chinese-flatbread",
    "早餐摊 煎饼果子 鸡蛋版": "chinese-flatbread",
    "早餐摊 手抓饼 培根鸡蛋": "chinese-flatbread",
    "早餐摊 鸡蛋灌饼 火腿版": "chinese-flatbread",
    "鸡蛋灌饼": "chinese-flatbread",
    "紫菜蛋花汤": "soup-bowl",
    "酸辣汤": "soup-bowl",
    "米村拌饭 石锅泡菜汤": "soup-bowl",
    "胡辣汤": "soup-bowl",
    "蘑菇汤": "soup-bowl",
    "冬瓜排骨汤": "soup-bowl",
    "鸭血粉丝汤": "soup-bowl",
    "清汤麻辣烫": "malatang-bowl",
    "必胜客 鸡茸蘑菇汤": "soup-bowl",
    "麦当劳 苹果派": "mcd-146",
    "北冰洋橙汽水": "orange-soda",
    "蜜雪冰城 棒打鲜橙": "orange-juice-glass",
    "基础水果 榴莲": "durian-fruit",
    "基础水果 荔枝": "lychee-fruit",
    "基础水果 山竹": "mangosteen-fruit",
    "基础水果 百香果": "passionfruit",
    "哈密瓜": "melon-fruit",
    "香瓜": "melon-fruit",
    "桃子": "peach-fruit",
    "油桃": "peach-fruit",
    "李子": "plum-fruit",
    "杨梅": "bayberry-fruit",
    "柚子": "grapefruit-fruit",
    "柠檬": "lemon-fruit",
    "椰子肉": "coconut-meat",
    "青提": "grapes-cluster",
    "红提": "grapes-cluster",
    "美汁源 果粒橙": "orange-juice-glass",
    "椰子水": "coconut-water",
    "元气森林 白桃气泡水": "sparkling-water",
    "元气森林 青瓜气泡水": "sparkling-water",
    "农夫山泉": "water-bottle",
    "农夫山泉 尖叫纤维饮料": "energy-drink",
    "红牛 维生素牛磺酸饮料": "energy-drink",
    "东鹏特饮": "energy-drink",
    "麻辣烫": "malatang-bowl",
    "冒菜": "malatang-bowl",
    "串串香": "malatang-bowl",
    "麻辣香锅 双人份": "malatang-bowl",
    "火锅 鸭血": "malatang-bowl",
    "鱼豆腐": "fish-ball",
    "7-11 关东煮鱼豆腐": "fish-ball",
    "全家 关东煮鱼豆腐": "fish-ball",
    "罗森 关东煮鱼豆腐": "fish-ball",
    "麻辣烫 鱼豆腐": "fish-ball",
    "麻婆豆腐": "mapo-tofu",
    "砂锅豆腐": "tofu-dish",
    "锅塌豆腐": "tofu-dish",
    "蟹粉豆腐": "tofu-dish",
    "家常 麻婆豆腐": "tofu-dish",
    "红烧肉": "braised-pork",
    "东坡肉": "braised-pork",
    "梅干菜烧肉": "braised-pork",
    "家常 红烧肉": "braised-pork",
    "南城香 梅菜扣肉饭": "braised-pork",
    "味千拉面 辣味叉烧拉面": "ajisen-181",
    "重庆小面": "spicy-noodle-bowl",
    "酸辣粉": "spicy-noodle-bowl",
    "担担面": "spicy-noodle-bowl",
    "桂林米粉": "rice-noodle-bowl",
    "柳州螺蛳粉": "rice-noodle-bowl",
    "牛肉粉": "rice-noodle-bowl",
    "排骨米线": "rice-noodle-bowl",
    "砂锅米线": "rice-noodle-bowl",
    "过桥米线": "rice-noodle-bowl",
    "牛肉河粉": "rice-noodle-bowl",
    "热干面": "dry-noodle-plate",
    "炸酱面": "dry-noodle-plate",
    "油泼面": "dry-noodle-plate",
    "葱油拌面": "dry-noodle-plate",
    "肉酱拌面": "dry-noodle-plate",
    "三鲜伊面": "dry-noodle-plate",
    "鱼香肉丝": "yu-xiang-pork",
    "鱼香肉丝饭": "yu-xiang-pork",
    "南城香 鱼香肉丝饭": "yu-xiang-pork",
    "留学生餐厅 鱼香肉丝饭": "yu-xiang-pork",
    "家常 鱼香肉丝": "yu-xiang-pork",
    "回锅肉": "twice-cooked-pork",
    "回锅肉饭": "twice-cooked-pork",
    "农家小炒肉饭": "twice-cooked-pork",
    "南城香 农家小炒肉饭": "twice-cooked-pork",
    "南城香 回锅肉饭": "twice-cooked-pork",
    "小炒肉": "twice-cooked-pork",
    "辣椒炒肉": "twice-cooked-pork",
    "腊肉炒蒜苔": "twice-cooked-pork",
    "农家一碗香": "twice-cooked-pork",
    "夫妻肺片": "spicy-stew-bowl",
    "毛血旺": "spicy-stew-bowl",
    "猪肉炖粉条": "northeast-stew",
    "东北乱炖": "northeast-stew",
    "杀猪菜": "northeast-stew",
    "酸菜白肉": "northeast-stew",
    "腌笃鲜": "northeast-stew",
    "红烧狮子头": "lion-head-meatball",
    "锅包肉": "sweet-sour-pork",
    "糖醋里脊": "sweet-sour-pork",
    "溜肉段": "sweet-sour-pork",
    "卤鸡胗": "chicken-gizzard",
    "麦当劳 麦麦脆汁鸡 鸡腿": "crispy-chicken-leg",
    "山姆 凯撒鸡肉沙拉": "chicken-salad-bowl",
    "干煸豆角": "green-bean-stirfry",
    "排骨炖豆角": "green-bean-stirfry",
    "武汉豆皮": "chinese-flatbread",
    "7-11 黑椒牛肉意面": "pasta-plate",
    "必胜客 黑椒牛肉意面": "pasta-plate",
    "猪里脊": "pork-slices",
    "瘦猪肉": "pork-slices",
    "午餐肉": "lunch-meat",
    "麻辣烫 午餐肉": "lunch-meat",
}

PRODUCT_LEVEL_CATEGORIES = {
    "连锁餐厅",
    "便利店即食",
}

BRANDED_PRODUCT_CATEGORIES = {
    "饮品",
    "乳制品",
    "甜品烘焙",
    "酒类",
    "轻食",
    "加工食品",
    "零食",
}

DISH_LEVEL_CATEGORIES = {
    "川菜",
    "广东菜",
    "卤味",
    "家常炒菜",
    "湘菜",
    "东北菜",
    "江浙菜",
    "火锅类",
    "烧烤夜宵",
}

BRAND_IMAGE_PREFIXES = {
    "麦当劳": "mcd",
    "肯德基": "kfc",
    "赛百味": "subway",
    "味千拉面": "ajisen",
    "7-11": "711",
    "全家": "familymart",
    "罗森": "lawson",
    "鱼籽村": "yuzicun",
    "留学生餐厅": "intl-cafe",
    "米村拌饭": "micun",
    "南城香": "nanchengxiang",
    "吉野家": "yoshinoya",
    "外卖常见": "takeaway",
    "青岛啤酒": "tsingtao",
    "雪花啤酒": "snowbeer",
    "百威": "budweiser",
    "哈尔滨啤酒": "harbinbeer",
    "燕京啤酒": "yanjing",
    "乌苏啤酒": "wusu",
    "科罗娜": "corona",
    "1664": "kronenbourg",
    "福佳": "hoegaarden",
    "喜力": "heineken",
    "朝日": "asahi",
    "麒麟": "kirin",
    "茅台": "maotai",
    "五粮液": "wuliangye",
    "汾酒": "fenjiu",
    "剑南春": "jiannanchun",
    "洋河": "yanghe",
    "泸州老窖": "luzhoulaojiao",
    "古井贡酒": "gujing",
    "牛栏山": "niulanshan",
    "红星": "hongxing",
    "可口可乐": "cocacola",
    "元气森林": "genki",
    "东方树叶": "oriental-leaf",
    "三得利": "suntory",
    "康师傅": "masterkong",
    "统一": "uni-president",
    "维他": "vita",
    "农夫山泉": "nongfu",
    "红牛": "redbull",
    "东鹏": "dongpeng",
    "美汁源": "minute-maid",
    "安慕希": "ambrosial",
    "纯甄": "chunzhen",
    "光明": "bright",
    "伊利": "yili",
    "蒙牛": "mengniu",
    "养乐多": "yakult",
    "山姆": "sams",
    "盒马": "hema",
    "瑞幸": "luckin",
    "星巴克": "starbucks",
    "蜜雪冰城": "mixue",
    "茶百道": "chabaidao",
    "古茗": "guming",
    "霸王茶姬": "chagee",
    "汉堡王": "burgerking",
    "华莱士": "wallace",
    "必胜客": "pizzahut",
}


# Older runtime databases can still carry an out-of-date McDonald's id segment.
# Keep the product image key anchored to the exact product name so clients render
# the canonical asset even before the underlying rows are resynced.
CANONICAL_PRODUCT_IMAGE_KEYS = {
    "肯德基 薯条": "fries",
    "肯德基 香辣鸡腿堡": "burger",
    "肯德基 老北京鸡肉卷": "sandwich",
    "赛百味 火鸡胸三明治 6英寸": "sandwich",
    "赛百味 香烤鸡肉三明治 6英寸": "sandwich",
    "赛百味 金枪鱼三明治 6英寸": "sandwich",
    "赛百味 意式BMT三明治 6英寸": "sandwich",
    "味千拉面 招牌豚骨拉面": "ajisen-180",
    "味千拉面 辣味叉烧拉面": "ajisen-181",
    "味千拉面 肥牛拉面": "ajisen-182",
    "肯德基 劲爆鸡米花": "fried-chicken",
    "味千拉面 日式煎饺 6只": "dumpling-plate",
    "味千拉面 炸鸡块": "chicken-nuggets",
    "味千拉面 咖喱猪排饭": "pork-cutlet",
    "麦当劳 可口可乐 中杯": "cola-pepsi",
    "麦当劳 无糖冰红茶 中杯": "iced-tea-cup",
    "麦当劳 薯条 大份": "mcd-140",
    "肯德基 百事可乐 中杯": "cola-pepsi",
    "肯德基 香辣鸡腿堡套餐薯条": "fries",
    "肯德基 早餐帕尼尼": "sandwich",
    "赛百味 冰拿铁 中杯": "latte-cup",
    "赛百味 双层火鸡胸三明治 12英寸": "sandwich",
    "赛百味 海盐薯片": "potato-chips-bag",
    "沙县小吃 香菇鸡腿饭": "chicken-thigh-real",
    "沙县小吃 卤鸡腿饭": "chicken-thigh-real",
    "沙县小吃 扁肉": "wonton-bowl",
    "沙县小吃 扁肉拌面": "dry-noodle-plate",
    "沙县小吃 花生酱拌面": "dry-noodle-plate",
    "沙县小吃 蒸饺": "dumpling-plate",
    "沙县小吃 鸡腿炖罐": "soup-bowl",
    "沙县小吃 乌鸡炖罐": "soup-bowl",
    "沙县小吃 茶树菇炖罐": "soup-bowl",
    "沙县小吃 卤肉饭": "rice-bowl",
    "伊利 小布丁牛奶口味雪糕": "yili-qiaolezi-classic",
    "伊利 老冰棍": "yili-qiaolezi-classic",
    "伊利 苦咖啡雪糕": "yili-qiaolezi-classic",
    "蒙牛 蒂兰圣雪香草冰淇淋": "mengniu-suibian-chocolate",
    "蒙牛 随变白桃乌龙雪糕": "mengniu-suibian-chocolate",
    "蒙牛 绿色心情绿豆冰棍": "mengniu-greenmood-mungbean",
    "和路雪 梦龙经典香草冰淇淋": "walls-magnum-truffle-chocolate",
    "和路雪 可爱多香草甜筒冰淇淋": "walls-cornetto-chocolate-cone",
    "和路雪 千层雪巧克力冰淇淋": "walls-layersnow-vanilla-peach",
    "天冰 奶砖雪糕": "yili-qiaolezi-classic",
    "索菲亚 大板奶雪糕": "yili-qiaolezi-classic",
    "红豆沙冰棍": "red-beans-bowl",
    "绿豆沙冰棍": "mung-beans-bowl",
    "雀巢 8次方巧克力冰淇淋": "walls-magnum-truffle-chocolate",
    "和路雪 可爱多榛子牛奶巧克力口味冰淇淋": "walls-cornetto-hazelnut-milk-chocolate",
    "和路雪 可爱多柿柿如意甜筒冰淇淋": "walls-cornetto-persimmon-cone",
    "和路雪 梦龙松露巧克力口味冰淇淋": "walls-magnum-truffle-chocolate",
    "和路雪 迷你可爱多缤纷口味甜筒冰淇淋": "walls-mini-cornetto-variety",
    "和路雪 梦龙巴旦木黑巧克力冰淇淋": "walls-magnum-almond-dark-chocolate",
    "和路雪 千层雪香草白桃口味冰淇淋": "walls-layersnow-vanilla-peach",
    "和路雪 可爱多椰子布朗尼甜筒冰淇淋": "walls-cornetto-coconut-brownie",
    "和路雪 迷你梦龙缤纷口味冰淇淋": "walls-mini-magnum-variety",
    "和路雪 可爱多巧克力甜筒冰淇淋": "walls-cornetto-chocolate-cone",
    "哈根达斯 夏威夷果仁杯装冰淇淋": "haagen-dazs-macadamia-pint",
    "哈根达斯 香草杯装冰淇淋": "haagen-dazs-vanilla-pint",
    "哈根达斯 草莓杯装冰淇淋": "haagen-dazs-strawberry-pint",
    "哈根达斯 巧克力杯装冰淇淋": "haagen-dazs-chocolate-pint",
    "哈根达斯 曲奇香奶杯装冰淇淋": "haagen-dazs-cookies-cream-pint",
    "伊利 巧乐兹经典巧脆棒": "yili-qiaolezi-classic",
    "伊利 巧乐兹草莓脆皮雪糕": "yili-qiaolezi-strawberry",
    "伊利 须尽欢香草巧克力冰淇淋": "yili-xujinhuan-vanilla-chocolate",
    "伊利 甄稀生巧冰淇淋": "yili-zhenxi-chocolate",
    "蒙牛 随变香草三层巧克力冰淇淋": "mengniu-suibian-chocolate",
    "蒙牛 绿色心情绿莎莎绿豆雪糕": "mengniu-greenmood-mungbean",
    "麦当劳 麦辣鸡翅": "mcd-142",
    "麦当劳 麦乐鸡块 4块": "mcd-143",
    "麦当劳 麦乐鸡块 10块": "mcd-144",
    "麦当劳 麦香鸡": "mcd-145",
    "麦当劳 苹果派": "mcd-146",
    "麦当劳 双层深海鳕鱼堡": "mcd-147",
    "麦当劳 板烧鸡腿堡": "mcd-148",
    "麦当劳 脆薯饼": "mcd-149",
    "麦当劳 奥利奥麦旋风": "mcd-150",
    "麦当劳 热巧克力新地": "mcd-151",
    "麦当劳 猪柳蛋麦满分": "mcd-152",
}


BEEF_NAME_KEYWORDS = (
    "牛肉",
    "牛排",
    "牛腩",
    "牛腱",
    "牛柳",
    "牛杂",
    "肥牛",
    "牛肋",
    "牛板腱",
    "牛上脑",
    "牛里脊",
    "牛眼肉",
    "牛西冷",
    "牛小排",
    "牛霖",
    "牛舌",
    "牛筋",
    "牛尾",
    "牛腱子",
)


EXPLICIT_ALIASES: dict[str, list[str]] = {
    "牛上脑": ["牛排", "牛肉", "高蛋白", "肩胛肉"],
    "牛里脊": ["牛排", "牛肉", "菲力", "高蛋白"],
    "牛眼肉": ["牛排", "牛肉", "肋眼", "西式"],
    "牛西冷": ["牛排", "牛肉", "西冷", "西式"],
    "牛板腱": ["牛排", "牛肉", "板腱", "肩胛"],
    "牛肋条": ["牛排", "牛肉", "肋条", "烧烤"],
    "牛腩": ["牛肉", "炖煮", "红烧"],
    "牛小排": ["牛排", "牛肉", "烧烤", "西式"],
    "菲力牛排": ["牛排", "牛肉", "里脊", "西式"],
    "西冷牛排": ["牛排", "牛肉", "西冷", "西式"],
    "肋眼牛排": ["牛排", "牛肉", "眼肉", "西式"],
    "T骨牛排": ["牛排", "牛肉", "西式", "厚切"],
    "麦当劳 巨无霸": ["麦当劳", "汉堡", "M记", "牛肉堡"],
    "麦当劳 双层吉士汉堡": ["麦当劳", "汉堡", "M记", "芝士堡"],
    "麦当劳 中薯条": ["麦当劳", "薯条", "M记", "炸薯条"],
    "麦当劳 麦辣鸡腿堡": ["麦当劳", "汉堡", "M记", "鸡腿堡"],
    "麦当劳 麦辣鸡翅": ["麦当劳", "鸡翅", "M记", "辣翅"],
    "麦当劳 麦乐鸡块 4块": ["麦当劳", "鸡块", "M记", "麦乐鸡"],
    "麦当劳 麦乐鸡块 10块": ["麦当劳", "鸡块", "M记", "麦乐鸡"],
    "麦当劳 麦香鸡": ["麦当劳", "汉堡", "M记", "鸡肉堡"],
    "麦当劳 苹果派": ["麦当劳", "甜点", "M记", "派"],
    "麦当劳 双层深海鳕鱼堡": ["麦当劳", "汉堡", "M记", "鳕鱼堡"],
    "麦当劳 板烧鸡腿堡": ["麦当劳", "汉堡", "M记", "鸡腿堡"],
    "麦当劳 脆薯饼": ["麦当劳", "早餐", "M记", "薯饼"],
    "麦当劳 奥利奥麦旋风": ["麦当劳", "M记", "麦旋风", "冰淇淋"],
    "麦当劳 热巧克力新地": ["麦当劳", "M记", "新地", "甜点"],
    "麦当劳 猪柳蛋麦满分": ["麦当劳", "M记", "早餐", "麦满分"],
    "麦当劳 可口可乐 中杯": ["麦当劳", "M记", "可乐", "饮料"],
    "麦当劳 无糖冰红茶 中杯": ["麦当劳", "M记", "无糖茶", "饮料"],
    "麦当劳 薯条 大份": ["麦当劳", "M记", "薯条", "大薯"],
    "肯德基 原味鸡": ["肯德基", "KFC", "炸鸡", "鸡块"],
    "肯德基 薯条": ["肯德基", "KFC", "薯条"],
    "肯德基 香辣鸡腿堡": ["肯德基", "KFC", "汉堡", "鸡腿堡"],
    "肯德基 老北京鸡肉卷": ["肯德基", "KFC", "卷饼", "鸡肉卷"],
    "肯德基 葡式蛋挞": ["肯德基", "KFC", "蛋挞", "甜点"],
    "肯德基 吮指原味鸡 2块": ["肯德基", "KFC", "炸鸡", "原味鸡"],
    "肯德基 新奥尔良烤翅 2块": ["肯德基", "KFC", "烤翅", "鸡翅"],
    "肯德基 香辣鸡翅 2块": ["肯德基", "KFC", "鸡翅", "辣翅"],
    "肯德基 土豆泥": ["肯德基", "KFC", "土豆泥", "配餐"],
    "肯德基 香甜粟米棒": ["肯德基", "KFC", "玉米", "配餐"],
    "肯德基 劲爆鸡米花": ["肯德基", "KFC", "鸡米花", "小食"],
    "肯德基 百事可乐 中杯": ["肯德基", "KFC", "可乐", "饮料"],
    "肯德基 香辣鸡腿堡套餐薯条": ["肯德基", "KFC", "薯条", "配餐"],
    "肯德基 早餐帕尼尼": ["肯德基", "KFC", "早餐", "帕尼尼"],
    "赛百味 火鸡胸三明治 6英寸": ["赛百味", "Subway", "三明治", "火鸡胸"],
    "赛百味 香烤鸡肉三明治 6英寸": ["赛百味", "Subway", "三明治", "鸡肉"],
    "赛百味 金枪鱼三明治 6英寸": ["赛百味", "Subway", "三明治", "金枪鱼"],
    "赛百味 意式BMT三明治 6英寸": ["赛百味", "Subway", "三明治", "BMT"],
    "赛百味 蔬菜三明治 6英寸": ["赛百味", "Subway", "三明治", "蔬菜"],
    "赛百味 经典牛排芝士三明治 6英寸": ["赛百味", "Subway", "三明治", "牛排芝士"],
    "赛百味 巧克力曲奇": ["赛百味", "Subway", "曲奇", "甜点"],
    "赛百味 冰拿铁 中杯": ["赛百味", "Subway", "拿铁", "饮料"],
    "赛百味 双层火鸡胸三明治 12英寸": ["赛百味", "Subway", "12英寸", "火鸡胸"],
    "赛百味 海盐薯片": ["赛百味", "Subway", "薯片", "小食"],
    "味千拉面 招牌豚骨拉面": ["味千拉面", "Ajisen", "拉面", "豚骨"],
    "味千拉面 辣味叉烧拉面": ["味千拉面", "Ajisen", "拉面", "叉烧"],
    "味千拉面 肥牛拉面": ["味千拉面", "Ajisen", "拉面", "肥牛"],
    "味千拉面 日式煎饺 6只": ["味千拉面", "Ajisen", "煎饺", "饺子"],
    "味千拉面 炸鸡块": ["味千拉面", "Ajisen", "炸鸡", "小食"],
    "味千拉面 咖喱猪排饭": ["味千拉面", "Ajisen", "猪排饭", "咖喱饭"],
    "味千拉面 冰绿茶": ["味千拉面", "Ajisen", "绿茶", "饮料"],
    "味千拉面 温泉蛋": ["味千拉面", "Ajisen", "鸡蛋", "加料"],
    "味千拉面 炸虾 3只": ["味千拉面", "Ajisen", "炸虾", "小食"],
    "土豆牛肉饭": ["牛肉饭", "盖饭", "土豆烧牛肉饭", "外卖", "简餐"],
    "黄焖鸡米饭": ["黄焖鸡", "鸡肉饭", "盖饭", "外卖", "简餐"],
    "黑椒牛柳饭": ["牛柳饭", "黑椒牛肉饭", "盖饭", "外卖", "简餐"],
    "肉末茄子饭": ["茄子饭", "盖饭", "下饭菜", "外卖", "简餐"],
    "宫保鸡丁饭": ["宫保鸡丁", "鸡丁饭", "盖饭", "外卖", "简餐"],
    "鱼香肉丝饭": ["鱼香肉丝", "肉丝饭", "盖饭", "外卖", "简餐"],
    "麻婆豆腐饭": ["麻婆豆腐", "豆腐饭", "盖饭", "外卖", "简餐"],
    "香菇滑鸡饭": ["滑鸡饭", "鸡肉饭", "盖饭", "外卖", "简餐"],
    "照烧鸡腿饭": ["鸡腿饭", "照烧鸡饭", "盖饭", "外卖", "简餐"],
    "咖喱鸡排饭": ["鸡排饭", "咖喱饭", "盖饭", "外卖", "简餐"],
    "台式卤肉饭": ["卤肉饭", "台式饭", "盖饭", "外卖", "简餐"],
    "鱼籽村 蒜香鱼籽拌饭": ["鱼籽村", "鱼籽拌饭", "拌饭", "蒜香鱼籽", "外卖"],
    "鱼籽村 招牌鱼籽拌饭": ["鱼籽村", "鱼籽拌饭", "招牌拌饭", "拌饭", "外卖"],
    "鱼籽村 双拼鱼籽拌饭": ["鱼籽村", "双拼拌饭", "鱼籽拌饭", "拌饭", "外卖"],
    "鱼籽村 韩式辣鱼籽拌饭": ["鱼籽村", "韩式辣拌饭", "鱼籽拌饭", "拌饭", "外卖"],
    "鱼籽村 肥牛鱼籽拌饭": ["鱼籽村", "肥牛鱼籽拌饭", "肥牛拌饭", "鱼籽拌饭", "外卖"],
    "鱼籽村 芝士鸡排鱼籽拌饭": ["鱼籽村", "芝士鸡排拌饭", "鸡排拌饭", "鱼籽拌饭", "外卖"],
    "鱼籽村 辣白菜鱼籽拌饭": ["鱼籽村", "辣白菜鱼籽拌饭", "泡菜拌饭", "鱼籽拌饭", "外卖"],
    "鱼籽村 照烧鸡腿鱼籽拌饭": ["鱼籽村", "照烧鸡腿拌饭", "鸡腿拌饭", "鱼籽拌饭", "外卖"],
    "留学生餐厅 蒜香猪排咖喱饭": ["留学生餐厅", "猪排咖喱饭", "咖喱饭", "蒜香猪排", "外卖"],
    "留学生餐厅 黑椒牛肉饭": ["留学生餐厅", "黑椒牛肉饭", "牛肉饭", "盖饭", "外卖"],
    "留学生餐厅 照烧鸡腿饭": ["留学生餐厅", "照烧鸡腿饭", "鸡腿饭", "盖饭", "外卖"],
    "留学生餐厅 台式卤肉饭": ["留学生餐厅", "台式卤肉饭", "卤肉饭", "盖饭", "外卖"],
    "留学生餐厅 咖喱牛肉饭": ["留学生餐厅", "咖喱牛肉饭", "牛肉饭", "咖喱饭", "外卖"],
    "留学生餐厅 黑椒鸡排饭": ["留学生餐厅", "黑椒鸡排饭", "鸡排饭", "盖饭", "外卖"],
    "留学生餐厅 鱼香肉丝饭": ["留学生餐厅", "鱼香肉丝饭", "肉丝饭", "盖饭", "外卖"],
    "米村拌饭 肥牛拌饭": ["米村拌饭", "肥牛拌饭", "拌饭", "肥牛饭", "外卖"],
    "米村拌饭 肥牛泡菜拌饭": ["米村拌饭", "肥牛泡菜拌饭", "泡菜拌饭", "肥牛饭", "外卖"],
    "米村拌饭 照烧鸡排拌饭": ["米村拌饭", "照烧鸡排拌饭", "鸡排拌饭", "照烧饭", "外卖"],
    "米村拌饭 石锅拌饭": ["米村拌饭", "石锅拌饭", "韩式拌饭", "拌饭", "外卖"],
    "米村拌饭 金枪鱼拌饭": ["米村拌饭", "金枪鱼拌饭", "拌饭", "鱼肉拌饭", "外卖"],
    "米村拌饭 辣白菜五花肉拌饭": ["米村拌饭", "辣白菜五花肉拌饭", "五花肉拌饭", "泡菜拌饭", "外卖"],
    "米村拌饭 烤肉拌饭": ["米村拌饭", "烤肉拌饭", "韩式烤肉饭", "拌饭", "外卖"],
    "米村拌饭 辣牛肉石锅拌饭": ["米村拌饭", "辣牛肉石锅拌饭", "牛肉石锅饭", "石锅拌饭", "外卖"],
    "南城香 番茄肥牛饭": ["南城香", "番茄肥牛饭", "肥牛饭", "盖饭", "外卖"],
    "南城香 农家小炒肉饭": ["南城香", "农家小炒肉饭", "小炒肉饭", "盖饭", "外卖"],
    "南城香 回锅肉饭": ["南城香", "回锅肉饭", "盖饭", "外卖", "下饭菜"],
    "南城香 宫保鸡丁饭": ["南城香", "宫保鸡丁饭", "鸡丁饭", "盖饭", "外卖"],
    "南城香 黑椒鸡腿饭": ["南城香", "黑椒鸡腿饭", "鸡腿饭", "盖饭", "外卖"],
    "南城香 梅菜扣肉饭": ["南城香", "梅菜扣肉饭", "扣肉饭", "盖饭", "外卖"],
    "南城香 鱼香肉丝饭": ["南城香", "鱼香肉丝饭", "肉丝饭", "盖饭", "外卖"],
    "南城香 番茄鸡腿饭": ["南城香", "番茄鸡腿饭", "鸡腿饭", "盖饭", "外卖"],
    "吉野家 招牌牛肉饭": ["吉野家", "牛肉饭", "招牌饭", "盖饭", "外卖"],
    "吉野家 照烧牛肉饭": ["吉野家", "照烧牛肉饭", "牛肉饭", "盖饭", "外卖"],
    "吉野家 照烧鸡排饭": ["吉野家", "照烧鸡排饭", "鸡排饭", "盖饭", "外卖"],
    "吉野家 双拼牛肉饭": ["吉野家", "双拼牛肉饭", "牛肉饭", "双拼饭", "外卖"],
    "吉野家 咖喱牛肉饭": ["吉野家", "咖喱牛肉饭", "牛肉饭", "咖喱饭", "外卖"],
    "吉野家 泡菜牛肉饭": ["吉野家", "泡菜牛肉饭", "牛肉饭", "盖饭", "外卖"],
    "吉野家 芝士牛肉饭": ["吉野家", "芝士牛肉饭", "牛肉饭", "盖饭", "外卖"],
    "吉野家 温泉蛋牛肉饭": ["吉野家", "温泉蛋牛肉饭", "牛肉饭", "盖饭", "外卖"],
    "番茄牛腩饭": ["牛腩饭", "番茄牛肉饭", "盖饭", "外卖", "简餐"],
    "青椒牛肉饭": ["青椒牛肉", "牛肉饭", "盖饭", "外卖", "简餐"],
    "农家小炒肉饭": ["小炒肉饭", "盖饭", "下饭菜", "外卖", "简餐"],
    "回锅肉饭": ["回锅肉", "盖饭", "下饭菜", "外卖", "简餐"],
    "红烧排骨饭": ["排骨饭", "红烧排骨", "盖饭", "外卖", "简餐"],
    "鳗鱼饭": ["日式鳗鱼饭", "盖饭", "日式饭", "外卖", "简餐"],
    "亲子丼": ["亲子饭", "鸡肉鸡蛋饭", "日式盖饭", "外卖", "简餐"],
    "留学生餐厅 番茄牛腩饭": ["留学生餐厅", "番茄牛腩饭", "牛腩饭", "盖饭", "外卖"],
    "照烧牛肉饭": ["照烧饭", "牛肉饭", "盖饭", "外卖", "简餐"],
    "奥尔良鸡腿饭": ["鸡腿饭", "奥尔良烤鸡饭", "盖饭", "外卖", "简餐"],
}

CATEGORY_ALIASES: dict[str, list[str]] = {
    "主食": ["碳水", "能量", "饱腹"],
    "肉类": ["蛋白质", "高蛋白"],
    "海鲜": ["蛋白质", "低脂"],
    "蛋类": ["蛋白质", "早餐"],
    "乳制品": ["蛋白质", "早餐"],
    "豆制品": ["植物蛋白", "高蛋白"],
    "水果": ["维生素", "加餐"],
    "蔬菜": ["膳食纤维", "清淡"],
    "坚果": ["健康脂肪", "加餐"],
    "油脂": ["高脂肪", "烹饪"],
    "饮品": ["饮料"],
    "零食": ["加餐", "高热量"],
    "轻食": ["减脂餐", "沙拉"],
    "补剂": ["蛋白补充", "训练后"],
    "连锁餐厅": ["套餐", "快餐", "单品"],
    "酒类": ["酒", "聚餐", "饮酒", "啤酒", "白酒"],
    "川菜": ["川味", "下饭菜", "辣菜"],
    "广东菜": ["粤菜", "烧腊", "广式"],
    "卤味": ["卤菜", "熟食", "下酒菜"],
    "家常炒菜": ["家常菜", "下饭菜", "热菜"],
    "湘菜": ["湘味", "辣菜", "下饭菜"],
    "东北菜": ["东北味", "下饭菜", "炖菜"],
    "江浙菜": ["本帮菜", "苏浙菜", "清鲜"],
    "火锅类": ["涮煮", "聚餐", "重口味"],
    "烧烤夜宵": ["夜宵", "烧烤", "下酒菜"],
    "甜品烘焙": ["甜点", "下午茶", "烘焙"],
}

IMAGE_KEYWORDS: list[tuple[Iterable[str], str]] = [
    (["北冰洋橙汽水"], "orange-soda"),
    (["烤玉米"], "grilled-corn"),
    (["玉米油"], "corn-oil-bottle"),
    (["玉米", "粟米"], "corn-cob"),
    (["无糖冰红茶", "冰红茶", "冰绿茶", "冰茶", "云岭茉莉白"], "iced-tea-cup"),
    (["乌龙茶", "茉莉花茶", "青柑普洱"], "tea-bottle"),
    (["水果茶", "百香双重奏", "柠檬茶", "柠檬水"], "fruit-tea-cup"),
    (["气泡水"], "sparkling-water"),
    (["农夫山泉"], "water-bottle"),
    (["红牛", "东鹏", "尖叫"], "energy-drink"),
    (["果粒橙"], "orange-juice-glass"),
    (["麻辣烫", "冒菜", "串串香", "麻辣香锅"], "malatang-bowl"),
    (["鱼豆腐"], "fish-ball"),
    (["红酒"], "wine-glass"),
    (["白酒", "茅台", "五粮液", "汾酒", "二锅头", "剑南春", "洋河", "泸州老窖", "古井贡酒"], "baijiu-bottle"),
    (["啤酒", "乌苏", "青岛", "雪花", "百威", "哈尔滨", "燕京", "科罗娜", "1664", "福佳", "喜力", "朝日", "麒麟"], "beer-bottle"),
    (["三明治", "帕尼尼", "麦满分", "BMT"], "sandwich"),
    (["番茄炒蛋", "西红柿炒鸡蛋"], "tomato-egg-stirfry"),
    (["鸡蛋白"], "egg-white-plate"),
    (["温泉蛋", "水煮蛋", "茶叶蛋", "卤蛋"], "boiled-egg-plate"),
    (["炒蛋"], "scrambled-egg-plate"),
    (["鸡蛋", "鸭蛋", "茶叶蛋", "卤蛋", "炒蛋", "水煮蛋"], "egg-plate"),
    (["鸡胸肉"], "chicken-breast-real"),
    (["鸡腿肉"], "chicken-thigh-real"),
    (["火鸡胸肉"], "turkey-breast-plate"),
    (["牛腱", "瘦牛肉", "牛里脊", "牛上脑", "牛眼肉", "牛西冷", "牛板腱", "牛肋条", "牛腩", "牛小排", "牛外脊", "牛臀肉", "牛肩肉", "牛霖"], "steak"),
    (["猪里脊", "瘦猪肉"], "pork-slices"),
    (["午餐肉"], "lunch-meat"),
    (["羊腿肉"], "steak"),
    (["薯条", "薯霸王", "薯饼"], "fries"),
    (["鸡排", "炸鸡排", "香煎鸡排"], "chicken-cutlet"),
    (["炸鸡块"], "chicken-nuggets"),
    (["鸡米花", "炸鸡", "原味鸡", "手扒鸡", "脆皮全鸡", "小酥肉"], "fried-chicken"),
    (["鸡块", "麦乐鸡", "黄金鸡块"], "chicken-nuggets"),
    (["鸡翅", "烤翅", "辣翅"], "chicken-wings-real"),
    (["猪排", "炸猪排"], "pork-cutlet"),
    (["披萨"], "pizza-slice"),
    (["饭团"], "onigiri"),
    (["便当", "饭盒"], "bento-box"),
    (["汉堡", "皇堡", "牛堡", "芝士堡", "巨无霸", "鸡腿堡", "麦香鸡"], "burger"),
    (["牛肉面"], "beef-noodle-bowl"),
    (["星冰乐", "麦旋风", "冰淇淋", "新地"], "frappuccino-cup"),
    (["奶茶", "珍珠奶茶", "伯牙", "霸王茶姬"], "milk-tea-cup"),
    (["牛肉卷"], "bread-toast"),
    (["杏仁"], "almond-handful"),
    (["核桃"], "walnut-handful"),
    (["花生"], "peanut-handful"),
    (["腰果"], "cashew-handful"),
    (["开心果"], "pistachio-handful"),
    (["芝麻"], "sesame-bowl"),
    (["橄榄油"], "olive-oil-bottle"),
    (["花生油"], "peanut-oil-bottle"),
    (["黄油"], "butter-block"),
    (["蜂蜜"], "honey-jar"),
    (["白砂糖"], "sugar-bowl"),
    (["蛋白粉", "乳清蛋白"], "protein-shake"),
    (["培根"], "bacon-strips"),
    (["豆腐皮", "腐竹"], "tofu-skin-bundle"),
    (["豆干", "干豆腐", "卤豆干"], "tofu-dried-block"),
    (["豆浆", "豆奶"], "soy-milk-cup"),
    (["毛豆"], "edamame-bowl"),
    (["黄豆"], "soybeans-bowl"),
    (["红豆", "红豆沙"], "red-beans-bowl"),
    (["绿豆", "绿豆沙"], "mung-beans-bowl"),
    (["鹰嘴豆"], "chickpea-bowl"),
    (["麻婆豆腐", "砂锅豆腐", "锅塌豆腐", "蟹粉豆腐", "烤冷吃豆腐"], "tofu-dish"),
    (["豆腐", "北豆腐", "豆腐脑", "臭豆腐"], "tofu-block"),
    (["魔芋结"], "kelp-knot"),
    (["胡萝卜"], "carrot-bunch"),
    (["西兰花"], "broccoli-real"),
    (["菠菜"], "spinach-bundle"),
    (["生菜"], "lettuce-head"),
    (["黄瓜"], "cucumber-whole"),
    (["番茄", "西红柿", "圣女果"], "tomato-real"),
    (["洋葱"], "onion-real"),
    (["青椒"], "green-pepper"),
    (["红彩椒"], "bell-pepper-red"),
    (["黄彩椒"], "bell-pepper-yellow"),
    (["橙彩椒"], "bell-pepper-orange"),
    (["芦笋"], "asparagus-bundle"),
    (["卷心菜", "圆白菜", "包菜"], "cabbage-head"),
    (["花椰菜", "菜花"], "cauliflower-head"),
    (["茄子"], "eggplant-real"),
    (["苦瓜"], "bitter-melon"),
    (["冬瓜"], "winter-melon"),
    (["芹菜"], "celery-bundle"),
    (["莲藕"], "lotus-root"),
    (["紫甘蓝"], "purple-cabbage"),
    (["海带"], "kelp-knot"),
    (["香菇"], "shiitake-mushroom"),
    (["蘑菇", "金针菇"], "button-mushroom"),
    (["娃娃菜", "萝卜"], "greens-bowl"),
    (["虾仁", "炸虾", "油爆虾", "龙井虾仁", "清炒虾仁", "虾滑", "生蚝", "烤鱿鱼", "小龙虾", "凤尾虾"], "shrimp-bowl"),
    (["三文鱼"], "salmon-fillet"),
    (["金枪鱼"], "tuna-salad-bowl"),
    (["蟹柳", "鱼丸", "贡丸"], "fish-ball"),
    (["鳕鱼", "带鱼", "鲈鱼", "鳗鱼", "酸菜鱼", "清蒸鲈鱼", "剁椒鱼头", "西湖醋鱼", "松鼠桂鱼", "雪菜黄鱼", "麦香鱼", "响油鳝糊"], "fish-fillet"),
    (["炒河粉", "炒粉", "炒面", "干炒牛河", "炒米粉", "肉丝炒面", "炒方便面", "扬州炒面"], "stir-fried-noodles"),
    (["炒饭", "蛋炒饭", "牛肉饭", "卤肉饭", "排骨饭", "鸡肉饭", "猪肉饭", "扣肉饭", "双拼牛肉饭", "咖喱牛肉饭", "泡菜牛肉饭", "芝士牛肉饭", "温泉蛋牛肉饭", "亲子丼", "叉烧饭", "烧鸭饭", "蜜汁叉烧饭"], "rice-bowl"),
    (["红烧肉", "梅菜扣肉", "东坡肉", "梅干菜烧肉"], "braised-pork"),
    (["回锅肉", "小炒肉", "辣椒炒肉", "农家一碗香", "腊肉炒蒜苔", "猪肉炖粉条", "酸菜白肉"], "pepper-pork-stirfry"),
    (["红烧排骨", "糖醋排骨", "蒜苔炒肉", "糖醋小排"], "beef-brisket"),
    (["小炒黄牛肉", "水煮牛肉", "杭椒牛柳", "黑椒牛柳"], "broccoli-beef-stirfry"),
    (["锅包肉", "糖醋里脊", "溜肉段"], "sweet-sour-pork"),
    (["鱼香肉丝"], "pepper-pork-stirfry"),
    (["地三鲜", "干锅花菜", "手撕包菜", "油焖春笋", "老厨白菜", "东北大拉皮", "拔丝地瓜"], "greens-bowl"),
    (["紫菜蛋花汤", "酸辣汤", "蘑菇汤", "胡辣汤", "石锅泡菜汤"], "soup-bowl"),
    (["外婆菜炒蛋", "擂椒皮蛋", "木须肉"], "egg-plate"),
    (["香干炒肉"], "tofu-dried-block"),
    (["夫妻肺片", "毛血旺", "麻辣香锅", "东北乱炖", "溜肉段", "杀猪菜", "腌笃鲜", "红烧狮子头"], "pepper-pork-stirfry"),
    (["烧鹅", "叉烧", "卤鸭脖", "卤鸭翅", "卤鸭掌", "卤猪耳朵", "卤牛肉"], "ham-slices"),
    (["豉汁蒸排骨"], "beef-brisket"),
    (["肠粉"], "noodle-bowl"),
    (["响油鳝糊"], "fish"),
    (["烤茄子"], "eggplant-real"),
    (["烤金针菇", "蘑菇"], "button-mushroom"),
    (["烤韭菜"], "greens-bowl"),
    (["羊肉串", "牛肉串", "烤五花肉", "肥牛卷", "牛杂", "毛肚"], "steak"),
    (["鸡翅中", "烤鸡翅", "鸡爪"], "chicken-wings-real"),
    (["鱼豆腐"], "fish-ball"),
    (["烤豆腐"], "tofu-dish"),
    (["午餐肉", "火腿"], "ham-slices"),
    (["宽粉", "魔芋丝"], "noodle-bowl"),
    (["小笼包", "生煎包", "鲜肉包", "青菜包", "豆沙包"], "baozi-real"),
    (["包子"], "baozi-real"),
    (["馒头", "花卷"], "mantou-real"),
    (["饺子", "煎饺", "锅贴"], "dumpling-plate"),
    (["烧麦"], "steamed-bun"),
    (["燕麦"], "oatmeal-bowl"),
    (["红薯", "地瓜"], "sweet-potato"),
    (["土豆泥", "土豆丝", "土豆"], "potato"),
    (["南瓜"], "pumpkin-slice"),
    (["山药"], "yam-root"),
    (["藜麦"], "quinoa-bowl"),
    (["小米粥", "皮蛋瘦肉粥", "八宝粥"], "millet-porridge"),
    (["小米"], "millet-grains"),
    (["意大利面"], "pasta-plate"),
    (["馄饨", "云吞面", "鲜虾云吞面"], "wonton-bowl"),
    (["凉皮", "凉面", "烤冷面"], "cold-noodle-plate"),
    (["拉面", "重庆小面", "酸辣粉", "油泼面", "阳春面", "雪菜肉丝面", "牛肉粉", "乌冬面", "螺蛳粉", "米粉", "河粉", "宽粉", "魔芋丝", "热干面", "炸酱面", "担担面", "刀削面", "拌面", "米线", "方便面", "伊面"], "ramen-bowl"),
    (["面条", "荞麦面"], "noodle-bowl"),
    (["牛油果吐司"], "avocado-toast"),
    (["奶黄包"], "baozi-real"),
    (["粢饭糕", "酒酿圆子"], "rice-bowl"),
    (["胡辣汤"], "millet-porridge"),
    (["煎饼果子", "手抓饼", "鸡蛋灌饼", "葱油饼", "韭菜盒子", "肉夹馍", "驴肉火烧", "牛肉馅饼"], "chinese-flatbread"),
    (["烤面筋", "油条"], "bread-toast"),
    (["全麦面包", "白面包", "面包", "吐司"], "bread-toast"),
    (["米饭", "糙米饭", "寿司饭", "盖饭", "拌饭", "咖喱饭"], "rice-bowl"),
    (["橙汁"], "orange-juice-glass"),
    (["香蕉"], "banana-bunch"),
    (["苹果"], "apple-fruit"),
    (["橙子", "橘子", "沙糖橘"], "orange-fruit"),
    (["梨"], "pear-fruit"),
    (["葡萄"], "grapes-cluster"),
    (["草莓"], "strawberry-bowl"),
    (["蓝莓"], "blueberry-bowl"),
    (["西瓜"], "watermelon-slice"),
    (["猕猴桃"], "kiwi-fruit"),
    (["芒果"], "mango-fruit"),
    (["菠萝"], "pineapple-fruit"),
    (["木瓜"], "papaya-half"),
    (["火龙果"], "dragon-fruit"),
    (["牛油果"], "avocado-half"),
    (["樱桃"], "cherry-pair"),
    (["榴莲"], "durian-fruit"),
    (["荔枝", "龙眼"], "lychee-fruit"),
    (["山竹"], "mangosteen-fruit"),
    (["百香果"], "passionfruit"),
    (["哈密瓜", "香瓜"], "melon-fruit"),
    (["桃子", "油桃"], "peach-fruit"),
    (["李子"], "plum-fruit"),
    (["杨梅"], "bayberry-fruit"),
    (["柚子"], "grapefruit-fruit"),
    (["柠檬"], "lemon-fruit"),
    (["椰子肉"], "coconut-meat"),
    (["酱油", "蚝油", "沙拉酱"], "oil-bottle"),
    (["寿司"], "rice-bowl"),
    (["拿铁", "厚乳", "生椰"], "latte-cup"),
    (["咖啡", "美式", "冰美式"], "coffee-cup"),
    (["豆乳"], "soy-milk-cup"),
    (["杨枝甘露", "奶昔"], "yogurt-drink-bottle"),
    (["牛奶", "低脂牛奶", "纯牛奶"], "milk-carton"),
    (["酸奶", "希腊酸奶", "安慕希", "纯甄", "莫斯利安"], "yogurt-cup"),
    (["奶酪"], "cheese-block"),
    (["优酸乳", "养乐多", "酸奶饮品"], "yogurt-drink-bottle"),
    (["可口可乐", "百事可乐", "可乐"], "cola-pepsi"),
    (["无糖可乐", "零度可乐"], "cola-pepsi-zero"),
    (["雪碧"], "sprite-bottle"),
    (["美年达橙味"], "mirinda-orange"),
    (["美年达葡萄味"], "mirinda-grape"),
    (["芬达橙味"], "fanta-orange"),
    (["芬达葡萄味"], "fanta-grape"),
    (["黑巧克力"], "dark-chocolate-bar"),
    (["沙琪玛", "蛋黄派", "肉松饼", "铜锣烧"], "cake-slice"),
    (["锅巴", "仙贝", "雪饼", "米饼", "威化饼", "薄脆饼干", "夹心饼干"], "cracker-stack"),
    (["果丹皮", "山楂条", "山楂糕", "话梅", "陈皮梅", "蜜枣", "葡萄干", "芒果干", "香蕉片"], "fruit"),
    (["海苔", "爆米花", "鱼皮花生", "辣条"], "snack"),
    (["猪肉脯", "牛肉粒", "牛肉条"], "beef-jerky-pack"),
    (["瓜子", "南瓜子", "混合坚果"], "nut-mix"),
    (["苏打饼干"], "cracker-stack"),
    (["薯片"], "potato-chips-bag"),
    (["牛肉干"], "beef-jerky-pack"),
    (["双皮奶", "芋圆", "仙草冻"], "yogurt-cup"),
    (["烤肠"], "chicken-sausage"),
    (["蛋挞"], "egg-tart"),
    (["曲奇"], "cookie"),
    (["可颂"], "croissant"),
    (["瑞士卷", "蛋糕", "拿破仑", "提拉米苏", "摩天脆脆"], "cake-slice"),
    (["泡芙", "香芋派", "苹果派"], "pastry-puff"),
    (["麦芬", "麻薯面包", "糖油粑粑"], "bread-toast"),
    (["牛排", "牛上脑", "牛里脊", "牛眼肉", "牛西冷", "牛板腱", "牛肋条", "牛腩", "牛小排", "牛外脊", "牛臀肉", "牛肩肉", "牛霖", "菲力", "肋眼", "T骨"], "steak"),
    (["牛梅花肉"], "steak"),
    (["猪肝"], "ham-slices"),
    (["鸡肉肠"], "chicken-sausage"),
    (["鸡肉卷", "鸡丝凉面"], "sandwich"),
    (["黄焖鸡", "滑鸡", "辣子鸡", "白切鸡", "叫花鸡", "烤鸡", "鸡腿饭", "奥尔良鸡腿", "黑椒鸡腿", "照烧鸡腿", "番茄鸡腿", "卤鸡腿"], "chicken-thigh-real"),
    (["宫保鸡丁"], "kung-pao-chicken"),
    (["鸡", "火鸡"], "chicken"),
    (["鱼", "虾", "三文鱼", "金枪鱼", "鳕鱼", "鲈鱼", "带鱼"], "fish"),
    (["米", "面", "馒头", "包子", "饺子", "燕麦", "藜麦", "吐司", "红薯", "土豆", "盖饭", "拌饭", "咖喱饭"], "grains"),
    (["苹果", "香蕉", "橙", "葡萄", "草莓", "蓝莓", "西瓜", "猕猴桃", "芒果", "菠萝", "木瓜", "火龙果", "樱桃", "牛油果"], "fruit"),
    (["西兰花", "菠菜", "生菜", "黄瓜", "番茄", "胡萝卜", "洋葱", "青椒", "蘑菇", "芦笋", "卷心菜", "花椰菜", "茄子", "苦瓜", "冬瓜", "芹菜", "菜花", "莲藕", "紫甘蓝", "海带"], "vegetable"),
    (["牛奶", "酸奶", "奶酪", "拿铁"], "dairy"),
    (["豆", "豆腐", "豆浆", "豆奶", "腐竹"], "soy"),
    (["啤酒", "白酒", "红酒", "威士忌", "鸡尾酒", "乌苏", "青岛", "雪花", "百威", "茅台", "五粮液", "汾酒", "二锅头"], "alcohol-drink"),
    (["可口可乐", "元气森林", "东方树叶", "三得利", "冰红茶", "奶茶", "柠檬茶", "红牛", "东鹏", "果粒橙"], "beijing-soda"),
    (["小面", "米粉", "螺蛳粉", "热干面", "炸酱面", "担担面", "刀削面", "拌面", "云吞面", "米线", "河粉", "炒面"], "noodle-bowl"),
    (["烧麦", "小笼包", "生煎包", "韭菜盒子", "鸡蛋灌饼", "手抓饼", "煎饼果子", "肉夹馍", "锅贴", "油条"], "grains"),
    (["麻辣烫", "冒菜", "串串香", "火锅", "黄喉", "鸭肠"], "steak"),
    (["烤鸡皮", "生蚝", "烤鱿鱼", "小龙虾"], "fish"),
    (["奶茶", "杨枝甘露", "双皮奶", "芋圆", "仙草冻", "绿豆沙", "红豆沙", "蛋挞", "泡芙", "瑞士卷", "蛋糕", "可颂", "面包", "提拉米苏"], "snack"),
    (["巧克力", "薯片", "饼干", "可乐", "牛肉干"], "snack"),
]


def get_food_aliases(name: str, category: str) -> list[str]:
    aliases = set(CATEGORY_ALIASES.get(category, []))
    for keyword, alias_list in EXPLICIT_ALIASES.items():
        if keyword in name:
            aliases.update(alias_list)
    if "鸡排" in name or "鸡扒" in name:
        aliases.update(["鸡排", "炸鸡排", "香煎鸡排", "鸡扒", "鸡排饭"])
    if any(keyword in name for keyword in BEEF_NAME_KEYWORDS) and "牛排" not in aliases:
        aliases.update(["牛肉", "高蛋白"])
    if "蛋" in name:
        aliases.update(["蛋白质"])
    if any(keyword in name for keyword in ("冰棍", "冰棒", "雪糕", "冰淇淋", "冰激凌", "冰糕")):
        aliases.update(["冰棍", "冰棒", "雪糕", "冰淇淋", "冰激凌", "冰糕", "冷饮"])
    return sorted(aliases)


def normalize_image_prefix(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return normalized or "food"


def get_brand_image_prefix(name: str, brand: str | None = None) -> str:
    brand_text = brand or ""
    candidates = [brand_text, name]
    for candidate in candidates:
        for keyword, prefix in BRAND_IMAGE_PREFIXES.items():
            if keyword and keyword in candidate:
                return prefix
    return "product"


def get_image_refinement_tier(name: str, category: str, brand: str | None = None) -> str:
    if category in PRODUCT_LEVEL_CATEGORIES:
        return "A"
    if brand and category in BRANDED_PRODUCT_CATEGORIES:
        return "A"
    if category in DISH_LEVEL_CATEGORIES:
        return "B"
    return "C"


def get_product_level_image_key(
    name: str,
    category: str,
    brand: str | None = None,
    food_id: int | None = None,
) -> str | None:
    canonical_key = CANONICAL_PRODUCT_IMAGE_KEYS.get(name)
    if canonical_key:
        return canonical_key

    if food_id is None:
        return None

    tier = get_image_refinement_tier(name, category, brand)
    if tier == "A":
        prefix = get_brand_image_prefix(name, brand)
        return f"{normalize_image_prefix(prefix)}-{food_id}"
    if tier == "B":
        return f"dish-{food_id}"
    return None


def get_food_image_key_for_food(
    name: str,
    category: str,
    brand: str | None = None,
    food_id: int | None = None,
) -> str:
    exact_image_key = EXACT_IMAGE_KEYS.get(name)
    if exact_image_key:
        return exact_image_key
    product_key = get_product_level_image_key(name, category, brand, food_id)
    if product_key:
        return product_key
    return get_food_image_key(name, category)


def get_food_image_key(name: str, category: str) -> str:
    exact_image_key = EXACT_IMAGE_KEYS.get(name)
    if exact_image_key:
        return exact_image_key

    for keywords, image_key in IMAGE_KEYWORDS:
        if any(keyword in name for keyword in keywords):
            return image_key
    category_map = {
        "水果": "fruit",
        "蔬菜": "vegetable",
        "主食": "grains",
        "肉类": "chicken",
        "海鲜": "fish",
        "乳制品": "dairy",
        "豆制品": "soy",
        "零食": "snack",
        "酒类": "alcohol-drink",
        "川菜": "meal",
        "广东菜": "meal",
        "卤味": "meal",
        "家常炒菜": "meal",
        "湘菜": "meal",
        "东北菜": "meal",
        "江浙菜": "meal",
        "火锅类": "meal",
        "烧烤夜宵": "meal",
        "甜品烘焙": "snack",
        "饮品": "beijing-soda",
        "连锁餐厅": "meal",
        "轻食": "meal",
    }
    return category_map.get(category, "meal")


def compact_search_text(text: str) -> str:
    return "".join(text.lower().split())


SEARCH_TERM_FAMILIES = (
    ("冰", "冰棍", "冰棒", "雪糕", "冰淇淋", "冰激凌", "冰糕", "冷饮"),
)


def expand_food_search_terms(query: str) -> list[str]:
    """Return related search terms while keeping the user's original term first."""
    normalized_query = compact_search_text(query)
    if not normalized_query:
        return []

    terms = [normalized_query]
    for family in SEARCH_TERM_FAMILIES:
        if any(normalized_query in term or term in normalized_query for term in family):
            terms.extend(family)
    return list(dict.fromkeys(term for term in terms if term))


def split_search_query_tokens(query: str) -> list[str]:
    normalized_query = compact_search_text(query)
    raw_tokens = query.replace("，", " ").replace(",", " ").replace("、", " ").split()
    tokens = [compact_search_text(token) for token in raw_tokens]
    return list(dict.fromkeys(token for token in tokens if token and token != normalized_query))


def split_aliases_text(aliases_text: str | None) -> list[str]:
    if not aliases_text:
        return []
    aliases: list[str] = []
    for raw_alias in aliases_text.replace("，", ",").replace("、", ",").split(","):
        alias = raw_alias.strip()
        if alias:
            aliases.append(alias)
    return aliases


def build_aliases_text(name: str, category: str, aliases_text: str | None = None) -> str:
    aliases = set(get_food_aliases(name, category))
    aliases.update(split_aliases_text(aliases_text))
    if not aliases:
        aliases.add(name)
    return ",".join(sorted(aliases))


def build_food_search_text(
    name: str,
    category: str,
    brand: str | None = None,
    aliases_text: str | None = None,
) -> str:
    parts = [name, category, brand or "", build_aliases_text(name, category, aliases_text)]
    return compact_search_text(" ".join(part for part in parts if part))


def ordered_subsequence_score(query: str, target: str, base_score: int) -> int:
    if len(query) < 3 or len(target) < len(query):
        return 0

    index = 0
    for char in target:
        if char == query[index]:
            index += 1
            if index == len(query):
                gap_penalty = min(len(target) - len(query), 10)
                return max(base_score - gap_penalty * 3, 0)

    return 0


def food_matches_query(
    name: str,
    category: str,
    query: str,
    brand: str | None = None,
    aliases_text: str | None = None,
) -> tuple[bool, int]:
    normalized_query = compact_search_text(query.strip())
    if not normalized_query:
        return False, 0

    aliases = set(get_food_aliases(name, category))
    aliases.update(split_aliases_text(aliases_text))
    name_lower = compact_search_text(name)
    category_lower = compact_search_text(category)
    brand_lower = compact_search_text(brand or "")
    alias_lowers = [compact_search_text(alias) for alias in aliases]

    score = 0
    if normalized_query in name_lower:
        score += 100
    else:
        score += ordered_subsequence_score(normalized_query, name_lower, 72)
    if name_lower.startswith(normalized_query):
        score += 20
    if normalized_query in category_lower:
        score += 40
    else:
        score += ordered_subsequence_score(normalized_query, category_lower, 24)
    if brand_lower and normalized_query in brand_lower:
        score += 85
    elif brand_lower:
        score += ordered_subsequence_score(normalized_query, brand_lower, 52)
    if brand_lower.startswith(normalized_query):
        score += 15
    if any(normalized_query in alias_lower for alias_lower in alias_lowers):
        score += 70
    else:
        score += max((ordered_subsequence_score(normalized_query, alias_lower, 44) for alias_lower in alias_lowers), default=0)

    query_tokens = split_search_query_tokens(query)
    if query_tokens:
        searchable_fields = [name_lower, category_lower, brand_lower, *alias_lowers]
        token_score = 0
        for token in query_tokens:
            best_score = 0
            if token in name_lower:
                best_score = max(best_score, 35)
            if token in brand_lower:
                best_score = max(best_score, 45)
            if token in category_lower:
                best_score = max(best_score, 20)
            if any(token in alias_lower for alias_lower in alias_lowers):
                best_score = max(best_score, 45)
            best_score = max(
                best_score,
                max((ordered_subsequence_score(token, field, 18) for field in searchable_fields), default=0),
            )
            if best_score <= 0:
                token_score = 0
                break
            token_score += best_score
        score += min(token_score, 130)

    return score > 0, score
