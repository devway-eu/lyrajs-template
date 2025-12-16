import { NextFunction, Request, Response } from "express"
import { Validator, ValidationException } from "@lyra-js/core"
import { User } from "@entity/User"
import { userRepository } from "@repository/UserRepository"

export class UserController {
  static list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await userRepository.findAll().map( (user: User) => {
          delete user.password
          return user
      } )
      res.status(200).json({ message: "Users fetched successfully", users })
    } catch (error) {
      next(error)
    }
  }

  static read = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const user = await userRepository.find(id)
      delete user?.password
      res.status(200).json({ message: "User fetched successfully", user })
    } catch (error) {
      next(error)
    }
  }

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data }: {data: User} = req.body

      if(
        !data.email || !data.password ||
        !data.firstname || !data.lastname ||
        !data.username
      )
      {
        new ValidationException("All fields are required.")
      }

      if( !Validator.isUsernameValid(data.username) )
      {
        new ValidationException("Username to short (min 2 characters, only alphabetical characters and underscores )")
      }

      if( !Validator.isEmailValid(data.email) )
      {
        new ValidationException("Invalid email format.")
      }

      if( !Validator.isPasswordValid(data.password) )
      {
        new ValidationException("Password is to weak. I must be 10 characters long, including at least 1 lowercase, 1 uppercase, 1 number and 1 special character.")
      }

      data.role = "ROLE_USER";

      await userRepository.save(data)
      res.status(201).json({ message: "User created successfully" })
    } catch (error) {
      next(error)
    }
  }

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data }: {data: User} = req.body
      const user = await userRepository.find(data.id)
      if (!user) res.status(404).json({ message: "User not found" })
      if (user) await userRepository.save(data)
      res.status(200).json({ message: "Users updated successfully" })
    } catch (error) {
      next(error)
    }
  }

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const user = await userRepository.find(id)
      if (!user) res.status(404).json({ message: "User not found" })
      if (!user?.id) res.status(400).json({ message: "Invalid user id" })
      if (user?.id && id) await userRepository.delete(id)
      res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
      next(error)
    }
  }
}
