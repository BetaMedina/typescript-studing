import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missingParam.error'
import { ControllerInterface } from '../protocols/controller'

import { badRequest } from '../helpers/http.helper'
import { EmailValidator } from '../protocols/emailValidator'
import { InvalidParamError } from '../errors/invalidParam.error'
export class SignUpController implements ControllerInterface {
  private readonly emailValidator: EmailValidator
  
  constructor (emailValidator:EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['email', 'name', 'password', 'passwordConfirm']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const teste = this.emailValidator.isValid(httpRequest.body.email)
    console.log(teste)
    if (!teste) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
