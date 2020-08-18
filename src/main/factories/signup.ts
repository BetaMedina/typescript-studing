import { SignUpController } from '../../presentation/controllers/signUp/signUpController'
import { DbAddAccount } from '../../data/usecases/addAccount/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountRepository } from '../../infra/db/mongodb/account-repository/account'
import { ControllerInterface } from '../../presentation/protocols'
import { LogErrorControllerDecorator } from '../decorators/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { makeValidationSignUpController } from './signup-validation'

export const makeSignUpController = ():ControllerInterface => {
  const accountRepository = new AccountRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)

  const signUController = new SignUpController(dbAddAccount, makeValidationSignUpController())
  
  const logRepository = new LogMongoRepository()
  
  return new LogErrorControllerDecorator(signUController, logRepository)
}
