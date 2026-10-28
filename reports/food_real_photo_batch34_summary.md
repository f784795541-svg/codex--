# 食物真实图片治理批次 34

日期：2026-08-31

## 处理目标

继续清理罗森 P0 fallback，同时对历史候选图执行语义复核，避免文件名与实际食物不一致。

## 已交付条目

- `lawson-639`：关东煮萝卜
- `lawson-640`：冰皮月亮蛋糕
- `lawson-638`：烤肠
- `lawson-712`：提拉米苏杯

四个条目均已生成并同步 750×750 WebP，图片抽检与名称语义一致。

## 语义纠偏

复核发现两个历史候选文件实际内容与文件名不符：

- `lawson-589_chocolate_croissant.jpeg` 实际为抹茶卷。
- `lawson-593_matcha_roll.jpeg` 实际为巧克力甜点。

已将涉及的 `lawson-589`、`lawson-593`、`lawson-609`、`lawson-613` manifest 恢复为 SVG fallback，并把台账状态改为 `fallback_only/unverified`；错误 WebP 已移入 `reports/quarantine_wrong_assets/`，不再被运行时引用。

## 门禁结果

- manifest：841 / 841
- 实际资源：841 / 841
- 缺失文件：0
- 超大文件：0
- failures：0
- 图片审计 high risk：0
- backlog：323 条（P0 67、P1 133、P2 123）

后续继续寻找真正的巧克力可颂、抹茶蛋糕卷来源，确认前不使用相近甜点替代。
