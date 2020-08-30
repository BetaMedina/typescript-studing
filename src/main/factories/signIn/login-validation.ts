import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFields } from '../../../presentation/helpers/validators/required-field.validation'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeValidationLoginController = ():ValidationComposite => {
  const validations:Validation[] = []
  const emailValidator = new EmailValidatorAdapter()

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFields(field))
  }
  validations.push(new EmailValidation('email', emailValidator))

  return new ValidationComposite(validations)
}
