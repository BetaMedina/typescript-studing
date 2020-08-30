
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { makeValidationLoginController } from './login-validation'
import { EmailValidation, RequiredFields, ValidationComposite } from '../../../presentation/helpers/validators'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('SignUp Validation Factory', () => {
  it('Should call ValidationComposite with all correct values', () => {
    const emailValidator = new EmailValidatorAdapter()

    makeValidationLoginController()
    const validations:Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFields(field))
    }
    validations.push(new EmailValidation('email', emailValidator))

    expect(ValidationComposite).toHaveBeenCalledWith(validations) 
  })
})
