from __future__ import annotations

import pytest

from app.database import SessionLocal
from app.models import FoodDatabase
from app.services import serialize_food
from conftest import api_request, query_string


IMAGE_KEY_CASES = [
    ("麦当劳 巨无霸", "麦当劳 巨无霸", "mcd-138"),
    ("麦当劳 中薯条", "麦当劳 中薯条", "mcd-140"),
    ("麦当劳 麦辣鸡腿堡", "麦当劳 麦辣鸡腿堡", "mcd-141"),
    ("麦当劳 双层吉士汉堡", "麦当劳 双层吉士汉堡", "mcd-*"),
    ("麦当劳 麦乐鸡块 4块", "麦当劳 麦乐鸡块 4块", "mcd-143"),
    ("麦当劳 麦乐鸡块 10块", "麦当劳 麦乐鸡块 10块", "mcd-144"),
    ("麦当劳 麦香鸡", "麦当劳 麦香鸡", "mcd-145"),
    ("肯德基 香辣鸡翅 2块", "肯德基 香辣鸡翅 2块", "kfc-*"),
    ("米村拌饭 韩式炸鸡", "米村拌饭 韩式炸鸡", "micun-*"),
    ("玉米油", "玉米油", "corn-oil-bottle"),
    ("烤玉米", "烤玉米", "dish-*"),
    ("7-11 金枪鱼饭团", "7-11 金枪鱼饭团", "711-*"),
    ("罗森 金枪鱼饭团", "罗森 金枪鱼饭团", "lawson-*"),
    ("必胜客 超级至尊披萨 普通装", "必胜客 超级至尊披萨 普通装", "pizzahut-*"),
    ("汉堡王 皇堡", "汉堡王 皇堡", "burgerking-*"),
    ("汉堡王 薯霸王", "汉堡王 薯霸王", "burgerking-*"),
    ("瑞幸 生椰拿铁 标准杯", "瑞幸 生椰拿铁 标准杯", "luckin-*"),
    ("星巴克 星冰乐 摩卡风味中杯", "星巴克 星冰乐 摩卡风味中杯", "starbucks-*"),
    ("霸王茶姬 伯牙绝弦", "霸王茶姬 伯牙绝弦", "chagee-*"),
    ("肯德基 葡式蛋挞", "肯德基 葡式蛋挞", "kfc-*"),
    ("麦当劳 麦辣鸡翅", "麦当劳 麦辣鸡翅", "mcd-142"),
    ("麦当劳 苹果派", "麦当劳 苹果派", "mcd-146"),
    ("麦当劳 奥利奥麦旋风", "麦当劳 奥利奥麦旋风", "mcd-150"),
    ("麦当劳 热巧克力新地", "麦当劳 热巧克力新地", "mcd-151"),
    ("麦当劳 猪柳蛋麦满分", "麦当劳 猪柳蛋麦满分", "mcd-152"),
    ("麦当劳 脆薯饼", "麦当劳 脆薯饼", "mcd-149"),
    ("味千拉面 冰绿茶", "味千拉面 冰绿茶", "ajisen-*"),
    ("康师傅 冰红茶", "康师傅 冰红茶", "masterkong-*"),
    ("鸡蛋灌饼", "鸡蛋灌饼", "chinese-flatbread"),
    ("鸭血粉丝汤", "鸭血粉丝汤", "soup-bowl"),
    ("蘑菇汤", "蘑菇汤", "soup-bowl"),
    ("北冰洋橙汽水", "北冰洋橙汽水", "orange-soda"),
    ("麻辣烫", "麻辣烫", "dish-*"),
    ("鱼豆腐", "鱼豆腐", "dish-*"),
    ("红烧肉", "红烧肉", "dish-*"),
    ("锅包肉", "锅包肉", "dish-*"),
    ("基础水果 榴莲", "基础水果 榴莲", "durian-fruit"),
    ("青岛啤酒 经典10度", "青岛啤酒 经典10度", "tsingtao-*"),
    ("茅台 53度飞天", "茅台 53度飞天", "maotai-*"),
    ("重庆小面", "重庆小面", "spicy-noodle-bowl"),
    ("桂林米粉", "桂林米粉", "rice-noodle-bowl"),
    ("热干面", "热干面", "dry-noodle-plate"),
    ("鱼香肉丝", "鱼香肉丝", "dish-*"),
    ("回锅肉", "回锅肉", "dish-*"),
    ("毛血旺", "毛血旺", "dish-*"),
    ("红烧狮子头", "红烧狮子头", "dish-*"),
    ("哈密瓜", "哈密瓜", "melon-fruit"),
    ("椰子水", "椰子水", "coconut-water"),
    ("红牛 维生素牛磺酸饮料", "红牛 维生素牛磺酸饮料", "redbull-*"),
    ("\u7f57\u68ee \u6d77\u82d4\u8089\u677e\u996d\u56e2", "\u7f57\u68ee \u6d77\u82d4\u8089\u677e\u996d\u56e2", "lawson-523"),
    ("\u7f57\u68ee \u5965\u5c14\u826f\u9e21\u8089\u5377", "\u7f57\u68ee \u5965\u5c14\u826f\u9e21\u8089\u5377", "lawson-616"),
    ("\u7f57\u68ee \u6c99\u62c9\u9e21\u80f8\u8089", "\u7f57\u68ee \u6c99\u62c9\u9e21\u80f8\u8089", "lawson-231"),
    ("\u7f57\u68ee \u53cc\u86cb\u706b\u817f\u4e09\u660e\u6cbb", "\u7f57\u68ee \u53cc\u86cb\u706b\u817f\u4e09\u660e\u6cbb", "lawson-690"),
    ("\u7f57\u68ee \u5168\u9ea6\u9e21\u86cb\u4e09\u660e\u6cbb", "\u7f57\u68ee \u5168\u9ea6\u9e21\u86cb\u4e09\u660e\u6cbb", "lawson-233"),
    ("\u7f57\u68ee \u9e21\u80f8\u8089\u6c99\u62c9", "\u7f57\u68ee \u9e21\u80f8\u8089\u6c99\u62c9", "lawson-522"),
    ("\u7f57\u68ee \u65e5\u5f0f\u7167\u70e7\u9e21\u817f\u4fbf\u5f53", "\u7f57\u68ee \u65e5\u5f0f\u7167\u70e7\u9e21\u817f\u4fbf\u5f53", "lawson-420"),
    ("\u7f57\u68ee \u70e4\u80a0", "\u7f57\u68ee \u70e4\u80a0", "lawson-618"),
    ("\u7f57\u68ee \u5173\u4e1c\u716e\u841d\u535c", "\u7f57\u68ee \u5173\u4e1c\u716e\u841d\u535c", "lawson-619"),
    ("\u7f57\u68ee \u5173\u4e1c\u716e\u6d77\u5e26\u7ed3", "\u7f57\u68ee \u5173\u4e1c\u716e\u6d77\u5e26\u7ed3", "lawson-421"),
    ("\u7f57\u68ee \u5173\u4e1c\u716e\u9b54\u828b\u7ed3", "\u7f57\u68ee \u5173\u4e1c\u716e\u9b54\u828b\u7ed3", "lawson-524"),
    ("\u7f57\u68ee \u5173\u4e1c\u716e\u9c7c\u8c46\u8150", "\u7f57\u68ee \u5173\u4e1c\u716e\u9c7c\u8c46\u8150", "lawson-525"),
    ("\u7f57\u68ee \u51b0\u7f8e\u5f0f\u5496\u5561", "\u7f57\u68ee \u51b0\u7f8e\u5f0f\u5496\u5561", "lawson-590"),
    ("\u7f57\u68ee \u65e0\u7cd6\u8309\u8389\u82b1\u8336", "\u7f57\u68ee \u65e0\u7cd6\u8309\u8389\u82b1\u8336", "lawson-621"),
    ("\u7f57\u68ee \u8336\u53f6\u86cb", "\u7f57\u68ee \u8336\u53f6\u86cb", "lawson-234"),
    ("\u7f57\u68ee \u65e0\u7cd6\u8c46\u6d46", "\u7f57\u68ee \u65e0\u7cd6\u8c46\u6d46", "lawson-235"),
    ("\u7f57\u68ee \u51b0\u76ae\u6708\u4eae\u86cb\u7cd5", "\u7f57\u68ee \u51b0\u76ae\u6708\u4eae\u86cb\u7cd5", "lawson-620"),
    ("\u7f57\u68ee \u5de7\u514b\u529b\u53ef\u9882", "\u7f57\u68ee \u5de7\u514b\u529b\u53ef\u9882", "lawson-589"),
    ("\u7f57\u68ee \u62b9\u8336\u86cb\u7cd5\u5377", "\u7f57\u68ee \u62b9\u8336\u86cb\u7cd5\u5377", "lawson-593"),
    ("\u7f57\u68ee \u63d0\u62c9\u7c73\u82cf\u676f", "\u7f57\u68ee \u63d0\u62c9\u7c73\u82cf\u676f", "lawson-692"),
    ("\u7f57\u68ee \u5496\u55b1\u9e21\u6392\u4fbf\u5f53", "\u7f57\u68ee \u5496\u55b1\u9e21\u6392\u4fbf\u5f53", "lawson-691"),
    ("\u5168\u5bb6 \u6c99\u62c9\u9e21\u80f8\u8089", "\u5168\u5bb6 \u6c99\u62c9\u9e21\u80f8\u8089", "familymart-226"),
    ("\u5168\u5bb6 \u65e0\u7cd6\u9178\u5976", "\u5168\u5bb6 \u65e0\u7cd6\u9178\u5976", "familymart-230"),
    ("\u5168\u5bb6 \u9e21\u8089\u5377", "\u5168\u5bb6 \u9e21\u8089\u5377", "familymart-229"),
    ("\u5168\u5bb6 \u5965\u5c14\u826f\u9e21\u8089\u5377", "\u5168\u5bb6 \u5965\u5c14\u826f\u9e21\u8089\u5377", "familymart-416"),
    ("\u5168\u5bb6 \u5173\u4e1c\u716e\u841d\u535c", "\u5168\u5bb6 \u5173\u4e1c\u716e\u841d\u535c", "familymart-228"),
    ("\u5168\u5bb6 \u5173\u4e1c\u716e\u9c7c\u8c46\u8150", "\u5168\u5bb6 \u5173\u4e1c\u716e\u9c7c\u8c46\u8150", "familymart-521"),
    ("\u5168\u5bb6 \u4f4e\u7cd6\u9e21\u80f8\u8089\u6c99\u62c9", "\u5168\u5bb6 \u4f4e\u7cd6\u9e21\u80f8\u8089\u6c99\u62c9", "familymart-417"),
    ("\u5168\u5bb6 \u4f4e\u7cd6\u5e0c\u814a\u9178\u5976", "\u5168\u5bb6 \u4f4e\u7cd6\u5e0c\u814a\u9178\u5976", "familymart-587"),
    ("\u5168\u5bb6 \u51b0\u62ff\u94c1", "\u5168\u5bb6 \u51b0\u62ff\u94c1", "familymart-591"),
    ("\u5168\u5bb6 \u5965\u5c14\u826f\u9e21\u6392\u4fbf\u5f53", "\u5168\u5bb6 \u5965\u5c14\u826f\u9e21\u6392\u4fbf\u5f53", "familymart-694"),
    ("\u5168\u5bb6 \u9ed1\u6912\u725b\u8089\u4fbf\u5f53", "\u5168\u5bb6 \u9ed1\u6912\u725b\u8089\u4fbf\u5f53", "familymart-520"),
    ("\u5168\u5bb6 \u62b9\u8336\u7ea2\u8c46\u5377", "\u5168\u5bb6 \u62b9\u8336\u7ea2\u8c46\u5377", "familymart-695"),
    ("\u5168\u5bb6 \u9999\u8471\u8089\u677e\u9762\u5305", "\u5168\u5bb6 \u9999\u8471\u8089\u677e\u9762\u5305", "familymart-588"),
    ("\u5168\u5bb6 \u5173\u4e1c\u716e\u8d21\u4e38", "\u5168\u5bb6 \u5173\u4e1c\u716e\u8d21\u4e38", "familymart-696"),
    ("7-11 \u5173\u4e1c\u716e\u6d77\u5e26\u7ed3", "7-11 \u5173\u4e1c\u716e\u6d77\u5e26\u7ed3", "711-413"),
    ("7-11 \u5173\u4e1c\u716e\u9b54\u828b\u7ed3", "7-11 \u5173\u4e1c\u716e\u9b54\u828b\u7ed3", "711-414"),
    ("7-11 \u5173\u4e1c\u716e\u9c7c\u8c46\u8150", "7-11 \u5173\u4e1c\u716e\u9c7c\u8c46\u8150", "711-415"),
    ("7-11 \u4f4e\u7cd6\u8c46\u6d46", "7-11 \u4f4e\u7cd6\u8c46\u6d46", "711-224"),
    ("7-11 \u4f4e\u7cd6\u5e0c\u814a\u9178\u5976", "7-11 \u4f4e\u7cd6\u5e0c\u814a\u9178\u5976", "711-586"),
    ("7-11 \u4f4e\u8102\u5e0c\u814a\u9178\u5976\u676f", "7-11 \u4f4e\u8102\u5e0c\u814a\u9178\u5976\u676f", "711-688"),
    ("7-11 \u5168\u9ea6\u706b\u817f\u86cb\u4e09\u660e\u6cbb", "7-11 \u5168\u9ea6\u706b\u817f\u86cb\u4e09\u660e\u6cbb", "711-225"),
    ("7-11 \u5168\u9ea6\u9e21\u80f8\u4e09\u660e\u6cbb", "7-11 \u5168\u9ea6\u9e21\u80f8\u4e09\u660e\u6cbb", "711-584"),
    ("7-11 \u51b0\u7f8e\u5f0f\u5496\u5561", "7-11 \u51b0\u7f8e\u5f0f\u5496\u5561", "711-592"),
    ("7-11 \u5373\u98df\u9e21\u80f8\u8089", "7-11 \u5373\u98df\u9e21\u80f8\u8089", "711-221"),
    ("7-11 \u91d1\u67aa\u9c7c\u996d\u56e2", "7-11 \u91d1\u67aa\u9c7c\u996d\u56e2", "711-222"),
    ("7-11 \u8336\u53f6\u86cb", "7-11 \u8336\u53f6\u86cb", "711-223"),
    ("7-11 \u7167\u70e7\u9e21\u817f\u4fbf\u5f53", "7-11 \u7167\u70e7\u9e21\u817f\u4fbf\u5f53", "711-411"),
    ("7-11 \u9e21\u80f8\u8089\u6c99\u62c9", "7-11 \u9e21\u80f8\u8089\u6c99\u62c9", "711-412"),
    ("7-11 \u539a\u5207\u706b\u817f\u4e09\u660e\u6cbb", "7-11 \u539a\u5207\u706b\u817f\u4e09\u660e\u6cbb", "711-518"),
    ("7-11 \u9ed1\u6912\u725b\u8089\u610f\u9762", "7-11 \u9ed1\u6912\u725b\u8089\u610f\u9762", "711-613"),
    ("7-11 \u65e0\u7cd6\u4e4c\u9f99\u8336", "7-11 \u65e0\u7cd6\u4e4c\u9f99\u8336", "711-615"),
    ("7-11 \u6d77\u82d4\u8089\u677e\u996d\u56e2", "7-11 \u6d77\u82d4\u8089\u677e\u996d\u56e2", "711-585"),
    ("7-11 \u91d1\u67aa\u9c7c\u4e09\u660e\u6cbb", "7-11 \u91d1\u67aa\u9c7c\u4e09\u660e\u6cbb", "711-612"),
    ("7-11 \u9e21\u80f8\u8089\u51ef\u6492\u5377", "7-11 \u9e21\u80f8\u8089\u51ef\u6492\u5377", "711-686"),
    ("\u7f57\u68ee \u706b\u817f\u9e21\u86cb\u4e09\u660e\u6cbb", "\u7f57\u68ee \u706b\u817f\u9e21\u86cb\u4e09\u660e\u6cbb", "lawson-419"),
    ("\u4e1c\u9e4f\u7279\u996e", "\u4e1c\u9e4f\u7279\u996e", "dongpeng-407"),
]


