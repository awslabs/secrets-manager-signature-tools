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
    expect(mockedASM.prototype.getSecretValue).toHaveBeenCalledWith(
      mockASMSecretOpts,
      expect.any(Function)
    );
  });

  it('should throw error if it fails to fetch secret from AWS Secrets Manager', async function() {
    mockedASM = mockASM('some-error', null);
    const asmClientInstance = getASMClientInstance();

    const fetchCall = () => asmClientInstance.getSecret(mockASMSecretOpts);

    expect(fetchCall()).rejects.toEqual(
      'An error occurred while fetching key from ASM:' + ' some-error'
    );
    expect(mockedASM.prototype.getSecretValue).toBeCalledWith(
      mockASMSecretOpts,
      expect.any(Function)
    );
  });

  it('should throw error if empty secret is returned from AWS Secrets Manager', async function() {
    mockedASM = mockASM(null, {});
    const asmClientInstance = getASMClientInstance();

    const fetchCall = () => asmClientInstance.getSecret(mockASMSecretOpts);

    expect(fetchCall()).rejects.toEqual('No key data received from AWS Secrets Manager');
    expect(mockedASM.prototype.getSecretValue).toBeCalledWith(
      mockASMSecretOpts,
      expect.any(Function)
    );
  });

  function getASMClientInstance() {
    return new (require('../../src/services/aws-secrets-manager').default)(mockASMClientConfig);
  }
});
