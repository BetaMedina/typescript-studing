import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo.helper'

export class AccountRepository implements AddAccountRepository {
  async create (account:AddAccountModel):Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const newAccount = await accountCollection.insertOne(account)
    return newAccount.ops[0]
  }
} 
