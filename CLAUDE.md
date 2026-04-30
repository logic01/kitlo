## ! IMPORTANT ! ##
Read docs/task.md for your next task.

# Kitlo — Peer-to-Peer Hunting Equipment Rental

A marketplace where hunters can list and rent hunting equipment to/from each other.

## Design Philosophy

- **Clean and minimal**: No clutter, no noise. Whitespace is intentional. Avoid decorative UI.
- **Content-first**: Equipment photos and listing details take center stage.
- **Neutral palette**: Earthy tones (slate, stone, warm grays) with a single accent color.
- No emojis in UI. No gradient text. No card shadows unless truly needed.

## Tech Stack

### Frontend
- **Angular** — Modern web framework for reactive UI
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **Component Library** — Custom components following brand guidelines

### Backend
- **C#** — Primary backend language
- **.NET** — Framework and runtime
- **Entity Framework Core** — ORM for PostgreSQL
- **ASP.NET Core** — Web API framework

### Database
- **PostgreSQL** — Relational database for all persistent data

### Auth
- **JWT (JSON Web Tokens)** — Stateless token-based authentication
- **Role-based Access Control (RBAC)** — User, Lister, Admin roles

### Payments
- **Stripe Connect** — P2P payment flow: renters pay Kitlo, Kitlo pays out to equipment owners. Handles holds, refunds, and identity verification for listers.

### Media
- **Cloudinary** — Image hosting and optimization for listing photos

### Deployment
- **Docker** — Containerization for backend
- **TBD** — Frontend hosting (Vercel, Netlify, or self-hosted)


## Project Structure

```
kitlo/
├── frontend/                 # Angular application
│   ├── src/
│   │   ├── app/            # Angular components, services, routing
│   │   ├── assets/         # Images, fonts, static files
│   │   └── styles/         # Global styles, Tailwind configuration
│   ├── angular.json        # Angular configuration
│   └── package.json        # Frontend dependencies
│
├── backend/                 # C# .NET application
│   ├── Kitlo.Api/         # ASP.NET Core Web API
│   │   ├── Controllers/   # API endpoints
│   │   ├── Services/      # Business logic
│   │   ├── Models/        # DTOs and request/response models
│   │   └── Middleware/    # Auth, logging, error handling
│   ├── Kitlo.Core/        # Domain models and interfaces
│   ├── Kitlo.Data/        # Entity Framework Core, database access
│   └── Kitlo.sln          # Solution file
│
├── docs/                   # Documentation
│   ├── features/          # Feature specifications
│   └── tasks.md          # Development task tracker
│
└── CLAUDE.md             # This file


## Core Domain Models

- **User** — lister or renter (same user can be both)
- **Listing** — equipment item with photos, price/day, availability, condition, pickup location
- **Booking** — rental period with status (pending, confirmed, active, returned, disputed)
- **Payment** — Stripe PaymentIntent linked to a Booking
- **Review** — bidirectional (renter reviews listing, lister reviews renter)

## Key Business Rules

- Lister sets a daily rate; renter pays rate × days + service fee.
- Funds are held until the rental period ends, then released to lister minus platform fee.
- Both parties must confirm return before funds release.
- Equipment must have at minimum: title, 3 photos, condition, pickup ZIP, daily rate.

## Development Commands

### Frontend (Angular)
```bash
cd frontend
npm install                # Install dependencies
npm start                  # Run dev server on http://localhost:4200
npm run build             # Build for production
npm test                  # Run unit tests
npm run lint              # Lint and format code
```

### Backend (C#/.NET)
```bash
cd backend
dotnet restore            # Restore NuGet dependencies
dotnet build              # Build the solution
dotnet run --project Kitlo.Api  # Run the API server
dotnet ef database update # Apply Entity Framework migrations
dotnet test               # Run unit tests
```



## Environment Variables

### Backend (.env or appsettings.json)
```
DATABASE_URL=postgresql://user:password@localhost:5432/kitlo
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your-jwt-secret-key
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

### Frontend (.env or environment.ts)
```
NG_APP_API_URL=http://localhost:5000/api
NG_APP_STRIPE_PUBLIC_KEY=pk_test_...
NG_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name
```


## Coding Conventions

### C# Backend
- **Naming**: PascalCase for classes, methods, properties; camelCase for private fields, local variables
- **Structure**: Controllers → Services → Data Access (Entity Framework)
- **Error Handling**: Use custom exception types, return appropriate HTTP status codes
- **Async**: Prefer async/await for I/O operations
- **Validation**: Use data annotations and FluentValidation for request validation
- **Logging**: Use ILogger for structured logging

### Angular Frontend
- **Naming**: PascalCase for components, services, models; camelCase for variables and methods
- **Structure**: Smart (container) and dumb (presentational) components
- **Services**: Use dependency injection via constructor
- **State**: Keep component state minimal; use services for shared state
- **Reactive**: Use RxJS Observables and reactive patterns
- **Styling**: Use Tailwind utilities; avoid inline styles
- **Comments**: Document complex logic and business rules, not obvious code

## Continue Pattern

When you say "continue", follow this workflow cycle:

1. **Check `docs/sub-tasks.md`** — Is there a pending (⬜ Pending) sub-task?
   - **Yes**: Resume from the last pending sub-task. Perform the work, test it, mark as complete (✅ Done).
   - **No**: Move to step 2.

2. **Check `docs/tasks.md`** — Is there a pending (⬜ Pending) main task in Phase 3 or 4?
   - **Yes**: Move to step 3.
   - **No**: Report completion; await new instructions.

3. **Create Implementation Plan** — For the selected task, create a concise plan outlining:
   - What needs to be built
   - Key files/components involved
   - Step-by-step work breakdown
   - Expected deliverable

4. **Generate Sub-Tasks** — Break the plan into 3–6 concrete sub-tasks (specific, actionable). Add them to `docs/sub-tasks.md` with status ⬜ Pending.

5. **Perform Sub-Tasks** — Execute sub-tasks in order:
   - Mark each as in progress when starting
   - Complete the work (code, tests, commits)
   - Mark as ✅ Done
   - Loop back to step 1 until all sub-tasks are done

6. **Mark Task Complete** — When all sub-tasks for a task are done, mark the main task in `docs/tasks.md` as ✅ Done, then loop back to step 1.

**Note**: Sub-task tracking lives in `docs/sub-tasks.md` (created on first use). This keeps work granular and resumable.

