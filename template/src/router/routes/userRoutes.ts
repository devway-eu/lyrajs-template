import { UserController } from "@controller/UserController"
import { Router } from "express"

export const userRoutes = Router()

userRoutes.get("/all", UserController.list)
userRoutes.get("/:id", UserController.read)
userRoutes.put("/", UserController.create)
userRoutes.patch("/:id", UserController.update)
userRoutes.delete("/:id", UserController.delete)
