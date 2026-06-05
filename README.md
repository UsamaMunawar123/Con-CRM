# Construction CRM

A web-based construction & real-estate CRM built with React + Babel. Dark dashboard, PKR pricing, visual unit maps, payment plans, user/role/permission management, and expense tracking.

## Features
- **Projects POS** — card overview with live mini unit maps
- **Unit Map** — floor-by-floor grid, color-coded by status (Available / Booked / Token / Sold / Blocked)
- **Payment Plans** — per-unit breakdown (down payment, installments, balloon, possession)
- **Add Project** — live preview as you configure floors, units, and pricing
- **User Management** — Users, Roles, and a full Permissions matrix
- **Expenses** — ledger with categories, budget tracking, and approval flow
- **3 Nav Styles** — Expanded, Grouped, Compact (persisted in localStorage)

## Stack
- React 18 (via CDN, no build step)
- Babel standalone (JSX in browser)
- Vanilla CSS custom properties for theming
- No backend — all data is mocked in `data.jsx`

## Running locally
Just open `Construction CRM.html` in any browser. No install needed.

```bash
git clone https://github.com/YOUR_USERNAME/construction-crm.git
cd construction-crm
open "Construction CRM.html"
```

## Deploying to GitHub Pages
Push to `main` — the included GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-deploys to GitHub Pages on every push.

## File structure
```
├── Construction CRM.html   # Shell + tokens + script tags
├── data.jsx                # Mock data, PKR formatting, helpers
├── components.jsx          # Shared UI primitives (Card, Button, Badge…)
├── nav.jsx                 # Sidebar with 3 style variations
├── app.jsx                 # Router + Topbar + App mount
├── screens_dashboard.jsx   # Dashboard overview
├── screens_projects.jsx    # Projects POS + unit map + payment plan
├── screens_addproject.jsx  # Add project form with live preview
├── screens_users.jsx       # Users · Roles · Permissions
├── screens_expenses.jsx    # Expenses + Categories
└── .github/
    └── workflows/
        └── deploy.yml      # CI/CD → GitHub Pages
```

## Currency
All prices in PKR (Rs), formatted in lakh/crore shorthand (e.g. Rs 4.25 Cr).

## Status colors
| Status | Color |
|--------|-------|
| Available | Emerald |
| Booked | Amber |
| Token | Violet |
| Sold | Rose |
| Blocked | Slate |
