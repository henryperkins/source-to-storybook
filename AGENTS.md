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

## Architecture rules
- Readings are created only by the `startReading` server function (service role insert after auth + quota checks); clients may only toggle `saved`, so interpretations can't be forged.
- Card meanings live in `src/content/canon.json` and are loaded inside server handlers only, keeping them out of the browser bundle; each reading stores the source meanings it used.
- Pure reading rules (admission, quotas, draw) live in `src/lib/reading-rules.ts` with tests beside it, so limits stay verifiable.
- AI writing uses the user's own OpenAI account (`OPENAI_API_KEY`, optional `OPENAI_PROJECT_ID`) preserved from the original app.
