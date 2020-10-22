import { Db } from "mongodb";

export interface DBContext {
  connection: any;
  db: Db;
}
