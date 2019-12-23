/**
 * Configuration interface for NodeJS Crypto engine that performs the cryptographic signature
 * operations in this module.
 */
export interface CryptoConfig {
  /**
   * Cipher used for the signature algorithm for signing. You can see recommendations
   * [here](https://nodejs.org/api/crypto.html#crypto_crypto_createsign_algorithm_options)
   */
  signatureCipher: string;

  /**
   * Encoding scheme for the input data.
   */
  signatureEncoding: string;
}
