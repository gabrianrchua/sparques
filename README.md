# Sparques

Omniforum app to connect communities worldwide

## Technical Details

Stack: MERN

- Frontend: React TSX, Vite, MUI
- Backend: NodeJS, TypeScript, Zod
- Database: MongoDB, Mongoose

## Development: Setup Guide

1. This project uses Volta for Node/npm version management. [Install Volta here](https://docs.volta.sh/guide/getting-started)
2. This project uses npm workspaces. In the project root, install dependencies for all subprojects using `npm install`
3. Build shared libraries in `libs/` using `npm run build`. This builds everything. Optionally, you can also build just the libraries by running `npm run build` in each library in `libs/`
