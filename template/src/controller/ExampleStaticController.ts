import { Controller, NextFunction, Request, Response } from "@lyra-js/core"

export class ExampleStaticController extends Controller {
  static exampleRouteMethod(req: Request, res: Response, next: NextFunction) {
    try {
      const exampleItem = {
        id: 1,
        title: "Example Title 1",
        content: "Example content of item 1"
      }

      res.status(200).json({ message: "Item fetched successfully", exampleItem })
    } catch (error) {
      next(error)
    }
  }
}
