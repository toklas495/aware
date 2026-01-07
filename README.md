# Aware

A privacy-first, self-awareness tracking application. Track your daily activities with intention and observe patterns without judgment.

> **"Nobody sees you. You are your own witness."**

## Philosophy

Aware is built on principles of:
- **Manual tracking** - You control what you track
- **Calm design** - Minimal, non-intrusive interface
- **Privacy-first** - All data stored locally in your browser
- **Non-judgmental** - No recommendations, no advice, just observation
- **Simple (KISS)** - Clarity and realization, not features for features' sake

## Features

### Core Functionality
- **Morning Setup** - Define point values for activities and set daily intentions
- **Day Logging** - Track activities with intentional/automatic awareness
- **Night Reflection** - Reflect on what energized, drained, and what you observed
- **Weekly/Monthly Review** - Simple totals and calm pattern observations
- **Activity Management** - Define your own activities (no defaults forced)

### Design
- **Light/Dark Mode** - Eye-friendly themes with smooth transitions
- **Responsive** - Works on mobile and desktop
- **Accessible** - Semantic HTML and keyboard navigation
- **Minimal UI** - Reduced noise, increased whitespace

### Data & Privacy
- **100% Local Storage** - All data stays in your browser (localStorage)
- **No Tracking** - No analytics, no external services
- **Reset Anytime** - Delete a day or all data with one click
- **Export/Import Ready** - Data structure designed for future export

## Quick Start

### Option 1: Local Development (Recommended for development)
```bash
git clone <your-repo-url>
cd aware
npm install
npm run dev
```

### Option 2: Docker (Recommended for production)
```bash
docker-compose up -d
# Or
docker build -t aware .
docker run -d -p 8080:80 aware
```

### Option 3: Vercel (Recommended for hosting)
Just push to GitHub and connect to Vercel - it's that simple!

## Getting Started

### Prerequisites
- **Node.js 20+** and npm (check `.nvmrc` for exact version)
- **Docker** (optional, for containerized deployment)
- **Git** (for version control)

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

### Docker Deployment

**Using Docker Compose (Recommended):**
```bash
docker-compose up -d
```

**Using Docker directly:**
```bash
# Build the image
docker build -t aware .

# Run the container
docker run -d -p 8080:80 --name aware-app --restart unless-stopped aware

# Stop the container
docker stop aware-app
docker rm aware-app

# View logs
docker logs -f aware-app
```

The app will be available at `http://localhost:8080`

**Docker Commands:**
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run container
- `npm run docker:stop` - Stop and remove container

### Vercel Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" and import your repository
4. Vercel will automatically detect the `vercel.json` configuration
5. Click "Deploy" - that's it!

The `vercel.json` file is already configured for:
- Client-side routing (SPA)
- Static asset caching
- Security headers
- Build optimization

**Note**: No environment variables needed - everything runs client-side!

📖 **For detailed deployment instructions**, see [DEPLOYMENT.md](DEPLOYMENT.md)

## Project Structure

```
src/
├── app/              # App root and lifecycle
├── components/       # Reusable components
├── domain/           # Business logic
│   ├── activity/     # Activity management
│   ├── day/          # Day tracking logic
│   ├── state/        # State management hooks
│   ├── storage/      # Storage adapters
│   └── theme/        # Theme management
├── screens/          # Screen components
│   ├── Home/
│   ├── MorningSetup/
│   ├── DailyLog/
│   ├── Reflection/
│   ├── ProgressSummary/
│   └── ActivityManager/
├── styles/           # Global styles
└── utils/            # Utility functions
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS Variables** - Theming system

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container
npm run docker:stop  # Stop Docker container
```

Or use `make` commands (see `Makefile`):
```bash
make help           # Show all available commands
make dev            # Start dev server
make docker-build   # Build Docker image
make docker-run     # Run Docker container
```

## Data Model

### Activity
- `id`: Unique identifier
- `label`: Display name
- `type`: 'good' | 'bad'
- `points`: Optional default point value
- `unit`: Optional unit (e.g., 'km', 'minutes')

### Day Data
- `date`: YYYY-MM-DD format
- `intention`: Optional daily intention
- `activityPoints`: Points per activity for the day
- `activityUnits`: Units per activity
- `activityCounts`: Number of times each activity was done
- `activityIntentionality`: Array of 'intentional' | 'automatic' per activity
- `reflection`: Reflection answers
- `completed`: Whether day is complete

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Functional components only
- Small, readable functions
- No side-effect heavy logic

### Adding Features
When adding features, ask:
1. Does this increase awareness?
2. Is it necessary (KISS principle)?
3. Does it respect privacy?
4. Is it non-judgmental?

If the answer to any is "no", reconsider the feature.

## Contributing

This is a personal awareness tool. Contributions should align with the core philosophy:
- No motivation features
- No advice or recommendations
- No social features
- No cloud sync (privacy-first)
- Observation over action

## License

MIT License - See LICENSE file for details.

## Acknowledgments

Built with intention for self-awareness and honest reflection.

---

**Remember**: "Don't lie to yourself. Observation is enough."


