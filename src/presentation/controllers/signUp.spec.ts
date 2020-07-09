import { SignUpController } from './signUpController'
import { MissingParamError } from '../errors/missingParam.error'

describe('Sign up Controller', () => {
  it('Should return error if no name is provided', async () => {
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
  it('Should return error if no passwordConfirmation is provided', async () => {
    const sut = new SignUpController()
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
    await expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  // it('Should pass parameters and create user account', () => {

  // })
})
