import { ValidationComposite, RequiredFields, CompareFields, EmailValidation } from '../../../presentation/helpers/validators'

import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { makeValidationSignUpController } from './signup-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('SignUp Validation Factory', () => {
  it('Should call ValidationComposite with all correct values', () => {
    const emailValidator = new EmailValidatorAdapter()

    makeValidationSignUpController()
    const validations:Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequiredFields(field))
    }

    validations.push(new CompareFields('password', 'passwordConfirm'))
    validations.push(new EmailValidation('email', emailValidator))

    expect(ValidationComposite).toHaveBeenCalledWith(validations) 
  })
})
