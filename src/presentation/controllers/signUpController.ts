import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missingParam.error'
import { ControllerInterface } from '../protocols/controller'

import { badRequest } from '../helpers/http.helper'
export class SignUpController implements ControllerInterface {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['email', 'name', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
