import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/emailValidator'
import { EmailValidation } from './email-validation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { 
    isValid (email:string):boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

let emailValidationSut:EmailValidator
let sut:EmailValidation

describe('Email-validation', () => {
  beforeEach(() => {
    emailValidationSut = makeEmailValidator()
    sut = new EmailValidation('email', emailValidationSut)
  })

  it('Should return error 400 if invalid email is provided', async () => {
    jest.spyOn(emailValidationSut, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.validate({ email: 'valid_email@medina.com.br' })
    await expect(httpResponse).toEqual(new InvalidParamError('valid_email@medina.com.br'))
  })

  it('Should call email validator with correct mail', async () => {
    const isValidSpy = jest.spyOn(emailValidationSut, 'isValid')

    await sut.validate({ email: 'valid_email@medina.com.br' })
    await expect(isValidSpy).toHaveBeenCalledWith('valid_email@medina.com.br')
  })
})
