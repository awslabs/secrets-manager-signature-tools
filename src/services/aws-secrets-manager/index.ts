import { SecretsManager as ASM } from 'aws-sdk';
import { ASMClientConfig } from './types/config';

/**
 * Service client for AWS Secrets Manager service. This client is used to fetch specified secrets
 * from ASM.
 */
class SecretsManager {
  private asmClient: ASM;

  /**
   * Constructs a service client.
   *
   * @param config Client config to initialize the client
   */
  constructor(config: ASMClientConfig) {
    const clientConfig: ASM.ClientConfiguration = Object.assign({}, config.asmRestOptions, {
      region: config.region,
      credentials: config.credentials
    });

    this.asmClient = new ASM(clientConfig);
  }

  /**
   * Fetches and returns a secret from AWS Secrets Manager.
   *
   * @param opts Options for the ASM client to be used for fetching the secret. The shape of
   * this argument is the same as that used in the native AWS SDK. You can read more
   * [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#getSecretValue-property)
   *
   * @returns {Promise<string>} Promise for the secret in plaintext string
   */
  public async getSecret(opts: ASM.Types.GetSecretValueRequest): Promise<string> {
    const data = await this.asmClient.getSecretValue(opts).promise();
    if (data && data.SecretString) {
      return data.SecretString;
    }

    throw new Error('No data received from AWS Secrets Manager');
  }
}

export default SecretsManager;
