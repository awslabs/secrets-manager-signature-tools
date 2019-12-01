import { Credentials, SecretsManager } from 'aws-sdk';
import { AWSCredentialPair } from '../../types/aws-credential-pair';

/**
 * Configuration interface for AWS Secrets Manager client. This config requires an AWS region and
 * the AWS credential pair with which the client will be initialized.
 */
export interface ASMClientConfig {
  /**
   * AWS Region to which the service requests to ASM will be directed. Please see
   * [here](https://docs.aws.amazon.com/general/latest/gr/rande.html) for the region codes used
   * by AWS services.
   */
  region?: string;

  /**
   * AWS credential pair for your AWS account. If not provided in this config as part of this
   * property or through the supplementary AWS config, this is inferred from the credentials
   * file stores in your machine's root directory. If absent, AWS service will throw an error.
   */
  credentials?: AWSCredentialPair | Credentials;

  /**
   * Rest options for AWS Secrets Manager as per shape defined by AWS. YOu can provide this
   * config for other helpful properties in AWS config for the service. You can refer the doc
   * [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#constructor-property).
   * Note that the region and credentials property supplied above will override the same here.
   */
  asmRestOptions?: SecretsManager.ClientConfiguration;
}
