# js/vendor — libraries used by the Academy (must be bundled; the app never loads them from the internet)

Put these files here (same versions the app was tested with):

| File | Where to get it |
|---|---|
| `supabase.min.js` | open https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.9 in the browser and save the page as `supabase.min.js` (it is the UMD build; it must define `window.supabase`) |
| `katex.min.js` | https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js |
| `katex.min.css` | https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css |
| `fonts/` (folder) | the `fonts` folder of katex@0.16.22 (inside https://github.com/KaTeX/KaTeX/releases/download/v0.16.22/katex.zip, folder `katex/fonts`) copied to `js/vendor/fonts/` — katex.min.css loads the math fonts from there |

Until they are present the Academy still opens from its offline cache, but cannot fetch new articles through the Supabase client, and equations are shown as plain text.
Paths are set in `academy/config.js`.
