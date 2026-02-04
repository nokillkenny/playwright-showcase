# playwright-showcase

[![Playwright Tests](https://github.com/nokillkenny/playwright-showcase/actions/workflows/test.yml/badge.svg)](https://github.com/nokillkenny/playwright-showcase/actions/workflows/test.yml)

Playwright test suite for [portfolio](https://nokillkenny.github.io/) demonstrating scalable test architecture patterns.

## Architecture

```
playwright-showcase/
├── fixtures/           # Custom test fixtures
│   ├── test.ts         # Page object fixtures
│   └── a11y.ts         # Axe-core accessibility fixture
├── pages/              # Page Object Model
│   ├── base.page.ts    # Shared navigation, theme, selectors
│   └── demos.page.ts   # Report viewer interactions
└── tests/              # Test specs
    ├── navigation.spec.ts
    ├── demos.spec.ts
    ├── a11y.spec.ts
    └── responsive.spec.ts
```

### Why This Structure?

**Page Object Model** — Centralizes selectors and interactions. When the UI changes, update one file instead of hunting through specs. Essential when multiple engineers write tests against the same app.

**Custom Fixtures** — Provides consistent setup/teardown and enables cross-cutting concerns (logging, screenshots, retries) without polluting test code. Fixtures become the contract between infrastructure and test authors.

**Separate A11y Fixture** — Accessibility rules often need org-wide consistency. A dedicated fixture ensures all a11y tests use the same axe-core configuration and exclusions.

## Setup

```bash
npm install
npx playwright install chromium
```

## Run

```bash
# Against local dev server
BASE_URL=http://localhost:4321/ npm test

# Against production
npm test
```

## Docker

```bash
# Build image
docker build -t playwright-showcase .

# Run against production (after deploy)
docker run --rm playwright-showcase

# Run against local dev server (start with --host first)
# In portfolio repo: npm run dev -- --host
docker run --rm -e BASE_URL=http://host.docker.internal:4321/ playwright-showcase

# With docker-compose (outputs reports to local folders)
BASE_URL=http://host.docker.internal:4321/ docker compose up
```

Note: For local Docker testing, start the dev server with `--host` flag to allow external connections.

## CI/CD

On push to `main`, the workflow:
1. Runs tests against production site
2. Uploads HTML report as artifact
3. Triggers [test-showcase](https://nokillkenny.github.io/test-showcase) aggregation

Reports are published with timestamps for historical tracking.
