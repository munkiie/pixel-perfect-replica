<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Shared student-data query options load owner-scoped private records only from authenticated client-only routes, keeping reusable career tools consistent.
- CV drafts use a validated browser-safe data module; PDF generation dynamically loads jsPDF from the download action to avoid server runtime dependencies.
- Each new content route uses the shared page-head helper for unique app-specific metadata.
- Keep authenticated navigation in the shared AppShell and place all student-only routes under the existing client-only authenticated layout; this keeps private workflows consistently gated on desktop and mobile.
