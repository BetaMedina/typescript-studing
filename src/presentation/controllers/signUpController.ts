import { MissingParamError, InvalidParamError } from '../errors'
import { ControllerInterface, EmailValidator, HttpResponse, HttpRequest } from '../protocols'
import { badRequest, serverError } from '../helpers/http.helper'
import { AddAccount } from '../../domain/usecases/add-account'

export class SignUpController implements ControllerInterface {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  
  constructor (emailValidator:EmailValidator, addAccount:AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['email', 'name', 'password', 'passwordConfirm']
    try {
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirm } = httpRequest.body
      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'))
      }

      if (!(this.emailValidator.isValid(email))) {
        return badRequest(new InvalidParamError('email'))
      }
      this.addAccount.add({
        name, email, password
      })
    } catch {
      return serverError()
    }
  }
}
