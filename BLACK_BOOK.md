# Bharat Yatra — Project Black Book

## 1) Project Snapshot

**Bharat Yatra** is a multiplayer, India-themed educational board game. Players move across a graph of Indian cities, answer quizzes, collect coins, buy/use cards, exchange at fairy/shop locations, and race to 10 stars.

- **Frontend:** React + TypeScript + Vite + Zustand + Tailwind.
- **Backend:** Node.js + Express + TypeScript + WebSocket (`ws`) + Prisma + PostgreSQL.
- **AI content:** Google Gemini for quiz and regional learning content with robust fallbacks.

Core game loop:
1. Create/join room.
2. Wait in lobby until room fills.
3. Roll dice and move on map graph.
4. Resolve tile events (quiz/fairy/shop/treasure).
5. Spend/earn coins and stars.
6. First player with **10 stars** wins.

---

## 2) Monorepo Layout

```text
/workspace/BharatYatra
├── frontend/    # Vite + React app
└── server/      # Express + WS + Prisma backend
```

### Frontend key areas
- `src/pages/` — route-level pages (`Home`, `Lobby`, `Game`, `Landing`).
- `src/components/` — game UI panels, modals, map, notifications.
- `src/game/store.ts` — global game/UI state (Zustand).
- `src/game/ws.client.ts` — WS transport + server event handling.
- `src/game/constants.ts` — map node graph for frontend rendering.

### Backend key areas
- `src/index.ts` — HTTP + WS bootstrapping.
- `src/routes/` — REST APIs (`rooms`, `game`, `gemini`).
- `src/ws/gameState.ts` — in-memory game engine and map.
- `src/ws/handlers.ts` — WS protocol implementation and orchestration.
- `src/services/gemini.service.ts` — AI quiz/info generation with fallback.
- `prisma/schema.prisma` — DB schema.

---

## 3) Product Flow (End-to-End)

### A. Entry and rooming
- User enters name and either creates or joins a room from `Home`.
- Frontend ensures WebSocket connection first.
- On `ROOM_CREATED` and `ROOM_STATE`, app stores `roomId` + `playerId` and routes to lobby.

### B. Lobby
- Lobby shows joined players and empty slots.
- Game auto-starts when player count reaches max configured players (4).

### C. Gameplay
- Active player rolls dice (`ROLL_DICE`), server calculates valid move path options.
- Player moves (`MOVE_PLAYER`), server updates position and triggers events:
  - treasure → star reward,
  - fairy tile → optional coin-to-star exchange,
  - shop tile → buy star/card or skip,
  - regular tile → quiz.
- Quiz answer affects coins; then educational region info is displayed.
- Turn ends via `END_TURN`; next player begins.

### D. Win condition
- Any action granting a player 10+ stars triggers game over and final score broadcast.

---

## 4) Gameplay Rules and Economy

### Global rules
- Start coins: **500**.
- Win stars: **10**.
- Max players: **4**.
- Min players to start (config): **2** (runtime auto-start currently uses 4 in handlers).

### Quiz economy
- Correct answer reward and incorrect penalty are configured in game constants.
- If player has ANSWER card effect active, answer can be auto-corrected.

### Special tiles
- **START:** Kanyakumari.
- **SHOP:** allows buying star/cards.
- **FAIRY node:** coin-to-star exchange and fairy relocates.
- **Treasure nodes:** fixed count per game, rewarding stars.

### Cards
- `BLOCK` — blocks another player’s next turn.
- `TELEPORT` — instant movement advantage.
- `ANSWER` — auto-correct support in quiz context.

Card costs:
- BLOCK: 500
- ANSWER: 1000
- TELEPORT: 3000

Shop star cost:
- 5000 coins for 1 star.

Fairy exchange cost:
- 1000 coins per star.

---

## 5) Map System

The board is a **graph** of Indian city nodes, each with:
- id, name, region
- x/y coordinates (for rendering)
- neighbors (legal movement edges)
- node type (`REGULAR`, `SHOP`, `START`)

Examples of connected clusters:
- South: Kanyakumari, Chennai, Bangalore, Kochi, etc.
- West: Mumbai, Pune, Ahmedabad, Jaipur connection corridor.
- East/North-East: Kolkata, Patna, Guwahati, Shillong.
- North: Delhi, Agra, Lucknow, Chandigarh, Amritsar, Srinagar.

Map exists in both frontend (`constants.ts`) and backend (`gameState.ts`) to support rendering and authoritative game logic.

---

## 6) Frontend Architecture

### Routing
Defined in `App.tsx`:
- `/` → Home
- `/lobby` → Lobby
- `/game` → Game
- `/landing` → landing animation page

### State management (Zustand)
`store.ts` tracks:
- connection and identity (`isConnected`, `playerId`, `playerName`),
- room and server game state,
- current quiz and dice/valid moves,
- modal visibility state,
- learning/region info,
- game-over payload,
- transient notifications.

### WS client behavior
`ws.client.ts`:
- reconnect strategy (up to 5 attempts),
- parses server messages and updates store,
- exposes action methods (`createRoom`, `joinRoom`, `rollDice`, `movePlayer`, `answerQuiz`, `fairyInteraction`, `shopAction`, `useCard`, `endTurn`, `learnRegion`).

### UI composition
`Game.tsx` composes:
- `IndiaMap` (main board),
- `PlayerPanel`, `ActionPanel`,
- Modals for quiz/fairy/shop/game-over/region/learning,
- Notification feed.

Landing page (`Landing.tsx`) is scroll-driven frame animation using static JPEG sequences.

---

## 7) Backend Architecture

