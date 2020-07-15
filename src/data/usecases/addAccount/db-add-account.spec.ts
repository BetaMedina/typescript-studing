import { DbAddAccount } from './db-add-account'
import { Encrypter, AccountModel, AddAccountRepository } from './db-add-accounnt-protocols'
import { AddAccountModel } from '../../../domain/usecases/add-account'

interface SutTypes {
  sut:DbAddAccount
  encrypterStub:Encrypter,
  addAccountReposityStub:AddAccountRepository
}

const makeSut = ():SutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt (value:string):Promise<string> {
      return new Promise(resolve => resolve('hashedValue'))
    }
  }

  class AddAccountReposityStub implements AddAccountRepository {
    async create (accountData:AddAccountModel):Promise<AccountModel> {
      const fakeAccount = {
        id: 'validId',
        name: 'validName',
        email: 'validMail',
        password: 'hashedValue'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }

  const encrypterStub = new EncrypterStub()
  const addAccountReposityStub = new AddAccountReposityStub()
  const sut = new DbAddAccount(encrypterStub, addAccountReposityStub)

  return {
    sut,
    encrypterStub,
    addAccountReposityStub
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
    await sut.create(accountData)
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
    expect(sut.create(accountData)
    ).rejects.toThrow()
  })
  it('Should call addAccountRepositorie with correct password ', async () => {
    const { addAccountReposityStub, sut } = makeSut()
    const createSpy = jest.spyOn(addAccountReposityStub, 'create')
    const accountData = {
      name: 'validName',
      email: 'validMail',
      password: 'validPassword'
    }
    await sut.create(accountData)
    expect(createSpy).toHaveBeenCalledWith({
      ...accountData,
      password: 'hashedValue'

    })
  })
  it('Should throw if addAccountRepositorie throws ', async () => {
    const { addAccountReposityStub, sut } = makeSut()
    jest.spyOn(addAccountReposityStub, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'validName',
      email: 'validMail',
      password: 'validPassword'
    }
    expect(sut.create(accountData)
    ).rejects.toThrow()
  })
  it('Should return and account on success ', async () => {
    const { addAccountReposityStub, sut } = makeSut()
    const accountData = {
      name: 'validName',
      email: 'validMail',
      password: 'validPassword'
    }
    const account = await sut.create(accountData)
    expect(account).toEqual({
      id: 'validId',
      name: 'validName',
      email: 'validMail',
      password: 'hashedValue'
    })
  })
})
