import { MongoClient } from 'mongodb';
import { DBContext } from './DBContext';
const connStr = process.env.CONN_STR;
const config = {
  url: connStr,
  dbName: 'cks-sports'
};

async function createConnection(): Promise<DBContext> {
  const connection = await MongoClient.connect(config.url, {
    useNewUrlParser: true
  });
  const db = connection.db(config.dbName);
  return {
    connection,
    db
  };
}

export const createDBConnection = createConnection;
