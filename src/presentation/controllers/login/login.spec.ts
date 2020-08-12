import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../signUp/signUp-protocols'
import { LoginController } from './login'

interface IPayload {
  body:{
    password:string,
    email:string
  }
}

let sut:LoginController
let mailValidator:EmailValidator

const makeLoginSut = (mailValidator) => {
  return new LoginController(mailValidator)
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { 
    isValid (email:string):boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('', () => {
  beforeEach(() => {
    mailValidator = makeEmailValidator()
    sut = makeLoginSut(mailValidator)
  })
  it('Should be return 400 if empty mail is provider', async () => {
    const payload:IPayload = {
      body: {
        email: '',
        password: 'validPassword'
      }
    }
    const httpResponse = await sut.handle(payload)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(MissingParamError)
  })

  it('Should be return 400 if empty password is provider', async () => {
    const payload:IPayload = {
      body: {
        email: 'valid@mail.com',
        password: ''
      }
    }
    const httpResponse = await sut.handle(payload)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(MissingParamError)
  })
  it('Should be return 400 if wrong mail is provider', async () => {
    const payload:IPayload = {
      body: {
        email: 'invalid@mail.com',
        password: 'validpassword'
      }
    }
    jest.spyOn(mailValidator, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(payload)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(InvalidParamError)
  })
})
