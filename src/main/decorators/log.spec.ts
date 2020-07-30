import { ControllerInterface, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorControllerDecorator } from './log'

const makeSut = () => {
  class ControllerSut implements ControllerInterface {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return {
        body: true,
        statusCode: 200
      }
    }
  }

  const controllerSut = new ControllerSut()
  return {
    controllerInject: controllerSut,
    logDecoratorSut: new LogErrorControllerDecorator(controllerSut)
  }
}
let sut
let controllerSut
let httpRequest
describe('Log controller decorator', () => {
  beforeEach(() => {
    const { controllerInject, logDecoratorSut } = makeSut()
    httpRequest = {
      body: {
        name: 'validName',
        mail: 'validMail'
      }
    }
  
    sut = logDecoratorSut
    controllerSut = controllerInject
  })
  it('Should be call controller handle', async () => {
    const call = jest.spyOn(controllerSut, 'handle')

    await sut.handle(httpRequest)
    expect(call).toHaveBeenCalledWith(httpRequest)
  })
  it('Should be catch a controller response', async () => {
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toHaveProperty('body')
    expect(httpResponse.body).toBe(true)
    expect(httpResponse.statusCode).toBe(200)
  })
})
