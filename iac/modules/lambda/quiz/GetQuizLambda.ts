import { join } from 'path';
import { Architecture, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { HttpMethod, HttpRoute, HttpRouteKey } from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import LambdaStackProps from '../../../utils/LambdaStackProps';
import esbuildBundlingConfig from '../../../utils/esbuildBundlingConfig';

export class GetQuizLambda extends NodejsFunction {
  private readonly name;

  constructor(scope: Construct, props: LambdaStackProps) {
    super(scope, `GetQuizLambda`, {
      runtime: Runtime.NODEJS_22_X,
      entry: join(__dirname, '../../../../app/modules/quiz/get/GetQuizHandler.ts'),
      handler: 'handler', // Name of the exported handler function,
      memorySize: 1024,
      timeout: Duration.seconds(60),
      architecture: Architecture.ARM_64,
      tracing: Tracing.ACTIVE,
      role: props.role,
      environment: {
        QUIZ_BUCKET: props.bucket.bucketName
      },
      bundling: esbuildBundlingConfig,
    });
    this.name = 'GetQuiz';

    //S3 access policy
    const s3AccessPolicy = new Policy(scope, `${this.name}LambdaS3AccessPolicy`, {
      statements: [
        new PolicyStatement({
          actions: ['s3:GetObject'],
          resources: [`${props.bucket.bucketArn}/*`],
        }),
      ],
    });

    this.role?.attachInlinePolicy(s3AccessPolicy);

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
    this.role?.attachInlinePolicy(bedrockInvokePolicy);

    const integration = new HttpLambdaIntegration(`${this.name}Integration`, this);

    new HttpRoute(scope, `${this.name}Route`, {
      httpApi: props.api,
      routeKey: HttpRouteKey.with('/quiz/{type}', HttpMethod.GET),
      integration
    });
  }
}