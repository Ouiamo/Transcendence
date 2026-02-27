*This project has been created as part of the 42 curriculum by wzahir, mlabyed, akoraich, meabdelk, oaoulad-*

# ft_transcendence - Real-Time Pong Gaming Platform

## Description

**ft_transcendence** is a modern web-based multiplayer Pong game platform that combines classic gameplay with contemporary web technologies. This project represents a full-stack web application featuring real-time gameplay, user authentication with OAuth integration, social features, and comprehensive game statistics tracking.

### Project Overview

The platform enables users to play the classic Pong game in real-time against other players, with support for both online multiplayer and AI opponents. Built as a single-page application (SPA), it provides a seamless user experience with responsive design and real-time updates.

### Key Features

- **Real-time Multiplayer Gaming**: Play Pong against other online players with WebSocket-based real-time synchronization
- **AI Opponent**: Practice against an AI opponent with adjustable difficulty
- **User Authentication**: Secure registration and login system with OAuth2 integration (42 Network, Google)
- **Two-Factor Authentication (2FA)**: Enhanced security with authenticator app and based 2FA
- **Social Features**: Friend system with friend requests, friend list management, and online status tracking
- **Game History & Statistics**: Comprehensive tracking of match history, win/loss records, and performance metrics
- **User Profiles**: Customizable user profiles with avatar upload, profile editing, and statistics display
- **Global Leaderboard**: Ranking system based on player performance and statistics
- **Game Invitations**: Direct challenge system to invite friends to private matches
- **Responsive Design**: Modern UI built with React and Tailwind CSS, optimized for various screen sizes

---

## Instructions

### Prerequisites

Before running the project, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 1.29 or higher)
- **Node.js** (version 18.x or higher) - for local development
- **npm** (version 9.x or higher) - for package management

### Environment Configuration

Create a `.env` file in the `my_project/backend/` directory with the following variables:

```env
# Server Configuration
BACKEND_URL=https://localhost:3010
PORT=3010

# JWT & Security
JWT_SECRET=your_jwt_secret_here
COOKIE_SECRET=your_cookie_secret_here

# OAuth - 42 Network
FORTYTWO_CLIENT_ID=your_42_client_id
FORTYTWO_CLIENT_SECRET=your_42_client_secret
FORTYTWO_REDIRECT_URI=https://localhost/api/auth/42/callback

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://localhost/api/auth/google/callback


### SSL Certificates

The application uses HTTPS. You need to generate SSL certificates:

1. For backend (`my_project/backend/certs/`):
```bash
mkdir -p my_project/backend/certs
openssl req -x509 -newkey rsa:4096 -keyout my_project/backend/certs/key.pem -out my_project/backend/certs/cert.pem -days 365 -nodes
```

2. For frontend (`my_project/frontend/certs/`):
```bash
mkdir -p my_project/frontend/certs
openssl req -x509 -newkey rsa:4096 -keyout my_project/frontend/certs/key.pem -out my_project/frontend/certs/cert.pem -days 365 -nodes
```

### Installation & Execution

1. **Clone the repository:**
```bash
git clone <repository_url>
cd newtrans
```

2. **Navigate to the project directory:**
```bash
cd my_project
```

3. **Build and start the application using Docker Compose:**
```bash
docker-compose up --build
```

4. **Access the application:**
   - Frontend: `https://localhost`
   - Backend API: `http://localhost:3010` (internal, proxied through frontend)

5. **Stop the application:**
```bash
docker-compose down
```

## Resources

### Documentation & References

