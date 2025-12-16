import { Response, Router } from "express"

import { Config } from "@lyra-js/core"
import { routes } from "@router/routes"

const routerBasePath = new Config().get("router.base_path")

export const router = Router()

router.use(routerBasePath, routes)

router.get("/", (req, res: Response) => {
  res.send("Nothing here...")
})
