import { HttpResponse } from '../protocols/http'
import { HandleDto } from './signUp.dto'
import { MissingParamError } from '../errors/missingParam.error'

export class SignUpController {
  handle (httpRequest: HandleDto): HttpResponse {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
    if (!httpRequest.body.name) { 
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }
  }
}
