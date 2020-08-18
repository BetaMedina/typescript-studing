import { SignUpController } from './signUpController'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { AccountModel } from '../../../domain/models/account'

import { 
  AddAccount,
  AddAccountModel,
  Validation
} from './signUp-protocols'
import { badRequest } from '../login/login-protocols'

interface SutTypes {
  sut:SignUpController
  validationStub:Validation,
  addAccountStub
}

const makeAddAcount = (): AddAccount => {
  class AddAccountSub implements AddAccount { 
    async create (account:AddAccountModel):Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountSub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation { 
    validate (input:any):Error {
      return null 
    }
  }
  return new ValidationStub()
}

const makeSut = ():SutTypes => {
  const addAccountStub = makeAddAcount()
  const validationStub = makeValidation() 

  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}
describe('Sign up Controller', () => {
  it('If password confirmation fail', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'create')

    const httpRequest = {
      body: {
        name: 'medina',
        email: 'medina@medina.com.br',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'medina',
      email: 'medina@medina.com.br',
      password: 'any_password'
    })
  })
  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    const error = new Error()
    error.stack = 'any_error'
    jest.spyOn(addAccountStub, 'create').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    
    const httpRequest = {
      body: {
        name: 'medina',
        email: 'any@medina.com.br',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(500)
    await expect(httpResponse.body).toBeInstanceOf(ServerError)
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(200)
    await expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })

  it('Should call validation validator with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = {
      body: {
        name: 'medina',
        email: 'invalid_email@medina.com.br',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    await expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  it('Should return 400 if validation return an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('any_error'))

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
