import { RequiredFields } from '../../presentation/helpers/validators/required-field.validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeValidationSignUpController = ():ValidationComposite => {
  const validations:Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFields(field))
  }
  
  return new ValidationComposite(validations)
}
