import { HttpMethod, HttpRoute, HttpRouteKey, HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Policy, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { Runtime, Architecture } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");

export default class SaveScoreLambda {
  private readonly name = 'SaveScore';

  constructor(scope: Construct, role: Role, apiGateway: HttpApi) {
    const lambda = new NodejsFunction(scope, `${this.name}Lambda`, {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../../app/modules/score/save/SaveScoreHandler.ts'),
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
    const dynamoUpdateItemPolicy = new Policy(scope, `${this.name}LambdaDynamoUpdateItemPolicy`, {
      statements: [
        new PolicyStatement({
          actions: ['dynamodb:UpdateItem'],
          resources: ['arn:aws:dynamodb:us-east-1:131578276461:table/ComDayUsers'],
        }),
      ],
    });

    // Attach the DynamoDB access policy to the Lambda function's role
    lambda.role?.attachInlinePolicy(dynamoUpdateItemPolicy);

    const integration = new HttpLambdaIntegration(`${this.name}Integration`, lambda);

    new HttpRoute(scope, `${this.name}Route`, {
      httpApi: apiGateway,
      routeKey: HttpRouteKey.with('/score', HttpMethod.POST),
      integration
    });
  }
}