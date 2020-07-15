import { AccountModel } from '../../../../domain/models/account'

export const map = (account: any):AccountModel => {
  const formatingAccount = account.ops[0]
  const { _id, ...formated } = formatingAccount
  
  return { ...formated, id: _id }
}
