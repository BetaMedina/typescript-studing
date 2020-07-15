import { AddAccountRepository } from '../../protocols/add-account-repository'
import { Encrypter, AccountModel, AddAccount, AddAccountModel } from './db-add-accounnt-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private encrypter:Encrypter, private addAccountReposity :AddAccountRepository) {}

  async create (accountData:AddAccountModel):Promise<AccountModel> {
    const passwordCrypted = await this.encrypter.encrypt(accountData.password)
    return this.addAccountReposity.create(Object.assign({}, accountData, { password: passwordCrypted }))
  }
}
