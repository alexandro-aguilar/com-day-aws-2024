import { HttpMethod, HttpRoute, HttpRouteKey } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime, Architecture, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import esbuildBundlingConfig from '../../../utils/esbuildBundlingConfig';
import LambdaStackProps from '../../../utils/LambdaStackProps';

export default class SaveScoreLambda extends NodejsFunction {
  private readonly name;

  constructor(scope: Construct, props: LambdaStackProps) {
    super(scope, `SaveScoreLambda`, {
      runtime: Runtime.NODEJS_22_X,
      entry: join(__dirname, '../../../../app/modules/score/save/SaveScoreHandler.ts'),
      handler: 'handler', // Name of the exported handler function,
      memorySize: 1024,
      architecture: Architecture.ARM_64,
      tracing: Tracing.ACTIVE,
      role: props.role,
      environment: {
        USERS_TABLE: props.table.tableName
      },
      bundling: esbuildBundlingConfig,
    });
    this.name = 'SaveScore';
    // Create an inline policy for DynamoDB PutItem access
    const dynamoUpdateItemPolicy = new Policy(scope, `${this.name}LambdaDynamoUpdateItemPolicy`, {
      statements: [
        new PolicyStatement({
          actions: ['dynamodb:UpdateItem'],
          resources: [props.table.tableArn],
        }),
      ],
    });

    // Attach the DynamoDB access policy to the Lambda function's role
    this.role?.attachInlinePolicy(dynamoUpdateItemPolicy);

    const integration = new HttpLambdaIntegration(`${this.name}Integration`, this);

    new HttpRoute(scope, `${this.name}Route`, {
      httpApi: props.api,
      routeKey: HttpRouteKey.with('/score', HttpMethod.POST),
      integration
    });
  }
}