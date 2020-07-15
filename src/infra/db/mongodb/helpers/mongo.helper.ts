import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: MongoClient,
  async connect (uri?:string):Promise<void> {
    this.client = await MongoClient.connect(uri || process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  
  async disconnect ():Promise<void> {
    await this.client.close()
  },

  getCollection (name:string):Collection {
    return this.client.db().collection(name)
  },

  map (collection: any):any {
    const formatingCollection = collection.ops[0]
    const { _id, ...formated } = formatingCollection
    
    return { ...formated, id: _id }
  }
  
}
