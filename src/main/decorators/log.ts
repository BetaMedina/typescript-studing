import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { ControllerInterface, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogErrorControllerDecorator implements ControllerInterface {
  constructor (private controller:ControllerInterface, private logErrorRepository:LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.log(httpRequest.body.stack)
    }
    return httpResponse
  }
}
