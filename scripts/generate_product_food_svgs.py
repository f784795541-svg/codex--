from __future__ import annotations

import argparse
import html
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BACKEND_APP = ROOT / "backend" / "app"
FOODS_PATH = BACKEND_APP / "foods.json"
FRONTEND_ASSET_DIR = ROOT / "frontend" / "assets" / "foods"
MINIPROGRAM_ASSET_DIR = ROOT / "miniprogram" / "assets" / "foods"
ASSET_EXTENSIONS = (".webp", ".jpg", ".jpeg", ".png", ".svg")

sys.path.insert(0, str(BACKEND_APP))

from food_metadata import (  # noqa: E402
    get_brand_image_prefix,
    get_food_image_key,
    get_food_image_key_for_food,
    get_image_refinement_tier,
)


BRAND_ACCENTS = {
    "mcd": ("#f4d03f", "#c0392b"),
    "kfc": ("#f8d7da", "#b03a2e"),
    "711": ("#f9e79f", "#e67e22"),
    "familymart": ("#d6eaf8", "#2471a3"),
    "lawson": ("#d4e6f1", "#2e86c1"),
    "luckin": ("#d6eaf8", "#2471a3"),
    "starbucks": ("#d5f5e3", "#1e8449"),
    "chagee": ("#fdebd0", "#af601a"),
    "pizzahut": ("#fadbd8", "#c0392b"),
    "micun": ("#e8f8f5", "#138d75"),
    "burgerking": ("#fdebd0", "#af601a"),
    "mixue": ("#f5eef8", "#8e44ad"),
    "hema": ("#ebf5fb", "#2874a6"),
    "sams": ("#ebf5fb", "#1f618d"),
    "redbull": ("#fdebd0", "#cb4335"),
    "dongpeng": ("#fcf3cf", "#d68910"),
    "ajisen": ("#fadbd8", "#943126"),
    "subway": ("#d5f5e3", "#196f3d"),
    "nanchengxiang": ("#fef5e7", "#b9770e"),
    "yoshinoya": ("#fdebd0", "#ba4a00"),
    "takeaway": ("#f2f4f4", "#5d6d7e"),
}


def load_foods() -> list[dict]:
    return json.loads(FOODS_PATH.read_text(encoding="utf-8"))


def list_assets(path: Path) -> dict[str, Path]:
    assets: dict[str, Path] = {}
    if not path.exists():
        return assets
    priority = {extension: index for index, extension in enumerate(ASSET_EXTENSIONS)}
    for item in path.iterdir():
        if not item.is_file() or item.name.startswith("._"):
            continue
        extension = item.suffix.lower()
        if extension not in priority:
            continue
        current = assets.get(item.stem)
        if current is None or priority[extension] < priority[current.suffix.lower()]:
            assets[item.stem] = item
    return assets


def infer_visual_family(name: str, category: str, semantic_key: str) -> str:
    if semantic_key != "meal":
        return semantic_key

    checks = [
        (("饭团",), "onigiri"),
        (("便当", "拌饭", "盖饭", "咖喱饭", "卤肉饭", "牛肉饭"), "rice-bowl"),
        (("披萨",), "pizza-slice"),
        (("汉堡", "皇堡", "芝士堡", "巨无霸"), "burger"),
        (("三明治", "帕尼尼", "麦满分"), "sandwich"),
        (("鸡排",), "chicken-cutlet"),
        (("鸡翅", "辣翅", "烤翅"), "chicken-wings-real"),
        (("炸鸡", "原味鸡", "鸡米花"), "fried-chicken"),
        (("薯条", "薯饼"), "fries"),
        (("拿铁", "生椰", "厚乳"), "latte-cup"),
        (("星冰乐", "奶昔"), "frappuccino-cup"),
        (("奶茶", "伯牙"), "milk-tea-cup"),
        (("可乐", "气泡水", "红牛", "东鹏"), "energy-drink"),
        (("乌龙茶", "茉莉花茶", "冰红茶", "冰绿茶"), "tea-bottle"),
        (("汤",), "soup-bowl"),
        (("面", "粉", "米线", "拉面"), "noodle-bowl"),
        (("鸡丁", "肉丝", "红烧", "豆腐", "锅包", "回锅", "狮子头"), "meal-plate"),
    ]
    for keywords, family in checks:
        if any(keyword in name for keyword in keywords):
            return family
    if category in {"川菜", "广东菜", "卤味", "家常炒菜", "湘菜", "东北菜", "江浙菜", "火锅类", "烧烤夜宵"}:
        return "meal-plate"
    return "meal-plate"


