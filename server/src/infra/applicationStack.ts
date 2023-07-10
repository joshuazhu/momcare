import {
  App,
  Stack,
  aws_lambda as lambda,
  StackProps,
  aws_dynamodb
} from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import path from "path";
import { ApplicationProperties } from "src/infra/types";

const buildEnv = () => ({
  NODE_OPTIONS: "--enable-source-maps",
});

export class ApplicationStack extends Stack {
  constructor(scope: App, props: ApplicationProperties) {
    super(scope, `${props.stackName}`, props);

    const table = new aws_dynamodb.Table(this, `${props.stackName}-dish`, {
      tableName: `${props.stackName}-dish`,
      partitionKey: { name: 'title', type: aws_dynamodb.AttributeType.STRING },
      readCapacity: 5, 
      writeCapacity: 5, 
    })

    const lambda = this.createLambda({
      scope: this,
      lambdaName: `graphql`,
      sourcePath: "../index.ts",
      props,
    });

    table.grantFullAccess(lambda)

    const api = new apigateway.RestApi(this, `${props.stackName}-graphql-api`, {
      restApiName: `${props.stackName}-graphql-api`,
      description: `${props.stackName} graphql api`,
    });

    const lambdaApiIntegration = new apigateway.LambdaIntegration(lambda);
    api.root.addMethod("POST", lambdaApiIntegration);
  }

  private createLambda({
    scope,
    lambdaName,
    sourcePath,
    props,
  }: {
    scope: Stack;
    lambdaName: string;
    sourcePath: string;
    props: ApplicationProperties;
  }) {
    const id = `${props.stackName}-${lambdaName}-id`;
    const name = `${props.stackName}-${lambdaName}`;

    return new NodejsFunction(scope, id, {
      functionName: name,
      runtime: lambda.Runtime.NODEJS_16_X,
      architecture: lambda.Architecture.ARM_64,
      entry: path.join(__dirname, sourcePath),
      handler: "graphqlHandler",
      bundling: props.bundlingOptions,
      memorySize: props.lambdaRuntime.memorySize,
      logRetention: props.lambdaRuntime.logRetentionInDays,
      timeout: props.lambdaRuntime.timeout,
      environment: { ...buildEnv() },
    } as StackProps);
  }
}