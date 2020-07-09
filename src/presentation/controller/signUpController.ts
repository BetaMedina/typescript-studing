import { HttpResponse } from '../protocols/http'
import { HandleDto } from './signUp.dto'

export class SignUpController {
  handle (httpRequest: HandleDto): HttpResponse {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Misssing param:email')
      }
    }
    if (!httpRequest.body.name) { 
      return {
        statusCode: 400,
        body: new Error('Misssing param:name')
      }
    }
  }
}
