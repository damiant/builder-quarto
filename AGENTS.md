<!--VITE PLUS START-->

# Agent Notes

- Use `vp` for all project commands; do not run package managers directly.
- Run `vp install` after pulling remote changes and before starting work.
- Run `vp dev` for the Vite dev server.
- Run `vp check` after every code change.
- Run `vp test` to validate behavior when tests are relevant.
- Run `vp build` to verify production builds.
- Use `vp add`, `vp remove`, and other `vp` dependency commands instead of `npm`, `pnpm`, or `yarn`.
- Use `vp run <script>` for package scripts that share a name with built-in `vp` commands.
- Use `vp dlx` for one-off package binaries.
- Import Vite/Vitest APIs from `vite-plus` and `vite-plus/test`, not `vite` or `vitest`.
- Do not install Vitest, Oxlint, Oxfmt, tsdown, or Vite tooling directly.
- Use `vp lint --type-aware` for type-aware linting.

<!--VITE PLUS END-->
