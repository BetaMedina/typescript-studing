import { AccountModel } from '../../domain/models/account'
import { AddAccountModel } from '../../domain/usecases/add-account'

export interface AddAccountRepository{
  create (value:AddAccountModel):Promise<AccountModel>

}
