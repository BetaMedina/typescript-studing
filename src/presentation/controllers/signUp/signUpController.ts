import { InvalidParamError } from '../../errors'
import { 
  ControllerInterface, 
  HttpResponse, 
  HttpRequest,
  AddAccount,
  EmailValidator
} from './signUp-protocols'
import { badRequest, serverError, successResponse } from '../../helpers/http.helper'
import { Validation } from '../../helpers/validators/validation'

export class SignUpController implements ControllerInterface {
  constructor (
    private readonly emailValidator:EmailValidator, 
    private readonly addAccount:AddAccount, 
    private readonly validation:Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }
      
      const { name, email, password } = httpRequest.body

      if (!(this.emailValidator.isValid(email))) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.create({
        name, email, password
      })

      return successResponse(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