def palette_for(prefix: str, family: str, tier: str) -> tuple[str, str, str]:
    base_bg = "#f6f3ef" if tier == "B" else "#f6f8fb"
    accent_bg, accent = BRAND_ACCENTS.get(prefix, ("#ecf0f1", "#566573"))
    if family in {"pizza-slice", "burger", "fries", "fried-chicken", "chicken-cutlet", "egg-tart"}:
        return "#fff4e6", "#f5c16c", accent
    if family in {"latte-cup", "coffee-cup", "milk-tea-cup", "fruit-tea-cup", "frappuccino-cup"}:
        return "#eef6ff", accent_bg, accent
    if family in {"tea-bottle", "water-bottle", "energy-drink", "sparkling-water", "cola-pepsi", "orange-soda"}:
        return "#eef7f1", accent_bg, accent
    if family in {"rice-bowl", "onigiri", "bento-box", "noodle-bowl", "ramen-bowl", "soup-bowl", "malatang-bowl"}:
        return "#f7f2ea", "#f2d4a7", accent
    if family in {"cake-slice", "croissant", "pastry-puff", "cookie"}:
        return "#fff3f7", "#f8d7da", accent
    return base_bg, accent_bg, accent


def draw_family(family: str, accent_bg: str, accent: str, variant_seed: int) -> str:
    shift = (variant_seed % 21) - 10
    lift = ((variant_seed // 7) % 17) - 8
    garnish = ("#58d68d", "#f5b041", "#cb4335", "#7dcea0", "#f8c471")[(variant_seed // 13) % 5]
    if family in {"grilled-corn", "corn-cob"}:
        return f"""
        <rect x="{82 + shift // 3}" y="{56 + lift // 3}" width="16" height="70" rx="8" fill="#f4d03f"/>
        <circle cx="{72 + shift}" cy="{74 + lift}" r="8" fill="#f7dc6f"/>
        <circle cx="{90 + shift // 2}" cy="{70 + lift}" r="8" fill="#f4d03f"/>
        <circle cx="{108 + shift}" cy="{74 + lift}" r="8" fill="#f7dc6f"/>
        <circle cx="{72 + shift}" cy="{92 + lift}" r="8" fill="#f4d03f"/>
        <circle cx="{90 + shift // 2}" cy="{88 + lift}" r="8" fill="#f7dc6f"/>
        <circle cx="{108 + shift}" cy="{92 + lift}" r="8" fill="#f4d03f"/>
        <circle cx="{72 + shift}" cy="{110 + lift}" r="8" fill="#f7dc6f"/>
        <circle cx="{90 + shift // 2}" cy="{106 + lift}" r="8" fill="#f4d03f"/>
        <circle cx="{108 + shift}" cy="{110 + lift}" r="8" fill="#f7dc6f"/>
        <path d="M{82 + shift // 3} 118 Q{70 + shift} 130 {62 + shift} 144" stroke="{garnish}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M{98 + shift // 3} 118 Q{110 + shift} 130 {118 + shift} 144" stroke="{garnish}" stroke-width="6" fill="none" stroke-linecap="round"/>
        """
    if family == "burger":
        return f"""
        <ellipse cx="90" cy="82" rx="42" ry="18" fill="#f1c27d"/>
        <rect x="48" y="82" width="84" height="12" rx="6" fill="{accent}"/>
        <rect x="54" y="94" width="72" height="10" rx="5" fill="#5d4037"/>
        <ellipse cx="90" cy="108" rx="40" ry="14" fill="#f4c97a"/>
        """
    if family == "sandwich":
        return f"""
        <polygon points="42,102 90,58 138,102" fill="#f1d39a"/>
        <polygon points="50,96 90,64 130,96" fill="{accent_bg}"/>
        <rect x="56" y="88" width="68" height="8" rx="4" fill="{accent}"/>
        """
    if family == "fries":
        return f"""
        <rect x="56" y="76" width="68" height="48" rx="12" fill="{accent}"/>
        <rect x="60" y="64" width="8" height="30" rx="4" fill="#f5c16c"/>
        <rect x="74" y="58" width="8" height="34" rx="4" fill="#f4d03f"/>
        <rect x="88" y="62" width="8" height="32" rx="4" fill="#f5c16c"/>
        <rect x="102" y="56" width="8" height="36" rx="4" fill="#f4d03f"/>
        <rect x="116" y="64" width="8" height="28" rx="4" fill="#f5c16c"/>
        """
    if family in {"latte-cup", "coffee-cup", "milk-tea-cup", "fruit-tea-cup", "frappuccino-cup"}:
        straw = '<rect x="107" y="44" width="6" height="34" rx="3" fill="#6c7a89"/>' if family != "coffee-cup" else ""
        dome = '<ellipse cx="90" cy="60" rx="28" ry="10" fill="#d6eaf8"/>' if family == "frappuccino-cup" else ""
        return f"""
        {straw}
        {dome}
        <rect x="58" y="66" width="64" height="58" rx="18" fill="#ffffff" stroke="{accent}" stroke-width="4"/>
        <rect x="{64 + shift // 2}" y="{84 + lift // 2}" width="44" height="22" rx="10" fill="{accent_bg}"/>
        <rect x="{68 + shift // 3}" y="{90 + lift // 3}" width="36" height="6" rx="3" fill="{garnish}" opacity="0.7"/>
        <circle cx="126" cy="94" r="10" fill="none" stroke="{accent}" stroke-width="4"/>
        """
    if family in {"tea-bottle", "water-bottle", "energy-drink", "sparkling-water", "cola-pepsi", "orange-soda"}:
        can = family in {"energy-drink", "cola-pepsi", "orange-soda"}
        if can:
            return f"""
            <rect x="64" y="48" width="52" height="84" rx="14" fill="{accent}" />
            <rect x="72" y="60" width="36" height="18" rx="6" fill="{accent_bg}" />
            <rect x="72" y="86" width="36" height="28" rx="8" fill="#ffffff" opacity="0.88" />
            """
        return f"""
        <rect x="74" y="42" width="32" height="12" rx="4" fill="{accent}"/>
        <rect x="62" y="54" width="56" height="78" rx="18" fill="{accent_bg}" stroke="{accent}" stroke-width="4"/>
        <rect x="72" y="78" width="36" height="24" rx="8" fill="#ffffff" opacity="0.9"/>
        """
    if family in {"onigiri"}:
        return f"""
        <polygon points="90,50 136,122 44,122" fill="#ffffff" stroke="#d0d7de" stroke-width="3"/>
        <rect x="58" y="92" width="64" height="26" rx="8" fill="{accent}"/>
        <circle cx="90" cy="82" r="10" fill="{accent_bg}"/>
        """
    if family in {"bento-box"}:
        return f"""
        <rect x="40" y="56" width="100" height="72" rx="14" fill="#2c3e50"/>
        <rect x="48" y="64" width="40" height="56" rx="10" fill="{accent_bg}"/>
        <rect x="92" y="64" width="40" height="24" rx="8" fill="{accent}"/>
        <rect x="92" y="92" width="40" height="28" rx="8" fill="#f7dc6f"/>
        """
    if family in {"rice-bowl", "noodle-bowl", "ramen-bowl", "soup-bowl", "malatang-bowl"}:
        chopsticks = ""
        if family in {"noodle-bowl", "ramen-bowl"}:
            chopsticks = '<rect x="118" y="48" width="4" height="54" rx="2" fill="#8e5b3a" transform="rotate(18 118 48)"/><rect x="128" y="44" width="4" height="58" rx="2" fill="#8e5b3a" transform="rotate(18 128 44)"/>'
        return f"""
        {chopsticks}
        <path d="M44 84 Q90 122 136 84 L126 126 Q90 144 54 126 Z" fill="{accent}" />
        <ellipse cx="90" cy="82" rx="46" ry="16" fill="{accent_bg}" />
        <circle cx="{72 + shift}" cy="{78 + lift}" r="8" fill="#f7dc6f"/>
        <circle cx="{92 + shift // 2}" cy="{74 + lift}" r="9" fill="#f5b041"/>
        <circle cx="{110 + shift}" cy="{80 + lift}" r="7" fill="{garnish}"/>
        """
    if family in {"spicy-noodle-bowl", "rice-noodle-bowl", "beef-noodle-bowl"}:
        return f"""
        <rect x="118" y="48" width="4" height="54" rx="2" fill="#8e5b3a" transform="rotate(18 118 48)"/>
        <rect x="128" y="44" width="4" height="58" rx="2" fill="#8e5b3a" transform="rotate(18 128 44)"/>
        <path d="M44 84 Q90 122 136 84 L126 126 Q90 144 54 126 Z" fill="{accent}" />
        <ellipse cx="90" cy="82" rx="46" ry="16" fill="{accent_bg}" />
        <path d="M62 82 Q90 68 118 82" stroke="#f5c16c" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M62 90 Q90 76 118 90" stroke="#f8c471" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="74" cy="74" r="6" fill="#cb4335"/>
        <circle cx="106" cy="74" r="6" fill="#58d68d"/>
        """
    if family in {"pizza-slice"}:
        return f"""
        <polygon points="90,44 138,132 42,132" fill="#f9d976"/>
        <path d="M90 44 L138 132 L126 132 Q90 120 54 132 L42 132 Z" fill="#f5b041"/>
        <circle cx="90" cy="82" r="8" fill="{accent}"/>
        <circle cx="70" cy="104" r="7" fill="#cb4335"/>
        <circle cx="112" cy="104" r="7" fill="#cb4335"/>
        """
    if family in {"chicken-cutlet", "pork-cutlet", "fried-chicken", "chicken-wings-real", "chicken-nuggets", "crispy-chicken-leg"}:
        return f"""
        <ellipse cx="90" cy="118" rx="46" ry="10" fill="#d5dbdb"/>
        <ellipse cx="{72 + shift}" cy="{88 + lift}" rx="18" ry="24" fill="#d68910"/>
        <ellipse cx="{104 + shift // 2}" cy="{92 + lift}" rx="20" ry="26" fill="#ca6f1e"/>
        <ellipse cx="{116 + shift}" cy="{76 + lift}" rx="12" ry="16" fill="#e59866"/>
        <circle cx="{84 + shift // 2}" cy="{86 + lift // 2}" r="4" fill="{garnish}" opacity="0.6"/>
        """
    if family == "fish-ball":
        return f"""
        <ellipse cx="90" cy="120" rx="44" ry="10" fill="#d5dbdb"/>
        <path d="M46 90 Q90 128 134 90 L126 124 Q90 140 54 124 Z" fill="{accent}"/>
        <ellipse cx="{74 + shift}" cy="{84 + lift}" rx="12" ry="12" fill="#f5cba7"/>
        <ellipse cx="{90 + shift // 2}" cy="{76 + lift}" rx="12" ry="12" fill="#fad7a0"/>
        <ellipse cx="{108 + shift}" cy="{84 + lift}" rx="12" ry="12" fill="#f5cba7"/>
        <rect x="118" y="58" width="4" height="42" rx="2" fill="#8e5b3a" transform="rotate(18 118 58)"/>
        """
    if family in {"pasta-plate", "dry-noodle-plate", "stir-fried-noodles"}:
        return f"""
        <ellipse cx="90" cy="118" rx="48" ry="12" fill="#d5dbdb"/>
        <ellipse cx="90" cy="96" rx="44" ry="24" fill="#ffffff" stroke="{accent}" stroke-width="4"/>
        <path d="M58 92 Q78 76 98 92 T130 92" stroke="#f5c16c" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M58 102 Q78 86 98 102 T130 102" stroke="#f8c471" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="76" cy="90" r="6" fill="#cb4335"/>
        <circle cx="112" cy="104" r="6" fill="#58d68d"/>
        """
    if family in {"kung-pao-chicken", "tomato-egg-stirfry", "braised-pork", "sweet-sour-pork", "yu-xiang-pork", "twice-cooked-pork", "tofu-dish", "green-bean-stirfry", "lion-head-meatball", "meal-plate"}:
        return f"""
        <ellipse cx="90" cy="120" rx="48" ry="12" fill="#d5dbdb"/>
        <ellipse cx="90" cy="96" rx="44" ry="24" fill="#ffffff" stroke="{accent}" stroke-width="4"/>
        <circle cx="{70 + shift}" cy="{92 + lift}" r="9" fill="#cb4335"/>
        <circle cx="{90 + shift // 2}" cy="{82 + lift}" r="10" fill="#f5b041"/>
        <circle cx="{108 + shift}" cy="{96 + lift}" r="9" fill="{garnish}"/>
        <circle cx="{84 + shift // 3}" cy="{104 + lift // 2}" r="8" fill="#a04000"/>
        <circle cx="{114 + shift}" cy="{82 + lift}" r="7" fill="#f7dc6f"/>
        """
    if family in {"durian-fruit", "melon-fruit"}:
        return f"""
        <path d="M54 120 Q90 52 126 120 Z" fill="{accent_bg}" stroke="{accent}" stroke-width="4"/>
        <circle cx="90" cy="92" r="18" fill="#f7dc6f"/>
        <circle cx="74" cy="104" r="10" fill="#f4d03f"/>
        <circle cx="108" cy="104" r="10" fill="#f4d03f"/>
        """
    if family in {"cake-slice", "croissant", "pastry-puff", "cookie", "egg-tart"}:
        if family == "cookie":
            return f"""
            <circle cx="90" cy="92" r="36" fill="#d2a679"/>
            <circle cx="74" cy="82" r="4" fill="#6e2c00"/>
            <circle cx="102" cy="74" r="4" fill="#6e2c00"/>
            <circle cx="108" cy="102" r="4" fill="#6e2c00"/>
            """
        return f"""
        <path d="M48 114 Q90 56 132 114 Z" fill="{accent_bg}"/>
        <path d="M58 110 Q90 72 122 110 Z" fill="#ffffff" opacity="0.7"/>
        <ellipse cx="90" cy="118" rx="44" ry="10" fill="#d5dbdb"/>
        """
    return f"""
    <rect x="42" y="64" width="96" height="60" rx="18" fill="{accent_bg}" stroke="{accent}" stroke-width="4"/>
    <circle cx="68" cy="86" r="10" fill="#f4d03f"/>
    <circle cx="92" cy="92" r="12" fill="#58d68d"/>
    <circle cx="116" cy="84" r="9" fill="#e67e22"/>
    """


def build_svg(name: str, image_key: str, prefix: str, family: str, tier: str) -> str:
    background, accent_bg, accent = palette_for(prefix, family, tier)
    badge = prefix.upper()[:10] if prefix else tier
    variant_seed = sum((index + 1) * ord(char) for index, char in enumerate(image_key))
    graphic = draw_family(family, accent_bg, accent, variant_seed)
    safe_title = html.escape(f"{name} [{image_key}]")
    safe_badge = html.escape(badge)
    safe_id = html.escape(image_key)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img" aria-labelledby="title desc">
  <title id="title">{safe_title}</title>
  <desc id="desc">Generated local illustration fallback for {safe_id}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{background}"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="28" fill="url(#bg)"/>
  <rect x="18" y="18" width="144" height="24" rx="12" fill="{accent}" opacity="0.14"/>
  <text x="28" y="34" font-family="Arial, sans-serif" font-size="12" fill="{accent}" font-weight="700">{safe_badge}</text>
  {graphic}
  <rect x="18" y="144" width="144" height="18" rx="9" fill="#ffffff" opacity="0.86"/>
  <text x="28" y="157" font-family="Arial, sans-serif" font-size="10" fill="#5d6d7e">{safe_id[:20]}</text>
</svg>
"""


def ensure_asset(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate local food illustration assets.")
    parser.add_argument(
        "--missing-only",
        action="store_true",
        help="Generate only image keys missing from at least one client asset directory.",
    )
    args = parser.parse_args()
    foods = load_foods()
    frontend_assets = list_assets(FRONTEND_ASSET_DIR)
    miniprogram_assets = list_assets(MINIPROGRAM_ASSET_DIR)
    generated = 0
    mirrored = 0
    skipped = 0

    for food in foods:
        name = str(food.get("name", ""))
        category = str(food.get("category", ""))
        brand = food.get("brand") or None
        food_id = food.get("food_id")
        image_key = get_food_image_key_for_food(name, category, brand, food_id)
        semantic_key = get_food_image_key(name, category)
        tier = get_image_refinement_tier(name, category, brand)
        prefix = get_brand_image_prefix(name, brand)
        family = infer_visual_family(name, category, semantic_key)

        frontend_asset = frontend_assets.get(image_key)
        miniprogram_asset = miniprogram_assets.get(image_key)
        if frontend_asset and miniprogram_asset:
            if args.missing_only:
                skipped += 1
                continue
            should_overwrite = tier in {"A", "B"} and frontend_asset.suffix.lower() == ".svg" and miniprogram_asset.suffix.lower() == ".svg"
            if not should_overwrite:
                skipped += 1
                continue

        if frontend_asset and not miniprogram_asset:
            target = MINIPROGRAM_ASSET_DIR / frontend_asset.name
            target.write_bytes(frontend_asset.read_bytes())
            miniprogram_assets[image_key] = target
            mirrored += 1
            continue

        if miniprogram_asset and not frontend_asset:
            target = FRONTEND_ASSET_DIR / miniprogram_asset.name
            target.write_bytes(miniprogram_asset.read_bytes())
            frontend_assets[image_key] = target
            mirrored += 1
            continue

        content = build_svg(name, image_key, prefix, family, tier)
        frontend_target = FRONTEND_ASSET_DIR / f"{image_key}.svg"
        miniprogram_target = MINIPROGRAM_ASSET_DIR / f"{image_key}.svg"
        ensure_asset(frontend_target, content)
        ensure_asset(miniprogram_target, content)
        frontend_assets[image_key] = frontend_target
        miniprogram_assets[image_key] = miniprogram_target
        generated += 1

    print(f"generated={generated} mirrored={mirrored} skipped={skipped}")
    print(f"frontend_assets={len(frontend_assets)} miniprogram_assets={len(miniprogram_assets)}")


if __name__ == "__main__":
    main()
