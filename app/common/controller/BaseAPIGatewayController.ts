import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import Controller from './Controller';
import HttpStatusCode from '@app/utils/httpStatusCode';
import ApiGatewayControllerResponse from './ApiGatewayControllerResponse';

export default abstract class BaseAPIGatewayController<TOutput> implements Controller<APIGatewayProxyEventV2, APIGatewayProxyResultV2> {

  abstract run(event: APIGatewayProxyEventV2): Promise<ApiGatewayControllerResponse<TOutput>>;

  async execute(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    try {
      const result: ApiGatewayControllerResponse<TOutput> = await this.run(event);
      return {
        statusCode: HttpStatusCode.OK ?? result.statusCode,
        body: JSON.stringify(result.body),
        headers: {
          'Content-Type': event.headers['Content-Type'] ?? 'application/json; charset=utf-8'
        }
      }
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      };
    }
  }
}