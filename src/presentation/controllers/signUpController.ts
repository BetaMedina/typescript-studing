import { HttpResponse } from '../protocols/http'
import { HandleDto } from './signUp.dto'
import { MissingParamError } from '../errors/missingParam.error'
import { badRequest } from '../helpers/http.helper'
export class SignUpController {
  handle (httpRequest: HandleDto): HttpResponse {
    const requiredFields = ['email', 'name']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