### App bootstrap
`server/src/index.ts`:
- loads env,
- mounts CORS + JSON middleware,
- mounts REST routes:
  - `/api/rooms`
  - `/api/game`
  - `/api/gemini`
- exposes `/health`.
- attaches WebSocket game server on same HTTP server.

### Game engine
`gameState.ts` maintains in-memory room state:
- room creation/start lifecycle,
- dice rolling and valid move calculation,
- movement progression and phase transitions,
- quiz result handling,
- fairy/shop/card mechanics,
- turn sequencing,
- win checks.

### WS orchestration
`handlers.ts` handles:
- connection mapping (room/player/socket),
- message validation via zod schema,
- CRUD-like game commands,
- event broadcasting,
- DB updates for game completion,
- dynamic content generation calls.

---

## 8) Network Contracts

## 8.1 REST APIs

### Room routes (`/api/rooms`)
- `POST /` create room (name).
- `GET /` list waiting rooms with players.
- `POST /:roomId/join` validate joinability.
- `GET /:roomId` room details.

### Game routes (`/api/game`)
- `POST /result` persist game winner and mark room `FINISHED`.
- `GET /history` latest 50 results.

### Gemini routes (`/api/gemini`)
- `POST /quiz` generate MCQ for city/region.
- `POST /region-info` generate educational summary text.

## 8.2 WebSocket protocol

### Client → Server message types
- `CREATE_ROOM`
- `JOIN_ROOM`
- `ROLL_DICE`
- `MOVE_PLAYER`
- `ANSWER_QUIZ`
- `BUY_CARD` (schema exists)
- `USE_CARD`
- `FAIRY_INTERACTION`
- `SHOP_ACTION`
- `END_TURN`
- `LEARN_REGION`

### Server → Client message types
- room/lifecycle: `ROOM_CREATED`, `ROOM_STATE`, `PLAYER_JOINED`, `PLAYER_LEFT`, `GAME_STARTED`, `GAME_OVER`
- movement/turn: `DICE_ROLLED`, `PLAYER_MOVED`, `TURN_CHANGED`, `PLAYER_TELEPORTED`, `PLAYER_BLOCKED`
- events/economy: `QUIZ_GENERATED`, `QUIZ_ANSWERED`, `FAIRY_REACHED`, `FAIRY_EXCHANGED`, `SHOP_REACHED`, `CARD_PURCHASED`, `CARD_USED`, `STAR_PURCHASED`, `TREASURE_FOUND`
- learning: `REGION_INFO`
- errors: `ERROR`

---

## 9) Database Model (Prisma)

### Room
- `id` UUID
- `name`
- `status` enum: WAITING/PLAYING/FINISHED
- relation: `players[]`

### Player
- `id` UUID
- `name`
- `roomId`
- `order` (join order)
- `coins`, `stars`

### GameResult
- `id` UUID
- `roomId`
- `winnerId`
- `createdAt`

Note: real-time gameplay state is primarily in memory; DB holds room/player/result persistence, mostly for room metadata and history.

---

## 10) AI Integration Details

Gemini service:
- Model used: `gemini-2.5-flash`.
- Quiz generation prompt enforces strict JSON payload.
- Region-info generation aims for concise educational text.
- On failures (or malformed response), fallback datasets generate deterministic quiz/info by region.

This design keeps game functional even with API outages or invalid AI output.

---

## 11) Configuration and Environment

### Server env vars
- `DATABASE_URL`
- `GEMINI_API_KEY`

### Runtime defaults
- Server listens on port **3000**.
- Frontend WS URL is hardcoded to `ws://localhost:3000`.

### Build/dev scripts

Frontend:
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

Server:
- `npm run dev`
- `npm run start`

---

## 12) Setup Runbook (Recommended)

1. Install dependencies:
   - `cd server && npm install`
   - `cd ../frontend && npm install`
2. Configure server env from `.env.example`.
3. Generate/apply prisma artifacts/migrations as needed.
4. Start server (`server`): `npm run dev`
5. Start frontend (`frontend`): `npm run dev`
6. Open frontend URL and create/join room.

---

## 13) Engineering Observations (Useful for Black-Book Discussion)

1. **Dual source of map coordinates** (frontend + backend) can drift over time.
2. **In-memory game room state** means restart resets active matches.
3. **Auto-start mismatch**: config includes min players 2, but handler auto-start currently triggers at 4 players.
4. **Hardcoded WS URL** limits deployment flexibility (should be env-based).
5. **Sensitive-looking values in `.env.example`** should be rotated if real and replaced with dummy placeholders.

---

## 14) Suggested Chapter Structure for Your Black Book

1. Problem Statement and Objectives
2. Existing Gaming/EdTech Landscape
3. System Requirements (functional/non-functional)
4. Architecture Diagram and Module Breakdown
5. Data Flow and Sequence Diagrams (room creation, turn cycle, quiz flow)
6. Game Logic and Rule Engine
7. AI Integration Strategy and Fallback Design
8. Database Design and Schema Rationale
9. API + WS Contract Documentation
10. UI/UX Design Decisions (map-first interaction)
11. Testing Strategy and Edge Cases
12. Deployment Model and Operational Concerns
13. Security Considerations
14. Future Enhancements

---

## 15) Quick Glossary

- **Room**: Match lobby/game instance.
- **TurnPhase**: Current micro-state in a player turn.
- **Fairy**: Exchange coins for stars mechanic.
- **Shop**: Purchase stars/cards mechanic.
- **Treasure**: Random bonus star tile.
- **Learning Modal**: Region info shown after quiz interaction.

---

## 16) One-Line Value Proposition

**Bharat Yatra combines multiplayer board-game mechanics with AI-assisted Indian regional learning, making educational exploration competitive and replayable.**
