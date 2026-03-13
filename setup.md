# RentFlow Setup Guide

Welcome to **RentFlow**! This guide will walk you through setting up the system on a new PC or server from scratch. 

We strongly recommend using **Docker** for running RentFlow, as it encapsulates all dependencies (database, backend, frontend) into a single, cohesive environment.

## Quick Start (Windows)

If you are on Windows, you can use our **One-Click Installer**:

1. Right-click `install.ps1` and select **Run with PowerShell**.
2. The script will automatically check for dependencies, clone the repo, set up your `.env`, and start the system.

---

## Detailed Prerequisites

Before you begin, ensure you have the following installed on your machine:

1. **Git**: To clone the repository.
   - [Download Git](https://git-scm.com/downloads)
2. **Docker & Docker Compose**: The engine that runs the application and database containers.
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/) (Available for Mac, Windows, and Linux)

---

## Step 1: Clone the Repository

Open your terminal or command prompt and run the following command to pull the code from Git:

```bash
# Clone the repository to your local machine
git clone https://github.com/alifoural/rent-system.git

# Navigate into the project folder
cd rent-system
```


---

## Step 2: Environment Configuration

The application requires some environment variables to connect to the database and configure settings.

1. Locate the `.env.example` file in the root directory (if it exists) or create a `.env` file directly.
2. Ensure your `.env` file has the necessary variables. Here is the configuration required for **PostgreSQL**:

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=asset_management
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5433/asset_management
```

> **Note:** When running via `docker-compose`, the backend container automatically overrides the `DATABASE_URL` internally to point to `db:5432` inside the Docker network. The `.env` file values shown above are used for local development directly on your machine or for initial database creation.

---

## Step 3: Run the Application Using Docker

We have configured `docker-compose.yml` to automatically build the application and serve it. This setup includes live-reloading volume mounts, so changes to the code reflect instantly.

1. Ensure **Docker Desktop** is running on your machine.
2. In your terminal (make sure you are inside the `rent-system` folder), run:

```bash
docker-compose up -d --build
```

### What this command does:
- `up`: Starts the containers.
- `-d`: Runs the containers in detached (background) mode.
- `--build`: Forces Docker to build the image from the `Dockerfile` to ensure you have the latest dependencies.

Wait a few moments for the backend and database containers to start up. You should see logs indicating the server is running on port `8000`.

---

## Step 4: Access the System

Once the containers are successfully running, open your web browser and navigate to:

👉 **[http://localhost:8000](http://localhost:8000)**

### Testing the API
To test the backend API endpoints directly or view the interactive documentation (Swagger UI), go to:
- **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Step 5: Stopping the System

When you are done, you can stop the application by pressing `Ctrl + C` in the terminal where Docker is running. 

If you ran it in detached mode (`-d`), you can stop it via:

```bash
docker-compose down
```

## Troubleshooting

- **Port in use error:** If port 8000 is already in use by another application, open `docker-compose.yml` and change the mapping for the `backend` service (e.g., `"8080:8000"`).
- **No data visible:** Ensure that your `data/` folder permissions allow read/write so the SQLite database (or Postgres volume) can be created properly.
