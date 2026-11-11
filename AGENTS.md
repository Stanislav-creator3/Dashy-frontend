# AGENTS.md

Dashy ("Dashly" in the UI): Notion-like workspace frontend — Next.js 16 App Router, React 19, TanStack Query v5, Zustand, Lexical, Tailwind v4. All UI copy, error messages and story titles are in Russian; keep new strings Russian.

## Rules
- Never `git push`; ask before `git commit`; don't read `.env*` files (mirrors the owner's `.claude/settings.local.json`).
- Branch off `develop` as `feature/<name>`; features merge into `develop` (`main` lags behind it).

## Run & verify
- `npm run dev` needs the API at `http://localhost:4000` — `BASE_API_URL` is hard-coded in `src/shared/config/api.ts`, not an env var. Backend is the sibling NestJS repo `../Dashy-Backend` (Postgres + Redis from its `docker-compose.yml`, then `npm run start:dev`); read its controllers/DTOs when an API shape is unclear.
- `.env` is gitignored with no example file; the only var is `NEXT_PUBLIC_MEDIA_URL`, the prefix for backend-relative media paths (`src/shared/utils/get-media-source.ts`).
- Typecheck with `npx tsc --noEmit`. `next build` won't catch type errors (`ignoreBuildErrors: true` in `next.config.ts`) and the baseline already has ~60 errors in untouched files, so judge only the files you changed.
- Lint is broken: `npm run lint` runs `next lint` (removed in Next 16), and `npx eslint src` crashes because `eslint.config.mjs` passes an object to `compat.extends()`. Don't report lint as passing.
- There is no `npm test`. The only tests are Storybook stories run through Vitest browser mode: `npx playwright install chromium` once, then `npx vitest run --project=storybook [path/to/X.stories.tsx]`. `npm run storybook` serves on :6006.
- Prettier is not a dependency (VS Code applies `.prettierrc` on save) and many files aren't Prettier-clean: format only files you touch, never the whole repo.

## Architecture
- Feature-Sliced Design in `src/`: `app` (routes) → `widgets` → `features` → `entities` → `shared`; import downward only. ~30 legacy upward imports exist (e.g. `shared/utils/*` → `@/widgets/sidebar/model/types`); don't add more. Widgets, features and `@/shared/ui` expose `index.ts` barrels; entities have none (import files directly).
- Auth is the backend's `session` cookie. `src/proxy.ts` (Next 16's replacement for `middleware.ts` — don't create one) redirects to `/account/login` without it.
- API layer: each slice's `api/*.api.ts` exports an object of `queryOptions({ queryKey: [KEYS_API.X, ...] })` factories for reads and plain async functions for mutations, using raw `fetch` + `credentials: "include"` (no shared client). New resources get a key in `KEYS_API` (`src/shared/config/api.ts`); React Query hooks live in `hooks/use-*.ts`.
- `credentials: "include"` does nothing in server components: authenticated server fetches must forward `cookies()` by hand (see `getPage` in `src/app/projects/[id]/pages/[pageId]/page.tsx`).
- Get the client via `useQueryClient()`. `src/shared/api/queryClient.ts` is an unused second instance; invalidating it never reaches the UI (the real one is created in `src/shared/api/Provider.tsx`).
- Route modals are parallel-route slots `src/app/@modal*/` holding intercepting `(.)projects/...` pages. A new slot needs `default.tsx` and `[...catchAll]/page.tsx` that return `null`, plus a prop rendered in `src/app/layout.tsx`; hard loads render the real route under `src/app/projects/...`.
- shadcn (`components.json`) generates into `src/shared/radixUi/ui`, but its `utils` alias `@/shared/radixUi/lib/radixUtils` doesn't exist — import `cn` from `@/lib/utils` there (like `avatar.tsx`). Most code uses the identical `cn` from `@/shared/utils/utils`. `src/components/ui/button.tsx` is an unused leftover; use `@/shared/ui`.
- Styling: Tailwind v4 CSS-first, no `tailwind.config`. Theme tokens are CSS vars in `src/app/styles/globals.css` (`:root` + `.dark`, exposed via `@theme inline`); use `text-text`, `bg-editor`, `bg-background`, `var(--color-…)` rather than raw palette colors so dark mode works (`.dark` on `<html>`, from `localStorage.theme`).
- Library APIs differ from common defaults: DnD is `@dnd-kit/react` 0.5 (`@dnd-kit/core`/`sortable` aren't installed), animation is `motion/react`, Radix comes from the unified `radix-ui` package, zod is v4. Keep `lexical` and every `@lexical/*` on the same version (0.38.2; `@lexical/react` is pinned exactly).

## Block editor (`src/features/editor`)
- Built on the Lexical Extension API: nodes, theme and extensions are registered in `EditorExtension` in `ui/BlockEditor.tsx`, which also mounts every plugin. Dead code — don't edit or import: `model/editor.config.ts`, `model/editor.ts` (stale `BlockType`), `hooks/useBlocks.ts`, `plugins/ToolbarPlugin.tsx`, `BLOCK_TYPES`/`BLOCK_CONFIGS` in `model/block.types.ts`.
- Each top-level element/decorator node is one backend block. Its `blockId`, `blockTempId`, `blockOrder` and `parentBlockId` live in Lexical NodeState (`model/blockState.ts`, helpers in `utils/nodeId.ts`). New blocks get a `temp-…` id (`utils/createTempId.ts`); the save response's `created[{ tempId, id }]` assigns real ids.
- Saving is implicit: `BlocksUpdatePlugin` re-serializes changed blocks (`serializeBlock`) and saves them debounced (400 ms); `BlockDeletePlugin` deletes on the server any non-temp block id that vanishes from the tree. Both skip updates tagged `"from-backend"`, so use `editor.update(fn, { tag: "from-backend" })` for changes that must not be persisted.
- When replacing a block node (type change, markdown shortcut, …) copy that metadata onto the new node (`replaceNodePreservingId`, or the setters in `getNode` in `utils/slashItems.ts`); otherwise the block is deleted server-side and the replacement is never saved.
- A new block type touches: the node class (`nodes/`, or a sub-folder like `board/`, `image/`), `EditorExtension.nodes`, the `IBlock` union (`model/block.types.ts`), `serializeBlock` (`model/blockSerializer.ts`), `buildBlockNode` (`utils/buildBlockNode.ts`), and `SLASH_COMMANDS` + `getNode` (`utils/slashItems.ts`).

## Storybook stories
- MSW runs with `onUnhandledRequest: "error"` (`.storybook/preview.tsx`): mock every request in `parameters.msw.handlers` using `${BASE_API_URL}/...` URLs. Components using `next/navigation` need `parameters.nextjs.appDirectory: true` plus `navigation` params — see `src/widgets/recentPagesCarousel/ui/RecentPagesCarousel.stories.tsx`.
