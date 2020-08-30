import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { RequiredFields } from '../../../presentation/helpers/validators/required-field.validation'

import { Validation } from '../../../presentation/protocols/validation'
import { CompareFields } from '../../../presentation/helpers/validators/compare-field.validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
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
