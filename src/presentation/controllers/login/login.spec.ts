import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator } from '../signUp/signUp-protocols'
import { LoginController } from './login'
import { Authentication } from '../../../domain/usecases/authentication'

interface IPayload {
  body:{
    password:string,
    email:string
  }
}

let sut:LoginController
let mailValidator:EmailValidator
let authentication:Authentication

const makeLoginSut = (mailValidator, authentication) => {
  return new LoginController(mailValidator, authentication)
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { 
    isValid (email:string):boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthSut = (): Authentication => {
  class Auth implements Authentication { 
    auth (email:string, password:string):Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new Auth()
}

describe('', () => {
  beforeEach(() => {
    mailValidator = makeEmailValidator()
    authentication = makeAuthSut()
    sut = makeLoginSut(mailValidator, authentication)
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
  it('Should be return 500 if mail validator throws', async () => {
    const payload:IPayload = {
      body: {
        email: 'invalid@mail.com',
        password: 'validpassword'
      }
    }
    jest.spyOn(mailValidator, 'isValid').mockImplementationOnce(() => {
      throw new ServerError('any_error')
    })
    
    const httpResponse = await sut.handle(payload)

    await expect(httpResponse.statusCode).toBe(500)
    await expect(httpResponse.body).toEqual(new ServerError('any_error')) 
  })
  it('Should call authentication with incorrect values', async () => {
    const payload:IPayload = {
      body: {
        email: 'invalid@mail.com',
        password: 'validpassword'
      }
    }

    jest.spyOn(mailValidator, 'isValid').mockImplementationOnce(() => {
      throw new ServerError('any_error')
    })
    
    const httpResponse = await sut.handle(payload)

    await expect(httpResponse.statusCode).toBe(500)
    await expect(httpResponse.body).toEqual(new ServerError('any_error')) 
  })

  it('Should call authentication with incorrect credentials', async () => {
    const payload:IPayload = {
      body: {
        email: 'invalid@mail.com',
        password: 'invalidpassword'
      }
    }

    jest.spyOn(authentication, 'auth').mockImplementationOnce(() => new Promise(resolve => resolve(null)))
    
    const httpResponse = await sut.handle(payload)

    await expect(httpResponse.statusCode).toBe(401)
    await expect(httpResponse.body).toBe('Invalid credentials') 
  })

  it('Should call authentication with correct values', async () => {
    const payload:IPayload = {
      body: {
        email: 'any@mail.com',
        password: 'validpassword'
      }
    }
    
    const httpResponse = await sut.handle(payload)

    await expect(httpResponse.statusCode).toBe(200)
    await expect(httpResponse.body).toBe('any_token') 
  })
})
