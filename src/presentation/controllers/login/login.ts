import { InvalidParamError } from '../../errors'
import { ControllerInterface } from '../../protocols/controller'
import { EmailValidator } from '../signUp/signUp-protocols'
import { HttpRequest, HttpResponse, badRequest, MissingParamError } from './login-protocols'

export class LoginController implements ControllerInterface {
  constructor (private emailValidator:EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest:HttpRequest): Promise <HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    if (await (!this.emailValidator.isValid(httpRequest.body.email))) {
      return badRequest(new InvalidParamError('email'))
    }
    return {
      statusCode: 200,
      body: 'aaaa'
    }
  }
}
