# RentFlow - Developer Navigator & Manual

This document serves as a guide to the project repository. It details what each file does and where you should look if you want to modify specific parts of the application.

## Directory Structure

```text
Rent System/
├── app/
│   ├── routers/          # Backend API endpoints (Assets, Leases, Revenues, Expenses)
│   ├── static/           # Frontend UI files (HTML, JS, CSS)
│   ├── database.py       # Database connection setup
│   ├── main.py           # FastAPI application entry point
│   ├── models.py         # Database SQL tables definition
│   └── schemas.py        # Data validation models (Pydantic)
├── data/                 # Local directory for SQLite or Postgres volumes
├── .env                  # Environment variables
├── docker-compose.yml    # Docker services configuration
├── Dockerfile            # Instructions to build the backend container
├── README.MD             # Product Objectives (PRD)
├── requirements.txt      # Python dependencies
├── UPDATE.MD             # Detailed Changelog
└── walkthrough.md        # Visual walkthrough of the implemented app
```

---

## ✨ Key Features & UX

- **Glassmorphism Design:** Modern dark theme with translucent surfaces and smooth gradients.
- **Mobile First Layout:** Optimized sidebars and native date pickers for iOS/Android reliability.
- **Dynamic Calculation:** Automated lease totaling based on monthly rent inputs.
- **Dual Financial Tracking:** Specialized modules for tracking incoming Revenues and outgoing Expenses.
- **Bilingual RTL Support:** Native Arabic support with automatic layout mirroring.

---

## Where to Edit Things

### 1. Frontend / User Interface (UI)
If you want to change how the app looks, works in the browser, or translate text:

* **`app/static/index.html`**
  * **What it does:** The main skeleton of the webpage. Contains the sidebar navigation menu and the top bar.
  * **Edit here if:** You want to add a new link to the sidebar (e.g., adding a "Maintenance" tab).

* **`app/static/style.css`**
  * **What it does:** All the styling rules, colors, and responsive logic.
  * **Edit here if:** You want to change the primary brand color or fix a specific mobile layout bug.

* **`app/static/app.js`**
  * **What it does:** The brain of the frontend. Handles routing, translations, and dynamic data rendering.
  * **Edit here if:** 
    * You need to update Arabic or English text (translations object).
    * You want to change the math for the lease auto-calculation.
    * You need to add a new column to the Revenue or Expense tables.

---

### 2. Backend / Server Logic
If you want to change what data is saved or add new features:

* **`app/main.py`**
  * **What it does:** Entry point. Registers routers and handles static file serving.
  * **Edit here if:** You add a new router file in the `routers/` folder.

* **`app/models.py`**
  * **What it does:** SQL table definitions.
  * **Edit here if:** You want to add a new field (like "Category" for Expenses).

* **`app/schemas.py`**
  * **What it does:** Pydantic validation.
  * **Edit here if:** You added a database field and need it to be visible in the API.

* **`app/routers/*.py`**
  * **What it does:** API endpoint logic.
    * `assets.py`: Asset CRUD.
    * `leases.py`: Lease assignment and status toggling.
    * `payments.py`: Revenue collection logic.
    * `expenses.py`: Operational cost tracking.
    * `reports.py`: Complex Dashboard and Monthly/Annual reporting math.

---

### 3. Infrastructure
* **`docker-compose.yml`**
  * **Edit here if:** You want to change database credentials or enable/disable live-reloading volume mounts.
