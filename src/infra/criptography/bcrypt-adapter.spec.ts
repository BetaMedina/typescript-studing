import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash ():Promise<string> {
    return new Promise(resolve => resolve('hashValue'))
  }
}))

const makeSut = ():BcryptAdapter => {
  return new BcryptAdapter(12)
}

let sut : BcryptAdapter
describe('Bcrypt Adapter', () => {
  beforeEach(() => {
    sut = makeSut()
  })

  it('Should call bcrypt with correct values', async () => {
    const bcryptParams = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')

    expect(bcryptParams).toHaveBeenCalledWith('any_value', 12)
  })
  it('Should return a hash on success', async () => {
    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('hashValue')
  })
  it('Should throw if bcrypt throws', async () => {
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    expect(sut.encrypt('any_value')).rejects.toThrow()
  })
})
