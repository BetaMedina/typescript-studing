import { HttpResponse, HttpRequest } from './http'

export interface ControllerInterface { 
  handle (httpRequest: HttpRequest): HttpResponse
}
