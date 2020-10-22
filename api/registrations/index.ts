import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const appSettingValue = `app setting value: ${process.env.test}`;

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: appSettingValue,
  };

};

export default httpTrigger;
