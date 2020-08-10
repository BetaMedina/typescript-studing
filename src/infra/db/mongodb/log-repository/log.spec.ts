import { MongoHelper } from '../helpers/mongo.helper'
import { AccountRepository } from '../account-repository/account'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log'

const makeSut = ():LogMongoRepository => {
  return new LogMongoRepository()
}

let sut:LogMongoRepository

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
    await sut.log('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
