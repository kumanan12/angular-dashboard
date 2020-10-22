import { Console } from 'console';
import mongoose from 'mongoose';
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to DB');

});
mongoose.connect(process.env.CONN_STR, { useNewUrlParser: true });
export const DB = mongoose;
