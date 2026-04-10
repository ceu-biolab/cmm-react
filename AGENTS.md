# AGENTS.md

- Never make design assumptions; in case of ambiguity or doubt, stop the implementation and ask questions.
- Self update this file for future sessions when new general guidelines are given or can be inferred.
- You can find a symlink to examples backend requests in __backend_request_examples/. Make sure to never modify anything in there.
- For result pages that split output by feature tabs, include a top results summary viewer per active tab.
- Keep one unified `External IDs` column across all results tables (include all available DB identifiers there).
- In tabbed feature results, compute matched adducts per active feature and only count adducts with `> 0` compounds.
- In results tables, hide adduct sections with `0` compounds; show a single empty-state message only when total matches are `0`.
- Keep adduct group ordering in results aligned with the adduct order shown in each form.
- In CE-MS forms, display buffer `description` labels from the backend, but keep submitting buffer `code` values.
- In CE-MS forms, render buffer options in a limited-height scrollable list (same UX pattern as adduct lists).
- Keep pathway rendering consistent across all result tables: preserve KEGG pathway hyperlinks via shared normalization (no page-specific divergence).
- Remove unused legacy pages/routes instead of maintaining parallel deprecated result UIs.
- Forms must start blank by default; only `Load Demo Data` should populate default/demo values.
- Keep form behavior consistent across searches (naming, tolerance mode wiring, and reset behavior).
- Keep `Deuterium` bundled with `Chemical Alphabet` in forms (rendered directly under/with that control, not detached in a separate section).
- In Codex non-interactive shells, `~/.bashrc` returns early so `nvm` is not auto-loaded; run `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22` before `node`/`npm` commands.
- You can test any backend GET/POST request with curl at https://ceumassdev.eps.uspceu.es/api/ but note that the backend is also in testing phase
- Keep git commits up to date while implementing multi-step work; commit logical chunks as you go.
