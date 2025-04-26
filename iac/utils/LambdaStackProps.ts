import { StackProps } from "aws-cdk-lib";
import { HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Role } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";

export default interface LambdaStackProps extends StackProps {
  role: Role,
  api: HttpApi,
  table: Table,
  bucket: Bucket
}