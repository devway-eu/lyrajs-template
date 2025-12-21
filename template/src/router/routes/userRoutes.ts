import { UserController } from "@controller/UserController"
import { Router } from "express"
import { isAdmin } from "@lyrajs/core"

export const userRoutes = Router()

userRoutes.get("/all", isAdmin, UserController.list)
userRoutes.get("/:id", isAdmin, UserController.read)
userRoutes.post("/", isAdmin, UserController.create)
userRoutes.patch("/:id", isAdmin, UserController.update)
userRoutes.delete("/:id", isAdmin, UserController.delete)
