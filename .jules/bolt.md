## 2023-11-20 - Optimizing typing responsiveness for search filters
**Learning:** For React client components where user input instantly filters large data grids (such as the cryptid or anomaly filter pages), filtering directly from the `searchQuery` state blocks the main thread causing high INP (Interaction to Next Paint) as users type.
**Action:** Use `useDeferredValue` for the search query and perform filtering based on the deferred value in `useMemo`. This keeps the UI responsive during fast typing, delaying the heavy re-render until the main thread has time.

## 2024-03-20 - Preventing unnecessary child component re-renders
**Learning:** Even with deferred values managing the parent filtering logic in grid layouts (`AnomalyFilters.tsx`, `CryptidFilters.tsx`), mapping over arrays to display UI components like `CasefileCard` triggers re-renders for every single card on screen whenever the parent component state changes—even if the card props haven't changed.
**Action:** Wrap heavily-repeated child components in list/grid views like `CasefileCard` with `React.memo()`. This tells React to skip rendering the component if its props haven't changed, reducing render times and further improving responsiveness during state changes like search filtering.

## 2024-05-18 - Optimizing heavy inline list renders connected to a parent selection state
**Learning:** In a list of many items where clicking an item sets a global `selectedKey` that modifies styles on the selected and previously selected items (like `SightingDistribution.tsx`), keeping the `<li>` mapped directly inside the parent component means *every* list item re-renders when the selection changes, causing the main thread to lag.
**Action:** Extract the `<li>` into a separate `React.memo`'d component (e.g., `SightingListItem`). This way, only the two items whose `active` props actually change (the old selection and the new selection) will re-render, keeping the UI fast and responsive.

## 2024-05-24 - Avoiding unnecessary inline array mapping
**Learning:** In components with deeply nested mapping (e.g. mapping drawers, then mapping cards), inline mapping functions can trigger massive re-renders when parent state updates independently (like `searchQuery` when using `useDeferredValue`).
**Action:** Memoize complex grid transformations and component rendering maps using `useMemo` so React skips recreating VDOM for untouched children, dramatically reducing INP.

## 2024-09-26 - Preventing O(n) list re-renders on row hover states
**Learning:** In table-like lists (e.g. `BulletinLedger.tsx`), passing an inline callback to track hovered rows (`onHover={() => setHoveredRow(id)}`) means the callback's reference changes on every render. Even worse, if the row components aren't memoized, updating a single hovered row causes *every single row* in the list to re-render.
**Action:** Wrap the row component in `React.memo()`, pass a stable `useCallback` down from the parent, and let the child row supply its own ID to the handler (`onHover={() => onHover(id)}` inside the memoized child). This ensures that only the previously hovered row and newly hovered row re-render.
