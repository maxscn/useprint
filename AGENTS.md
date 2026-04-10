## Learned User Preferences

- Prefer leaner docs: remove redundant cards or sections when the same destination is already linked in nearby prose.
- Use “Manual install” as the visible label for the manual setup page (not “Installation”); use “Backends” instead of “Integrations”; use “Chromium” instead of “Custom Chromium” where those terms apply.
- Treat `render()` → HTML → headless Chromium as the primary server-side PDF path to document, alongside local preview—not only CLI export or build flows.
- For not-yet-public pieces such as `useprint-js`, state availability clearly and point readers to Discord for updates; home-page cards may link to Discord until a public package or doc exists.

## Learned Workspace Facts

- `npx init-doc@latest` scaffolds new projects from `packages/init-doc`; automatic-setup docs follow React Email–style structure.
- Monorepo docs follow React Email’s npm workspaces pattern: a dedicated workspace package owns `documents/` and runs the `useprint` CLI from that package’s cwd.
- Useprint is a narrow fork of React Email focused on printable documents; public docs acknowledge WIP status and substantial prior internal use.
- The intended PDF path is Chromium-based, so standard web layout and CSS apply rather than a bespoke engine.
- Docs information architecture uses a “Backends” area (for example `/docs/backends/chromium`) instead of “Integrations.”
