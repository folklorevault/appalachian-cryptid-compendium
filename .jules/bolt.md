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
