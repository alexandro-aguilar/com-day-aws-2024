import * as path from 'path';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Policy, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { HttpMethod, HttpRoute, HttpRouteKey, HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';

export class GetQuizLambda {
  private readonly name = 'GetQuiz';

  constructor(scope: Construct, role: Role, apiGateway: HttpApi) {
    const lambda = new NodejsFunction(scope, `${this.name}Lambda`, {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../../app/modules/quiz/get/GetQuizHandler.ts'),
      handler: 'handler', // Name of the exported handler function,
      memorySize: 1024,
      timeout: Duration.seconds(60),
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

    //S3 access policy
    const s3AccessPolicy = new Policy(scope, `${this.name}LambdaS3AccessPolicy`, {
      statements: [
        new PolicyStatement({
          actions: ['s3:GetObject'],
          resources: ['arn:aws:s3:::com-day-questions-131578276461/*'],
        }),
      ],
    });

    lambda.role?.attachInlinePolicy(s3AccessPolicy);

     // Create an inline policy for Bedrock model invocation
    const bedrockInvokePolicy = new Policy(scope, `${this.name}LambdaBedrockInvokePolicy`, {
      statements: [
        new PolicyStatement({
          actions: [
            'bedrock:InvokeModel'
          ],
          resources: ['*'], // You can specify a specific Bedrock model ARN if applicable
        }),
      ],
    });

    // Attach the Bedrock access policy to the Lambda function's role
    lambda.role?.attachInlinePolicy(bedrockInvokePolicy);

    const integration = new HttpLambdaIntegration(`${this.name}Integration`, lambda);

    new HttpRoute(scope, `${this.name}Route`, {
      httpApi: apiGateway,
      routeKey: HttpRouteKey.with('/quiz/{type}', HttpMethod.GET),
      integration
    });
  }
}