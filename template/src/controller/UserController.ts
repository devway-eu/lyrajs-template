import {
  AccessControl,
  Controller,
  Delete,
  Get,
  isAuthenticated,
  NextFunction,
  Patch,
  Post,
  Request,
  Response,
  Route,
  UnauthorizedException,
  ValidationException,
  Validator
} from "@lyra-js/core"

import { User } from "@entity/User"

@Route({ path: "/user", middlewares: [isAuthenticated] })
export class UserController extends Controller {
  @Get({ path: "/all" })
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = (await this.userRepository.findAll()).map((user: User) => {
        const { password: _password, ...userWithoutPassword } = user
        return userWithoutPassword
      })
      res.status(200).json({ message: "Users fetched successfully", users })
    } catch (error) {
      next(error)
    }
  }

  @Get({ path: "/:user", resolve: { user: User } })
  async read(req: Request, res: Response, next: NextFunction, user: User) {
    try {
      const { password: _password, ...userWithoutPassword } = user
      res.status(200).json({ message: "User fetched successfully", user: userWithoutPassword })
    } catch (error) {
      next(error)
    }
  }

  @Post({ path: "/" })
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { data }: { data: User } = req.body

      if (!data.email || !data.password || !data.firstname || !data.lastname || !data.username) {
        new ValidationException("All fields are required.")
      }

      if (!Validator.isUsernameValid(data.username)) {
        new ValidationException("Username to short (min 2 characters, only alphabetical characters and underscores )")
      }

      if (!Validator.isEmailValid(data.email)) {
        new ValidationException("Invalid email format.")
      }

      if (!Validator.isPasswordValid(data.password)) {
        new ValidationException(
          "Password is to weak. I must be 10 characters long, including at least 1 lowercase, 1 uppercase, 1 number and 1 special character."
        )
      }

      const isEmailUsed = await this.userRepository.findOneBy({ email: data.email })

      if (isEmailUsed) {
        throw new Error("Email already in use")
      }

      if (!Validator.isPasswordValid(data.password)) {
        throw new Error("Invalid password")
      }

      const user = new User()
      const hashedPassword = await this.bcrypt.hash(data.password, 10)

      user.username = data.username
      user.firstname = data.firstname
      user.lastname = data.lastname
      user.email = data.email
      user.password = hashedPassword
      user.role = "ROLE_USER"

      await this.userRepository.save(data)
      res.status(201).json({ message: "User created successfully" })
    } catch (error) {
      next(error)
    }
  }

  @Patch({ path: "/:user", resolve: { user: User } })
  async update(req: Request, res: Response, next: NextFunction, user: User) {
    try {
      const { data }: { data: User } = req.body
      if (!user) return res.status(404).json({ message: "User not found" })
      if (!AccessControl.isOwner(req.user, user.id) && !AccessControl.hasRoleHigherThan(req.user, user.role))
        throw new UnauthorizedException()

      // Remove sensitive fields from data
      const { password: _password, email: _email, role, ...updateData } = data

      // Keep role if user doesn't have higher privileges
      const finalData = AccessControl.hasRoleHigherThan(req.user, user.role) ? updateData : { ...updateData, role }

      finalData.updated_at = new Date()
      await this.userRepository.save(finalData)
      res.status(200).json({ message: "Users updated successfully" })
    } catch (error) {
      next(error)
    }
  }

  @Delete({ path: "/:id" })
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const user = await this.userRepository.find(id)
      if (!user) return res.status(404).json({ message: "User not found" })
      if (!AccessControl.isOwner(req.user, user.id) && !AccessControl.hasRoleHigherThan(req.user, user.role))
        throw new UnauthorizedException()
      if (!user?.id) res.status(400).json({ message: "Invalid user id" })
      if (user?.id && id) await this.userRepository.delete(id)
      res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
      next(error)
    }
  }
}
