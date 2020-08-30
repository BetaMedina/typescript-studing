import { MissingParamError, ServerError, UnauthorizedError } from '../../errors'
import { Validation } from '../signUp/signUp-protocols'
import { LoginController } from './login'
import { Authentication } from '../../../domain/usecases/authentication'
import { badRequest } from '../../helpers/http/http.helper'

interface IPayload {
  body:{
    password:string,
    email:string
  }
}

let sut:LoginController
let authentication:Authentication
let validation:Validation

const makeLoginSut = (authentication, validation) => {
  return new LoginController(authentication, validation)
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation { 
    validate (input:any):Error {
      return null 
    }
  }
  return new ValidationStub()
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
    authentication = makeAuthSut()
    validation = makeValidation()
    sut = makeLoginSut(authentication, validation)
  })

  it('Should return 500 if authenticated throws', async () => {
    const payload:IPayload = {
      body: {
        email: 'invalid@mail.com',
        password: 'validpassword'
      }
    }

    jest.spyOn(authentication, 'auth').mockImplementationOnce(() => {
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
    await expect(httpResponse.body).toBeInstanceOf(UnauthorizedError) 
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
    await expect(httpResponse.body.access_token).toBe('any_token') 
  })
  it('Should call validation validator with correct value', async () => {
    const validateSpy = jest.spyOn(validation, 'validate')

    const httpRequest = {
      body: {
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    await expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  it('Should return 400 if validation return an error', async () => {
    jest.spyOn(validation, 'validate').mockReturnValue(new MissingParamError('any_error'))

    const httpRequest = {
      body: {
        name: 'medina',
        email: 'invalid_email@medina.com.br',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    await expect(httpResponse).toEqual(badRequest(new MissingParamError('any_error')))
  })
})