@pytest.mark.parametrize(("keyword", "expected_name", "expected_image_key"), IMAGE_KEY_CASES)
def test_high_risk_food_search_image_keys(keyword, expected_name, expected_image_key):
    params = query_string({"q": keyword, "limit": 8, "platform": "pytest"})
    results = api_request("GET", f"/food/search?{params}")
    assert results, f"Expected at least one result for {keyword}"

    matching = [item for item in results if item["name"] == expected_name]
    if not matching:
        matching = [item for item in results if expected_name in item["name"]]
    assert matching, f"Expected a result containing {expected_name} for {keyword}: {[item['name'] for item in results]}"
    if expected_image_key.endswith("*"):
        assert matching[0]["image_key"].startswith(expected_image_key[:-1])
    else:
        assert matching[0]["image_key"] == expected_image_key


def test_product_level_image_key_count_is_expanded():
    db = SessionLocal()
    try:
        foods = db.query(FoodDatabase).order_by(FoodDatabase.food_id).all()
        serialized = [serialize_food(food) for food in foods]
    finally:
        db.close()

    unique_keys = {item["image_key"] for item in serialized}
    assert len(unique_keys) >= 260


def test_chicken_cutlet_results_are_split_to_product_level_keys():
    params = query_string({"q": "鸡排", "limit": 8, "platform": "pytest"})
    results = api_request("GET", f"/food/search?{params}")
    cutlet_results = [item for item in results if "鸡排" in item["name"]]
    assert cutlet_results
    unique_keys = {item["image_key"] for item in cutlet_results}
    assert len(unique_keys) >= 4
    assert "chicken-cutlet" not in unique_keys
    assert "meal" not in unique_keys
    assert "chicken" not in unique_keys


def test_food_image_keys_are_consistent_across_client_platforms():
    platform_results = []
    for platform in ("web", "mobile_web", "miniprogram"):
        params = query_string({"q": "鸡排", "limit": 5, "platform": platform})
        platform_results.append(api_request("GET", f"/food/search?{params}"))

    first_ids = [[item["food_id"] for item in results] for results in platform_results]
    first_keys = [[item["image_key"] for item in results] for results in platform_results]
    assert first_ids[0] == first_ids[1] == first_ids[2]
    assert first_keys[0] == first_keys[1] == first_keys[2]
