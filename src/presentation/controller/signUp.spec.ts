import { SignUpController } from './signUpController'

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
    await expect(httpResponse.body).toEqual(new Error('Misssing param:name'))
  })
  it('Should return error if no email is provided', async () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: '',
        email: '',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
    await expect(httpResponse.body).toEqual(new Error('Misssing param:email'))
  })
  // it('Should pass parameters and create user account', () => {

  // })
})
