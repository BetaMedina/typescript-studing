
import { MongoHelper } from '../helpers/mongo.helper'
import { AccountRepository } from '../account-repository/account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  it('Should return an account on success', async () => {
    const sut = new AccountRepository()
    const account = await sut.create({
      name: 'validName',
      email: 'validMail@mail.com',
      password: 'hashPass'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('validName')
    expect(account.email).toBe('validMail@mail.com')
    expect(account.password).toBe('hashPass')
  })
})
