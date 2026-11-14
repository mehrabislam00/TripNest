# TripNest

TripNest is a travel booking application built with Next.js. Users can browse
destinations, view destination details, create accounts, manage profiles, and
create or cancel bookings.

## Features

- Better Auth email and password authentication
- JWT authorization for protected backend requests
- MongoDB-backed destinations, profiles, and bookings
- Destination search and featured destination carousel
- Destination detail pages with booking status
- Profile management and booking history
- Responsive UI built with Tailwind CSS and shadcn/ui

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Better Auth
- MongoDB
- Tailwind CSS
- Express backend

## Backend

The Express and MongoDB backend is maintained in a separate repository:

[TripNest Backend](https://github.com/mehrabislam00/TripNest_Backend)

Live link:

```text
https://tripnest-two-theta.vercel.app/
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB database
- The TripNest backend running locally or deployed

### Installation

```bash
git clone https://github.com/mehrabislam00/TripNest.git
cd TripNest
npm install
```

Create a `.env` file in the project root:

```env
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_MONGO_URI=mongodb://localhost:27017
NEXT_PUBLIC_API_URL=https://tripnest-backend-delta.vercel.app
```

Do not commit real secrets or database credentials.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev        # Start the development server
npm run build      # Create a production build
npm run start      # Start the production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
```

## Project Structure

```text
app/          Next.js routes and pages
components/   Reusable UI components
lib/          Authentication, API, and data helpers
public/       Static assets
```

## Deployment

Set the environment variables in the hosting provider before deploying. Make
sure `NEXT_PUBLIC_API_URL` points to a running backend and that the backend
allows requests from the deployed frontend origin.
