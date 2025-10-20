# Security Policy

## Supported Versions

We actively support the following versions of the LyraJS project template:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability within the LyraJS template or generated projects, please send an email to:

**security@devway.eu**

### What to Include

Please include the following information:
- Description of the vulnerability
- Steps to reproduce the issue
- Affected files or components
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Updates**: Weekly progress updates
- **Resolution**: Critical issues addressed within 7 days

## Security Guidelines for Generated Projects

When you create a new project using `npm create lyrajs`, the generated template includes authentication and user management. Follow these guidelines to ensure your application remains secure:

### Initial Setup

**1. Change Default Secrets Immediately**

The `.env.example` file contains placeholder values. **Never use these in production!**

```bash
# ❌ INSECURE - Never use these defaults
JWT_SECRET=your_very_long_random_secret_key_here
JWT_SECRET_REFRESH=your_different_very_long_refresh_secret_here

# ✅ SECURE - Generate strong random secrets
JWT_SECRET=8Kx9mP4nQ2wR7tY6uI5oP3aS2dF1gH0j9K8l7M6n5B4v3C2x
JWT_SECRET_REFRESH=2Hg8Jk4Lp9Mq3Nr7Sw1Tx5Vy9Zu4Av8Bw2Cx6Dy0Ez4Fy8Gz3
```

Generate secure secrets:
```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**2. Configure Environment Variables**

Update all variables in your `.env` file:
- `JWT_SECRET` - Access token secret (32+ characters)
- `JWT_SECRET_REFRESH` - Refresh token secret (32+ characters, different from JWT_SECRET)
- `DB_PASSWORD` - Strong database password
- `MAILER_PASSWORD` - Email service password

### Authentication Security

**JWT Configuration**

The template uses JWT for authentication with the following defaults:
- Access token expiration: 3600 seconds (1 hour)
- Refresh token expiration: 86400 seconds (24 hours)
- Algorithm: HS256

Consider adjusting these values based on your security requirements in `config/security.yaml`.

**Password Requirements**

Default password validation requires:
- Minimum 10 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

These rules are defined in `@lyrajs/core/validator`.

**Cookie Security**

Authentication tokens are stored in HTTP-only cookies:
- `httpOnly: true` - Prevents JavaScript access (XSS protection)
- `sameSite: "Lax"` - CSRF protection
- `secure: true` - Enabled automatically in production (requires HTTPS)

### User Management Security

**Role Assignment**

The template includes a basic role system. By default, new users are assigned `ROLE_USER`.

**⚠️ Important**: The `UserController` endpoints allow user creation. If you expose these endpoints:

1. **Add authentication** - Require admin authentication for user management
2. **Validate input** - Ensure users cannot set their own roles
3. **Add authorization** - Restrict user creation to administrators

Example protection:
```typescript
// In your routes file
import { accessMiddleware, isAuthenticated } from '@lyrajs/core'

// Protect user management routes
router.post('/users', accessMiddleware, isAuthenticated, UserController.create)
router.put('/users', accessMiddleware, isAuthenticated, UserController.update)
router.delete('/users/:id', accessMiddleware, isAuthenticated, UserController.delete)
```

**Password Exposure Prevention**

The template automatically removes password hashes from API responses in most cases. However, always verify that password fields are not exposed in custom endpoints.

### Database Security

**Configuration**

Database credentials are in `.env` and referenced in `config/database.yaml`:

```yaml
database:
  host: "%env(DB_HOST)%"
  port: "%env(DB_PORT)%"
  user: "%env(DB_USER)%"
  password: "%env(DB_PASSWORD)%"
  name: "%env(DB_NAME)%"
```

**Best Practices**
- Use strong, unique database passwords
- Restrict database access to application servers only
- Use SSL/TLS for database connections in production
- Regular database backups
- Keep database software up to date

### CORS Configuration

The template configures CORS to accept requests from `CLIENT_APP_URL`:

```javascript
cors({
  origin: process.env.CLIENT_APP_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  credentials: true
})
```

**⚠️ Security Warning**: Never use `origin: "*"` in production with `credentials: true`.

### Rate Limiting

The template includes `express-rate-limit` as a dependency. **You must implement it manually:**

```javascript
import rateLimit from 'express-rate-limit'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
})

// Apply to authentication routes
app.use('/api/auth/sign-in', authLimiter)
app.use('/api/auth/sign-up', authLimiter)
```

Configuration is available in `config/security.yaml` but not automatically applied.

### Error Handling

**Centralized Error Handler**

The template includes an error handler middleware that:
- Hides error details in production
- Logs errors with request metadata
- Returns appropriate HTTP status codes

**Security Considerations**
- Never expose database errors to clients
- Don't leak internal paths or configuration in error messages
- Log errors server-side for debugging

### Production Deployment

**Pre-Deployment Checklist**

- [ ] All environment variables are set with production values
- [ ] JWT secrets are strong and unique (32+ characters)
- [ ] Database password is strong
- [ ] `NODE_ENV=production` is set
- [ ] HTTPS is enabled
- [ ] Rate limiting is implemented
- [ ] CORS is configured for production domain
- [ ] Database backups are configured
- [ ] Error logging is set up
- [ ] Security headers are configured (consider using `helmet`)

**Environment Variables**
```bash
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
JWT_SECRET_REFRESH=<different-strong-random-secret>
DB_PASSWORD=<strong-database-password>
CLIENT_APP_URL=https://your-production-domain.com
```

### Regular Maintenance

**Dependency Updates**
```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check for major updates
npm outdated
```

**Security Monitoring**
- Monitor application logs for suspicious activity
- Set up alerts for failed authentication attempts
- Regular security audits of custom code
- Keep LyraJS Core updated to the latest version

## Template-Specific Vulnerabilities

### User Controller Input Validation

The generated `UserController` accepts raw data from requests. If you expose these endpoints publicly:

**Risk**: Users could inject arbitrary fields including role escalation.

**Mitigation**: Add input validation to `create()` and `update()` methods:

```typescript
static create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, firstname, lastname, email } = req.body

    // Validate required fields
    if (!username || !firstname || !lastname || !email) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Validate formats
    if (!Validator.isUsernameValid(username) || !Validator.isEmailValid(email)) {
      return res.status(400).json({ message: "Invalid input format" })
    }

    // Create user with validated data only
    const user = new User()
    user.username = username
    user.firstname = firstname
    user.lastname = lastname
    user.email = email
    user.role = "ROLE_USER" // Don't accept from request!

    await userRepository.save(user)
    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    next(error)
  }
}
```

## Additional Resources

- [LyraJS Core Security Policy](https://github.com/devway-eu/lyrajs-core/SECURITY.md)
- [LyraJS Documentation](https://lyrajs.com)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Contact

- **Security Issues**: security@devway.eu
- **General Questions**: Via GitHub discussions

---

**Stay secure and build amazing applications with LyraJS! 🔒**
