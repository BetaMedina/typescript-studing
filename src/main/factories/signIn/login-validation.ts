import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { EmailValidation, RequiredFields, ValidationComposite } from '../../../presentation/helpers/validators'

export const makeValidationLoginController = ():ValidationComposite => {
  const validations:Validation[] = []
  const emailValidator = new EmailValidatorAdapter()

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFields(field))
  }
  validations.push(new EmailValidation('email', emailValidator))

  return new ValidationComposite(validations)
}
