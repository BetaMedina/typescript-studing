import { MissingParamError, InvalidParamError } from '../../errors'
import { 
  ControllerInterface, 
  HttpResponse, 
  HttpRequest,
  AddAccount,
  EmailValidator
} from './signUp-protocols'
import { badRequest, serverError } from '../../helpers/http.helper'

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
      const account = this.addAccount.add({
        name, email, password
      })

      return {
        statusCode: 200,
        body: account
      }
    } catch {
      return serverError()
    }
  }
}
