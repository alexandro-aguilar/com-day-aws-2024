import Score from './Score';
import SaveScoreRepository from './SaveScoreRepository';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import HttpStatusCode from '../../utils/httpStatusCode';

export default class SaveScoreController {
  constructor(
    private readonly saveScoreRepository = new SaveScoreRepository()
  ) {}

  async execute(request: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const body = JSON.parse(request.body as string);
    const score = new Score(body.email, body.score);
    await this.saveScoreRepository.execute(score);

    return {
      statusCode: HttpStatusCode.CREATED
    }
  }
}