import { SignUpController } from './signUpController'

describe('Sign up Controller', () => {
  it('Should return error if no name is provided', async () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    console.log('a')
    const httpResponse = sut.handle(httpRequest)
    await expect(httpResponse.statusCode).toBe(400)
  })
  // it('Should pass parameters and create user account', () => {

  // })
})
