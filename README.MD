# RentFlow - Asset Management & Rental System

RentFlow is a scalable Asset Management & Rental Module designed using a decoupled architecture. While it starts by managing Rooms, Stores, and Vehicles, the system is built to allow seamless expansion into maintenance, accounting, or CRM without core rewrites.

## 1. System Overview
The system is a centralized platform to manage physical assets, track their rental lifecycles, and monitor financial balances.

### Core Objectives
- **Full Asset Lifecycle (CRUD)**: Complete control over physical assets.
- **Dynamic Categorization**: Support for diverse types (Rooms, Stores, Cars, etc.).
- **Financial Dual-Tracking**: Separate modules for **Revenues** (Rent collection) and **Expenses** (Operational costs).
- **Intelligent Reporting**: Real-time status on collections, arrears, and annual asset history.

## 2. Technical Architecture
The system follows a Layered Architecture for maximum modularity.

- **Backend Layer**: Python (FastAPI) for high-performance asynchronous operations.
- **Frontend Layer**: Vanilla JS Single Page Application (SPA) with a premium "Glassmorphism" dark theme.
- **Database Layer**: PostgreSQL 15 (Postgres as the primary engine, with SQLite fallback for rapid local dev).
- **Infrastructure Layer**: Docker & Docker Compose for consistent containerized deployments.

### Updated Database Schema Overview
- **AssetTypes**: ID, Name (e.g., "Room", "Store").
- **Assets**: ID, TypeID, Name, Description, BasePrice, Status, Metadata (JSON).
- **Leases**: ID, AssetID, TenantName, StartDate, EndDate, TotalContractAmount, MonthlyRate.
- **Revenues (Payments)**: ID, LeaseID, AmountPaid, DateCollected, PaymentMethod.
- **Expenses**: ID, Item, Amount, DateIncurred, Notes.

## 3. Key Functional Modules

### 3.1 Asset & Lease Management
- **Soft-Delete Logic**: Assets and financial records use soft-delete to preserve chronological history for annual reports even if an asset is retired.
- **Auto-Calculation Engine**: When creating a lease, the system automatically calculates the total contract value based on the monthly rent input and the duration selected.

### 3.2 Financial Monitoring
- **Revenues Dashboard**: Tracks every payment against specific Lease IDs.
- **Expense Logging**: A dedicated interface to record miscellaneous business costs like maintenance or utilities.

### 3.3 Reporting Engine
- **Monthly Status**: A dynamic view showing Expected vs. Paid rent for all assets in a given month.
- **Annual Asset History**: A granular chronological history for individual assets over time.

## 4. Docker Implementation
The system is fully containerized for one-command deployment.

```bash
docker-compose up --build
```

**Live-Reloading**: The developer setup includes host-to-container volume mounts, allowing UI and logic changes to reflect instantly without rebuilding the image.

## 5. Scalability Strategy
- **Shared Identity**: Uses UUID/String(36) for Assets so other future modules can reference them easily.
- **Generic Metadata**: Uses JSON columns in the Assets table to store type-specific data (like "Engine Number") without schema changes.
- **UX/UI Principles**: Mobile-first design using native date pickers for 100% reliability on handheld devices across iOS/Android.
