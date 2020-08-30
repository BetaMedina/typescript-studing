import { CompareFields } from '../../../presentation/helpers/validators/compare-field.validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFields } from '../../../presentation/helpers/validators/required-field.validation'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
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
