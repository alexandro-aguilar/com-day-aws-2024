import path = require('path');
import { Construct } from 'constructs';
import { Policy, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, Architecture } from 'aws-cdk-lib/aws-lambda';
import { HttpMethod, HttpRoute, HttpRouteKey, HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export default class RegisterUserLambda {
  private readonly name = 'RegisterUser';

  constructor(scope: Construct, role: Role, apiGateway: HttpApi) {
    const lambda = new NodejsFunction(scope, `${this.name}Lambda`, {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../../app/modules/user/register/UserRegisterHandler.ts'),
      handler: 'handler', // Name of the exported handler function,
      memorySize: 1024,
      architecture: Architecture.ARM_64,
      bundling: {
        externalModules: [
          'aws-sdk',
          '@aws-sdk'
        ], // Exclude specific modules from bundling
        nodeModules: [],     // Include specific modules in the bundle
        target: 'node20',    // Set the target environment for esbuild
        sourceMap: true,
        sourcesContent: false,
      },
      role
    });

    // Create an inline policy for DynamoDB PutItem access
    const dynamoPutItemPolicy = new Policy(scope, `${this.name}LambdaDynamoPutItemPolicy`, {
      statements: [
        new PolicyStatement({
          actions: ['dynamodb:PutItem'],
          resources: ['arn:aws:dynamodb:us-east-1:131578276461:table/ComDayUsers'],
        }),
      ],
    });

    // Attach the DynamoDB access policy to the Lambda function's role
    lambda.role?.attachInlinePolicy(dynamoPutItemPolicy);

    const integration = new HttpLambdaIntegration(`${this.name}Integration`, lambda);

    new HttpRoute(scope, `${this.name}Route`, {
      httpApi: apiGateway,
      routeKey: HttpRouteKey.with('/users', HttpMethod.POST),
      integration
    });
  }
}