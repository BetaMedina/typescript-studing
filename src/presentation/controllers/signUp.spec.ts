import { SignUpController } from './signUpController'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols/emailValidator'

interface SutTypes {
  sut:SignUpController
  emailValidatorStub:EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { 
    isValid (email:string):boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = ():SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Sign up Controller', () => {
  it('Should return error if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: '',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
    await expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  it('Should return error if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'medina',
        email: '',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
    await expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  it('Should return error if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'medina',
        email: 'medina@medina.com.br',
        password: '',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
    await expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  it('Should return error if invalid email is provided', async () => {
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

    const httpResponse = sut.handle(httpRequest)
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

    sut.handle(httpRequest)
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

    const httpResponse = sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(500)
    await expect(httpResponse.body).toEqual(new ServerError())
  })
  it('Should return error if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'medina',
        email: 'medina@medina.com.br',
        password: 'any_password',
        passwordConfirm: ''
      }
    }
    const httpResponse = sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
    await expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })
  it('If password confirmation fail', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'medina',
        email: 'medina@medina.com.br',
        password: 'any_password',
        passwordConfirm: 'invalid_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
    await expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'))
  })
})
