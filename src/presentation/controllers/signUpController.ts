import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError, InvalidParamError } from '../errors'
import { ControllerInterface } from '../protocols/controller'

import { badRequest, serverError } from '../helpers/http.helper'
import { EmailValidator } from '../protocols/emailValidator'

export class SignUpController implements ControllerInterface {
  private readonly emailValidator: EmailValidator
  
  constructor (emailValidator:EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['email', 'name', 'password', 'passwordConfirm']
    try {
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      if (!(this.emailValidator.isValid(httpRequest.body.email))) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch {
      return serverError()
    }
  }
}
