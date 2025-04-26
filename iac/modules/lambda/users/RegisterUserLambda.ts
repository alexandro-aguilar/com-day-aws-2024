import { join } from 'path';
import { Construct } from 'constructs';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, Architecture } from 'aws-cdk-lib/aws-lambda';
import { HttpMethod, HttpRoute, HttpRouteKey } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import LambdaStackProps from '../../../utils/LambdaStackProps';
import esbuildBundlingConfig from '../../../utils/esbuildBundlingConfig';


export default class RegisterUserLambda extends NodejsFunction {
  private readonly name;

  constructor(scope: Construct, props: LambdaStackProps) {
    super(scope, `RegisterUserLambda`, {
      runtime: Runtime.NODEJS_22_X,
      entry: join(__dirname, '../../../../app/modules/user/register/UserRegisterHandler.ts'),
      handler: 'handler', // Name of the exported handler function,
      memorySize: 1024,
      architecture: Architecture.ARM_64,
      role: props.role,
      environment: {
        USERS_TABLE: props.table.tableName
      },
      bundling: esbuildBundlingConfig,
    });
    this.name = 'RegisterUser';

    // Create an inline policy for DynamoDB PutItem access
    const dynamoPutItemPolicy = new Policy(scope, `${this.name}LambdaDynamoPutItemPolicy`, {
      statements: [
        new PolicyStatement({
          actions: ['dynamodb:PutItem'],
          resources: [props.table.tableArn],
        }),
      ],
    });

    // Attach the DynamoDB access policy to the Lambda function's role
    this.role?.attachInlinePolicy(dynamoPutItemPolicy);

    const integration = new HttpLambdaIntegration(`${this.name}Integration`, this);

    new HttpRoute(scope, `${this.name}Route`, {
      httpApi: props.api,
      routeKey: HttpRouteKey.with('/users', HttpMethod.POST),
      integration
    });
  }
}