import { SignUpController } from './signUpController'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { AccountModel } from '../../../domain/models/account'

import { 
  AddAccount,
  EmailValidator,
  AddAccountModel
} from './signUp-protocols'

interface SutTypes {
  sut:SignUpController
  emailValidatorStub:EmailValidator,
  addAccountStub
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { 
    isValid (email:string):boolean {
      return true
    }
  }
  return new EmailValidatorStub()
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

const makeSut = ():SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAcount()

  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}
describe('Sign up Controller', () => {
  it('Should return error 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: '',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
    await expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  it('Should return error 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'medina',
        email: '',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
    await expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  it('Should return error 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'medina',
        email: 'medina@medina.com.br',
        password: '',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
    await expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  it('Should return error 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'medina',
        email: 'invalid_email@medina.com.br',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
    await expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  it('Should call email validator with correct mail', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'medina',
        email: 'invalid_email@medina.com.br',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    await sut.handle(httpRequest)
    await expect(isValidSpy).toHaveBeenCalledWith('invalid_email@medina.com.br')
  })
  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
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
    await expect(httpResponse.body).toEqual(new ServerError())
  })
  it('Should return error 400 if call AddAccount with  incorrect values', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'medina',
        email: 'medina@medina.com.br',
        password: 'any_password',
        passwordConfirm: ''
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
    await expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })
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
    await expect(httpResponse.body).toEqual(new ServerError())
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
})
