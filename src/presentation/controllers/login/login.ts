import { HttpRequest, HttpResponse, Authentication, ControllerInterface, Validation } from './login-protocols'
import { badRequest, unauthorized, serverError, successResponse } from '../../helpers/http/http.helper' 

export class LoginController implements ControllerInterface {
  constructor (
    private authenticated:Authentication,
    private readonly validation:Validation
  ) {}

  async handle (httpRequest:HttpRequest): Promise <HttpResponse> {
    const error = this.validation.validate(httpRequest.body)

    if (error) {
      return badRequest(error)
    }

    try {
      const { email, password } = httpRequest.body

      const token = await this.authenticated.auth(email, password)

      if (!token) {
        return unauthorized()
      }

      return successResponse({ access_token: token })
    } catch (err) {
      return serverError(err)
    }
  }
}
