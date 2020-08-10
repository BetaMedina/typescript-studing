import { LogErrorControllerDecorator } from './log'
import { ControllerInterface, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { serverError, successResponse } from '../../presentation/helpers/http.helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

class ControllerSpy implements ControllerInterface {
  httpRequest: HttpRequest

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return {
      body: 'any_response',
      statusCode: 200
    }
  }
}

const mockLogRepository = () => {
  class LogErrorRepositorySpy implements LogErrorRepository {
    stack: string
    async log (stack: string): Promise<void> {
      this.stack = stack
    }
  }
  return new LogErrorRepositorySpy()
}

const mockRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'anymail@mail.com',
      password: '123123',
      passwordConfirmation: '123123'
    }
  }
}

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

type SutTypes = {
  sut: LogErrorControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = mockLogRepository()
  const sut = new LogErrorControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(controllerSpy.httpRequest).toEqual(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual({
      body: 'any_response',
      statusCode: 200
    })
  })
})
