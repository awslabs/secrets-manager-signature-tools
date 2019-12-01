import { mockCrypto } from '../test-utils/mocks';
import {
  mockCryptoConfig,
  mockData,
  mockSecretKey,
  mockSignature,
  mockSignEncoding
} from '../resources/test-data';

describe('Cypto tests', function() {
  let mockedCrypto: any;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate the signature of given data correctly', function() {
    mockedCrypto = mockCrypto(mockSignature);
    const cryptoClient = getCryptoEngineInstance();

    const result = cryptoClient.sign(mockSecretKey, mockData);

    expect(result).toEqual(mockSignature);
    expect(mockedCrypto.mockUpdateFn).toHaveBeenCalledWith(mockData);
    expect(mockedCrypto.mockSignFn).toHaveBeenCalledWith(mockSecretKey, mockSignEncoding);
  });

  it('should verify given data against a given signature correctly', function() {
    mockedCrypto = mockCrypto('', true);
    const cryptoClient = getCryptoEngineInstance();

    const result = cryptoClient.verify(mockSecretKey, mockData, mockSignature);

    expect(result).toBeTruthy();
    expect(mockedCrypto.mockUpdateFn).toHaveBeenCalledWith(mockData);
    expect(mockedCrypto.mockVerifyFn).toHaveBeenCalledWith(
      mockSecretKey,
      mockSignature,
      mockSignEncoding
    );
  });

  function getCryptoEngineInstance() {
    return new (require('../../src/crypto').default)(mockCryptoConfig);
  }
});
