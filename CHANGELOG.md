# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-12-19

### Added
- **Activity Model Enhancement**
  - Added optional `points` field to activity definitions (default point values)
  - Added optional `unit` field to activities (e.g., 'km', 'minutes', 'sessions')
  - Extended day data to support units per activity
  - Backward compatible with existing saved data

- **Intentional/Automatic Awareness Tracking**
  - Added intentionality toggle when logging activities
  - Track whether each activity instance was a choice or a habit
  - UI prompt: "Was this a choice or a habit?"
  - No defaults - user must choose consciously

- **Morning Setup Improvements**
  - Allow setting point values per activity for the day
  - Optional unit input per activity
  - Philosophical text: "You decide what nourishes you and what drains you."

- **Reflection Enhancement**
  - New reflection questions:
    - "What energized me today?"
    - "What drained me today?"
    - "What did I observe about myself?"
  - Added calm closure text: "Nobody will check this. Be honest with yourself."
  - Removed judgmental language ("What You Did Right/Wrong")

- **Review Screen Updates**
  - Simplified weekly/monthly views - removed tables
  - Added calm pattern observations (e.g., "Walking days often feel lighter.")
  - No recommendations, no advice, no warnings
  - Simple totals only

- **UI/UX Improvements**
  - Light/Dark mode support with system preference detection
  - Smooth theme transitions
  - Increased whitespace for calmer interface
  - Softer typography and reduced visual noise
  - Eye-friendly dark theme (deep, soft colors)
  - Fixed theme toggle button (top-right)

- **Philosophical UI Text**
  - Home screen: "Nobody sees you. You are your own witness."
  - Reflection screen: "Observation is enough."
  - Activity Manager: Updated to reflect awareness focus
  - Reset functionality: "You can reset anytime. Nothing is permanent."

- **Docker Support**
  - Multi-stage Dockerfile for production builds
  - Nginx configuration for SPA routing
  - Docker Compose file for easy deployment
  - Health check endpoints

- **Vercel Deployment**
  - `vercel.json` configuration for Vercel deployment
  - SPA routing configuration
  - Static asset caching
  - Security headers

- **Documentation**
  - Comprehensive README.md
  - CHANGELOG.md for version tracking
  - MIT License

### Changed
- **Data Model**
  - Extended `DayData` type with `activityUnits` and `activityIntentionality`
  - Extended `DayReflection` with new question fields
  - Point calculation now falls back to activity defaults if day-specific not set

- **Point Calculation**
  - Updated to support default points from activity definitions
  - Backward compatible - old data still works

- **UI Language**
  - Removed judgmental terms ("good habits" vs "bad habits" still exist but less emphasized)
  - Changed "Progress" to "Review"
  - Changed "Manage Habits" to "Activities"
  - More neutral, observational language throughout

- **Review Screens**
  - Removed detailed breakdowns
  - Simplified to totals only
  - Added pattern observations (derived from data, not recommendations)

### Technical
- Added theme context (`useTheme` hook)
- Updated all calculation functions to accept activities parameter
- Improved TypeScript types for intentionality tracking
- Enhanced CSS with theme variables for light/dark modes
- Improved mobile responsiveness

### Fixed
- Backward compatibility with old saved data
- Null/undefined guards throughout
- Data migration handled silently

## [1.0.0] - Initial Release

### Added
- Basic activity tracking
- Good/bad habit tracking
- Daily logging
- Morning setup
- Night reflection
- Progress summary (weekly/monthly)
- Activity management
- Local storage persistence
- Responsive design

---

## Version History

- **2.0.0** - Awareness-focused update with intentionality tracking, theme support, and philosophical updates
- **1.0.0** - Initial release with basic tracking functionality


