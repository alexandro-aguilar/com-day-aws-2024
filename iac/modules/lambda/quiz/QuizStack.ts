import { NestedStack } from 'aws-cdk-lib';
import { GetQuizLambda } from './GetQuizLambda';
import { Construct } from 'constructs';
import LambdaStackProps from '../../../utils/LambdaStackProps';

export class QuizStack extends NestedStack {
  constructor(scope: Construct, props: LambdaStackProps) {
    super(scope, 'QuizStack', props);
    new GetQuizLambda(this, props);
  }
}