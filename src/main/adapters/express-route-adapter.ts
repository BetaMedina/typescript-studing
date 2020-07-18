import { Request, Response } from 'express'
import { ControllerInterface, HttpRequest } from '../../presentation/protocols'

export const adaptRoute = (controller:ControllerInterface) => {
  return async (req:Request, res:Response) => {
    const httpRequest:HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
