import cookieParser from "cookie-parser"
import cors from "cors"
import * as dotenv from "dotenv"
import express from "express"
import * as process from "node:process"

import { router } from "@app/router"
import { Config, LyraConsole, accessMiddleware, errorHandler, httpRequestMiddleware } from "@lyra-js/core"

dotenv.config()

const params = new Config().get("parameters")
const securityConfig = new Config().get("security")

const port = process.env.PORT
const app = express()

app.set("trust proxy", true)
app.use(cookieParser())
app.use(express.json({ limit: securityConfig.limits.request_max_size || "10mb" }))
app.use(express.urlencoded({ limit: securityConfig.limits.request_max_size || "10mb", extended: true }))
app.use(
  cors({
    origin: `${process.env.CLIENT_APP_URL}`,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    credentials: true
  })
)
app.use(httpRequestMiddleware)
app.use(accessMiddleware)
app.use(router)
app.use(errorHandler)

app.listen(port, (err?: Error) => {
  if (err) {
    LyraConsole.error("Error starting server:", err.message)
  } else {
    LyraConsole.info(
      `${params.api_name} v${params.api_version}`,
      `Server running at ${params.api_host}:${params.api_port}`,
      ""
    )
  }
})
