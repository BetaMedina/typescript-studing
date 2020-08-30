import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite, RequiredFields, CompareFields, EmailValidation } from '../../../presentation/helpers/validators'

import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeValidationSignUpController = ():ValidationComposite => {
  const validations:Validation[] = []
  const emailValidator = new EmailValidatorAdapter()

  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequiredFields(field))
  }
  validations.push(new CompareFields('password', 'passwordConfirm'))
  validations.push(new EmailValidation('email', emailValidator))

  return new ValidationComposite(validations)
}
