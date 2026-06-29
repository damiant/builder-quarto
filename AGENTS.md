<!--VITE PLUS START-->

# Agent Notes

- Use `npx vp` for all project commands; do not run package managers directly.
- Run `npx vp install` after pulling remote changes and before starting work.
- Run `npx vp dev` for the Vite dev server.
- Run `npx vp check` after every code change.
- Run `npx vp test` to validate behavior when tests are relevant.
- Run `npx vp build` to verify production builds.
- Use `npx vp add`, `npx vp remove`, and other `npx vp` dependency commands instead of `npm`, `pnpm`, or `yarn`.
- Use `npx vp run <script>` for package scripts that share a name with built-in `npx vp` commands.
- Use `npx vp dlx` for one-off package binaries.
- Import Vite/Vitest APIs from `vite-plus` and `vite-plus/test`, not `vite` or `vitest`.
- Do not install Vitest, Oxlint, Oxfmt, tsdown, or Vite tooling directly.
- Use `npx vp lint --type-aware` for type-aware linting.

<!--VITE PLUS END-->
