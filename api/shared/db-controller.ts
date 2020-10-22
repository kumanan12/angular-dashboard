
import { ObjectId, Db } from 'mongodb';
import { createDBConnection } from '../shared/mongo';
import { DBContext } from '../shared/DBContext';
import { Logger } from '@azure/functions';

export class DBController {
  dbContext: DBContext;

  constructor(private collectionName: string, private log: Logger) {

  }

  // insert or update.
  async upsertDocument(document: any): Promise<any> {
    const { db, connection } = await createDBConnection();
    try {
      const collection = db.collection(this.collectionName);
      document.createdDate = new Date();
      document.updatedDate = new Date();
      document.isDeleted = false;
      const query = { userId: document.userId };
      let updatedDoc = null;
      // check if it is a new user or existing user.
      const doc = await collection.findOne(query);
      if (doc) {
        // update doc.
        this.log(`updating the document for ${document.email}`);
        updatedDoc = await this.findOneAndUpdateDocument(query, document);
      } else {
        // insert doc.
        this.log(`inserting the document for ${document.email}`);
        updatedDoc = await (await collection.insert(document)).ops[0];
      }
      connection.close();
      return updatedDoc;
    } catch (error) {
      this.log.error(error);
      connection.close();
      throw error;
    }
  }

  async getDocuments(query: any): Promise<any> {
    const { db, connection } = await createDBConnection();
    let documents = null;
    this.log(`query : ${JSON.stringify(query)}`);
    query = query ? query : {};
    let { skip, limit } = query;
    this.log(`skip = ${skip}, limit = ${limit}`);
    delete query.limit;
    delete query.skip;
    this.log(`skip = ${skip}, limit = ${limit}`);

    if (query.isDeleted === "true") {
      query.isDeleted = true;
    } else {
      query.isDeleted = false;
    }
    const id = query._id ? query._id : null;
    if (id) {
      query._id = new ObjectId(id);
    }
    try {
      const collection = db.collection(this.collectionName);
      limit = (limit) ? limit : 1000;
      if (skip) {
        documents = await collection.find(query).skip(parseInt(skip)).limit(parseInt(limit)).toArray();
      } else {
        documents = await collection.find(query).toArray();
      }
      connection.close();
      return documents;
    } catch (err) {
      connection.close();
      this.log.error(err);
      throw err;
    }
  }

  async findOneAndUpdateDocument(query: any, data: any): Promise<any> {
    const { db, connection } = await createDBConnection();
    data.updatedDate = new Date();
    try {
      const collection = db.collection(this.collectionName);
      this.log(`query: ${JSON.stringify(query)}++++ document: ${JSON.stringify(data)}`);
      const doc = await collection.findOne(query);
      this.log(`doc userId is ${data.userId}`);
      const document = await collection.findOneAndUpdate(query, { $set: data });
      connection.close();
      return document;
    } catch (err) {
      connection.close();
      this.log.error(err);
      throw err;
    }

  }

  async softDeleteDocumentById(query: any): Promise<any> {
    // const body = await Dishes.findOne({ _id: ObjectID(id) })
    const { db, connection } = await createDBConnection();
    query = query ? query : {};
    let { _id } = query;
    this.log(`_id is ${_id}`);
    if (_id) {
      _id = new ObjectId(_id);
    }
    try {
      const collection = db.collection(this.collectionName);
      const documentToSoftDelete = await collection.findOne({ _id: _id });
      documentToSoftDelete.updatedDate = new Date();
      documentToSoftDelete.isDeleted = true;
      const document = await collection.findOneAndUpdate({ _id }, { $set: documentToSoftDelete });
      connection.close();
      return document;
    } catch (err) {
      connection.close();
      this.log.error(err);
      throw err;
    }
  }


  // 5f6930dd2799d64e1c6724d2



}
