# 🛠️ Stack Context & Rules

## 🌌 Global Infrastructure
- **Deployment:** Dockerized environment for Dockploy + Traefik.
- **Rules:** Every new service must include/update a `Dockerfile` and `docker-compose.yaml` compatible with Traefik labels.

## ⚛️ Frontend Stack (React + TSX)
- **UI:** shadcn/ui + Tailwind CSS.
- **State/Data:** TanStack Query (React Query) for server state.
- **Architecture:** Clean Architecture + MVVM.
  - **Entities:** Pure business logic.
  - **Use Cases:** Application logic.
  - **ViewModels:** Logic for UI state and interaction with Use Cases.
  - **Views:** React components (dumb as possible).

## 🚀 Astro Stack
- **Style:** Pure Astro (Zero-JS wherever possible). 
- **Pattern:** Use Astro Islands only when client-side interactivity is mandatory.

## 📱 React Native
- **Architecture:** Clean Architecture (same layers as React).
- **Navigation:** [Añade aquí si usas Expo Router o React Navigation].

## 🔙 Backend (FastAPI / Node / Firebase)
- **FastAPI:** Pydantic schemas, dependency injection.
- **Node:** Express or Fastify with TypeScript.
- **Firebase:** Use Firestore/Auth only through Repository Pattern to keep Clean Arch.

## 🤐 Output Rules (Token Saving)
- **No Yapping:** No greetings, no summaries, no "I understand".
- **Code Diffs:** Only show the lines that change. Use `// ... existing code` for context.
- **Clean Arch Enforcement:** If I write logic in a View that belongs in a ViewModel/Use Case, warn me and refactor it.