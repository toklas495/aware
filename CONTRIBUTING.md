# Contributing to Aware

Thank you for your interest in improving Aware. This project is an awareness tool, not a productivity app, so every change should reinforce that philosophy.

## Core Principles
- **Awareness over optimization**: Prefer features that illuminate behavior, not ones that force change.
- **Privacy first**: All data stays local; no telemetry.
- **Calm UI**: Minimal, intentional visuals with accessible defaults.
- **Clarity**: Keep copy neutral and judgment-free.

## Getting Started
1. Fork the repo and create a topic branch from `main`.
2. Install dependencies with `npm install` (Node 20+).
3. Run `npm run dev` to work locally.
4. Keep `npm run lint` and `npm run test` (when available) green before you push.

## Pull Requests
- Open an issue first for large changes or new features.
- Describe the user story and why it fits the awareness philosophy.
- Include before/after screenshots for UI changes.
- Add tests (unit or visual) when applicable.
- Update docs/README if behavior changes.
- Keep commits focused and well-described.

## Code Style
- TypeScript strict mode; follow existing patterns.
- Functional React components only; hooks before render logic.
- Keep business logic in `src/domain/**` and UI in `src/screens`/`src/components`.
- Prefer descriptive names; avoid abbreviations.

## Issue Labels
- `help wanted`: Safe for newcomers.
- `good first issue`: Small, self-contained tasks.
- `design needed`: Requires visual exploration.
- `philosophy check`: Needs extra scrutiny for alignment with core principles.

## Reporting Bugs
- Use the bug report template (coming soon).
- Include browser/device info and reproduction steps.
- Attach screenshots/console output when relevant.

## Security
- Report vulnerabilities privately via email listed in `SECURITY.md` (todo).

Thanks for helping people see their day more clearly. 🙏
