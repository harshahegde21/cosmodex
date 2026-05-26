# 🐳 Local Infrastructure Setup Guide

Welcome to the Cosmodex! To make development fast, secure, and completely isolated, we use **Docker** to run our database (PostgreSQL) and our background queue system (Redis). 

You **do not** need to install PostgreSQL or Redis directly on your computer. Docker will handle everything for you behind the scenes.

## 📋 Prerequisites

Before you start, you must have Docker installed and running on your machine:
* **Mac/Windows:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
* **Linux:** Install [Docker Engine](https://docs.docker.com/engine/install/).


> **Note:** Make sure the Docker application is actually open and running before proceeding to the next steps.

---

## Step-by-Step Setup

### Step 1: Start the Infrastructure
We have a blueprint file called `docker-compose.yml` in the root of the project. This file tells Docker exactly how to build our local databases.

Open your terminal in the root folder of this project and run:
```bash
docker compose up -d
```

### Step 2. Configure Your Local Environment
We never share production passwords. For local development, you will connect to the isolated Docker databases.

1. Duplicate the `.env.example` file in the root directory.
2. Rename the duplicated file to `.env.local`.