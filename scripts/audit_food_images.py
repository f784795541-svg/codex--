from __future__ import annotations

import csv
import html
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
BACKEND_APP = ROOT / "backend" / "app"
FOODS_PATH = BACKEND_APP / "foods.json"
FRONTEND_ASSET_DIR = ROOT / "frontend" / "assets" / "foods"
MINIPROGRAM_ASSET_DIR = ROOT / "miniprogram" / "assets" / "foods"
REPORT_DIR = ROOT / "reports"
ASSET_EXTENSIONS = (".webp", ".jpg", ".jpeg", ".png", ".svg")
SVG_FALLBACK_REPORT = REPORT_DIR / "food_svg_fallback_normalization_report.json"
SOURCE_LEDGER = REPORT_DIR / "food_photo_source_ledger.csv"


def load_real_photo_keys() -> set[str]:
    if not SOURCE_LEDGER.exists():
        return set()
    try:
        with SOURCE_LEDGER.open("r", encoding="utf-8-sig", newline="") as handle:
            return {row.get("image_key", "").strip() for row in csv.DictReader(handle) if row.get("image_key", "").strip()}
    except OSError:
        return set()


def load_svg_fallback_keys() -> set[str]:
    if not SVG_FALLBACK_REPORT.exists():
        return set()
    try:
        payload = json.loads(SVG_FALLBACK_REPORT.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return set()
    return {str(item.get("image_key")) for item in payload.get("items", []) if item.get("image_key")}


SVG_FALLBACK_KEYS = load_svg_fallback_keys()
REAL_PHOTO_KEYS = load_real_photo_keys()

sys.path.insert(0, str(BACKEND_APP))

from food_metadata import EXACT_IMAGE_KEYS, get_food_image_key, get_food_image_key_for_food, get_image_refinement_tier  # noqa: E402


GENERIC_KEYS = {
    "meal",
    "grains",
    "snack",
    "chicken",
    "vegetable",
    "fruit",
    "dairy",
    "soy",
    "fish",
    "beijing-soda",
}

ALLOWED_HIGH_REUSE_KEYS = {
    "rice-bowl": "same visual family for rice bowl, bento, onigiri, and rice-based meals; review specific brand items",
    "bread-toast": "same visual family for plain bread and toast",
    "burger": "same visual family for burger products when exact brand photos are unavailable",
    "sandwich": "same visual family for sandwich products when exact brand photos are unavailable",
    "latte-cup": "similar visual family for latte-style drinks",
    "coffee-cup": "similar visual family for plain coffee",
    "tea-bottle": "similar visual family for bottled unsweetened tea drinks",
    "beer-bottle": "similar visual family for beer bottles or cans when exact brand photos are unavailable",
    "steak": "temporary grilled meat visual family; review beef/pork/chicken cutlets separately",
}

EXPECTED_RULES: list[tuple[str, list[str], str]] = [
    ("chicken-cutlet", ["鸡排", "炸鸡排", "香煎鸡排"], "chicken-cutlet"),
    ("chicken-wings", ["鸡翅", "烤翅", "辣翅", "翅中"], "chicken-wings-real"),
    ("chicken-nuggets", ["鸡块", "麦乐鸡"], "chicken-nuggets"),
    ("fried-chicken", ["炸鸡", "鸡米花", "原味鸡"], "fried-chicken"),
    ("pork-cutlet", ["猪排", "炸猪排"], "pork-cutlet"),
    ("sandwich", ["三明治", "麦满分", "帕尼尼"], "sandwich"),
    ("steak", ["牛排", "菲力", "西冷", "肉眼", "T骨", "肋眼"], "steak"),
    ("corn-oil", ["玉米油"], "corn-oil-bottle"),
    ("grilled-corn", ["烤玉米"], "grilled-corn"),
    ("corn", ["玉米", "粟米"], "corn-cob"),
    ("fries", ["薯条", "薯霸王", "薯饼"], "fries"),
    ("onigiri", ["饭团"], "onigiri"),
    ("bento", ["便当", "饭盒"], "bento-box"),
    ("pizza", ["披萨"], "pizza-slice"),
    ("burger", ["汉堡", "皇堡", "牛堡", "芝士堡", "巨无霸", "鸡腿堡", "麦香鸡"], "burger"),
    ("latte", ["拿铁", "生椰", "厚乳"], "latte-cup"),
    ("coffee", ["咖啡", "美式", "冰美式"], "coffee-cup"),
    ("milk-tea", ["奶茶", "伯牙", "霸王茶姬", "珍珠奶茶"], "milk-tea-cup"),
    ("tea", ["冰红茶", "冰绿茶", "冰茶", "云岭茉莉白"], "iced-tea-cup"),
    ("tea", ["乌龙茶", "茉莉花茶", "青柑普洱"], "tea-bottle"),
    ("fruit-tea", ["水果茶", "百香双重奏", "柠檬茶", "柠檬水"], "fruit-tea-cup"),
    ("orange-soda", ["北冰洋橙汽水"], "orange-soda"),
    ("durian", ["榴莲"], "durian-fruit"),
    ("lychee", ["荔枝", "龙眼"], "lychee-fruit"),
    ("mangosteen", ["山竹"], "mangosteen-fruit"),
    ("passionfruit", ["百香果"], "passionfruit"),
    ("melon", ["哈密瓜", "香瓜"], "melon-fruit"),
    ("peach", ["桃子", "油桃"], "peach-fruit"),
    ("plum", ["李子"], "plum-fruit"),
    ("bayberry", ["杨梅"], "bayberry-fruit"),
    ("grapefruit", ["柚子"], "grapefruit-fruit"),
    ("lemon", ["柠檬"], "lemon-fruit"),
    ("coconut-meat", ["椰子肉"], "coconut-meat"),
    ("coconut-water", ["椰子水"], "coconut-water"),
    ("sparkling-water", ["气泡水"], "sparkling-water"),
    ("water", ["农夫山泉"], "water-bottle"),
    ("energy-drink", ["红牛", "东鹏", "尖叫"], "energy-drink"),
    ("orange-juice", ["果粒橙", "棒打鲜橙"], "orange-juice-glass"),
    ("wonton", ["馄饨", "云吞面"], "wonton-bowl"),
    ("cold-noodle", ["凉皮", "凉面", "烤冷面"], "cold-noodle-plate"),
    ("stir-fried-noodle", ["炒河粉", "炒粉", "炒面", "干炒牛河", "炒米粉", "肉丝炒面", "炒方便面"], "stir-fried-noodles"),
    ("spicy-noodle", ["重庆小面", "酸辣粉", "担担面"], "spicy-noodle-bowl"),
    ("rice-noodle", ["桂林米粉", "螺蛳粉", "牛肉粉", "排骨米线", "砂锅米线", "过桥米线", "牛肉河粉"], "rice-noodle-bowl"),
    ("dry-noodle", ["热干面", "炸酱面", "油泼面", "葱油拌面", "肉酱拌面", "三鲜伊面"], "dry-noodle-plate"),
    ("fish-ball", ["鱼豆腐"], "fish-ball"),
    ("lunch-meat", ["午餐肉"], "lunch-meat"),
    ("ramen", ["拉面", "重庆小面", "酸辣粉", "油泼面", "阳春面", "乌冬面", "螺蛳粉", "米粉", "河粉", "热干面", "炸酱面", "担担面", "刀削面", "拌面", "米线"], "ramen-bowl"),
    ("malatang", ["麻辣烫", "冒菜", "串串香", "麻辣香锅"], "malatang-bowl"),
    ("tofu-dish", ["麻婆豆腐", "砂锅豆腐", "锅塌豆腐", "蟹粉豆腐", "烤豆腐"], "tofu-dish"),
    ("braised-pork", ["红烧肉", "东坡肉", "梅干菜烧肉", "梅菜扣肉"], "braised-pork"),
    ("sweet-sour-pork", ["锅包肉", "糖醋里脊", "溜肉段"], "sweet-sour-pork"),
    ("yu-xiang-pork", ["鱼香肉丝"], "yu-xiang-pork"),
    ("twice-cooked-pork", ["回锅肉", "小炒肉", "辣椒炒肉", "腊肉炒蒜苔", "农家一碗香"], "twice-cooked-pork"),
    ("spicy-stew", ["夫妻肺片", "毛血旺"], "spicy-stew-bowl"),
    ("northeast-stew", ["猪肉炖粉条", "东北乱炖", "杀猪菜", "酸菜白肉", "腌笃鲜"], "northeast-stew"),
    ("lion-head", ["红烧狮子头"], "lion-head-meatball"),
    ("chicken-gizzard", ["鸡胗"], "chicken-gizzard"),
    ("crispy-chicken-leg", ["脆汁鸡 鸡腿"], "crispy-chicken-leg"),
    ("green-bean", ["豆角"], "green-bean-stirfry"),
    ("pasta", ["意面"], "pasta-plate"),
    ("beer", ["啤酒", "乌苏", "青岛", "雪花", "百威", "哈尔滨", "燕京", "科罗娜", "1664", "福佳", "喜力", "朝日", "麒麟"], "beer-bottle"),
    ("baijiu", ["白酒", "茅台", "五粮液", "汾酒", "二锅头", "剑南春", "洋河", "泸州老窖", "古井贡酒"], "baijiu-bottle"),
    ("wine", ["红酒"], "wine-glass"),
    ("frappuccino", ["星冰乐", "麦旋风", "冰淇淋", "新地"], "frappuccino-cup"),
    ("beer-wine", ["啤酒", "白酒", "红酒", "威士忌", "鸡尾酒", "茅台", "五粮液", "二锅头"], "alcohol-drink"),
    ("egg-tart", ["蛋挞"], "egg-tart"),
    ("cookie", ["曲奇"], "cookie"),
    ("cake", ["瑞士卷", "蛋糕", "提拉米苏", "拿破仑", "摩天脆脆"], "cake-slice"),
    ("croissant", ["可颂"], "croissant"),
    ("pastry", ["泡芙", "香芋派", "苹果派"], "pastry-puff"),
    ("flatbread", ["煎饼果子", "手抓饼", "鸡蛋灌饼", "葱油饼", "肉夹馍", "韭菜盒子"], "chinese-flatbread"),
    ("soup", ["汤", "石锅泡菜汤"], "soup-bowl"),
    ("kung-pao", ["宫保鸡丁"], "kung-pao-chicken"),
    ("tomato-egg", ["番茄炒蛋", "西红柿炒鸡蛋"], "tomato-egg-stirfry"),
    ("beef-noodle", ["牛肉面"], "beef-noodle-bowl"),
    ("pork", ["猪里脊", "瘦猪肉"], "pork-slices"),
    ("lunch-meat", ["午餐肉"], "lunch-meat"),
]


ACTUAL_GROUPS: list[tuple[str, list[str]]] = [
    ("chicken-cutlet", ["chicken-cutlet"]),
    ("chicken-wings", ["chicken-wings-real"]),
    ("chicken-nuggets", ["chicken-nuggets"]),
    ("fried-chicken", ["fried-chicken"]),
    ("pork-cutlet", ["pork-cutlet"]),
    ("beef-noodle", ["beef-noodle"]),
    ("steak", ["steak", "ribeye", "sirloin", "filet", "tbone", "short-rib", "chuck-roll", "flat-iron", "beef"]),
    ("corn-oil", ["corn-oil"]),
    ("grilled-corn", ["grilled-corn"]),
    ("corn", ["corn-cob"]),
    ("onigiri", ["onigiri"]),
    ("sandwich", ["sandwich"]),
    ("bento", ["bento"]),
    ("pizza", ["pizza"]),
    ("burger", ["burger"]),
    ("fries", ["fries", "potato-chips"]),
    ("latte", ["latte"]),
    ("coffee", ["coffee"]),
    ("milk-tea", ["milk-tea"]),
    ("tea", ["tea-bottle", "iced-tea"]),
    ("fruit-tea", ["fruit-tea"]),
    ("orange-soda", ["orange-soda"]),
    ("durian", ["durian"]),
    ("lychee", ["lychee"]),
    ("mangosteen", ["mangosteen"]),
    ("passionfruit", ["passionfruit"]),
    ("melon", ["melon"]),
    ("peach", ["peach"]),
    ("plum", ["plum"]),
    ("bayberry", ["bayberry"]),
    ("grapefruit", ["grapefruit"]),
    ("lemon", ["lemon"]),
    ("coconut-meat", ["coconut-meat"]),
    ("coconut-water", ["coconut-water"]),
    ("sparkling-water", ["sparkling-water"]),
    ("water", ["water-bottle"]),
    ("energy-drink", ["energy-drink"]),
    ("orange-juice", ["orange-juice"]),
    ("ramen", ["ramen"]),
    ("wonton", ["wonton"]),
    ("cold-noodle", ["cold-noodle"]),
    ("stir-fried-noodle", ["stir-fried-noodles"]),
    ("spicy-noodle", ["spicy-noodle"]),
    ("rice-noodle", ["rice-noodle"]),
    ("dry-noodle", ["dry-noodle"]),
    ("malatang", ["malatang"]),
    ("fish-ball", ["fish-ball"]),
    ("tofu-dish", ["tofu-dish"]),
    ("braised-pork", ["braised-pork"]),
    ("sweet-sour-pork", ["sweet-sour-pork"]),
    ("yu-xiang-pork", ["yu-xiang-pork"]),
    ("twice-cooked-pork", ["twice-cooked-pork"]),
    ("spicy-stew", ["spicy-stew"]),
    ("northeast-stew", ["northeast-stew"]),
    ("lion-head", ["lion-head"]),
    ("chicken-gizzard", ["chicken-gizzard"]),
    ("crispy-chicken-leg", ["crispy-chicken-leg"]),
    ("green-bean", ["green-bean"]),
    ("pasta", ["pasta"]),
    ("beer", ["beer-bottle"]),
    ("baijiu", ["baijiu"]),
    ("wine", ["wine"]),
    ("frappuccino", ["frappuccino"]),
    ("beer-wine", ["alcohol", "beer", "wine"]),
    ("egg-tart", ["egg-tart"]),
    ("cookie", ["cookie"]),
    ("cake", ["cake-slice"]),
    ("croissant", ["croissant"]),
    ("pastry", ["pastry-puff"]),
    ("flatbread", ["chinese-flatbread"]),
    ("soup", ["soup-bowl"]),
    ("pork", ["pork-slices"]),
    ("kung-pao", ["kung-pao-chicken"]),
    ("tomato-egg", ["tomato-egg"]),
    ("rice", ["rice-bowl", "grains"]),
    ("bread", ["bread", "toast"]),
    ("vegetable", ["vegetable", "greens"]),
    ("egg", ["egg"]),
    ("fish", ["fish", "salmon", "shrimp", "tuna"]),
    ("fruit", ["fruit", "apple", "banana", "orange", "mango", "grape", "strawberry", "watermelon"]),
]


def load_foods() -> list[dict[str, Any]]:
    return json.loads(FOODS_PATH.read_text(encoding="utf-8"))


def list_assets(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    priority = {extension: index for index, extension in enumerate(ASSET_EXTENSIONS)}
    assets: dict[str, str] = {}
    for item in path.iterdir():
        if not item.is_file() or item.name.startswith("._"):
            continue
        extension = item.suffix.lower()
        if extension not in priority:
            continue
        current = assets.get(item.stem)
        if current is None or priority[extension] < priority[Path(current).suffix.lower()]:
            assets[item.stem] = item.name
    return assets


def asset_style(filename: str) -> str:
    if not filename:
        return "missing"
    if Path(filename).stem in REAL_PHOTO_KEYS:
        return "local real photo"
    if Path(filename).stem in SVG_FALLBACK_KEYS:
        return "local svg"
    return "local svg" if Path(filename).suffix.lower() == ".svg" else "local real photo"


def expected_group_and_key(food: dict[str, Any]) -> tuple[str, str]:
    name = food.get("name") or ""
    category = food.get("category") or ""
    brand = food.get("brand") or ""
    comparable_name = name.replace(brand, "", 1).strip() if brand else name
    text = f"{comparable_name} {category}"
    for expected_group, keywords, suggested_key in EXPECTED_RULES:
        if any(keyword in text for keyword in keywords):
            if suggested_key == "corn-cob" and "玉米油" in text:
                continue
            return expected_group, suggested_key
    return category or "unknown", ""


def actual_group(image_key: str) -> str:
    for group, fragments in ACTUAL_GROUPS:
        if any(fragment in image_key for fragment in fragments):
            return group
    return image_key or "missing"


def build_reuse_reason(tier: str, semantic_key: str) -> str:
    if tier == "A":
        return "product-level image key split from shared family"
    if tier == "B":
        return "dish-level image key split from shared family"
    if semantic_key in ALLOWED_HIGH_REUSE_KEYS:
        return ALLOWED_HIGH_REUSE_KEYS[semantic_key]
    if semantic_key in GENERIC_KEYS:
        return "C-tier ingredient family reuse is allowed when the semantic family remains consistent"
    return "semantic-family reuse accepted for current tier"


def csv_problem_text(problems: list[str]) -> str:
    return "; ".join(dict.fromkeys(problems))


def audit_foods() -> tuple[list[dict[str, Any]], dict[str, list[dict[str, Any]]], Counter[str], Counter[str]]:
    foods = load_foods()
    frontend_assets = list_assets(FRONTEND_ASSET_DIR)
    miniprogram_assets = list_assets(MINIPROGRAM_ASSET_DIR)
    rows: list[dict[str, Any]] = []
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    semantic_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    category_by_semantic_key: dict[str, set[str]] = defaultdict(set)

    for food in foods:
        name = food.get("name", "")
        category = food.get("category", "")
        brand = food.get("brand") or None
        image_key = get_food_image_key_for_food(name, category, brand, food.get("food_id"))
        semantic_key = get_food_image_key(name, category)
        refinement_tier = get_image_refinement_tier(name, category, brand)
        food["_audit_image_key"] = image_key
        food["_audit_semantic_image_key"] = semantic_key
        food["_audit_refinement_tier"] = refinement_tier
        groups[image_key].append(food)
        semantic_groups[semantic_key].append(food)
        category_by_semantic_key[semantic_key].add(category or "")

    reuse_counts = Counter({key: len(items) for key, items in groups.items()})
    semantic_reuse_counts = Counter({key: len(items) for key, items in semantic_groups.items()})

    for food in foods:
        name = food.get("name", "")
        image_key = food["_audit_image_key"]
        semantic_key = food["_audit_semantic_image_key"]
        refinement_tier = food["_audit_refinement_tier"]
        expected_group, suggested_key = expected_group_and_key(food)
        actual = actual_group(semantic_key)
        frontend_filename = frontend_assets.get(image_key, "")
        miniprogram_filename = miniprogram_assets.get(image_key, "")
        frontend_exists = bool(frontend_filename)
        miniprogram_exists = bool(miniprogram_filename)
        reuse_count = reuse_counts[image_key]
        semantic_reuse_count = semantic_reuse_counts[semantic_key]
        categories = {item.get("category") or "" for item in semantic_groups[semantic_key]}
        problems: list[str] = []
        product_level_problems: list[str] = []
        risk_level = "ok"
        requires_unique_image = refinement_tier in {"A", "B"}
        reuse_reason = build_reuse_reason(refinement_tier, semantic_key)
        reuse_policy = "unique_required" if requires_unique_image else "family_reuse_allowed"
        # An explicit product mapping intentionally reuses a known visual asset.
        # It should not be reported as an unresolved product-level image split.
        should_split_from_group = (
            requires_unique_image
            and image_key == semantic_key
            and name not in EXACT_IMAGE_KEYS
        )
        reuse_grade = "ok"

        if not frontend_exists:
            problems.append("frontend asset missing")
            product_level_problems.append("frontend asset missing")
        if not miniprogram_exists:
            problems.append("miniprogram asset missing")
            product_level_problems.append("miniprogram asset missing")
        if should_split_from_group:
            problems.append("still using semantic shared key")
            product_level_problems.append("still using semantic shared key")
            reuse_grade = "must_split"
        if (
            name not in EXACT_IMAGE_KEYS
            and expected_group not in {"unknown", food.get("category", "")}
            and actual != expected_group
            and suggested_key
        ):
            problems.append(f"semantic mismatch {expected_group}!={actual}")
            product_level_problems.append("semantic family mismatch")
            if reuse_grade == "ok":
                reuse_grade = "too_broad"
        if not requires_unique_image and len(categories) >= 4 and semantic_key in GENERIC_KEYS:
            reuse_grade = "acceptable"
        if requires_unique_image and asset_style(frontend_filename) == "local svg":
            product_level_problems.append("using local illustration fallback")

        if problems:
            risk_level = "medium"
        if any(
            problem.startswith(prefix)
            for problem in problems
            for prefix in ("frontend asset missing", "miniprogram asset missing", "semantic mismatch")
        ):
            risk_level = "high"
        if reuse_count >= 30 and requires_unique_image:
            risk_level = "high"

        asset_style_value = asset_style(frontend_filename)
        if asset_style_value == "local real photo":
            photo_status = "real_photo"
        elif frontend_exists:
            photo_status = "local_illustration"
        else:
            photo_status = "missing_real_photo"

        rows.append(
            {
                "food_id": food.get("food_id", ""),
                "name": food.get("name", ""),
                "category": food.get("category", ""),
                "brand": food.get("brand", ""),
                "refinement_tier": refinement_tier,
                "requires_unique_image": requires_unique_image,
                "reuse_policy": reuse_policy,
                "reuse_grade": reuse_grade,
                "should_split_from_group": should_split_from_group,
                "photo_status": photo_status,
                "real_photo_candidate": f"{image_key}.webp",
                "product_level_problem": csv_problem_text(product_level_problems),
                "image_key": image_key,
                "semantic_image_key": semantic_key,
                "frontend_asset_exists": frontend_exists,
                "miniprogram_asset_exists": miniprogram_exists,
                "expected_group": expected_group,
                "actual_group": actual,
                "risk_level": risk_level,
                "problem": csv_problem_text(problems),
                "suggested_image_key": image_key if requires_unique_image else suggested_key,
                "reuse_count": reuse_count,
                "semantic_reuse_count": semantic_reuse_count,
                "reuse_reason": reuse_reason,
                "needs_unique_asset": should_split_from_group,
                "asset_style": asset_style_value,
                "frontend_asset_file": frontend_filename,
                "miniprogram_asset_file": miniprogram_filename,
            }
        )

    return rows, groups, reuse_counts, semantic_reuse_counts


def write_csv(rows: list[dict[str, Any]]) -> None:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    for filename in ("food_image_audit.csv", "food_image_refinement_audit.csv"):
        csv_path = REPORT_DIR / filename
        with csv_path.open("w", encoding="utf-8-sig", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)


def write_summary(
    rows: list[dict[str, Any]],
    groups: dict[str, list[dict[str, Any]]],
    reuse_counts: Counter[str],
    semantic_reuse_counts: Counter[str],
) -> None:
    total = len(rows)
    high = [row for row in rows if row["risk_level"] == "high"]
    medium = [row for row in rows if row["risk_level"] == "medium"]
    missing_frontend = [row for row in rows if not row["frontend_asset_exists"]]
    missing_miniprogram = [row for row in rows if not row["miniprogram_asset_exists"]]
    needs_unique = [row for row in rows if row["should_split_from_group"]]
    real_photo_keys = {row["image_key"] for row in rows if row["asset_style"] == "local real photo"}
    local_illustration_keys = {row["image_key"] for row in rows if row["asset_style"] == "local svg"}
    top_reuse = semantic_reuse_counts.most_common(50)
    tier_counts = Counter(str(row["refinement_tier"]) for row in rows)
    a_broad = [row for row in rows if row["refinement_tier"] == "A" and row["should_split_from_group"]]
    b_broad = [row for row in rows if row["refinement_tier"] == "B" and row["should_split_from_group"]]

    lines = [
        "# Food Image Refinement Summary",
        "",
        f"- Total foods: {total}",
        f"- Total image keys: {len(groups)}",
        f"- Total semantic image families: {len(semantic_reuse_counts)}",
        f"- High risk rows: {len(high)}",
        f"- Medium risk rows: {len(medium)}",
        f"- Missing frontend assets: {len(missing_frontend)}",
        f"- Missing miniprogram assets: {len(missing_miniprogram)}",
        f"- A-tier foods: {tier_counts['A']}",
        f"- B-tier foods: {tier_counts['B']}",
        f"- C-tier foods: {tier_counts['C']}",
        f"- A-tier foods still using broad shared keys: {len(a_broad)}",
        f"- B-tier foods still using broad shared keys: {len(b_broad)}",
        f"- Rows needing further split: {len(needs_unique)}",
        f"- Image keys using local real photos: {len(real_photo_keys)}",
        f"- Image keys using local illustration fallback: {len(local_illustration_keys)}",
        "",
        "## Top Semantic Reuse Families",
        "",
        "| semantic_image_key | count | sample foods |",
        "|---|---:|---|",
    ]
    for key, count in top_reuse:
        sample_rows = [row for row in rows if row["semantic_image_key"] == key][:12]
        sample = "、".join(str(item.get("name", "")) for item in sample_rows)
        lines.append(f"| `{key}` | {count} | {sample} |")

    lines.extend(["", "## Suggested Split Candidates", "", "| food_id | tier | name | image_key | semantic_image_key | problem |", "|---:|---|---|---|---|---|"])
    for row in needs_unique[:100]:
        lines.append(
            f"| {row['food_id']} | {row['refinement_tier']} | {row['name']} | `{row['image_key']}` | `{row['semantic_image_key']}` | {row['product_level_problem'] or row['problem']} |"
        )

    lines.extend(["", "## High Risk Samples", "", "| food_id | name | image_key | problem | suggested |", "|---:|---|---|---|---|"])
    for row in high[:120]:
        lines.append(
            f"| {row['food_id']} | {row['name']} | `{row['image_key']}` | {row['problem']} | `{row['suggested_image_key']}` |"
        )

    lines.extend(["", "## Required Follow-up", ""])
    if high:
        lines.append("- Fix all high risk rows before marking the image audit complete.")
    if needs_unique:
        lines.append("- Add or remap precise assets for rows marked `needs_unique_asset=true`.")
    if not high and not needs_unique:
        lines.append("- No high risk image rows detected by the current rules.")

    text = "\n".join(lines) + "\n"
    (REPORT_DIR / "food_image_audit_summary.md").write_text(text, encoding="utf-8")
    (REPORT_DIR / "food_image_refinement_summary.md").write_text(text, encoding="utf-8")


def write_contact_sheet(rows: list[dict[str, Any]], groups: dict[str, list[dict[str, Any]]], reuse_counts: Counter[str]) -> None:
    row_by_food_id = {str(row["food_id"]): row for row in rows}
    cards: list[str] = []
    for image_key, foods in sorted(groups.items(), key=lambda item: (-len(item[1]), item[0])):
        sample_rows = [row_by_food_id[str(food.get("food_id"))] for food in foods]
        worst = "high" if any(row["risk_level"] == "high" for row in sample_rows) else "medium" if any(row["risk_level"] == "medium" for row in sample_rows) else "ok"
        asset_file = next((str(row["frontend_asset_file"]) for row in sample_rows if row["frontend_asset_file"]), f"{image_key}.svg")
        names = "\n".join(
            f"<li><strong>{html.escape(str(food.get('name', '')))}</strong> <span>{html.escape(str(food.get('category', '')))}</span></li>"
            for food in foods[:50]
        )
        problems = "; ".join(dict.fromkeys(row["problem"] for row in sample_rows if row["problem"]))
        cards.append(
            f"""
            <section class="card {worst}" data-key="{html.escape(image_key)}" data-text="{html.escape(' '.join(str(food.get('name', '')) for food in foods))}">
              <div class="thumb"><img src="../frontend/assets/foods/{html.escape(asset_file)}" alt="{html.escape(image_key)}" /></div>
              <div class="meta">
                <h2>{html.escape(image_key)} <span>{reuse_counts[image_key]} foods</span></h2>
                <p class="risk">risk: {worst}</p>
                <p>tier: {html.escape(str(sample_rows[0]['refinement_tier']))} | semantic: {html.escape(str(sample_rows[0]['semantic_image_key']))}</p>
                <p>{html.escape(problems or 'no rule-based issue')}</p>
                <ol>{names}</ol>
              </div>
            </section>
            """
        )
    html_text = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <title>Food Image Refinement Contact Sheet</title>
  <style>
    body {{ margin: 0; font-family: Arial, "Microsoft YaHei", sans-serif; background: #f6f8f8; color: #1d2b2f; }}
    header {{ position: sticky; top: 0; z-index: 2; padding: 16px 24px; background: #ffffff; border-bottom: 1px solid #dde6e8; }}
    h1 {{ margin: 0 0 10px; font-size: 22px; }}
    input {{ width: min(760px, 92vw); padding: 10px 12px; border: 1px solid #cdd8da; border-radius: 8px; font-size: 14px; }}
    main {{ display: grid; gap: 12px; padding: 18px; }}
    .card {{ display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 16px; padding: 14px; border: 1px solid #dce5e7; border-radius: 8px; background: #fff; }}
    .card.high {{ border-color: #d66; background: #fff8f7; }}
    .card.medium {{ border-color: #e2ba5d; background: #fffaf0; }}
    .thumb {{ width: 120px; height: 120px; display: grid; place-items: center; background: #f4f7f8; border-radius: 8px; overflow: hidden; }}
    .thumb img {{ max-width: 108px; max-height: 108px; object-fit: contain; }}
    h2 {{ margin: 0; font-size: 18px; }}
    h2 span {{ font-size: 13px; color: #667; font-weight: 400; }}
    .risk {{ margin: 6px 0; font-weight: 700; }}
    ol {{ margin: 8px 0 0; padding-left: 20px; columns: 2; }}
    li {{ break-inside: avoid; line-height: 1.55; }}
    li span {{ color: #667; }}
  </style>
</head>
<body>
  <header>
    <h1>Food Image Refinement Contact Sheet</h1>
    <input id="q" placeholder="Search image_key or food name, e.g. 鸡排 / 玉米油 / 瑞幸 / KFC / 711" />
  </header>
  <main id="cards">
    {''.join(cards)}
  </main>
  <script>
    const q = document.getElementById('q');
    const cards = Array.from(document.querySelectorAll('.card'));
    q.addEventListener('input', () => {{
      const value = q.value.trim().toLowerCase();
      for (const card of cards) {{
        const haystack = `${{card.dataset.key}} ${{card.dataset.text}}`.toLowerCase();
        card.style.display = !value || haystack.includes(value) ? '' : 'none';
      }}
    }});
  </script>
</body>
</html>
"""
    (REPORT_DIR / "food_image_contact_sheet.html").write_text(html_text, encoding="utf-8")
    (REPORT_DIR / "food_image_refinement_contact_sheet.html").write_text(html_text, encoding="utf-8")


def main() -> None:
    rows, groups, reuse_counts, semantic_reuse_counts = audit_foods()
    write_csv(rows)
    write_summary(rows, groups, reuse_counts, semantic_reuse_counts)
    write_contact_sheet(rows, groups, reuse_counts)
    print(f"foods={len(rows)} image_keys={len(groups)} high={sum(row['risk_level'] == 'high' for row in rows)}")
    print(f"reports={REPORT_DIR}")


if __name__ == "__main__":
    main()
