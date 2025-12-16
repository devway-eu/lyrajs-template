import bcrypt from "bcrypt"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

import { SecurityConfig } from "@lyra-js/core"
import { AuthenticatedRequest, UnauthorizedException, Validator } from "@lyra-js/core"
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
      user.role = 'ROLE_USER'

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

      user.refresh_token = jwt.sign({ id: user.id }, securityConfig.jwt.secret_key_refresh as string, {
        algorithm: securityConfig.jwt.algorithm as string,
        expiresIn: securityConfig.jwt.refresh_token_expiration
      })

      await userRepository.save(user)

      res.cookie("Token", token, {
        sameSite: "Lax",
        httpOnly: true,
        secure: process.env.ENV === "production",
        maxAge: 1000 * 60 * 60 * 24,
        partitioned: false
      })

      delete user.password

      res.status(200).json({ message: "User authenticated in successfully", user, token })
    } catch (error) {
      next(error)
    }
  }

  static getAuthenticatedUser = async (req: AuthenticatedRequest<Request>, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User

      if (!user) throw new UnauthorizedException()

      res.status(200).json({
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
    res.status(200).json({ message: "Unauthenticated successfully" })
  }
}
