# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-01-09

### Added
- **Energy-Based Awareness Model**
  - Introduced explicit `energy` concept (replacing mental “points” abstraction)
  - Energy can be positive (gained), negative (drained), or neutral (0)
  - Energy values can be set per day or fall back to activity defaults
  - Supports legacy `points` field for backward compatibility

- **Realistic Daily Energy Calculation**
  - New `calculateDayEnergy` domain logic
  - Models human energy using:
    - Diminishing returns for repeated activities
    - Intentional vs automatic action weighting
    - Time-based fatigue (activities close together reduce impact)
  - Separates:
    - Total energy
    - Energy gained
    - Energy drained
  - Rounded output for calm, non-fake precision

- **Activity Intentionality Weighting**
  - Intentional actions have slightly higher energy impact
  - Automatic actions still counted, without judgment
  - No defaults — absence implies “automatic”

- **Morning Setup Validation**
  - New `isMorningSetupComplete` logic
  - Morning setup is complete only when:
    - Every activity has a defined energy value
    - `0` is treated as a valid, intentional value
  - Prevents logging without explicit energy awareness

- **Day Lifecycle Handling**
  - Clear separation of day state by date
  - Completing a day does not affect future days
  - New days automatically start incomplete with clean state

---

### Changed
- **Terminology**
  - Shifted from “points” to **energy** (conceptual clarity)
  - UI reflects “Gained / Drained / Net” instead of scores
  - Language further neutralized (observation-only tone)

- **Home Screen Behavior**
  - Displays daily energy summary only when data exists
  - “Today is complete” shown only for the current day
  - Automatically shows “Log activity” on the next day

- **Data Model**
  - Added `activityEnergyOverrides` to `DayData`
  - Legacy fields (`activityPoints`) migrated automatically
  - Improved guards for corrupted or partial local data

- **Calculation Architecture**
  - Energy logic fully moved into domain layer
  - UI now consumes derived values only
  - Frontend remains simple; complexity hidden

---

### Technical
- Added robust energy calculation utilities
- Improved TypeScript strictness around numeric validation
- Strengthened backward compatibility paths
- Improved localStorage safety and silent recovery
- Domain logic made deterministic and testable

---

### Fixed
- Incorrect handling of `0` as a falsy energy value
- Edge cases where days appeared “set up” without energy
- Inconsistent totals when activities repeated many times
- UI rendering before day data finished loading

---

## [2.0.0] - 2024-12-19

### Added
- Intentional/automatic awareness tracking
- Morning setup for daily values
- Reflection questions focused on observation
- Weekly/monthly calm review screens
- Light/Dark mode theming
- Privacy-first local-only storage
- Docker + Vercel deployment support
- Comprehensive documentation

### Changed
- Removed judgmental language
- Simplified UI and review screens
- Neutralized terminology

---

## [1.0.0] - Initial Release

### Added
- Basic activity tracking
- Daily logging and reflection
- Activity management
- Local storage persistence
- Responsive UI

---

## Version History

- **2.1.0** — Energy-based awareness model with realistic human logic
- **2.0.0** — Intentionality, themes, and philosophy-driven redesign
- **1.0.0** — Initial release
