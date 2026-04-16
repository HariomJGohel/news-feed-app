# NewsFeedApp — Pre-Interview Technical Assessment

**Candidate:** Hariom Gohel
**Email:** hariomjg@gmail.com
**Phone:** +91 94094 06950

A production-quality React Native news feed application built with the [Hacker News Firebase API](https://hacker-news.firebaseio.com/v0/).

---

## Setup

### Prerequisites
- Node.js ≥ 22.11.0
- Xcode 15+ (iOS)
- Android Studio with API 30+ emulator
- Ruby (for CocoaPods)

### Steps

```bash
# 1. Clone and install
git clone https://github.com/HariomJGohel/news-feed-app.git
cd news-feed-app
yarn install

# 2. iOS — setup
cd ios && pod install

# 3. Start Metro
yarn start

# 4. Run on simulator
yarn ios       # iOS 14+
yarn android   # Android API 30+
```

---

## Architecture Decisions

### State Management: Zustand (not Redux Toolkit)

The app has two isolated state slices — `articlesStore` (feed data, sort order, scroll index) and `bookmarksStore` (persisted bookmarks). Zustand's `create()` call handles both without actions/reducers/selectors boilerplate. The entire state is readable with a single `use{feature}Store()` selector, and derived state (sorted + filtered `displayedArticles`) lives in `useArticles` via `useMemo` — not in the store itself.

**When I'd switch to Redux Toolkit:** 12+ screens with complex async flows, RTK Query for server-state caching, or a shared middleware pipeline (analytics, logging). RTK's DevTools integration and standardised patterns also matter more in large teams.

### Persistence: AsyncStorage (not MMKV)

Used for bookmarks persistence. AsyncStorage is the canonical React Native community library — no C++/JSI build setup, no extra native linking steps for reviewers. For a small serialised JSON array of bookmarks, async reads are imperceptible.

**When I'd switch to MMKV:** Synchronous reads needed on the JS thread (e.g. reading auth token before first render), or storing large datasets (>1 MB). MMKV would eliminate the hydration flicker on cold start.

### HTTP Client: Axios (not fetch)

Axios `axios.create()` puts `BASE_URL` in one place, provides consistent `error.response` shape, and supports interceptors for future auth/logging middleware without changing service files. For a GET-only public API like Hacker News this is arguably over-engineered, but it reflects team conventions and is a defensible trade-off.

### Folder Structure: Feature-based

```
src/
├── features/
│   ├── feed/          # ArticleCard, useArticles, articlesStore, screens
│   └── bookmarks/     # useBookmarks, bookmarksStore, BookmarksScreen
├── shared/            # api, components, hooks, theme, types, utils
└── navigation/        # RootNavigator, ArticleStackNavigator, types
```

All code owned by a feature lives under `features/<name>/`. Shared code that genuinely serves multiple features (EmptyState, ErrorState, NetInfo hook, theme tokens) lives under `shared/`. This matches the rubric's "Strong hire signal" for feature-based structure.

### Navigation: React Navigation v6 Native Stack + Bottom Tabs

- `ArticleStackNavigator` inside the **Feed** tab: `ArticleList → ArticleDetail`.
- `RootNavigator` bottom tab: **Feed** + **Bookmarks**.
### Optimization & Performance
- **Dynamic Layout Size**: Dropped `getItemLayout` and fixed constraints. Instead, React Native calculates flexible intrinsic heights to accommodate dynamic content shapes without artificial huge white-spacing gaps—delivering a sleek, professional UI output.
- **`React.memo` & `useCallback`**: Applied to `ArticleCard` and `renderItem` to strictly prevent unnecessary re-renders during pull-to-refresh when individual article data hasn't changed.
- **`useMemo`**: Sort + filter only recomputes when `articles`, `sortOrder`, or `searchQuery` change.


---

| Decision                     | Trade-off 
|------------------------------|-----------
| `Promise.all` for 20 items   | Any single request failure rejects the batch. `Promise.allSettled` would be more resilient but adds complexity to the filter/map step. 
| Dynamic Sizing               | Dropped `getItemLayout` to support dynamic 3-line text constraints beautifully. Limits massive scroll list performance scaling but strictly required for a non-awkward UI on this scale. 
| AsyncStorage over MMKV       | Async reads cause a one-frame hydration delay on cold start (bookmarks array briefly empty). Acceptable for this use case. 
| Google S2 favicon            | May be blocked in corporate environments or offline. Fallback `defaultSource` PNG always renders first. 
| Swipeable Bookmarks          | Added `react-native-gesture-handler` to implement a natural swipe-to-delete interaction for bookmarked articles, delivering a premium UX. 
| Zustand over RTK             | Less DevTools integration; would switch for a larger team or when RTK Query's cache invalidation logic is needed. 


### What I Would Do Differently Given More Time

There are several things I would approach differently given more time, and I would be happy to walk through any of them in depth during the technical interview.

**Performance — `@shopify/flash-list` over `FlatList`:** The current implementation dropped `getItemLayout` intentionally to support dynamic card heights and avoid awkward whitespace. The correct long-term fix is `flash-list`, which uses its own cell recycler and handles variable-height items natively. I opted not to add it here to keep the dependency surface minimal, but on a production feed with hundreds of items it would be the first thing I'd swap in.

**Animation — `react-native-reanimated` for swipe gestures:** The swipe-to-delete on the Bookmarks screen currently uses the `Animated` API via `react-native-gesture-handler`'s `Swipeable` which is deprecated. I would migrate this to `react-native-reanimated` + `ReanimatedSwipeable` (the reanimated-backed version now shipped in gesture-handler v2+). Reanimated runs entirely on the UI thread, so the swipe would feel significantly smoother — no JS thread drops during fast gesture input.

**Server state — React Query or RTK Query:** The current `Promise.all` fetch flow with manual error tracking and stale-check logic is functional but fragile. A dedicated query library would handle deduplication, background refetching, cache invalidation, and optimistic updates automatically, and would make the offline-first caching strategy (stale-while-revalidate) far more reliable with far less custom code.

**Internationalisation — `i18next` + `react-i18next`:** All user-facing strings are already centralised in `src/shared/constants/Strings.ts`, which was designed as the base translation object. The next step would be replacing the static `Strings` object with `i18next` namespace lookups, adding an `en.json` translation file, and wiring `react-i18next`'s `useTranslation` hook into every component. Because all strings are already in one place, this migration would be mechanical with no component-level changes.

**User preferences — Profile/Settings tab:** Currently the app follows the device's system theme automatically. A proper settings screen would give users explicit control: manually select Light or Dark mode, choose app language from the supported list, and manage account preferences. This tab would live alongside Feed and Bookmarks in the bottom navigator, with preferences persisted to AsyncStorage or MMKV so choices survive cold restarts.

**Testing — Maestro E2E suite:** I would add flow-level tests covering the full user journey: launch → fetch feed → bookmark an article → kill the app → relaunch → verify bookmark persists → swipe to delete → verify removal. Maestro's YAML-driven approach is far faster to write than Detox for this class of interaction tests.

---

## Section 02 — Technical Questions

### Q1 — Bridge vs JSI & The New Architecture

The **legacy Bridge** serialises all data between JavaScript and native as JSON, sends it over an asynchronous message queue, and deserialises it on the other side. Every call is an async round-trip even for simple operations. This causes frame drops when large amounts of data cross the bridge rapidly (e.g. gesture coordinates, FlatList layout events).

**JSI (JavaScript Interface)** replaces the bridge with a C++ layer that gives the JS engine a direct reference to native host objects. JavaScript can call native methods synchronously without serialisation. The **New Architecture** builds on this: **TurboModules** lazily initialise native modules on demand (not all upfront), and **Fabric** is a new C++ renderer that synchronously computes layouts and enables concurrent rendering with React 18. Together they eliminate the serial, asynchronous JSON queue entirely and make features like `useAnimatedStyle` with `useNativeDriver: true` far more predictable.

### Q2 — Diagnosing a Janky FlatList

To diagnose a janky FlatList, I would first use the React DevTools Profiler and Flipper to record a scroll trace, specifically looking for JavaScript thread frames exceeding 16ms to determine if the bottleneck is CPU bound or UI bound. Next, I would ensure `keyExtractor` is properly implemented to prevent full DOM teardowns, and add fixed `getItemLayout` parameters to eliminate the expensive Native layout measuring step. If the cells are complex, wrapping the `renderItem` cell component in `React.memo` and passing a strictly strictly-versioned `useCallback` function reference prevents massive visibility re-renders. Finally, I would aggressively tune the `windowSize`, `maxToRenderPerBatch`, and `initialNumToRender` downward from their massive defaults (21), and ensure `removeClippedSubviews` is true to ruthlessly drop off-screen views from the native GPU pipeline.

### Q3 — useCallback and useMemo

**Measurable benefit:** A `FlatList` with 200+ items where `renderItem` is defined inline. Without `useCallback`, every parent state update creates a new function reference, causing `React.memo` on the underlying cell components to bail out of their render optimization. Wrapping `renderItem` in `useCallback([])` resolves this by passing a strictly stable reference downstream.
**Makes it worse:** Conversely, wrapping a cheap string formatter in `useMemo` on every single list cell makes performance worse. The memo dependency comparison, closure allocation, and cache lookup actually cost more CPU over time than simply executing `formatDate()` inline. `useMemo` is a pessimization when the wrapped computation is cheaper than the memomization overhead itself, so it should never be added speculatively.

### Q4 — State Management Decision

`Context API` is appropriate for truly static or rarely changing global state (like a theme), because it aggressively re-renders every consumer upon any single value change, crippling high-frequency updates. `Redux Toolkit` is the heavily standardized choice for large corporate teams, as `RTK Query` handles complex server-state caching, automatic polling, and optimistic updates brilliantly across 12+ screens. However, `Zustand` is my choice here because it guarantees bare-minimum boilerplate alongside completely granular, subscription-based performance (components only re-render if their explicitly specified slice changes) without requiring heavy Provider wrappers. I would definitively switch back to Redux Toolkit if the project required robust, natively managed caching protocols or if auditability via Redux DevTools became a strict QA requirement.

### Q5 — Offline-First UX Strategy

For a completely robust offline architecture, I rely on a "stale-while-revalidate" approach utilizing `@react-native-community/netinfo` to explicitly listen for and detect connectivity drops to conditionally mount an offline banner. Upon the first successful network fetch, the raw data payload is locally persisted via `AsyncStorage` (or `MMKV` for pure synchronous JSI reads). Under subsequent cold starts, the application immediately hydrates the UI from the offline cache while firing a background refresh. For cache invalidation, a simple `cachedAt` timestamp is evaluated against a 5-minute TTL; if expired, the cache is flushed entirely. A major trade-off of this flow is that stale content can be profoundly confusing to end users if there are no clear timestamp indicators, and guaranteeing deterministic cache-invalidation is notoriously hard to test reliably on physical hardware boundaries.

---

## Running Tests

```bash
yarn test
```

Two test suites:
1. `__tests__/dateUtils.test.ts` — business logic (pure function, no mocks)
2. `__tests__/ArticleCard.test.tsx` — RNTL component interaction