# KookGuide

KookGuide is a full-stack recipe assistant web app powered by AI. Users can generate, save, update, and delete recipes via a simple interface.

## Project Structure

```
backend/
  src/
    app.js
    server.js
    config/db.js
    controllers/recipeController.js
    models/models.js
  .env
  package.json
frontend/
  public/
    index.html
    script.js
    style.css
    2ChatGPT Image Sep 16, 2025, 12_18_26 AM.png
    ChatGPT Image Sep 16, 2025, 12_18_26 AM.png
  server.js
  package.json
.gitignore
```

## Setup

### Prerequisites

- Node.js (see `.nvmrc` for recommended version)
- MongoDB instance
- Groq API key for AI responses

### Backend

1. Copy `.env.example` to `.env` and set:
   ```
   MONGO_URL=<your_mongodb_url>
   GROQ_API_KEY=<your_groq_api_key>
   ```
2. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
3. Start backend server:
   ```sh
   npm start
   ```
   The backend runs on port `3222`.

### Frontend

1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start frontend server:
   ```sh
   npm start
   ```
   The frontend runs on port `3221`.

3. Open [http://localhost:3221](http://localhost:3221) in your browser.

## Usage

- Enter a recipe prompt and click **Create**.
- View, update, or delete recipes in the sidebar.
- Recipes are generated using Groq AI and stored in MongoDB.

## API Endpoints

- `GET /recipes` — List all recipes
- `POST /recipes` — Create a new recipe (`{ prompt }`)
- `PUT /recipes` — Update a recipe (`{ id, prompt }`)
- `DELETE /recipes` — Delete a recipe (`{ id }`)

## License

MIT

---

For questions or issues, open an issue or contact the maintainer.