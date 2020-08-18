import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFields } from '../../presentation/helpers/validators/required-field.validation'

import { makeValidationSignUpController } from './signup-validation'
import { Validation } from '../../presentation/helpers/validators/validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUp Validation Factory', () => {
  it('Should call ValidationComposite with all correct values', () => {
    makeValidationSignUpController()
    const validations:Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequiredFields(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations) 
  })
})
