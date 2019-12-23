export const mockSecretId = 'some-secret-id';
export const mockSignature = 'some-signature';
export const mockSecretKey = 'some-secret';
export const mockData = 'some-data';
export const mockSignEncoding = 'some-sign-encoding';
export const mockASMClientConfig = {};
export const mockASMSecretOpts = {
  SecretId: mockSecretId
};
export const mockSecretResults = {
  SecretString: mockSignature
};
export const mockCryptoConfig = {
  signatureCipher: 'some-cipher',
  signatureEncoding: mockSignEncoding
};
export const mockEngineConfig = {
  cryptoConfig: mockCryptoConfig,
  asmClientConfig: mockASMClientConfig
};
