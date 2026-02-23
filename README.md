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
- **Two-Factor Authentication (2FA)**: Enhanced security with authenticator app and email-based 2FA
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

# Email Configuration (for 2FA)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

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

<!-- TODO: Add team member information -->
- **wzahir**: Role(s) and responsibilities
- **mlabyed**: Role(s) and responsibilities  
- **akoraich**: Role(s) and responsibilities
- **meabdelk**: Role(s) and responsibilities
- **oaoulad-**: Role(s) and responsibilities

---

## Project Management

<!-- TODO: Add project management details -->

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

**Email Service:**
- **Nodemailer 7.0.12**: Email sending for 2FA codes and notifications

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
| `twofa_method` | TEXT | 2FA method (authenticator/email) | - |
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
- **Email-based 2FA**: Alternative 2FA method using time-limited codes sent via email
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

<!-- TODO: Add modules information -->

---

## Individual Contributions

<!-- TODO: Add individual contributions information -->



---

*Last updated: February 2026*