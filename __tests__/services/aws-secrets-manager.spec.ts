import {
  mockASMClientConfig,
  mockASMSecretOpts,
  mockSecretResults,
  mockSignature
} from '../resources/test-data';
import { mockASM } from '../test-utils/mocks';

describe('AWS Secrets Manager client tests', function() {
  let mockedASM: any;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch a secret from AWS Secrets Manager correctly', async function() {
    mockedASM = mockASM(null, mockSecretResults);
    const asmClientInstance = getASMClientInstance();

    const result = await asmClientInstance.getSecret(mockASMSecretOpts);

    expect(result).toEqual(mockSignature);
    expect(mockedASM.prototype.getSecretValue).toHaveBeenCalledWith(mockASMSecretOpts);
  });

  it('should throw error if it fails to fetch secret from AWS Secrets Manager', async function() {
    mockedASM = mockASM('some-error', null);
    const asmClientInstance = getASMClientInstance();

    try {
      await asmClientInstance.getSecret(mockASMSecretOpts);
    } catch (err) {
      expect(err).toEqual('some-error');
      expect(mockedASM.prototype.getSecretValue).toHaveBeenCalledWith(mockASMSecretOpts);
    }
  });

  it('should throw error if empty secret is returned from AWS Secrets Manager', async function() {
    mockedASM = mockASM(null, {});
    const asmClientInstance = getASMClientInstance();

    try {
      await asmClientInstance.getSecret(mockASMSecretOpts);
    } catch (err) {
      expect(err.message).toEqual('No data received from AWS Secrets Manager');
      expect(mockedASM.prototype.getSecretValue).toHaveBeenCalledWith(mockASMSecretOpts);
    }
  });

  function getASMClientInstance() {
    return new (require('../../src/services/aws-secrets-manager').default)(mockASMClientConfig);
  }
});
