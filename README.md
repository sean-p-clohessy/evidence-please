# Evidence, Please

A browser-based professional-development game for education leaders to rehearse challenging inspection-style conversations. It is a static React/TypeScript application with no login, backend, uploads or remote assessment.

The current content release is focused on General Further Education and Tertiary colleges and the renewed FE and skills inspection toolkit in active use from 10 November 2025. See [OFSTED_SOURCE_NOTES.md](OFSTED_SOURCE_NOTES.md) for the versioned 10-report pilot corpus, scope boundaries and attribution.

## Run locally

Requires Node.js 20+. Run `npm install`, then `npm run dev`. Checks: `npm test`, `npm run build`, and `npm run preview`.

## Deploy to GitHub Pages

The included GitHub Actions workflow tests, builds and deploys the site automatically whenever `main` changes. In **Settings → Pages**, select **GitHub Actions** as the source. To request another deployment manually, run `npm run deploy` after authenticating the GitHub CLI. Vite uses relative asset paths, so repository subdirectories work without editing a base URL.

## Add content

Questions live in `src/data/questions.ts` and use the `InspectionQuestion` contract in `src/types.ts`. Each prompt includes useful evidence, reflection prompts and follow-ups for all personas. Answer-builder option metadata is used for coaching and is not exposed as a score.

Personas live in `src/data/personas.ts`. A new persona requires an ID in `PersonaId`, display content, a Push Me challenge, and compatible follow-up data.

## Disclaimer

Evidence, Please is an independent professional-development and rehearsal tool. It is not affiliated with, endorsed by or produced by Ofsted. Questions and feedback support reflection and do not predict inspection activity or represent official inspection judgements.
