import { 
  ControllerInterface, 
  HttpResponse, 
  HttpRequest,
  AddAccount,
  Validation
} from './signUp-protocols'
import { badRequest, serverError, successResponse } from '../../helpers/http.helper'
export class SignUpController implements ControllerInterface {
  constructor (
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
      
      const account = await this.addAccount.create({
        name, email, password
      })

      return successResponse(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
