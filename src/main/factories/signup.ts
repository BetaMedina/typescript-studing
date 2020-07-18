import { SignUpController } from '../../presentation/controllers/signUp/signUpController'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/addAccount/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = ():SignUpController => {
  const accountRepository = new AccountRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)
  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
