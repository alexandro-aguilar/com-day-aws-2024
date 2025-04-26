import GetQuizRepository from './GetQuizRepository';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import Quiz from './Quiz';
import BaseAPIGatewayController from '@app/common/controller/BaseAPIGatewayController';
import ApiGatewayControllerResponse from '@app/common/controller/ApiGatewayControllerResponse';

export default class GetQuizController extends BaseAPIGatewayController<object> {
  constructor(
    private readonly getQuizRepository = new GetQuizRepository()
  ) {
    super();
  }

  async run(request: APIGatewayProxyEventV2): Promise<ApiGatewayControllerResponse<object>> {
    const type: number = request.pathParameters?.type as unknown as number ?? 1;
    const quiz: Quiz = await this.getQuizRepository.execute(type);
    const response = new ApiGatewayControllerResponse<object>(quiz.toJson());
    return response;
  }
}