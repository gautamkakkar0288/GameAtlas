# GameAtlas

GameAtlas is a production-ready gaming platform that aggregates your gaming library across multiple platforms (Steam, Epic, Xbox, PlayStation), calculates your unique "Gaming DNA", and provides personalized game recommendations.

## Features

- **Secure Authentication**: Server-side Google OAuth integration.
- **Multi-Platform Sync**: Real-time synchronization of owned games and playtime from Steam, Epic, Xbox, and PlayStation.
- **Gaming DNA**: Deterministic scoring system based on your activity signals.
- **Personalized Recommendations**: AI-driven recommendation engine based on your Gaming DNA.
- **Responsive UI**: Modern, accessible interface built with React, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Backend**: Express.js, Node.js, PostgreSQL (Drizzle ORM).
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, TanStack Query.
- **Authentication**: OAuth2/OIDC.
- **External APIs**: Steam Web API, IGDB API.

## Deployment

This project is configured for deployment on Vercel. Ensure the following environment variables are set:

- `DATABASE_URL`: PostgreSQL connection string.
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID.
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret.
- `STEAM_API_KEY`: Steam Web API Key.
- `JWT_SECRET`: Secret for JWT token signing.
- `NODE_ENV`: Set to `production`.

## License

MIT
