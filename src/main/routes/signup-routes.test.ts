import { Request, Response } from 'express'
import request from 'supertest'

import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        email: 'Medina@mail.com',
        name: 'Medina',
        password: 'senhaLouca',
        passwordConfirmation: 'senhaLouca'
      })
      .expect(200)
  })
})
