import * as cdk from 'aws-cdk-lib';
import { NestedStack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HttpApi, CorsHttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';

export default class GalacticQuizAPIGatewayStack extends NestedStack {
  private _api: HttpApi;
  constructor(scope: Construct, props: StackProps) {
    super(scope, 'GalacticQuizAPIGatewayStack', props);

    this._api = new HttpApi(this, 'GalacticQuizAPIGateway', {
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.OPTIONS, CorsHttpMethod.POST],
        allowOrigins: ['*'],
        maxAge: cdk.Duration.days(10), // Cache preflight response for 10 days
      },
      apiName: 'GalacticQuizAPIGatewayService'
    });
  }

  get api(): HttpApi {
    return this._api;
  }
}