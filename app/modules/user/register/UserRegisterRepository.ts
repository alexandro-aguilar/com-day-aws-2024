import User from './User';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import Environment from '../../../utils/Environment';

export default class UserRegisterRepository {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({ region: 'us-east-1' });
    this.client = DynamoDBDocumentClient.from(client);
  }

  async execute(user: User): Promise<boolean> {
    const params = {
      TableName: Environment.UsersTable,
      Item: user.toJSON(),
      ConditionExpression: 'attribute_not_exists(email)' // Prevent overwriting
    };
    try {
      const command = new PutCommand(params);
      await this.client.send(command);
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      console.error('Error', error);
      if (error.name === 'ConditionalCheckFailedException') {
        return false;
      }
      throw error;
    }
  }
}