**Web Technologies:**
- [Fastify Documentation](https://www.fastify.io/) - Backend framework
- [React Documentation](https://react.dev/) - Frontend framework
- [Socket.IO Documentation](https://socket.io/docs/v4/) - Real-time communication
- [SQLite Documentation](https://www.sqlite.org/docs.html) - Database system
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type-safe development
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - UI styling

**Authentication & Security:**
- [OAuth 2.0 Specification](https://oauth.net/2/) - OAuth implementation
- [Speakeasy Documentation](https://github.com/speakeasyjs/speakeasy) - 2FA implementation
- [JWT.io](https://jwt.io/) - JSON Web Tokens
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js) - Password hashing

**Game Development:**
- [HTML5 Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) - Game rendering
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - Real-time game state


---

## Team Information


### wzahir — Project Manager (PM) & Backend Developer

**PM Responsibilities:**
- Organized team meetings and sprint planning sessions.
- Tracked progress and deadlines.
- Ensured communication between frontend and backend.
- Managed risks and blockers.

**Developer Responsibilities:**
- Implemented authentication system (JWT, login/signup).
- Integrated OAuth 2.0 (42 & Google).
- Developed 2FA system (TOTP + QR code).
- Contributed to backend security architecture.

---

### mlabyed — Product Owner (PO) & Frontend Lead

**PO Responsibilities:**
- Defined product vision and prioritized features.
- Maintained the product backlog.
- Validated completed work and feature integration.
- Communicated with evaluators and stakeholders.

**Developer Responsibilities:**
- Developed main frontend pages (Login, Signup, Home, Dashboard, Profile).
- Implemented routing and protected routes (React Router).
- Integrated 2FA flows on frontend.
- Ensured cross-browser compatibility and UI consistency.

---

### meabdelk — Technical Lead (TL) & Game Developer

**TL Responsibilities:**
- Defined technical architecture and WebSocket strategy.
- Reviewed critical code changes.
- Ensured code quality and modular design.

**Developer Responsibilities:**
- Implemented real-time multiplayer Pong game.
- Managed latency, synchronization, and reconnection logic.
- Built game invitation system.
- Developed frontend game interface.

---

### akoraich — AI & Data Systems Developer

**Developer Responsibilities:**
- Designed AI opponent logic.
- Developed game statistics and leaderboard.
- Built analytics dashboard with charts.
- Managed match history persistence.

---

### oaoulad- — Backend API & Social Features Developer

**Developer Responsibilities:**
- Developed secured Public API (CRUD endpoints).
- Implemented rate limiting and API security.
- Built friend system (requests, online status, removal).
- Implemented avatar upload and account deletion modules.

---

## Project Management

Proper organization and task coordination were crucial for the success of **ft_transcendence**. Our team followed a structured workflow with clearly defined roles and responsibilities.

### Work Organization
- Features were divided into major modules:  
  - Authentication & Security  
  - Real-Time Game Engine  
  - AI & Statistics  
  - Public API & Social Features  
  - Frontend Interface
- Each module had a responsible lead.
- Development tasks were tracked using GitHub Issues.
- Features were implemented in dedicated Git branches.
- Pull requests were reviewed before merging into the main branch.
- Weekly integration sessions were held to ensure system stability.

### Tools Used
- **Version Control:** Git & GitHub  
- **Task Management:** GitHub Issues, Milestones, Feature Branches  
- **Communication:** Discord for text and voice communication  
- **Collaboration:** Pair programming and screen-sharing for complex features  

### Development Methodology
- Agile-inspired workflow with milestones and sprints.
- Modular architecture with separation of concerns.
- Real-time communication handled with WebSockets.
- Security-first approach (HTTPS, JWT, 2FA, secure cookies).
- Continuous testing, code reviews, and refactoring.

### Risk Management
- Potential risks identified:
  - Real-time synchronization challenges
  - OAuth integration issues
  - HTTPS and cookie security setup
  - Cross-browser compatibility
- Mitigation strategies:
  - Early prototype testing for WebSockets
  - Dedicated OAuth testing environment
  - SSL certificate setup and testing
  - Manual and automated cross-browser testing
---

## Technical Stack

### Frontend Technologies

**Core Framework:**
- **React 19.2.4**: Modern UI library for building component-based single-page application
- **TypeScript 5.9.3**: Type-safe development with static type checking
- **Vite 7.2.4**: Fast build tool and development server with hot module replacement

**Styling & UI:**
- **Tailwind CSS 4.1.18**: Utility-first CSS framework for rapid UI development
- **Lottie React 2.4.1**: Animation library for rendering After Effects animations
- **React Icons 5.5.0**: Comprehensive icon library
- **Chart.js 4.5.1 + React ChartJS 2**: Data visualization for statistics and leaderboards

**Routing & State:**
- **React Router DOM 7.13.0**: Client-side routing for SPA navigation
- **Socket.IO Client 4.8.3**: Real-time bidirectional event-based communication

**Development Tools:**
- **ESLint**: Code linting and quality enforcement
- **PostCSS + Autoprefixer**: CSS processing and browser compatibility

### Backend Technologies

**Core Framework:**
- **Fastify 4.29.1**: High-performance web framework chosen for its speed and low overhead
- **Node.js**: JavaScript runtime environment

**Authentication & Security:**
- **@fastify/jwt 8.0.1**: JWT token generation and verification
- **@fastify/cookie 8.3.0**: Cookie parsing and signing
- **bcryptjs 2.4.3**: Password hashing with salt
- **Speakeasy 2.0.0**: Time-based one-time password (TOTP) generation for 2FA
- **QRCode 1.5.4**: QR code generation for authenticator app setup

**Real-time Communication:**
- **Socket.IO 4.8.3**: WebSocket library for real-time game state synchronization and online status

**Additional Backend Libraries:**
- **@fastify/cors 8.0.0**: Cross-origin resource sharing configuration
- **@fastify/static 9.0.0**: Static file serving for avatars and assets
- **dotenv 17.2.3**: Environment variable management
- **jsonwebtoken 9.0.3**: JWT token utilities

### Database System

**Database: SQLite3 5.0.0**

**Why SQLite was chosen:**
1. **Simplicity**: Zero-configuration, serverless database perfect for this project's scale
2. **Portability**: Single-file database easy to backup and deploy with Docker
3. **Performance**: Sufficient for the expected user load and query patterns
4. **Development Speed**: No need to manage separate database server during development
5. **Reliability**: ACID-compliant with robust transaction support
6. **Resource Efficiency**: Low memory footprint, ideal for containerized deployment

**Trade-offs considered:**
- SQLite is ideal for small to medium-scale applications (up to ~100K users)
- For production scale beyond this, PostgreSQL or MySQL could be considered as alternatives
- Concurrent write limitations acceptable given the read-heavy nature of the application

### Game Server Technologies

**TypeScript Game Server:**
- **TypeScript 5.9.3**: Type-safe game logic implementation
- **Socket.IO**: Real-time game state broadcasting and player input handling
- **Canvas API**: Client-side game rendering

### Deployment & DevOps

**Containerization:**
- **Docker**: Application containerization for consistent deployment
- **Docker Compose**: Multi-container orchestration for frontend, backend, and networking

**Web Server:**
- **Nginx**: Reverse proxy and static file serving for production frontend

### Technical Justifications

**Why Fastify over Express:**
- Superior performance with up to 2x faster request handling
- Built-in TypeScript support and modern async/await patterns
- Powerful plugin architecture for better code organization
- JSON schema validation out of the box

**Why React with Vite:**
- Vite provides instant server start and lightning-fast HMR
- Modern build tool with optimized production bundles
- Better development experience compared to Create React App
- TypeScript support without additional configuration

**Why Socket.IO:**
- Automatic reconnection and fallback mechanisms
- Room-based architecture perfect for game lobbies
- Built-in support for binary data and JSON
- Wide browser compatibility and mobile support

**Why TypeScript:**
- Early error detection during development
- Better IDE support with autocomplete and refactoring
- Self-documenting code through type definitions
- Easier maintenance and collaboration in team environment

---

## Database Schema

### Visual Representation

```
┌─────────────────────────────────┐
│           USERS                 │
├─────────────────────────────────┤
│ id (PK)                         │
│ provider                        │
│ provider_id                     │
│ email (UNIQUE)                  │
│ password_hash                   │
│ username (UNIQUE)               │
│ firstname                       │
│ lastname                        │
│ avatar_url                      │
│ twofa_enabled                   │
│ twofa_method                    │
│ twofa_secret                    │
│ created_at                      │
└─────────────────────────────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────────────────────┐
│          FRIENDS                │
├─────────────────────────────────┤
│ id (PK)                         │
│ user_id (FK → users.id)         │
│ friend_id (FK → users.id)       │
│ status                          │
│ created_at                      │
└─────────────────────────────────┘
```

### Tables and Relationships

#### **Users Table**

Stores all user account information, authentication data, and 2FA settings.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | INTEGER | Primary key, auto-increment | PRIMARY KEY |
| `provider` | TEXT | Authentication provider (local/42/google) | NOT NULL |
| `provider_id` | TEXT | OAuth provider's user ID | UNIQUE |
| `email` | TEXT | User email address | UNIQUE, NOT NULL |
| `password_hash` | TEXT | Bcrypt hashed password | NOT NULL |
| `username` | TEXT | Display username | UNIQUE, NOT NULL |
| `firstname` | TEXT | User's first name | - |
| `lastname` | TEXT | User's last name | - |
| `avatar_url` | TEXT | URL/path to user avatar | DEFAULT: '/api/avatar/default.png' |
| `twofa_enabled` | BOOLEAN | 2FA activation status | DEFAULT: false |
| `twofa_method` | TEXT | 2FA method (authenticator) | - |
| `twofa_secret` | TEXT | TOTP secret for authenticator app | - |
| `created_at` | TIMESTAMP | Account creation timestamp | DEFAULT: CURRENT_TIMESTAMP |

**Relationships:**
- One user can have many friends (1:N relationship with friends table)
- One user can have many game history records
- One user can have many statistics records

#### **Friends Table**

Manages friend relationships and friend request statuses between users.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | INTEGER | Primary key, auto-increment | PRIMARY KEY |
| `user_id` | INTEGER | ID of user who initiated/received request | NOT NULL, FK → users.id |
| `friend_id` | INTEGER | ID of the friend | NOT NULL, FK → users.id |
| `status` | TEXT | Friendship status | DEFAULT: 'pending' |
| `created_at` | TIMESTAMP | Request creation timestamp | DEFAULT: CURRENT_TIMESTAMP |

**Status Values:**
- `pending`: Friend request sent but not yet accepted
- `accepted`: Friend request accepted, users are friends
- `blocked`: User has blocked the other user

**Relationships:**
- `user_id` references `users.id` (who sent or received the request)
- `friend_id` references `users.id` (the other user in the relationship)


## Features List

### Core Features

#### 1. **User Authentication & Authorization**
- **Standard Authentication**: Email/password registration and login with bcrypt password hashing
- **OAuth2 Integration**: Login via 42 Network and Google accounts
- **JWT-based Sessions**: Secure token-based authentication with httpOnly cookies
- **Session Management**: Automatic token refresh and logout functionality

#### 2. **Two-Factor Authentication (2FA)**
- **Authenticator App Support**: TOTP-based 2FA using apps like Google Authenticator or Authy
- **QR Code Generation**: Easy setup by scanning QR code with authenticator app
- **2FA Management**: Enable/disable 2FA from user settings

#### 3. **User Profile Management**
- **Profile Viewing**: Display user information, statistics, and game history
- **Avatar Upload**: Custom profile picture upload with file type validation
- **Profile Editing**: Update username, first name, last name, and email
- **Account Deletion**: Complete account removal with data cleanup

#### 4. **Real-time Multiplayer Pong Game**
- **Matchmaking**: Automatic player pairing in game queue
- **Real-time Gameplay**: Smooth 60 FPS gameplay synchronized via WebSockets
- **Game Physics**: Authentic Pong mechanics with ball acceleration and paddle collision
- **Score Tracking**: Live score updates during matches
- **Game Completion**: Automatic winner determination and match history recording

#### 5. **AI Opponent**
- **Single Player Mode**: Play against computer-controlled opponent
- **AI Difficulty Levels**: Adjustable difficulty for varying challenge
- **AI Logic**: Predictive paddle movement algorithm

#### 6. **Friend System**
- **Friend Requests**: Send and receive friend requests
- **Friend List Management**: View all friends with online/offline status
- **Friend Request Notifications**: Real-time notifications for new friend requests
- **Accept/Reject Requests**: Manage incoming friend requests
- **Remove Friends**: Unfriend functionality

#### 7. **Online Presence System**
- **Real-time Status**: Display online/offline status of friends
- **Status Broadcasting**: Automatic status updates via WebSockets
- **Grace Period**: 3-second offline grace period for connection hiccups

#### 8. **Game Invitations**
- **Private Matches**: Challenge specific friends to a game
- **Invitation System**: Send and receive game invites
- **Invitation Notifications**: Real-time invite delivery
- **Accept/Decline**: Respond to game invitations

#### 9. **Game History & Statistics**
- **Match History**: Complete record of all played games
- **Win/Loss Tracking**: Personal win/loss statistics
- **Performance Metrics**: Games played, win rate calculation
- **Match Details**: View scores and opponents from past games

#### 10. **Global Leaderboard**
- **Ranking System**: Player rankings based on performance metrics
- **Statistics Display**: View top players with their stats
- **User Ranking**: Find your position in global rankings
- **Sortable Columns**: Sort by wins, games played, win rate, etc.

#### 11. **Responsive UI/UX**
- **Modern Design**: Clean, intuitive interface with Tailwind CSS
- **Animated Elements**: Lottie animations for engaging user experience
- **Mobile Responsive**: Optimized for tablets and mobile devices
- **Dark Theme**: Easy-on-the-eyes dark color scheme
- **Loading States**: Smooth loading indicators and transitions

#### 12. **Security Features**
- **HTTPS Encryption**: All communications encrypted with SSL/TLS
- **CORS Protection**: Configured CORS policy for API security
- **SQL Injection Prevention**: Parameterized queries for database safety
- **XSS Protection**: Input sanitization and validation
- **Secure Cookies**: httpOnly and secure cookie flags
- **Password Requirements**: Strong password enforcement

### Additional Features

#### 13. **Settings Management**
- **2FA Settings**: Configure two-factor authentication preferences
- **Account Settings**: Update account information
- **Privacy Controls**: Manage profile visibility

#### 14. **Legal Pages**
- **Privacy Policy**: Comprehensive privacy policy page
- **Terms of Service**: Terms and conditions page

#### 15. **Navigation & Routing**
- **SPA Navigation**: Smooth page transitions without full reloads
- **Protected Routes**: Authentication-required route guards
- **Sidebar Navigation**: Persistent sidebar with active state indicators

---

## Modules


**Major Modules:**
- **Use a framework for both frontend and backend (React + Fastify):** React provides a component-based SPA architecture, while Fastify offers high-performance routing and a lightweight plugin system — together they give a clean separation of concerns and faster development.
- **Public API with secured key, rate limiting, documentation, and at least 5 endpoints (GET, POST, PUT, DELETE):** Exposes core platform data to third parties in a controlled, abuse-resistant way, demonstrating production API design practices.
- **Standard user management and authentication (profile update, avatar upload, friends with online status, profile page):** Covers the essential social layer of any multiplayer platform — users need persistent identities, profiles, and a way to connect with others.
- **Real-time features using WebSockets:** Game state, online presence, and invitations all require instant two-way communication that HTTP polling cannot deliver reliably.
- **Complete web-based game (Pong with live matches, clear rules, win/loss conditions):** The core deliverable of the project — a fully playable, rule-complete game running in the browser without any native dependencies.
- **Remote players (two players on separate computers, latency handling, disconnection management, reconnection logic):** Moves the game beyond localhost, requiring server-authoritative state and handling real network conditions such as lag and drops.
- **AI Opponent for games (challenging AI that wins occasionally, human-like behavior, explainable implementation):** Gives solo users a meaningful practice mode and fills game queues when no human opponent is available.


**Minor Modules:**
- **Remote authentication with OAuth 2.0 (42, Google):** Lets users sign in with existing accounts, reducing friction at registration and offloading credential management to trusted providers.
- **Complete 2FA system (authenticator app):** Adds a second layer of account security using TOTP, protecting users whose passwords may be compromised.
- **Game statistics and match history (wins/losses, match history, leaderboard):** Gives players a reason to keep coming back by tracking progress and enabling friendly competition through rankings.
- **User activity analytics and insights dashboard:** Surfaces aggregated play data in visual form, making personal performance easy to understand at a glance.
- **Support for additional browsers (Firefox, Brave — full compatibility, testing, consistent UI/UX):** Ensures the platform is accessible to users regardless of browser choice, with verified parity across Chromium-based and non-Chromium engines.
- Module of choice: Account deletion with data cleanup and confirmation flow

---

## Module of Choice — Justification

### Account Deletion with Data Cleanup (Minor Module)

**Why we chose this module:**
Account deletion is a real production requirement that touches every layer of the stack — authentication, database, file system, and active sessions. It was chosen to demonstrate full-stack ownership rather than an isolated feature.

**Technical challenges it addresses:**
- Cascading deletion across multiple tables (users, friends, game history, stats) without breaking foreign key constraints
- Physical avatar file removal from disk alongside database cleanup
- Session and JWT cookie invalidation to prevent ghost sessions after deletion
- Preventing data writes during an active deletion process

**How it adds value:**
- Gives users full control over their personal data (GDPR-aligned)
- Demonstrates production-quality thinking beyond basic CRUD
- Includes a multi-step confirmation flow on the frontend to prevent accidental deletion

**Why it deserves Minor Module status:**
- Requires coordinated logic across routes, database, file system, and session management
- Frontend implements a secure confirmation modal (password re-entry before deletion)
- Handles edge cases: pending friend requests, ongoing game sessions, orphaned avatar files
- Goes well beyond a simple `DELETE FROM users WHERE id = ?` query

---

## Architecture Overview

### Application Architecture

The application follows a client-server architecture:

- **Frontend:** React SPA (served via Nginx over HTTPS)
- **Backend:** Fastify API server (REST + WebSocket)
- **Database:** SQLite (persistent storage)
- **Real-time Communication:** Socket.IO (WebSockets)
- **Reverse Proxy:** Nginx handling HTTPS and routing

### Authentication Flow

1. User submits login credentials.
2. Backend verifies credentials.
3. JWT token is generated.
4. Token is stored in a secure httpOnly cookie.
5. Protected routes verify JWT via middleware.

### Real-Time Game Flow

1. Player joins matchmaking queue.
2. Server pairs players and creates a game room.
3. Server maintains authoritative game state.
4. Game state is broadcasted via WebSockets.
5. Match result is stored in the database.


---

## Public API Overview

The backend provides secured public API endpoints, protected by **API key** and **rate limiting** (100 requests per minute per IP). All endpoints respond with JSON.

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/stats` | Returns total user count and server time |
| GET | `/api/public/users` | Returns a list of up to 10 users with their creation date |
| POST | `/api/public/contact` | Submit a contact message (`name` + `message`) |
| PUT | `/api/public/feedback` | Submit feedback rating (`rating` required) |
| DELETE | `/api/public/request` | Delete a request by `request_id` |
| GET | `/api/public` | Overview of the public API and application status |

**Authentication & Security:**
- Each request requires a valid API key in header: `x-api-key: pong-api-key`
- Rate limiting enforced: max 100 requests per minute per IP
- Responses include proper HTTP status codes:
  - 401: Invalid API key
  - 429: Rate limit exceeded
  - 400: Missing required fields
  - 500: Server or database errors


## Individual Contributions


### wzahir
- Standard user management (profile update, profile page)
- Remote authentication with OAuth 2.0 (42, Google)
- Complete 2FA system (authenticator app)
- Settings page frontend
- Authentication backend (login/signup, JWT, middleware)

### oaoulad-
- Public API with secured key, rate limiting, documentation (GET, POST, PUT, DELETE endpoints)
- Avatar upload system (with default avatar)
- Friend system (invetation/remove/accept friends, online status..)
- Frontend friend page
- Account deletion (module of choice)

### meabdelk
- Real-time features using WebSockets
- Complete web-based Pong game (live matches, clear rules, win/loss conditions)
- Remote players (two players on separate computers, latency handling, disconnection management, reconnection logic)
- Game invitation system
- Frontend game interface

### akoraich
- AI Opponent for games (challenging AI that wins occasionally, human-like behavior)
- Game statistics and match history (wins/losses, match history, leaderboard)
- User activity analytics dashboard
- Statistics with Chart
- Leaderboard with rankings

### mlabyed
- Main frontend developer (login, signup, home, dashboard, profile pages)
- Frontend routing navigation (React Router with protected routes)
- 2FA frontend integration (setup wizard, verification screens)
- Support for additional browsers (Firefox, brave - testing and fixes)
---

*Last updated: February 2026*
