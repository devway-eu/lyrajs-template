import { AccessControl, isAuthenticated, SecurityConfig } from "@lyra-js/core"
import {
  Controller,
  Delete,
  Get,
  NextFunction,
  Patch,
  Post,
  rateLimiter,
  Request,
  Response,
  Route,
  UnauthorizedException,
  Validator
} from "@lyra-js/core"

import { User } from "@entity/User"

const securityConfig = new SecurityConfig().getConfig()

@Route({ path: "/auth" })
export class AuthController extends Controller {
  @Post({ path: "/sign-up" })
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, firstname, lastname, email, password } = req.body

      if (!username || !firstname || !lastname || !email || !password) {
        throw new Error("Missing required fields")
      }

      if (!Validator.isUsernameValid(username)) {
        throw new Error("Invalid username")
      }

      if (!Validator.isEmailValid(email)) {
        throw new Error("Invalid email")
      }

      const isEmailUsed = await this.userRepository.findOneBy({ email })

      if (isEmailUsed) {
        throw new Error("Email already in use")
      }

      if (!Validator.isPasswordValid(password)) {
        throw new Error("Invalid password")
      }

      const user = new User()
      const hashedPassword = await this.bcrypt.hash(password, 10)

      user.username = username
      user.firstname = firstname
      user.lastname = lastname
      user.email = email
      user.password = hashedPassword
      user.role = "ROLE_USER"

      await this.userRepository.save(user)

      const registeredUser = await this.userRepository.findOneBy({ email })
      const { password: _, ...userWithoutPassword } = registeredUser || {}

      res.status(201).json({ message: "User registered successfully", user: userWithoutPassword })
    } catch (error) {
      next(error)
    }
  }

  @Post({ path: "/sign-in", middlewares: [rateLimiter] })
  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        throw new Error("Missing required fields")
      }

      const user = await this.userRepository.findOneBy({ email })

      if (!user || !(user && (await this.bcrypt.compare(password, user.password)))) {
        throw new Error("Invalid credentials")
      }

      const token = this.jwt.sign({ id: user.id }, securityConfig.jwt.secret_key as string, {
        algorithm: securityConfig.jwt.algorithm as string,
        expiresIn: securityConfig.jwt.token_expiration
      })

      const refreshToken = this.jwt.sign({ id: user.id }, securityConfig.jwt.secret_key_refresh as string, {
        algorithm: securityConfig.jwt.algorithm as string,
        expiresIn: securityConfig.jwt.refresh_token_expiration
      })

      await this.userRepository.save(user)

      res.cookie("Token", token, {
        sameSite: "Lax",
        httpOnly: true,
        secure: process.env.ENV === "production",
        maxAge: securityConfig.jwt.token_expiration * 1000,
        partitioned: false
      })

      res.cookie("RefreshToken", refreshToken, {
        sameSite: "Lax",
        httpOnly: true,
        secure: process.env.ENV === "production",
        maxAge: securityConfig.jwt.refresh_token_expiration * 1000,
        partitioned: false
      })

      const { password: _, ...userWithoutPassword } = user

      res
        .status(200)
        .json({ message: "User authenticated in successfully", user: userWithoutPassword, token, refreshToken })
    } catch (error) {
      next(error)
    }
  }

  @Get({ path: "/user", middlewares: [isAuthenticated] })
  async getAuthenticatedUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as User

      if (!user) throw new UnauthorizedException()

      res.status(200).json({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      })
    } catch (error) {
      next(error)
    }
  }

  @Get({ path: "/sign-out" })
  async signOut(_req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("Token")
      res.clearCookie("RefreshToken")
      return res.status(200).json({ message: "Unauthenticated successfully" })
    } catch (error) {
      next(error)
    }
  }

  @Patch({ path: "/update-account", middlewares: [isAuthenticated] })
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { data }: { data: User } = req.body
      const user = req.user as User
      if (!user) throw new UnauthorizedException()
      if (data?.id && data.id !== user.id) throw new UnauthorizedException()

      // Remove protected fields
      const { role: _role, created_at: _created_at, password, ...updateData } = data

      // Hash password if provided
      const hashedPassword = password ? await this.bcrypt.hash(password, 10) : undefined

      const finalData = {
        ...updateData,
        ...(hashedPassword && { password: hashedPassword }),
        updated_at: new Date()
      }

      if (user) await this.userRepository.save(finalData)
      res.status(200).json({ message: "Users updated successfully" })
    } catch (error) {
      next(error)
    }
  }

  @Get({ path: "/refresh-token" })
  async refreshToken(req: Request, res: Response, _next: NextFunction) {
    try {
      const securityConfig = new SecurityConfig().getConfig()
      let refreshToken = req.cookies.RefreshToken
      if (!refreshToken) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith("Bearer ")) {
          refreshToken = authHeader.substring(7)
        }
      }

      AccessControl.checkRefreshTokenValid(refreshToken)

      const decoded = await AccessControl.decodeToken(refreshToken)

      if (!decoded || !decoded.id) throw new UnauthorizedException("Invalid refresh token")

      const user = await this.userRepository.find(decoded.id)

      if (!user) throw new UnauthorizedException("Invalid refresh token")

      const token = await AccessControl.getNewToken(user)

      res.cookie("Token", token, {
        sameSite: "Lax",
        httpOnly: true,
        secure: process.env.ENV === "production",
        maxAge: securityConfig.jwt.token_expiration * 1000,
        partitioned: false
      })

      const { password: _, ...userWithoutPassword } = user

      res
        .status(200)
        .json({ message: "User authenticated in successfully", user: userWithoutPassword, token, refreshToken })
    } catch (_refreshError) {
      return res.redirect(securityConfig.auth_routes.sign_out)
    }
  }

  @Delete({ path: "/delete-account", middlewares: [isAuthenticated] })
  async removeUser(req: Request, res: Response, _next: NextFunction) {
    const user = req.user

    if (!user) throw new UnauthorizedException()

    await this.userRepository.delete(user.id)

    res.clearCookie("Token")
    res.clearCookie("RefreshToken")

    res.status(200).json({ message: "User deleted successfully" })
  }
}
