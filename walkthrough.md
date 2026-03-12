# RentFlow — Asset Management & Rental System Walkthrough

RentFlow is a premium, high-performance Asset Management system built for speed, visual excellence, and reliability across all devices.

## 🚀 Recent Major Implementations

### 1. Dual Financial Hub (Revenues & Expenses)
We've evolved the financial logic into a two-pillar system:
- **Revenue Module (Formerly Payments)**: Optimized for tracking incoming rent with advanced date-validation and bilingual support.
- **Expenses Module [NEW]**: A dedicated module for tracking operational costs (Item, Amount, Date, Notes). Features a mobile-first native date entry system.

### 2. Intelligent Lease Automation
- **Auto-Totaling Engine**: The system now accepts a **Monthly Rent** input. It then automatically calculates the total contract value based on the duration between start and end dates—eliminating manual calculation errors.
- **Dynamic Math**: Validates that start dates are not in the past and that end dates follow start dates.

### 3. Mobile-First Reliability
- **Native Datepickers**: Replaced complex popups with high-performance native OS date wheels for 100% stability on iOS and Android.
- **Responsive RTL Layouts**: Fully mirrored layouts that wrap intelligently on narrow 375px viewports (iPhone/Android).

### 4. Dual Theme System (Light & Night)
- **Fluid Transitions**: Seamlessly switch between a premium "Night Mode" and a crisp "Light Mode".
- **State Persistence**: The application remembers your theme preference across sessions using `localStorage`.

## 📂 Project Architecture

```text
Rent System/
├── app/
│   ├── routers/          # Modular logic: Assets, Leases, Revenues, Expenses, Reports
│   ├── static/           # SPA Assets (HTML, JS, CSS)
│   ├── models.py         # SQLAlchemy tables (including new Expense model)
│   └── schemas.py        # Pydantic validation
├── docker-compose.yml    # Re-engineered with live-reloading volume mounts
└── walkthrough.md        # This visual guide
```

## 📸 Visual Tour

### Financial Control Center
The dashboard and reporting engines have been upgraded to provide a crystal-clear overview of both incoming revenue and outgoing operational expenses.

````carousel
![Expenses Module - Empty State](file:///C:/Users/Ali%20Foural/.gemini/antigravity/brain/2a04037a-bd28-47d6-a8a2-a639623c3b91/empty_expenses_view_1773278849837.png)
<!-- slide -->
![New Expense Modal - Native Mobile Logic](file:///C:/Users/Ali%20Foural/.gemini/antigravity/brain/2a04037a-bd28-47d6-a8a2-a639623c3b91/filled_expense_modal_1773278878387.png)
<!-- slide -->
![Expenses Table - Populated](file:///C:/Users/Ali%20Foural/.gemini/antigravity/brain/2a04037a-bd28-47d6-a8a2-a639623c3b91/updated_expenses_table_1773278890151.png)
````

````carousel
![Night Mode Dashboard](file:///C:/Users/Ali%20Foural/.gemini/antigravity/brain/2a04037a-bd28-47d6-a8a2-a639623c3b91/initial_dark_mode_1773279802251.png)
<!-- slide -->
![Light Mode Dashboard](file:///C:/Users/Ali%20Foural/.gemini/antigravity/brain/2a04037a-bd28-47d6-a8a2-a639623c3b91/light_mode_persisted_1773279830602.png)
````

### Modern Reporting Hub
Comprehensive financial oversight with month-specific status tracking and full-year asset narratives.

````carousel
![Annual Asset Narrative](file:///C:/Users/Ali%20Foural/.gemini/antigravity/brain/2a04037a-bd28-47d6-a8a2-a639623c3b91/reports_hub_annual_view_1773178268438.png)
<!-- slide -->
![Dynamic Monthly Report](file:///C:/Users/Ali%20Foural/.gemini/antigravity/brain/2a04037a-bd28-47d6-a8a2-a639623c3b91/monthly_report_march_1773173772386.png)
<!-- slide -->
![Expenses Report Hub](file:///C:/Users/Ali%20Foural/.gemini/antigravity/brain/2a04037a-bd28-47d6-a8a2-a639623c3b91/expenses_report_march_2026_1773292879820.png)
````

### High-Fidelity PDF Export
Universal PDF generation across all reports with print-optimized styling for professional physical records.
![Export PDF Action](file:///C:/Users/Ali%20Foural/.gemini/antigravity/brain/2a04037a-bd28-47d6-a8a2-a639623c3b91/.system_generated/click_feedback/click_feedback_1773292884217.png)

## 🎥 Full System Flows
- **Expenses & Revenue Walkthrough**: [View Recording](file:///C:/Users/Ali%20Foural/.gemini/antigravity/brain/2a04037a-bd28-47d6-a8a2-a639623c3b91/verify_reports_port_8005_1773292795581.webp)
- **General Navigation & Reports Rebuild**: [View Recording](file:///C:/Users/Ali%20Foural/.gemini/antigravity/brain/2a04037a-bd28-47d6-a8a2-a639623c3b91/unified_reports_hub_rebuilt_1773177980271.webp)

## 🛠 Deployment Status
- **Docker**: ✅ Verified (Live Reloading Enabled)
- **DB Migrations**: ✅ Auto-synced on startup
- **Cache Management**: ✅ Forced refresh via headers configured
- **Bilingual Interface**: ✅ 100% Coverage (EN/AR)
