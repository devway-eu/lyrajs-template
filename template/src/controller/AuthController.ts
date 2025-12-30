import { AccessControl, SecurityConfig } from "@lyra-js/core"
import { AuthenticatedRequest, UnauthorizedException, Validator } from "@lyra-js/core"
import bcrypt from "bcrypt"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import md5 from "md5"

import { User } from "@entity/User"
import { userRepository } from "@repository/UserRepository"

const securityConfig = new SecurityConfig().getConfig()

export class AuthController {
  static signUp = async (req: Request, res: Response, next: NextFunction) => {
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

      const isEmailUsed = await userRepository.findOneBy({ email })

      if (isEmailUsed) {
        throw new Error("Email already in use")
      }

      if (!Validator.isPasswordValid(password)) {
        throw new Error("Invalid password")
      }

      const user = new User()
      const hashedPassword = await bcrypt.hash(password, 10)

      user.username = username
      user.firstname = firstname
      user.lastname = lastname
      user.email = email
      user.password = hashedPassword
      user.role = "ROLE_USER"

      await userRepository.save(user)

      const registeredUser = await userRepository.findOneBy({ email })

      delete registeredUser?.password

      res.status(201).json({ message: "User registered successfully", user: registeredUser })
    } catch (error) {
      next(error)
    }
  }

  static signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        throw new Error("Missing required fields")
      }

      const user = await userRepository.findOneBy({ email })

      if (!user || !(user && (await bcrypt.compare(password, user.password)))) {
        throw new Error("Invalid credentials")
      }

      const token = jwt.sign({ id: user.id }, securityConfig.jwt.secret_key as string, {
        algorithm: securityConfig.jwt.algorithm as string,
        expiresIn: securityConfig.jwt.token_expiration
      })

      const refreshToken = jwt.sign({ id: user.id }, securityConfig.jwt.secret_key_refresh as string, {
        algorithm: securityConfig.jwt.algorithm as string,
        expiresIn: securityConfig.jwt.refresh_token_expiration
      })

      await userRepository.save(user)

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

      delete user.password

      res.status(200).json({ message: "User authenticated in successfully", user, token, refreshToken })
    } catch (error) {
      next(error)
    }
  }

  static getAuthenticatedUser = async (req: AuthenticatedRequest<Request>, res: Response, next: NextFunction) => {
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

  static signOut = async (_req: Request, res: Response) => {
    res.clearCookie("Token")
    res.clearCookie("RefreshToken")
    res.status(200).json({ message: "Unauthenticated successfully" })
  }

  static updateProfile = async (req: AuthenticatedRequest<Request>, res: Response, next: NextFunction) => {
    try {
      const { data }: { data: User } = req.body
      const user = req.user as User
      if (!user) throw new UnauthorizedException()
      if (data?.id && data.id !== user.id) throw new UnauthorizedException()
      if (data.role) delete data.role
      if (data.created_at) delete data.created_at
      data.updated_at = new Date()
      if (user && data.password) data.password = await bcrypt.hash(data.password, 10)
      if (user) await userRepository.save(data)
      res.status(200).json({ message: "Users updated successfully" })
    } catch (error) {
      next(error)
    }
  }

  static refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const securityConfig = new SecurityConfig().getConfig()
      let refreshToken = req.cookies.RefreshToken
      if (!refreshToken) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
          refreshToken = authHeader.substring(7)
        }
      }

      AccessControl.checkRefreshTokenValid(refreshToken)

      const decoded = await AccessControl.decodeToken(refreshToken)

      if (!decoded || !decoded.id) throw new UnauthorizedException("Invalid refresh token")

      const user = await userRepository.find(decoded.id)

      if (!user) throw new UnauthorizedException("Invalid refresh token")

      const token = await AccessControl.getNewToken(user)

      res.cookie("Token", token, {
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.ENV === "production",
        maxAge: securityConfig.jwt.token_expiration,
        partitioned: false
      })

      delete user.password

      res.status(200).json({ message: "User authenticated in successfully", user, token, refreshToken })
    } catch (_refreshError) {
      return res.redirect(securityConfig.auth_routes.sign_out)
    }
  }

  static removeUser = async (req: AuthenticatedRequest<Request>, res: Response, next: NextFunction) => {
    const user = req.user

    if (!user) throw new UnauthorizedException()

    await userRepository.delete(user.id)

    res.clearCookie("Token")
    res.clearCookie("RefreshToken")

    res.status(200).json({ message: "User deleted successfully" })
  }
}
