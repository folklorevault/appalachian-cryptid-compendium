## 2023-11-20 - Optimizing typing responsiveness for search filters
**Learning:** For React client components where user input instantly filters large data grids (such as the cryptid or anomaly filter pages), filtering directly from the `searchQuery` state blocks the main thread causing high INP (Interaction to Next Paint) as users type.
**Action:** Use `useDeferredValue` for the search query and perform filtering based on the deferred value in `useMemo`. This keeps the UI responsive during fast typing, delaying the heavy re-render until the main thread has time.

## 2024-03-20 - Preventing unnecessary child component re-renders
**Learning:** Even with deferred values managing the parent filtering logic in grid layouts (`AnomalyFilters.tsx`, `CryptidFilters.tsx`), mapping over arrays to display UI components like `CasefileCard` triggers re-renders for every single card on screen whenever the parent component state changes—even if the card props haven't changed.
**Action:** Wrap heavily-repeated child components in list/grid views like `CasefileCard` with `React.memo()`. This tells React to skip rendering the component if its props haven't changed, reducing render times and further improving responsiveness during state changes like search filtering.
## 2024-10-18 - Memoize JSX generation for lists to prevent React rendering overhead during fast typing
**Learning:** Just memoizing `CasefileCard` with `React.memo` is not always sufficient if the parent component maps and recreates the list elements on every render. During text input, such as the search functionality, the parent component re-renders constantly which causes overhead.
**Action:** Memoize not just the data arrays (`visibleCryptids`, `drawers`) but also the rendered JSX elements (`visibleDrawerCards`) using `useMemo`. This allows React to entirely skip rendering the mapped child components while the user types, until the deferred query updates.
