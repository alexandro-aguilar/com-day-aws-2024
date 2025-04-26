import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import User from './User';
import UserRegisterRepository from './UserRegisterRepository';
import HttpStatusCode from '../../../utils/httpStatusCode';

export default class UserRegisterController {
  constructor(
    private readonly userRegisterRepository = new UserRegisterRepository()
  ) {}

  async execute(request: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const body = JSON.parse(request.body as string);
    const user = new User(body.email, body.profile, body.name);
    const registrationResponse: boolean = await this.userRegisterRepository.execute(user);

    return {
      statusCode: registrationResponse ? HttpStatusCode.CREATED : HttpStatusCode.OK
    };
  }
}