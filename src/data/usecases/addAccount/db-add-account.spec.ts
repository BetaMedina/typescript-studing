import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut:DbAddAccount
  encrypterStub:Encrypter,
}

const makeSut = ():SutTypes => {
  class EncrypterStub {
    async encrypt (value:string):Promise<string> {
      return new Promise(resolve => resolve('hashedValue'))
    }
  }

  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount UseCase', () => {
  it('Should call encrypter with correct password ', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'validName',
      email: 'validMail',
      password: 'validPassword'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('validPassword')
  })
  it('Should throw if encrypter throws ', async () => {
    const { encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'validName',
      email: 'validMail',
      password: 'validPassword'
    }
    expect(sut.add(accountData)
    ).rejects.toThrow()
  })
})
