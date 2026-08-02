# Evidence, Please

A browser-based professional-development game for education leaders to rehearse challenging inspection-style conversations. It is a static React/TypeScript application with no login, backend, uploads or remote assessment.

## Run locally

Requires Node.js 20+. Run `npm install`, then `npm run dev`. Checks: `npm test`, `npm run build`, and `npm run preview`.

## Deploy to GitHub Pages

Run `npm run deploy` to build and publish `dist` to a `gh-pages` branch, then select that branch in **Settings → Pages**. The script uses `npx gh-pages`; the first run may ask to download that publishing utility. Vite uses relative asset paths, so repository subdirectories work without editing a base URL.

## Add content

Questions live in `src/data/questions.ts` and use the `InspectionQuestion` contract in `src/types.ts`. Each prompt includes useful evidence, reflection prompts and follow-ups for all personas. Answer-builder option metadata is used for coaching and is not exposed as a score.

Personas live in `src/data/personas.ts`. A new persona requires an ID in `PersonaId`, display content, a Push Me challenge, and compatible follow-up data.

## Disclaimer

Evidence, Please is an independent professional-development and rehearsal tool. It is not affiliated with, endorsed by or produced by Ofsted. Questions and feedback support reflection and do not predict inspection activity or represent official inspection judgements.
