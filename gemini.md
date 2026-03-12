# RentFlow - Project Intelligence (gemini.md)

## 📌 Project Overview
**RentFlow** is a scalable Asset Management & Rental Module designed to manage physical assets (Rooms, Stores, Vehicles, etc.), track their rental lifecycles, and monitor financial balances (Paid vs. Pending). It uses a decoupled, layered architecture to allow for future modular expansion.

## 🛠 Tech Stack
- **Backend:** FastAPI (Python)
- **Database:** SQLAlchemy ORM with support for both **PostgreSQL 15** (Production) and **SQLite** (Local).
- **Frontend:** Vanilla JavaScript SPA with a premium "Glassmorphism" dark theme.
- **Styling:** Vanilla CSS & **Bootstrap 5** (integrated for components) with full RTL (Right-to-Left) support for Arabic.
- **Infrastructure:** Docker & Docker Compose with live-reloading volume mounts.

## 📂 Key Directory Structure
- `app/`: Main application logic.
    - `routers/`: Modular API endpoints (`assets`, `asset_types`, `leases`, `payments`, `reports`, `notifications`, `expenses`).
    - `static/`: Frontend assets (`index.html`, `style.css`, `app.js`).
    - `models.py`: Database table definitions (now including `Expense`).
    - `schemas.py`: Pydantic models for data validation.
- `data/`: Persistent storage.
- `docker-compose.yml` & `Dockerfile`: Container configuration.

## 🚀 Core Features & Logic
1.  **Dynamic Asset Management:** Supports multiple asset types with custom metadata.
2.  **Rental Lifecycle:** 
    - Leases link tenants to assets for specific durations.
    - Automatic asset status toggling (Available <-> Rented).
    - **Lease Auto-Calculation:** System automatically calculates the total contract value based on a monthly rent input and the duration between start/end dates.
3.  **Financial Tracking (Revenues & Expenses):** 
    - **Revenues (Formerly Payments):** Logging rent collection against Lease IDs.
    - **Expenses Module:** Dedicated module to track operational costs (Item, Date, Amount, Notes).
    - Soft-delete logic preserves history across all financial modules.
4. **Reporting Engine:** 
    - **Dynamic Monthly Reporting:** Filters by dates to visualize payment status (Paid, Partial, Unpaid, Vacant).
    - **Annual History:** Granular chronological history per asset.
    - **Dashboard:** Live metrics for Total Revenue, Pending Balance, and Asset Status.
5. **Notification Center:**
    - Live tracking of Upcoming Dues and Overdue Leases via top-bar dropdown.
    - WhatsApp Integration for immediate tenant outreach.
6. **I18n & UX Logic:** 
    - **Bilingual:** Full English/Arabic support with persistent language state.
    - **Mobile-First UX:** Optimized mobile date pickers using the native device interface for reliability across iOS/Android.
    - **Cache Management:** FastAPI server-side cache-control headers ensure browsers always serve the latest frontend assets.

## 📝 Developer Guidelines
- **Modifying UI:** Edit `app/static/style.css` for themes or `app/static/app.js` for logic/translations.
- **Adding Data Fields:** Update `app/models.py`, then `app/schemas.py`, then the relevant router.
- **Docker Volume Mounts:** The `docker-compose.yml` is configured to mount `./` to `/app` inside the container for instant hot-reloading of frontend and backend changes.

## ⚙️ How to Run
### Option 1: Docker (Recommended)
```bash
docker-compose up --build
```
### Option 2: Local Python
```bash
python -m venv venv
venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
