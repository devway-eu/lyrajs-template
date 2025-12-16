# Contributing to LyraJS Template (create-lyrajs)

Thank you for your interest in contributing to the LyraJS project template! 🎉

This package provides the `npm create lyrajs` command that scaffolds new LyraJS projects.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Making Changes](#making-changes)
- [Testing Your Changes](#testing-your-changes)
- [Pull Request Process](#pull-request-process)
- [Template Structure](#template-structure)
- [Best Practices](#best-practices)

## Code of Conduct

Please be respectful, constructive, and professional in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/lyrajs-template.git
   cd lyrajs-template
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/devway-eu/lyrajs-template.git
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Project Structure

```
lyrajs-template/
├── cli.js              # Entry point (executable)
├── src/
│   └── createApp.js    # Main scaffolding logic
├── template/           # Template files copied to new projects
│   ├── src/
│   ├── config/
│   ├── migrations/
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── ...
└── package.json        # create-lyrajs package config
```

### Local Testing

Test the template locally before submitting:

```bash
# Method 1: Direct execution
node cli.js

# Method 2: Global install (recommended for full testing)
npm install -g .
create-lyrajs

# Method 3: Using npx
npm pack
npm install -g ./create-lyrajs-1.0.0.tgz
create-lyrajs

# Clean up after testing
npm uninstall -g create-lyrajs
```

## How to Contribute

### Improving the CLI

Enhance the user experience when running `npm create lyrajs`:

- Add new prompts for configuration options
- Improve error messages
- Add progress indicators
- Support additional flags (e.g., `--typescript`, `--database`)

### Adding Template Files

Add new example files to help users get started:

- Example entities
- Example controllers
- Additional middleware
- Configuration examples
- Documentation

### Updating Dependencies

Keep the template dependencies up to date:

- Update `template/package.json`
- Test that the generated project works
- Document any breaking changes

### Improving Documentation

- Update README in template
- Add code comments
- Improve setup instructions
- Add usage examples

## Making Changes

### Modifying the CLI (`cli.js` or `src/createApp.js`)

```javascript
// Example: Adding a new prompt
const database = await prompt("Database type (mysql/postgres): ");

// Example: Copying additional files
await cp(
  path.join(templateDir, 'custom-config'),
  path.join(targetDir, 'config')
);
```

### Adding Files to the Template

1. Add files to `template/` directory
2. Update `package.json` `files` array if needed
3. Test that files are copied correctly
4. Update `.npmignore` if necessary

### Modifying Template Files

When changing files in `template/`:

1. Consider impact on existing projects
2. Update template version if breaking
3. Test the generated project thoroughly
4. Document changes in PR

## Testing Your Changes

### Test Checklist

- [ ] Run `node cli.js` locally
- [ ] Enter a test project name
- [ ] Verify all files are copied
- [ ] Check `.env` is created from `.env.example`
- [ ] Test dependency installation
- [ ] Navigate to generated project
- [ ] Run `npm run dev` successfully
- [ ] Test Maestro CLI: `npx maestro --help`
- [ ] Create entity: `npx maestro make:entity`
- [ ] Create migration: `npx maestro make:migration`
- [ ] Verify no errors or warnings

### Testing Different Scenarios

```bash
# Test with dependencies installation
node cli.js
# Choose "Yes" when prompted

# Test without dependencies installation
node cli.js
# Choose "No" when prompted

# Test with existing directory (should fail gracefully)
mkdir existing-project
node cli.js
# Enter "existing-project" - should show error

# Test with invalid project names
node cli.js
# Try: "../invalid", "./test", "project with spaces"
```

## Pull Request Process

### Before Submitting

1. **Test thoroughly** following the test checklist above
2. **Update documentation** if you changed functionality
3. **Check package.json** if you added dependencies
4. **Verify .npmignore** doesn't exclude necessary files

### Submitting

1. Push to your fork
2. Open a Pull Request
3. Fill out the PR template completely
4. Sign the CLA when prompted
5. Respond to review feedback

## Template Structure

### What Goes in the Template?

**Include**:
- Essential project structure
- Basic configuration files
- Example entities and controllers
- Development dependencies
- Documentation (README, comments)
- .env.example with required variables

**Don't Include**:
- node_modules/
- .env (use .env.example instead)
- Build artifacts
- IDE-specific files (use .gitignore)
- Personal configuration

### Template Files Best Practices

1. **Use placeholders** for values that might change:
   ```javascript
   // Don't hardcode
   const DB_HOST = 'localhost';

   // Do use environment variables
   const DB_HOST = process.env.DB_HOST || 'localhost';
   ```

2. **Include helpful comments**:
   ```typescript
   /**
    * User entity representing the users table
    * Generated with: npx maestro make:entity
    */
   @Table()
   export class User extends Entity<User> {
     // ...
   }
   ```

3. **Provide working examples**:
   - Working entity with relationships
   - Working controller with CRUD operations
   - Working authentication setup

4. **Keep it minimal but functional**:
   - Don't overcomplicate
   - Provide clear extension points
   - Document where to add more features

## Best Practices

### Code Style

- Follow existing code style
- Use async/await consistently
- Handle errors gracefully
- Provide clear error messages

### User Experience

- Clear prompts with examples
- Helpful error messages
- Progress indicators for long operations
- Success messages with next steps

### Error Handling

```javascript
// Good error handling
if (fs.existsSync(targetDir)) {
  console.error(`❌ Directory ${projectName} already exists.`);
  console.log(`💡 Try a different name or remove the existing directory.`);
  process.exit(1);
}

// Provide helpful guidance
if (!installSuccess) {
  console.log(`⚠️ Dependencies installation failed.`);
  console.log(`\nTry running manually:`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm install`);
}
```

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(cli): add TypeScript template option
fix(template): correct database.yaml configuration
docs(readme): update installation instructions
chore(deps): update @lyrajs/core to 1.1.0
```

## Community

### Getting Help

- **Documentation**: https://lyrajs.dev/docs
- **Discussions**: https://github.com/devway-eu/lyrajs-template/discussions
- **Email**: matthieu@dev-way.eu

### Reporting Issues

- **Template bugs**: Use this repository
- **Core framework bugs**: Use [lyrajs-core](https://github.com/devway-eu/lyrajs-core/issues)

## License

By contributing, you agree to the terms in our [CLA](../CLA.md). Your contributions will be licensed under the GPL-3.0 License.

---

**Questions?** Open a [discussion](https://github.com/devway-eu/lyrajs-template/discussions) or contact matthieu@dev-way.eu

Thank you for improving the LyraJS project template! 🚀
