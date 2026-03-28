# Sparques

Sparques is an omniforum community discussion platform with a shared drawing canvas per community.

## Overview

The project is organized as an npm workspaces monorepo with TypeScript project references. It consists of two applications and two shared libraries:

- `apps/frontend`: React + TypeScript + Vite + MUI web application
- `apps/backend`: Node.js + TypeScript + Express API with Zod validation and Mongoose models
- `libs/types`: shared DTOs and domain types used across frontend and backend
- `libs/sparques-canvas`: shared canvas drawing primitives used by both frontend and backend rendering paths

The shared libraries are the integration layer between the two apps:

- `@sparques/types` defines the contract for posts, communities, comments, votes, canvas payloads, and drawing strokes.
- `@sparques/sparques-canvas` implements the drawing behavior for supported stroke types so the same drawing logic is reused on both the client and the server.

## Architecture

### Frontend

The frontend provides the main user experience for:

- browsing the global feed
- browsing community-specific feeds
- viewing posts and nested comments
- registering and logging in
- creating posts
- opening a community canvas and submitting drawing strokes

Routing is defined in `apps/frontend/src/App.tsx`. API access is centralized in `apps/frontend/src/services/Network.tsx`.

### Backend

The backend exposes REST endpoints under `/api` for:

- `auth`: registration, login, and token validation
- `posts`: feed retrieval, post creation, comments, voting, updates, and deletion
- `community`: community listing, lookup, creation, and updates
- `canvas`: canvas lookup, stroke submission, and canvas enumeration

The Express server is initialized in `apps/backend/src/server.ts`. Request validation is handled with Zod middleware, persistence is handled with Mongoose, and authentication uses an HTTP-only JWT cookie.

### Shared Types

`libs/types` contains the domain contracts shared across the repository. This includes:

- forum DTOs such as `Post`, `Community`, `CommentDetail`, and `Vote`
- canvas DTOs such as `CanvasDetails`
- drawing types such as `StrokeType`, `AnyStroke`, and shape-specific stroke definitions

These shared types keep frontend API usage and backend responses aligned.

### Shared Canvas Library

`libs/sparques-canvas` contains the rendering primitives for:

- brush
- circle
- rectangle
- polygon
- text
- fill

The frontend uses these functions to render the interactive canvas view. The backend uses the same functions when flattening stored strokes into the persisted base image.

## How The Components Work Together

### Forum Flow

The frontend calls the backend through `NetworkService`. The backend serves posts, communities, comments, and votes from MongoDB. When a user is authenticated, feed and post responses also include that user's vote state so the frontend can render the current voting state directly.

### Canvas Flow

Each community has an associated canvas. When the frontend opens a canvas page, it fetches the canvas payload from the backend, including:

- the current `baseImage`
- any pending `strokes`

The frontend then renders the canvas locally using the shared canvas library. When a user submits a new stroke, the backend:

1. validates the request
2. verifies the community exists
3. creates the canvas if it does not already exist
4. stores the stroke in MongoDB
5. periodically flushes accumulated strokes into the canvas `baseImage`

This allows the backend to persist a durable canvas image while still supporting incremental stroke submission.

## Data Model Summary

At a high level, the backend stores:

- `User`: username and hashed password
- `Community`: title plus optional banner and icon images
- `Post`: title, content, author, community, and aggregate counts
- `Comment`: post-linked comments with optional parent comment
- `Vote`: per-user upvote or downvote state for a post
- `Canvas`: community title, base image, and queued strokes
- `Stroke`: discriminator-backed shape records for canvas drawing operations

## Development

### Requirements

- Node.js `24.3.0`
- npm `11.4.2`
- Docker and Docker Compose

The repository uses Volta to pin Node.js and npm versions.

### Install

```bash
npm install
```

### Run The Full Development Stack

```bash
npm run dev
```

This starts:

- MongoDB via `database/docker-compose.yml`
- the backend in watch mode
- the frontend development server

### Build

```bash
npm run build
```

The root TypeScript build uses project references, so the shared libraries are built before the applications that depend on them.

## Environment

The backend currently reads these environment variables:

- `JWT_SECRET`
- `MONGO_URI`
- `PORT`

If not provided, development defaults are used. The default MongoDB connection expects the Docker Compose database configuration in `database/docker-compose.yml`.

## Seed Data

On first launch, the backend seeds a default `main` community, including banner and icon image data. This gives the application an initial community and also enables canvas creation for that community immediately.

## Notes For Contributors

- The frontend currently uses a hardcoded API base URL of `http://localhost:8080/api`.
- The backend currently allows CORS from `http://localhost:3000`.
- Authentication is cookie-based using a JWT stored as an HTTP-only cookie.
- The shared canvas library directory is `libs/sparques-canvas`.
- The fill tool is present but currently marked as unstable in the shared canvas implementation.

## Repository Structure

```text
.
├── apps
│   ├── backend
│   └── frontend
├── database
├── libs
│   ├── sparques-canvas
│   └── types
└── README.md
```
