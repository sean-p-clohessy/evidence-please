# Ofsted source notes

## Scope and framework edition

The report-informed content pilot is restricted to **General Further Education and Tertiary** colleges. It uses the renewed FE and skills inspection toolkit that became active on 10 November 2025. The older FE inspection handbook and pre-renewal reports are excluded.

As of 18 August 2026, Ofsted labels the September 2025 toolkit as **currently in use**. A revised toolkit is published for September 2026 but is not mixed into this corpus before its commencement date. Framework editions must remain separately versioned when the corpus is updated.

- [Current toolkit, operating guides and information](https://www.gov.uk/government/publications/further-education-and-skills-inspection-toolkit-operating-guide-and-information)
- [Current FE and skills inspection toolkit PDF](https://assets.publishing.service.gov.uk/media/68b975aa3f3e5483efdba9c3/Further_education_and_skills_inspection_toolkit.pdf)
- [Ofsted copyright and Open Government Licence guidance](https://www.gov.uk/guidance/using-ofsted-logos-and-copyright)

The current toolkit areas represented in the data model are safeguarding; inclusion; leadership and governance; contribution to meeting skills needs; curriculum, teaching and training; achievement; and participation and development.

## Provision scope

Every pilot report separately covers education programmes for young people, adult learning programmes, apprenticeships and provision for learners with high needs. The corpus also tags:

- Access to HE and higher/degree apprenticeships where they appear within the inspected FE and skills provision;
- commercial and employer-responsive curriculum activity where reports connect it to skills needs, apprenticeships or relevant funded provision.

The tags do **not** imply that every standalone HE or privately funded commercial course is inspected under the FE toolkit. Questions must be framed around the provision that is actually within scope.

## Ten-report pilot corpus

All reports below are full inspections carried out after the renewed toolkit came into use.

| College | Inspection | Official report |
|---|---:|---|
| South and City College Birmingham | 28 April 2026 | [Report](https://files.ofsted.gov.uk/v1/file/50304841) |
| Macclesfield College | 27 April 2026 | [Report](https://files.ofsted.gov.uk/v1/file/50304845) |
| Newbury College | 24 March 2026 | [Report](https://files.ofsted.gov.uk/v1/file/50303117) |
| Kendal College | 17 March 2026 | [Report](https://files.ofsted.gov.uk/v1/file/50301692) |
| Furness College | 10 February 2026 | [Report](https://files.ofsted.gov.uk/v1/file/50299910) |
| Craven College | 12 May 2026 | [Report](https://files.ofsted.gov.uk/v1/file/50305984) |
| Capel Manor College | 27 January 2026 | [Report](https://files.ofsted.gov.uk/v1/file/50297763) |
| Sandwell College | 9 December 2025 | [Report](https://files.ofsted.gov.uk/v1/file/50294740) |
| Heart of Worcestershire College | 10 March 2026 | [Report](https://files.ofsted.gov.uk/v1/file/50300699) |
| Wirral Metropolitan College | 27 January 2026 | [Report](https://files.ofsted.gov.uk/v1/file/50297762) |

## Derivation rules

Report text is not presented to users as a quotation bank. Findings are manually paraphrased into reusable patterns that separate current position, evidence, leadership action, impact and remaining challenge.

- Provider names, URNs and identifying examples stay in source metadata, not gameplay text.
- A finding pattern should normally be supported by more than one report.
- No pattern is described as an official question, required answer or prediction.
- Grades in source reports do not become player scores.
- Naming an activity or document is not treated as evidence of impact.
- Source metadata remains local TypeScript data so every derived pattern can be audited.

Public information is reused and attributed under the Open Government Licence. Ofsted logos and protected visual identity are not used.

## Reproducing the extraction

The optional research utility downloads the fixed pilot manifest and extracts text to the ignored `tmp/pdfs/ofsted-pilot` directory:

```powershell
python scripts/extract_ofsted_reports.py
```

It requires `pdfplumber`. Raw PDFs and extracted text are research inputs only and are not bundled into the browser application.
