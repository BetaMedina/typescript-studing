import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = new BcryptAdapter(12)
    const bcryptParams = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')

    expect(bcryptParams).toHaveBeenCalledWith('any_value', 12)
  })
})
