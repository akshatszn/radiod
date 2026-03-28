# Project Radiod

Project Radiod is a modern music streaming and social platform designed to create an engaging and interactive music discovery experience. Built with Next.js, it brings together user authentication, a music content pipeline, global audio playback, social interactions, and community features into a single cohesive web application.

## Key Features
- **Music Playback**: Search and play music seamlessly with a global responsive player.
- **Social & Community**: Connect with others, discover shared playlists, and engage with community-driven content.
- **Library Management**: Curate personal libraries, manage favorites, and track history.
- **Modern UI**: An aesthetically pleasing, dynamic, and responsive interface built for an optimal user experience.

## Technology Stack
- **Framework**: Next.js (App Router)
- **Database ORM**: Prisma
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Styling**: Vanilla CSS / React
- **Language**: TypeScript

## Getting Started Locally

Follow these instructions to set up and run Project Radiod on your local machine.

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18 or higher recommended)
- **npm**, **yarn**, **pnpm**, or **bun**

### 1. Clone the Repository (or navigate to the project directory)

If you haven't already, navigate your terminal to the project root directory where `package.json` is located.

```bash
cd radiod
```

### 2. Install Dependencies

Install the project dependencies using your preferred package manager:

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add the necessary environment variables. You will need a database connection string for Prisma (e.g., SQLite for local dev, or Postgres) and any NextAuth secrets.

Example `.env` for local SQLite development:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"
```

### 4. Database Initialization

Run the Prisma migrations to set up your local database schema:

```bash
npx prisma db push
# or
npx prisma migrate dev
```

### 5. Start the Development Server

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application will automatically reload if you make code changes.

## Development Status

The current focus is on final integration of database-driven dynamic content into the core platform pages (Dashboard, Library, Community).
