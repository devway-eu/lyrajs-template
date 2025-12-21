import { AuthController } from "@controller/AuthController"
import { Router } from "express"
import { rateLimiter } from "@lyra-js/core"

export const authRoutes = Router()

authRoutes.post("/sign-up", AuthController.signUp)
authRoutes.post("/sign-in", rateLimiter, AuthController.signIn)
authRoutes.get("/user", AuthController.getAuthenticatedUser)
authRoutes.get("/sign-out", AuthController.signOut)
authRoutes.get("/refresh-token", AuthController.refreshToken)
authRoutes.post("/update-account", AuthController.updateProfile)
authRoutes.delete("/delete-account", AuthController.removeUser)
