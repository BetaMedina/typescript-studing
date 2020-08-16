import { Authentication } from '../../../domain/usecases/authentication'
import { ControllerInterface } from '../../protocols/controller'
import { EmailValidator } from '../signUp/signUp-protocols'
import { HttpRequest, HttpResponse, badRequest, MissingParamError, unauthorized, serverError, InvalidParamError } from './login-protocols'

export class LoginController implements ControllerInterface {
  constructor (private emailValidator:EmailValidator, private authenticated:Authentication) {}

  async handle (httpRequest:HttpRequest): Promise <HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    try {
      if (await (!this.emailValidator.isValid(httpRequest.body.email))) {
        return badRequest(new InvalidParamError('email'))
      }
      
      const { email, password } = httpRequest.body

      const token = await this.authenticated.auth(email, password)

      if (!token) {
        return unauthorized('Invalid credentials')
      }

      return {
        statusCode: 200,
        body: token
      }
    } catch (err) {
      return serverError(err)
    }
  }
}
