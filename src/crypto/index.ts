import { createSign, createVerify, HexBase64Latin1Encoding } from 'crypto';
import { CryptoConfig } from './types/config';

/**
 * Cryptographic engine for signing and verifying data ad signatures based on the algorithm
 * specified.
 */
class CryptoClient {
  private config: CryptoConfig;

  /**
   * Constructs a crypto engine.
   *
   * @param config Client config to initialize the engine
   */
  constructor(config: CryptoConfig) {
    this.config = config;
  }

  /**
   * Generates the signature of given data with the supplied private key and configured algorithm
   *
   * @param key Private key for signing as Base-64 encoded string
   * @param data Data to be signed, which can be a string or a Buffer
   *
   * @returns {string} signature string for the data, encoded per config
   */
  public sign(key: string, data: string | Buffer): string {
    const signer = createSign(this.config.signatureCipher);
    signer.update(data);
    return signer.sign(key, this.config.signatureEncoding as HexBase64Latin1Encoding);
  }

  /**
   * Verifies given data against a given signature with the supplied public key
   *
   * @param key Public key for verification as Base-64 encoded string
   * @param data Data whose signature has to be verified, which can be a string or a Buffer
   * @param signature Signature for verification as a string whose encoding was specified in the
   * config
   *
   * @returns {boolean} result of the verification as either true (passed) or false (failed)
   */
  public verify(key: string, data: string | Buffer, signature: string): boolean {
    const verifier = createVerify(this.config.signatureCipher);
    verifier.update(data);
    return verifier.verify(
      key,
      signature,
      this.config.signatureEncoding as HexBase64Latin1Encoding
    );
  }
}

export default CryptoClient;
