import { createRouter, Request, Response } from "@lyra-js/core"
import { Config } from "@lyra-js/core"

import { routes } from "@router/routes"

const routerBasePath = new Config().get("router.base_path")

export const router = createRouter()

router.use(routerBasePath, routes)

router.get("/", (req: Request, res: Response) => {
  res.send("Nothing here...")
})
