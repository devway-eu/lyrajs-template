# create-lyrajs

[![npm version](https://img.shields.io/npm/v/create-lyrajs)](https://www.npmjs.com/package/create-lyrajs)
[![CLA Assistant](https://cla-assistant.io/readme/badge/devway-eu/lyrajs-template)](https://cla-assistant.io/devway-eu/lyrajs-template)
[![docs](https://img.shields.io/badge/docs-read-green)](https://lyrajs.dev)
[![Discord](https://img.shields.io/discord/1449345012604342427?label=discord&logo=discord&logoColor=white)](https://discord.gg/cWvUh8pQNU)

The official project template and scaffolding tool for LyraJS, a lightweight TypeScript framework for building robust APIs.

## About

`create-lyrajs` is the quickest way to start a new LyraJS project. It's a CLI tool that scaffolds a fully-configured LyraJS application with best practices, pre-built authentication, and example code to get you started immediately.

## Role in the Framework

This repository serves as the **project starter** for LyraJS. It provides:

- **CLI Tool** - Interactive project creation via `npm create lyrajs`
- **Project Template** - Pre-configured application structure with working examples
- **Best Practices** - Demonstrates recommended patterns and conventions
- **Starting Point** - Complete foundation for building production APIs

When developers run `npm create lyrajs`, this tool copies the template folder to create a new project with everything needed to start building an API.

## What's Included in the Template

### Pre-built Features

1. **Authentication System**
   - User registration and login
   - JWT token generation (access + refresh tokens)
   - Password hashing with bcrypt
   - Protected routes via configuration

2. **User Management**
   - User entity with role support
   - UserRepository with custom queries
   - UserController with CRUD operations
   - Complete user routes

3. **Database Setup**
   - MySQL/MariaDB configuration
   - Migration system ready to use
   - Example entity (User)
   - Fixture system for seed data

4. **Configuration Files**
   - `database.yaml` - Database connection settings
   - `security.yaml` - JWT and access control rules
   - `router.yaml` - API base path configuration
   - `parameters.yaml` - Application metadata
   - `mailer.yaml` - Email service settings
   - `.env` - Environment variables

5. **Project Structure**
   - TypeScript configuration
   - ESLint and Prettier setup
   - Organized folder structure (controller, entity, repository, router, etc.)
   - Example code demonstrating patterns

6. **Development Tools**
   - Hot reload with `npm run dev`
   - Build scripts
   - Type definitions
   - Path aliases configured

### Project Structure

```
my-project/
├── src/
│   ├── controller/        # HTTP request handlers
│   │   ├── AuthController.ts    # Registration, login, logout
│   │   └── UserController.ts    # User CRUD operations
│   ├── entity/            # Database models
│   │   └── User.ts              # User entity with decorators
│   ├── repository/        # Data access layer
│   │   └── UserRepository.ts    # User database operations
│   ├── router/            # Route definitions
│   │   ├── index.ts             # Main router setup
│   │   └── routes/
│   │       ├── authRoutes.ts    # Auth endpoints
│   │       └── userRoutes.ts    # User endpoints
│   ├── middleware/        # Custom middleware
│   │   └── YourMiddleware.ts    # Example middleware
│   ├── services/          # Business logic services
│   │   └── YourService.ts       # Example service
│   ├── fixtures/          # Seed data
│   │   └── AppFixtures.ts       # Sample user data
│   ├── tests/             # Test files
│   │   └── exemple.test.ts      # Example test
│   ├── types/             # TypeScript types
│   │   └── ExempleType.ts       # Example types
│   └── server.ts          # Application entry point
├── config/                # YAML configuration files
│   ├── database.yaml
│   ├── router.yaml
│   ├── security.yaml
│   ├── parameters.yaml
│   └── mailer.yaml
├── migrations/            # SQL migration files
├── .env                   # Environment variables
├── .prettierrc            # Code formatting rules
├── eslint.config.js       # Linting configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Usage

### Create a New Project

```bash
# Using npm (recommended)
npm create lyrajs

# Using npx
npx create-lyrajs

# Using yarn
yarn create lyrajs
```

The CLI will prompt you for a project name:

```bash
Project name: my-api
✅ Project "my-api" created.
➡ cd my-api
➡ npm install
➡ npm run dev
```

### Next Steps After Creation

1. **Configure environment variables** in `.env`:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=my_database
   JWT_SECRET=your_secret_key
   ```

2. **Create the database**:
   ```bash
   npx maestro create:database
   ```

3. **Run migrations**:
   ```bash
   npx maestro migration:migrate
   ```

4. **Load sample data** (optional):
   ```bash
   npx maestro fixtures:load
   ```

5. **Start developing**:
   ```bash
   npm run dev
   ```

Your API will be available at `http://localhost:3333/api`

### Pre-built Endpoints

The template includes these working endpoints:

**Authentication:**
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `GET /api/auth/user` - Get authenticated user (protected)
- `GET /api/auth/sign-out` - Logout (protected)

**User Management:**
- `GET /api/user/all` - List all users
- `GET /api/user/:id` - Get user by ID
- `PUT /api/user/` - Create new user
- `PATCH /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user

## Contributing

We welcome contributions to improve the template! Here's how you can help:

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/lyrajs-template.git
   cd lyrajs-template
   ```

2. **Test the CLI locally**
   ```bash
   npm link

   # Create a test project
   cd /path/to/test-location
   create-lyrajs
   ```

3. **Make changes to the template**
   - Edit files in the `template/` folder
   - Update CLI logic in `src/createApp.js`
   - Test thoroughly before submitting

### Contribution Guidelines

- **Read the guidelines** - See [CONTRIBUTING.md](https://github.com/devway-eu/lyrajs/blob/main/lyrajs-core/CONTRIBUTING.md)
- **Maintain consistency** - Follow existing patterns and conventions
- **Test thoroughly** - Ensure the generated project works correctly
- **Document changes** - Update the template README if needed
- **Keep it simple** - The template should be easy to understand for beginners

### Areas for Contribution

We particularly welcome contributions in these areas:

1. **Template Improvements**
   - Additional example code
   - Better default configuration
   - Improved project structure
   - More comprehensive README in generated projects

2. **Pre-built Features**
   - Additional authentication methods
   - Example middleware implementations
   - Sample services and business logic
   - Test examples

3. **Developer Experience**
   - Better error messages
   - Improved CLI prompts
   - Setup wizard enhancements
   - Documentation improvements

4. **Configuration**
   - Environment-specific configs
   - Docker setup
   - CI/CD examples
   - Deployment guides

5. **Code Quality**
   - ESLint rule improvements
   - Prettier configuration
   - TypeScript strictness
   - Code comments and documentation

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/improve-template
   ```

2. **Make your changes**
   - Modify files in `template/` folder
   - Update CLI if needed
   - Test the generated project

3. **Test the changes**
   ```bash
   npm link
   cd /tmp
   create-lyrajs
   cd my-test-project
   npm install
   npm run dev
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Improve template with [description]"
   git push origin feature/improve-template
   ```

5. **Open a Pull Request**
   - Describe what you changed and why
   - Include screenshots if UI-related
   - Ensure the template generates a working project

### Testing Checklist

Before submitting a PR, verify:

- ✅ Generated project installs without errors
- ✅ `npm run dev` starts successfully
- ✅ Authentication endpoints work
- ✅ Database migrations execute properly
- ✅ TypeScript compiles without errors
- ✅ ESLint passes
- ✅ All configuration files are valid
- ✅ README is clear and accurate

### Reporting Issues

Found a problem with the template?

- **Check existing issues** - Search for similar problems first
- **Create a new issue** - Use the [issue tracker](https://github.com/devway-eu/lyrajs-template/issues)
- **Provide details** - Include:
  - Node.js and npm versions
  - Operating system
  - Steps to reproduce
  - Expected vs actual behavior
  - Error messages or logs

## Template Customization

When creating your own LyraJS project, you can customize the template by:

1. **Modifying entities** - Add your own entities and relationships
2. **Adjusting routes** - Change API endpoints and structure
3. **Customizing authentication** - Adapt to your security requirements
4. **Adding features** - Extend with your own controllers and services
5. **Updating configuration** - Adjust settings for your environment

## Links

- **GitHub Repository**: [github.com/devway-eu/lyrajs-template](https://github.com/devway-eu/lyrajs-template)
- **npm Package**: [npmjs.com/package/create-lyrajs](https://www.npmjs.com/package/create-lyrajs)
- **Main Repository**: [github.com/devway-eu/lyrajs](https://github.com/devway-eu/lyrajs)
- **Core Package**: [github.com/devway-eu/lyrajs-core](https://github.com/devway-eu/lyrajs-core)
- **Documentation**: [lyrajs.dev](https://lyrajs.dev)

## License

LyraJS is licensed under the [GPL-3.0 License](./LICENSE).

## Authors

- **Matthieu Fergola** - Core Developer
- **Anthony Dewitte** - Core Developer

## Acknowledgments

Built with dedication by the Devway team and our amazing contributors.

---

**Need help?** Check the [documentation](https://lyrajs.dev) or join our [Discussions](https://github.com/devway-eu/lyrajs/discussions).

## Contributors ❤️

![Contributors](https://img.shields.io/github/contributors/devway-eu/lyrajs)