# Food Real Photo Batch 4 Summary

## Scope

- Goal: unblock live runtime search results for `711 饭团` and `罗森 饭团`.
- Batch completed: 7-11 kimchi beef onigiri, 7-11 sausage cheese onigiri, 7-11 Orleans chicken onigiri, Lawson sausage onigiri, Lawson chicken cutlet onigiri, Lawson tuna onigiri.

## Newly Verified Real Photo Keys

- `711-611` -> live runtime key for `7-11 泡菜肥牛饭团`
- `711-685` -> live runtime key for `7-11 烤肠芝士饭团`
- `711-610` -> live runtime key for `7-11 奥尔良鸡腿饭团`
- `lawson-689` -> live runtime key for `罗森 烤肠饭团`
- `lawson-617` -> live runtime key for `罗森 照烧鸡排饭团`
- `lawson-232` -> live runtime key for `罗森 金枪鱼饭团`

## Source Notes

- `lawson-689`, `lawson-617`, `lawson-232` use Lawson public product covers.
- `711-611`, `711-685`, `711-610` use Lawson public product covers as closest near-product real photos because stable 7-11 public product packshots were not available from the current reachable public sources.
- The asset pipeline now supports optional `source_referer` and `source_cache_path` so official public images that are hotlink-sensitive can still be normalized reproducibly.

## Runtime Notes

- Frontend and miniprogram manifests now map these six keys to `.webp`.
- Real photo manifest count increased from `17` to `23`.
- Audit summary now reports `Image keys using local real photos: 21`; the gap versus manifest count is expected because some cached real-photo assets are not yet counted by the foods audit surface.
