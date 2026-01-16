# Changelog

All notable changes to `create-lyrajs` (lyrajs-template) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-16

### Added

#### New Directories
- **src/jobs/** - Directory for scheduled job classes
  - Includes `ExampleJob.ts` demonstrating scheduler usage
  - Auto-discovered by the scheduler system
- **src/templates/** - Directory for SSR templates
  - Includes `ExampleRender.tsx` showing JSX template usage
  - Contains `layout/` subdirectory for layout templates
  - Includes README.md with template documentation
- **public/** - Directory for static assets
  - Contains `assets/` subdirectory for images, CSS, fonts, etc.
  - Served via static file middleware

#### New Template Files
- **ExampleJob.ts** - Demonstrates job scheduling with @Job and @Schedule decorators
- **ExampleRender.tsx** - Example JSX/TSX template for SSR
- **Layout Templates** - Base layout templates for consistent page structure

#### Enhanced Server Configuration
- **SSR Configuration** - Template engine settings in server.ts
  - Engine selection (jsx/tsx)
  - Templates directory path
  - Engine-specific options
- **Scheduler Configuration** - Optional scheduler enablement
  - Timezone configuration
  - Job auto-discovery setup
- **Static File Serving** - Configuration for serving static assets
  - Public directory mapping
  - Asset path configuration
- **Dependency Injection Setup** - Registration of third-party libraries
  - bcrypt registration for DI
  - jwt registration for DI

#### New Features in Generated Projects
- **Server-Side Rendering** - Full SSR support out of the box
- **Job Scheduling** - Pre-configured scheduler with example job
- **Static Assets** - Ready-to-use public assets directory
- **Enhanced DI** - Dependency injection configured and ready to use

### Changed

#### Server Setup (src/server.ts)
- **Server Creation** - Now uses `createServer()` from @lyra-js/core
  - Replaces manual Express setup
  - Built-in middleware and configuration
- **Server Settings** - New `setSetting()` API for configuration
  - Trust proxy settings
  - Request size limits
  - SSR engine configuration
- **Third-party Registration** - Libraries registered for DI
  - bcrypt available for injection
  - jwt available for injection
- **Controller Discovery** - Controllers now auto-discovered from src/controller
  - No manual registration needed for decorated controllers
  - Decorator-based route definition

#### Controller System
- **Route Definition** - Controllers now use decorators for routes
  - @Route, @Get, @Post, @Put, @Delete decorators
  - @Param decorators for parameters
  - No separate route files needed
- **Dependency Injection** - Controllers support constructor injection
  - Repositories auto-injected
  - Services auto-injected
  - Third-party libraries injectable

#### Project Structure
- **Template Organization** - Better organization of template components
  - Separation of concerns (jobs, templates, public)
  - Clear directory purposes
  - Improved discoverability

#### Configuration Files
- **Enhanced Security Config** - Additional security settings
  - Request size limits
  - Rate limiting configuration
- **Server Configuration** - New server-specific settings
  - SSR configuration
  - Static file serving
  - Scheduler settings

### Enhanced

#### Authentication System
- **Controller Decorators** - AuthController uses new decorator system
- **Service Injection** - Auth services properly injected via DI
- **Type Safety** - Better type safety with parameter decorators

#### User Management
- **Controller Decorators** - UserController uses new decorator system
- **Repository Injection** - UserRepository auto-injected
- **Route Definition** - Routes defined with decorators

#### Development Experience
- **Hot Reload** - Still available via `npm run dev`
- **Type Safety** - Enhanced TypeScript support with decorators
- **Auto-discovery** - No manual registration of components
- **Better Defaults** - More sensible default configurations

#### Testing
- **Test Structure** - Updated test examples for new decorator system
- **Type Safety** - Better typed test utilities

### Removed

#### Manual Configuration
- **Route Files** - No longer need separate route definition files
  - Routes now defined in controllers with decorators
- **Manual Controller Registration** - Decorated controllers auto-discovered
  - No manual import and registration needed
- **Manual Express Setup** - Server setup simplified
  - ExpressJS replaced by LyraServer through `createServer()`

### Migration Guide

#### From v1 to v2

See our [migration guide](https://lyrajs.dev/migration-guide/v1-to-v2).

### Breaking Changes

1. **Server Initialization**: Must use `createServer()` instead of raw Express
2. **Controller Routes**: Routes must be defined with decorators, not in separate route files
3. **Controller Registration**: Controllers are auto-discovered, manual registration removed
4. **Dependency Injection**: Services and repositories must use constructor injection

### New Project Structure

```
my-lyrajs-project/
├── src/
│   ├── controller/          # HTTP controllers with route decorators
│   ├── entity/              # Database entities
│   ├── repository/          # Data access repositories
│   ├── services/            # Business logic services
│   ├── middleware/          # Custom middleware
│   ├── jobs/                # 🆕 Scheduled jobs
│   ├── templates/           # 🆕 SSR templates (JSX/TSX)
│   ├── router/              # ⚠️ Deprecated (use decorators)
│   ├── fixtures/            # Database seed data
│   ├── tests/               # Test files
│   ├── types/               # TypeScript type definitions
│   └── server.ts            # 🔄 Updated server entry point
├── public/                  # 🆕 Static assets
│   └── assets/              # Images, CSS, fonts, etc.
├── config/                  # YAML configuration files
├── migrations/              # Database migrations
├── backups/                 # Database backups
├── logs/                    # Application logs
└── package.json
```

## [1.1.3] - 2025-12-31

### Previous Version Features

- Project scaffolding with best practices
- Pre-built authentication system (registration, login, JWT)
- User management (CRUD operations)
- MySQL/MariaDB database configuration
- Migration system with example User entity
- Fixture system for seed data
- Hot-reload development mode
- TypeScript, ESLint, and Prettier pre-configured
- Path aliases and organized folder structure

---

For detailed documentation and upgrade guides, visit [lyrajs.dev](https://lyrajs.dev).
