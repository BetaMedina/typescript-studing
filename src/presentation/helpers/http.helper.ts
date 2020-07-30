
import { ServerError } from '../errors/serverError.error'
import { HttpResponse } from '../protocols/http' 

export const badRequest = (error:Error):HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error:Error):HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const successResponse = (body):HttpResponse => ({
  statusCode: 200,
  body
})
