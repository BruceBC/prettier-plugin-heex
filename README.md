## Installation

> **Note:** Currently only supported on Intel Macs (darwin-x64). ARM and Linux support coming soon.

```shell
bun install
cp prebuilds/darwin-x64/tree-sitter.node node_modules/tree-sitter/prebuilds/darwin-x64/tree-sitter.node
cp prebuilds/darwin-x64/tree-sitter-heex.node node_modules/tree-sitter-heex/prebuilds/darwin-x64/tree-sitter-heex.node
```

## Usage

```shell
bun run format <file>.heex
```

## Tasks

**Phase 1 — In progress**
- [x] Sort static `class="..."` attributes in Tailwind canonical order
- [x] Wire in `createSorter` from `prettier-plugin-tailwindcss`
- [x] Make stylesheet path configurable via `.prettierrc`
- [ ] Sort `class={"..."}` — simple expression with static string
- [ ] Sort string literals within `class={["...", @var]}` lists
- [ ] Fix `bunx prettier` broken binary issue
- [ ] Wire up `npm run prettier-sort` in LiveView project

**Phase 2 — Formatting opinions**
- [ ] Opinionated multiline formatting for dynamic class lists
- [ ] Grouping order — static, conditional, complex expressions
- [ ] Warn on lines that couldn't be fully sorted

**Phase 3 — File extension support**
- [ ] `.eex` files
- [ ] `.ex` files with `~H` sigils — detect and extract HEEx embedded in Elixir
- [ ] Add all extensions to the `languages` definition in the plugin
- [ ] Handle `.ex` files that mix Elixir and HEEx (sigil extraction)

**Phase 4 — Polish**
- [ ] Publish as an npm package
- [ ] VS Code integration
- [ ] README and documentation