import {
  AccessControl,
  Config,
  isAuthenticated,
  Mail,
  NotFoundException,
  SecurityConfig,
  ValidationException
} from "@lyra-js/core"
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  rateLimiter,
  Route,
  UnauthorizedException,
  Validator
} from "@lyra-js/core"
import bcrypt from "bcrypt"
import * as crypto from "node:crypto"

import { ResetPassword } from "@entity/ResetPassword"
import { User } from "@entity/User"
import {EmailTemplateService} from "@services/EmailTemplateService";

const securityConfig = new SecurityConfig().getConfig()

@Route({ path: "/auth" })
export class AuthController extends Controller {
  @Post({ path: "/sign-up" })
  async signUp() {
    try {
      const { username, firstname, lastname, email, password } = this.req.body

      if (!username || !firstname || !lastname || !email || !password) {
        this.badRequest("Missing required fields")
      }

      if (!Validator.isUsernameValid(username)) {
        this.badRequest("Invalid username")
      }

      if (!Validator.isEmailValid(email)) {
        this.badRequest("Invalid email")
      }

      const isEmailUsed = await this.userRepository.findOneBy({ email })

      if (isEmailUsed) {
        this.badRequest("Email already in use")
      }

      if (!Validator.isPasswordValid(password)) {
        this.badRequest("Invalid password")
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

      this.res.status(201).json({ message: "User registered successfully", user: userWithoutPassword })
    } catch (error) {
      this.next(error)
    }
  }

  @Post({ path: "/sign-in", middlewares: [rateLimiter] })
  async signIn() {
    try {
      const { email, password } = this.req.body

      if (!email || !password) {
        this.badRequest("Missing required fields")
      }

      const user = await this.userRepository.findOneBy({ email })

      if (!user || !(user && (await this.bcrypt.compare(password, user.password)))) {
        this.unauthorized("Invalid credentials")
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

      this.res.cookie("Token", token, {
        sameSite: "Lax",
        httpOnly: true,
        secure: process.env.ENV === "production",
        maxAge: securityConfig.jwt.token_expiration * 1000,
        partitioned: false
      })

      const base_path = new Config().get("router.base_path")

      this.res.cookie("RefreshToken", refreshToken, {
        path: `${base_path}/auth`,
        sameSite: "Lax",
        httpOnly: true,
        secure: process.env.ENV === "production",
        maxAge: securityConfig.jwt.refresh_token_expiration * 1000,
        partitioned: false
      })

      const { password: _, ...userWithoutPassword } = user

      this.res
        .status(200)
        .json({ message: "User authenticated in successfully", user: userWithoutPassword, token, refreshToken })
    } catch (error) {
      this.next(error)
    }
  }

  @Get({ path: "/user", middlewares: [isAuthenticated] })
  async getAuthenticatedUser() {
    try {
      const user = this.req.user as User

      if (!user) throw new UnauthorizedException()

      this.res.status(200).json({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      })
    } catch (error) {
      this.next(error)
    }
  }

  @Get({ path: "/sign-out" })
  async signOut() {
    try {
      const base_path = new Config().get("router.base_path")
      this.res.clearCookie("Token")
      this.res.clearCookie("RefreshToken", { path: `${base_path}/auth` })
      return this.res.status(200).json({ message: "Unauthenticated successfully" })
    } catch (error) {
      this.next(error)
    }
  }

  @Patch({ path: "/update-account", middlewares: [isAuthenticated] })
  async updateProfile() {
    try {
      const { data }: { data: User } = this.req.body
      const user = this.req.user as User
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
      this.res.status(200).json({ message: "Users updated successfully" })
    } catch (error) {
      this.next(error)
    }
  }

  @Get({ path: "/refresh-token" })
  async refreshToken() {
    try {
      const securityConfig = new SecurityConfig().getConfig()
      let refreshToken = this.req.cookies.RefreshToken
      if (!refreshToken) {
        const authHeader = this.req.headers.authorization
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

      this.res.cookie("Token", token, {
        sameSite: "Lax",
        httpOnly: true,
        secure: process.env.ENV === "production",
        maxAge: securityConfig.jwt.token_expiration * 1000,
        partitioned: false
      })

      const { password: _, ...userWithoutPassword } = user

      this.res
        .status(200)
        .json({ message: "User authenticated in successfully", user: userWithoutPassword, token, refreshToken })
    } catch (_refreshError) {
      return this.res.redirect(securityConfig.auth_routes.sign_out)
    }
  }

  @Post({ path: "/verify-account/:validationSignature" })
  async verifyAccount() {
    try {
      const { token: validation_signature } = this.req.body
      if (!validation_signature) throw new ValidationException("Missing validation signature")

      const user = await this.userRepository.findOneBy({ validation_signature })

      if (!user) throw new NotFoundException("User")

      if (!user.signature_expires_at || user.signature_expires_at < new Date()) {
        throw new ValidationException("Validation signature expired")
      }

      await this.userRepository.update({
        ...user,
        is_active: 1,
        is_verified: 1,
        updated_at: new Date(),
        validation_signature: null as never,
        signature_expires_at: null as never
      })

      return this.res.status(200).json({ message: "Account verified successfully" })
    } catch (error) {
      this.next(error)
    }
  }

  @Post({ path: "/resend-verification-email" })
  async resendVerificationEmail() {
    try {
      const { token: validation_signature } = this.req.body

      if (!validation_signature) {
        throw new ValidationException("Missing validation signature")
      }

      const user = await this.userRepository.findOneBy({ validation_signature })

      if (!user) throw new NotFoundException("User")

      const newValidationSignature = crypto.randomBytes(32).toString("hex")

      await this.userRepository.update({
        ...user,
        validation_signature: newValidationSignature,
        signature_expires_at: new Date(Date.now() + 60 * 60 * 1000)
      })

      const validationLink = `${process.env.CLIENT_APP_URL}/verify-account/${user.validation_signature}`

      const mail = new Mail(
        user.email,
        "Email Verification",
        EmailTemplateService.accountValidationMail(user.name, validationLink),
        []
      )

      await this.mailer.send(mail)

      return this.res.status(200).json({ message: "Verification email sent successfully" })
    } catch (error) {
      this.next(error)
    }
  }

  @Post({ path: "/request-new-password" })
  async requestNewPassword() {
    try {
      const { email } = this.req.body

      if (!email) throw new ValidationException("Missing email")

      const user = await this.userRepository.findOneBy({ email })

      if (!user) throw new NotFoundException("User")

      const existingResetPasswords = await this.resetPasswordRepository.findBy({ user: user.id })

      if (existingResetPasswords.length > 0) {
        for (const existingResetPasswordItem of existingResetPasswords) {
          await this.resetPasswordRepository.delete(existingResetPasswordItem.id)
        }
      }

      const newResetPasswordToken = crypto.randomBytes(32).toString("hex")

      const newResetPassword = new ResetPassword()
      newResetPassword.token = newResetPasswordToken
      newResetPassword.user = user.id
      newResetPassword.requested_at = new Date()
      newResetPassword.expires_at = new Date(Date.now() + 60 * 60 * 1000)

      await this.resetPasswordRepository.save(newResetPassword)

      const resetPasswordLink = `${process.env.CLIENT_APP_URL}/reset-password/${newResetPasswordToken}`

      const mail = new Mail(
        user.email,
        "Reset Password",
        EmailTemplateService.resetPasswordMail(user.name, resetPasswordLink),
        []
      )

      await this.mailer.send(mail)

      return this.res.status(200).json({ message: "Email sent" })
    } catch (error) {
      this.next(error)
    }
  }

  @Post({ path: "/check-reset-password-key" })
  async checkResetPasswordKey() {
    try {
      const { key: token } = this.req.body

      if (!token) throw new ValidationException("Missing reset password token")

      const resetPassword = await this.resetPasswordRepository.findOneBy({ token })

      if (!resetPassword) {
        throw new NotFoundException("Token")
      }

      if (resetPassword.expires_at < new Date()) {
        throw new ValidationException("Token expired")
      }

      return this.res.status(200).json({ message: "Token is valid" })
    } catch (error) {
      this.next(error)
    }
  }

  @Post({ path: "/resend-reset-password-email" })
  async resendResetPasswordEmail() {
    try {
      const { token } = this.req.body

      if (!token) throw new ValidationException("Missing reset token")

      const resetPassword = await this.resetPasswordRepository.findOneBy({ token })

      if (!resetPassword) throw new NotFoundException("Token")

      const user = await resetPassword.getUser()

      const newResetPasswordToken = crypto.randomBytes(32).toString("hex")

      await this.resetPasswordRepository.save({
        ...resetPassword,
        token: newResetPasswordToken,
        requested_at: new Date(),
        expires_at: new Date(Date.now() + 60 * 60 * 1000)
      })

      const resetPasswordLink = `${process.env.CLIENT_APP_URL}/reset-password/${newResetPasswordToken}`

      const mail = new Mail(
        user.email,
        "Reset Password",
        EmailTemplateService.resetPasswordMail(user.name, resetPasswordLink),
        []
      )

      await this.mailer.send(mail)

      return this.res.status(200).json({ message: "Reset password email sent successfully" })
    } catch (error) {
      this.next(error)
    }
  }

  @Post({ path: "/reset-password" })
  async resetPassword() {
    try {
      const { key: token, password, confirmPassword } = this.req.body

      if (!password || !confirmPassword) throw new ValidationException("Missing required fields")

      if (password !== confirmPassword) throw new ValidationException("Passwords do not match")

      const resetPassword = await this.resetPasswordRepository.findOneBy({ token })

      if (!resetPassword) throw new NotFoundException("Token")

      if (resetPassword.expires_at < new Date()) {
        await this.resetPasswordRepository.delete(resetPassword.id)
        throw new ValidationException("Token expired")
      }

      const user = await resetPassword.getUser()

      const hashedNewPassword = await bcrypt.hash(password, 10)

      await this.userRepository.save({
        ...user,
        password: hashedNewPassword
      })

      await this.resetPasswordRepository.delete(resetPassword.id)

      return this.res.status(200).json({ message: "Password reset successfully" })
    } catch (error) {
      this.next(error)
    }
  }

  @Delete({ path: "/delete-account", middlewares: [isAuthenticated] })
  async removeUser() {
    const user = this.req.user

    if (!user) throw new UnauthorizedException()

    await this.userRepository.delete(user.id)

    this.res.clearCookie("Token")
    const base_path = new Config().get("router.base_path")
    this.res.clearCookie("RefreshToken", { path: `${base_path}/auth` })

    this.res.status(200).json({ message: "User deleted successfully" })
  }
}
