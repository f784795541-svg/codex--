from __future__ import annotations

import pytest

from conftest import api_request, query_string


SEARCH_CASES = [
    ("M记 双吉", "麦当劳"),
    ("麦当劳 双吉", "麦当劳"),
    ("KFC 鸡排", "鸡排"),
    ("711 饭团", "饭团"),
    ("罗森 饭团", "罗森"),
    ("瑞幸 生椰", "瑞幸"),
    ("星巴克 星冰乐", "星巴克"),
    ("霸王茶姬 伯牙", "霸王茶姬"),
    ("必胜客 披萨", "必胜客"),
    ("米村 炸鸡", "米村"),
]

THIRD_BATCH_SEARCH_CASES = [
    ("汉堡王 皇堡", "汉堡王"),
    ("汉堡王 薯霸王", "薯霸王"),
    ("华莱士 鸡腿堡", "华莱士"),
    ("华莱士 手扒鸡", "华莱士"),
    ("必胜客 夏威夷 披萨", "夏威夷"),
    ("必胜客 牛肉意面", "黑椒牛肉意面"),
    ("麦当劳 香芋派", "香芋派"),
    ("肯德基 原味鸡 1块", "吮指原味鸡"),
    ("KFC 鸡排饭", "香辣鸡排饭"),
    ("瑞幸 厚乳", "厚乳拿铁"),
    ("瑞幸 椰云", "椰云拿铁"),
    ("瑞幸 橙C", "橙C美式"),
    ("星巴克 抹茶星冰乐", "抹茶星冰乐"),
    ("星巴克 冷萃", "冷萃咖啡"),
    ("蜜雪 柠檬水", "冰鲜柠檬水"),
    ("蜜雪 珍珠奶茶", "珍珠奶茶"),
    ("茶百道 豆乳玉麒麟", "豆乳玉麒麟"),
    ("古茗 芝士葡萄", "芝士葡萄"),
    ("霸王茶姬 万里木兰", "万里木兰"),
    ("711 烤肠饭团", "烤肠芝士饭团"),
    ("7-11 黑椒鸡扒便当", "黑椒鸡扒便当"),
    ("罗森 提拉米苏", "提拉米苏杯"),
    ("全家 韩式泡菜饭团", "韩式泡菜饭团"),
    ("盒马 鸡胸便当", "香煎鸡胸便当"),
    ("山姆 牛肉卷", "牛肉卷"),
    ("早餐 鲜肉包", "鲜肉包"),
    ("早餐 油条", "油条"),
    ("鸡蛋灌饼 火腿", "鸡蛋灌饼"),
    ("家常 红烧肉", "红烧肉"),
    ("家常 麻婆豆腐", "麻婆豆腐"),
    ("夜宵 烤鸡翅", "烤鸡翅中"),
    ("烤玉米", "烤玉米"),
    ("麻辣烫 鱼豆腐", "鱼豆腐"),
    ("基础水果 榴莲", "榴莲"),
    ("沙拉酱", "沙拉酱"),
    ("基础肉类 猪肝", "猪肝"),
]


@pytest.mark.parametrize(("keyword", "expected_text"), SEARCH_CASES)
def test_required_food_search_cases(keyword, expected_text):
    params = query_string({"q": keyword, "limit": 5, "platform": "pytest"})
    results = api_request("GET", f"/food/search?{params}")
    assert results, f"Expected at least one result for {keyword}"
    joined = " ".join(item["name"] for item in results)
    assert expected_text in joined


@pytest.mark.parametrize(("keyword", "expected_text"), THIRD_BATCH_SEARCH_CASES)
def test_third_batch_food_search_cases(keyword, expected_text):
    params = query_string({"q": keyword, "limit": 8, "platform": "pytest"})
    results = api_request("GET", f"/food/search?{params}")
    assert results, f"Expected at least one result for {keyword}"
    joined = " ".join(item["name"] for item in results)
    assert expected_text in joined


def test_food_search_selection_is_recorded(registered_user):
    token = registered_user["token"]
    params = query_string({"q": "瑞幸 生椰", "limit": 1, "platform": "pytest"})
    results = api_request("GET", f"/food/search?{params}", token=token)
    assert results
    response = api_request(
        "POST",
        "/food/search/selection",
        {
            "query": "瑞幸 生椰",
            "food_id": results[0]["food_id"],
            "platform": "pytest",
            "user_id": registered_user["user"]["id"],
        },
        token=token,
    )
    assert response["food_id"] == results[0]["food_id"]
