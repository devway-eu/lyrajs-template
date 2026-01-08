import { Controller, Get, NextFunction, Request, Response, Route } from "@lyra-js/core"

@Route({ path: "/example" })
export class ExampleController extends Controller {
  @Get({ path: "/ssr" })
  async exampleSsrRouteMethod(req: Request, res: Response, next: NextFunction) {
    try {
      await this.render("ExampleRender.tsx", {
        title: "Example Title"
      })
    } catch (error) {
      next(error)
    }
  }
}
