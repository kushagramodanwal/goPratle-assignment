# GoPratle

A 4-step form for posting event requirements for Planners, Performers, and Event Crew.

- **Frontend:** Next.js (Plain JavaScript) → `frontend/`
- **Backend:** Node.js + Express + MongoDB (Mongoose) → `backend/`

## How to Run the Project

```bash
# 1. Start the backend
cd backend
cp .env.example .env      # Add your MONGODB_URI to the .env file
npm install
npm run dev               # http://localhost:4000

# 2. Start the frontend (in a new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev               # http://localhost:3000
```

## Folder Structure

```text
backend/
  config/db.js                         MongoDB connection
  models/Requirement.js                Mongoose schema
  controllers/requirementController.js Business logic for routes
  routes/requirementRoutes.js          Maps URLs to controllers
  utils/constants.js                   Allowed values
  utils/validate.js                    Data validation logic
  server.js                            Application entry point

frontend/
  app/layout.js, page.js               Home page (form)
  app/requirements/page.js             Posted requirements list
  components/Wizard.js                 4-step form
  components/Fields.js                 Input fields for steps 2 and 3
  lib/config.js                        Configuration for all