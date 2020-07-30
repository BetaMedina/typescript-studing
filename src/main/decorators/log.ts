import { ControllerInterface, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogErrorControllerDecorator implements ControllerInterface {
  constructor (private controller:ControllerInterface) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      console.error(httpResponse)
    }
    return httpResponse
  }
}
