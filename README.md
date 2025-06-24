# ModernBidSystem

ModernBidSystem is a full-stack, real-time online auction platform for paintings, built with Express, React, PostgreSQL, and WebSockets. It supports live bidding, analytics dashboards, and a modern UI with Radix UI and TailwindCSS.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Database](#database)
- [WebSocket Real-Time Bidding](#websocket-real-time-bidding)
- [API Endpoints](#api-endpoints)
- [Dashboard Analytics](#dashboard-analytics)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Live Auctions:** Real-time bidding on paintings with instant updates.
- **WebSocket Support:** Live bid updates using WebSockets.
- **User Authentication:** Secure login and session management (Passport.js).
- **Analytics Dashboard:** View top paintings, bid stats, and auction activity.
- **Modern UI:** Built with React, Radix UI, and TailwindCSS.
- **PostgreSQL Database:** Robust data storage for auctions and bids.
- **Validation:** Strong input validation with Zod and Drizzle ORM.
- **Responsive Design:** Works on desktop and mobile.

---

## Tech Stack

- **Frontend:** React, Radix UI, TailwindCSS, Vite
- **Backend:** Express, Node.js, WebSocket (ws), Drizzle ORM
- **Database:** PostgreSQL
- **Authentication:** Passport.js, express-session
- **Validation:** Zod
- **Build Tools:** Vite, esbuild, TypeScript

---

## Project Structure

```
ModernBidSystemnew/
├── server/
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API and WebSocket routes
│   ├── storage.ts       # Database access layer
│   └── ...              
├── shared/
│   └── schema.ts        # Zod validation schemas
├── client/              # React frontend (if present)
├── dist/                # Production build output
├── package.json
├── .env                 # Environment variables
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- npm

### Installation

1. **Clone the repo:**
   ```sh
   git clone <repo-url>
   cd ModernBidSystemnew
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in your PostgreSQL credentials.

4. **Run database migrations:**
   ```sh
   npm run db:push
   ```

5. **Build the project:**
   ```sh
   npm run build
   ```

6. **Start the server:**
   ```sh
   npm start
   ```
   - For development with hot reload:
     ```sh
     npm run dev
     ```

---

## Scripts

| Command         | Description                                 |
|-----------------|---------------------------------------------|
| `npm run dev`   | Start server in development mode            |
| `npm run build` | Build client and server for production      |
| `npm start`     | Start production server                     |
| `npm run check` | TypeScript type checking                    |
| `npm run db:push` | Push Drizzle ORM migrations to database   |

---

## Database

- **PostgreSQL** is used for storing users, paintings, and bids.
- ORM: **Drizzle ORM**
- Validation: **Zod**
- Configure your database connection in `.env`.

**Viewing the Database:**
- Use `psql`, `pgAdmin`, or a VS Code PostgreSQL extension to inspect tables and data.

---

## WebSocket Real-Time Bidding

- WebSocket server runs at `/ws`.
- Clients join rooms for specific paintings.
- Bid updates are broadcast instantly to all connected clients for that painting.

---

## API Endpoints

- `GET /api/auctions` — List all paintings/auctions
- `GET /api/auctions/:id` — Get details and bids for a painting
- `GET /api/auctions/:id/bids` — Get all bids for a painting
- `POST /api/auctions/:id/bid` — Place a bid (JSON body)
- `GET /api/dashboard` — Get analytics (total bids, top paintings, etc.)

---

## Dashboard Analytics

- **totalBids:** Total number of bids placed
- **highestBid:** Highest bid across all auctions
- **activeAuctions:** Number of ongoing auctions
- **avgBidsPerItem:** Average bids per painting
- **topPaintings:** Top 3 paintings by bid count

---

## Customization

- **UI:** Modify React components in `/client` (if present).
- **Server:** Edit API logic in `/server/routes.ts`.
- **Database:** Update Drizzle ORM models in `/server/storage.ts`.

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## License

MIT

---

**Questions?**  
Open an issue or contact the