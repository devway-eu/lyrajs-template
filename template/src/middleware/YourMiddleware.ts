import { NextFunction, Request, Response } from "express"

export const YourMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("Your middleware checks or does something here...")
  next()
}
