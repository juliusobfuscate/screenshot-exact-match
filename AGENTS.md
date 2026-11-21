<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- This app is an educational UI recreation: every page renders `DemoNotice`, and sign-in forms validate only through `src/lib/demo-auth.ts` (synthetic example.com/example.test emails, fixed demo code) with input kept in transient React state — never send, store or log form input, so the prototype cannot collect real credentials.
- Brand SVGs live in `public/assets/` and are referenced by `/assets/...` paths via `<img>`; the brief mandates these exact files and paths.
- Non-navigating links use the shared `DemoLink` component so hover/focus/no-navigation behavior stays consistent.
- The `/settings` admin panel is a simulation: its session, token and edits live only in the in-memory store `src/lib/admin/store.ts` (no localStorage, cookies or server), and statistics come from the deterministic synthetic log in `src/lib/admin/sample-logs.ts` — so the panel can never hold real credentials or track real visitors.
