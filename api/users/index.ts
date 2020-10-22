import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { DBController } from '../shared/db-controller';
import { ObjectId } from 'mongodb';


const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  context.log(`HTTP trigger function processed a request for users. Request method is ${req.method}`);
  const dbController = new DBController('users', context.log);
  let responseBody = null;
  try {
    switch (req.method) {
      case 'GET':
        context.log(`req parameters in the function : ${JSON.stringify(req.query)}`);
        responseBody = await dbController.getDocuments(req.query);
        break;
      case 'POST':
        const insertedDocument = await dbController.upsertDocument(req.body);
        responseBody = insertedDocument;
        break;
      case 'PUT':
        const { id } = req.query;
        const formData = req.body;
        context.log(`id is ${id} and request body is ${JSON.stringify(formData)}`);
        const query = {
          _id: new ObjectId(id)
        };
        const updatedDocument = await dbController.findOneAndUpdateDocument(query, formData);
        responseBody = updatedDocument;
        break;
        case 'DELETE':
          const softDeletedDocument = await dbController.softDeleteDocumentById(req.query);
          responseBody = softDeletedDocument;
          break;
      default:
        break;
    }
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: responseBody
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: error
    };

  }

};

export default httpTrigger;
