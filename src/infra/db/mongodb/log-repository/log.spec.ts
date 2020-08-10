import { MongoHelper } from '../helpers/mongo.helper'
import { AccountRepository } from '../account-repository/account'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log'
const makeSut = ():AccountRepository => {
  return new AccountRepository()
}
let sut:AccountRepository
describe('Log Mongo Repository', () => {
  let errorCollection:Collection

  beforeAll(async () => {
    await MongoHelper.connect()
    sut = makeSut()
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors')
    errorCollection.deleteMany({})
  })

  it('Should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.log('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
