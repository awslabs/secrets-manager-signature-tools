import CryptoClient from './crypto';
import SecretsManager from './services/aws-secrets-manager';
import { EngineConfig } from './types/config';

export { EngineConfig as SimpleSignEngineConfig } from './types/config';

/**
 * Signature engine that signs or verified given data artefacts against secrets stored in AWS
 * Secrets Manager. This module is capable of caching keys in memory for multiple use to avoid
 * network turnarounds. This can be configured on per-cipher-key basis.
 */
export default class SimpleSignEngine {
  private config: EngineConfig;
  private asmClient: SecretsManager;
  private cryptoClient: CryptoClient;

  // NOTE: Keys must be stored in cipher-friendly format in AWS Secrets Manager, preferably PEM
  // format for the common RSA-SHA cipher
  private keyMap: Map<string, string>;

  /**
   * Constructs and instance of the signature engine
   *
   * @param config Configuration to initialize the engine
   */
  constructor(config: EngineConfig) {
    this.config = config;
    this.keyMap = new Map<string, string>();

    this.asmClient = new SecretsManager(this.config.asmClientConfig);
    this.cryptoClient = new CryptoClient(this.config.cryptoConfig);
  }

  /**
   * Generates a signature for the given data. It fetches the private key for signing using the
   * given secret id from ASM. If option shouldCache is false, the function will not save the key,
   * else it will store the key in the map.
   *
   * NOTE: the secretId param is the name of the secret that represents the private key in
   * AWS Secrets Manager.
   *
   * @param {string | Buffer} data Data that needs to be signed
   * @param {string} secretId ID in ASM for the private key for signing
   * @param {boolean} shouldCache Flag to cache the private key in the key map in-memory. This
   * option is set to false by default.
   *
   * @returns {Promise<string>} Promise for the signature as Base-64 encoded string
   */
  public getSign(data: string | Buffer, secretId: string, shouldCache = false): Promise<string> {
    const privateKey = this.keyMap.get(secretId);
    if (privateKey) {
      return Promise.resolve(this.cryptoClient.sign(privateKey, data));
    } else {
      // Fetch the key from ASM and generate the sign. Cache the key if said so
      return this.asmClient
        .getSecret({ SecretId: secretId })
        .then((key: string) => {
          // If the key should be cached, save it
          if (shouldCache) {
            this.keyMap.set(secretId, key);
          }
          return Promise.resolve(this.cryptoClient.sign(key, data));
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
  }

  /**
   * Verifies given data against a given signature. It fetches the public key using the given secret
   * id from ASM. If option shouldCache is false, the function will not save the key, else it will
   * store the key in the map.
   *
   * NOTE: the secretId param is the name of the secret that represents the public key in
   * AWS Secrets Manager.
   *
   * @param {string} signature
   * @param {string | Buffer} data Data that needs to be verified
   * @param {string} secretId ID in ASM for the public key for signing
   * @param {boolean} shouldCache Flag to cache the public key in the key map in-memory. This
   * option is set to false by default.
   *
   * @returns {Promise<boolean>} Promise for the result of the verification as either true (passed)
   * or false (failed)
   */
  public async verifySign(
    signature: string,
    data: string | Buffer,
    secretId: string,
    shouldCache = false
  ): Promise<boolean> {
    const publicKey = this.keyMap.get(secretId);
    if (publicKey) {
      return Promise.resolve(this.cryptoClient.verify(publicKey, data, signature));
    } else {
      // Fetch the key from ASM and verify the sign. Cache the key if the options say so
      return this.asmClient
        .getSecret({ SecretId: secretId })
        .then((key: string) => {
          // If the key should be cached, save it
          if (shouldCache) {
            this.keyMap.set(secretId, key);
          }
          return Promise.resolve(this.cryptoClient.verify(key, data, signature));
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
  }
}
