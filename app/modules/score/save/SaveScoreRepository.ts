import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import Score from './Score';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import Environment from '../../../utils/Environment';

export default class SaveScoreRepository {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({ region: 'us-east-1' });
    this.client = DynamoDBDocumentClient.from(client);
  }

  async execute(score: Score): Promise<boolean> {
    try {
      const command = new UpdateCommand({
        TableName: Environment.UsersTable,
        Key: {
          email: score.Email
        },
        UpdateExpression: 'set score = :score',
        ExpressionAttributeValues: {
          ':score': score.Score
        },
        ConditionExpression: 'attribute_not_exists(score)',
        ReturnValues: 'NONE'
      });
  
      await this.client.send(command);
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        return false;
      }
      throw error;
    }
  }
}