import { HttpResponse } from '../protocols/http'
import { HandleDto } from './signUp.dto'
import { MissingParamError } from '../errors/missingParam.error'
import { badRequest } from '../helpers/http.helper'
export class SignUpController {
  handle (httpRequest: HandleDto): HttpResponse {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
    if (!httpRequest.body.name) { 
      return badRequest(new MissingParamError('name'))
    }
  }
}
