import "reflect-metadata"

import { Config, cors, createServer, LyraConsole, SecurityConfig } from "@lyra-js/core"
import bcrypt from "bcrypt"
import * as dotenv from "dotenv"
import jwt from "jsonwebtoken"
import * as process from "node:process"

dotenv.config()

process.env.TZ = process.env.TZ || "Europe/Paris"

const params = new Config().get("parameters")
const securityConfig = new SecurityConfig().getConfig()

const port = process.env.PORT ? parseInt(process.env.PORT) : 3333
const app = createServer()

// Server settings
app.setSetting("trust proxy", false)
app.setSetting("request max size", securityConfig.limits.request_max_size || "10mb")

// Register third-party libraries for dependency injection
app.register(bcrypt, "bcrypt")
app.register(jwt, "jwt")

// CORS middleware
app.use(
  cors({
    origin: `${process.env.CLIENT_APP_URL}`,
    credentials: true
  })
)

// Controllers are auto-discovered and registered from src/controller directory
// Repositories and Services are auto-injected via DIContainer
app.listen(port, () => {
  LyraConsole.info(
    `${params.api_name} v${params.api_version}`,
    `Server running at ${params.api_host}:${params.api_port}`
  )
})
