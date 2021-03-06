import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'

import app from '../config/app'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        email: 'Medina@mail.com',
        name: 'Medina',
        password: 'senhaLouca',
        passwordConfirm: 'senhaLouca'
      })
      .expect(200)
  })
})
