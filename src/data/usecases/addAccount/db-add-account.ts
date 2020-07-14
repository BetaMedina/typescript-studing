import { AddAccountRepository } from '../../protocols/add-account-repository'
import { Encrypter, AccountModel, AddAccount, AddAccountModel } from './db-add-accounnt-protocols'

export class DbAddAccount implements AddAccount {
  // eslint-disable-next-line no-useless-constructor
  constructor (private encrypter:Encrypter, private addAccountReposity :AddAccountRepository) {}

  async add (accountData:AddAccountModel):Promise<AccountModel> {
    const passwordCrypted = await this.encrypter.encrypt(accountData.password)
    await this.addAccountReposity.create(Object.assign({}, accountData, { password: passwordCrypted }))
    return new Promise(resolve => resolve(null))  
  }
}
