import { SignUpController } from '../../presentation/controllers/signUp/signUpController'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/addAccount/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountRepository } from '../../infra/db/mongodb/account-repository/account'
import { ControllerInterface } from '../../presentation/protocols'
import { LogErrorControllerDecorator } from '../decorators/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'

export const makeSignUpController = ():ControllerInterface => {
  const accountRepository = new AccountRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)
  const signUController = new SignUpController(emailValidatorAdapter, dbAddAccount)
  const logRepository = new LogMongoRepository()

  return new LogErrorControllerDecorator(signUController, logRepository)
}
