import { Construct } from 'constructs';
import { QuizStack } from './modules/lambda/quiz/QuizStack';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { UserStack } from './modules/lambda/users/UsersStack';
import { ScoreStack } from './modules/lambda/score/ScoreStack';
import GalacticQuizAPIGatewayStack from './modules/apigateway/GalacticQuizAPIGatewayStack';
import LambdaStackProps from './utils/LambdaStackProps';
import GalacticQuizUsersDynamoStack from './modules/dynamoDB/GalacticQuizUsersDynamoStack';
import GalacticQuizQuestionsBucketStack from './modules/s3/GalacticQuizQuestionsBucketStack';

export default class GalacticQuizStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    Tags.of(this).add('App', 'GalacticQuiz');

    const role = new Role(this, 'LambdaExecutionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    const apiGatewayStack = new GalacticQuizAPIGatewayStack(this, {});
    const api = apiGatewayStack.api;

    const galacticQuizUsersDynamoStack = new GalacticQuizUsersDynamoStack(this, {});
    const table = galacticQuizUsersDynamoStack.table;

    const comDayQuestionsBucketStack = new GalacticQuizQuestionsBucketStack(this, {});
    const bucket = comDayQuestionsBucketStack.bucket;

    const lambdaStackProps: LambdaStackProps = {
      role,
      api,
      table,
      bucket
    }
    
    new QuizStack(this, lambdaStackProps);

    new UserStack(this, lambdaStackProps);

    new ScoreStack(this, lambdaStackProps);
  }
}