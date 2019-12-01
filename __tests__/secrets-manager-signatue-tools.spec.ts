import {
  mockASMSecretOpts,
  mockData,
  mockEngineConfig,
  mockSecretId,
  mockSecretKey,
  mockSignature
} from './resources/test-data';
import { getMapSpies, mockASMClient, mockCryptoClient } from './test-utils/mocks';

describe('Secrets Manager Signature Tools tests', function() {
  let mockedASMClient: any;
  let mockedCryptoClient: any;
  let mapSpies: any;

  beforeEach(() => {
    mapSpies = getMapSpies();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Signature generation tests', function() {
    it('should compute the sign of given data without caching', async function() {
      mockedASMClient = mockASMClient();
      mockedCryptoClient = mockCryptoClient();
      const signEngine = getSignEngineInstance();

      const result = await signEngine.getSign(mockData, mockSecretId);

      expect(result).toEqual(mockSignature);
      expect(mapSpies.getSpy).toHaveBeenCalledWith(mockSecretId);
      expect(mockedASMClient.mockGetSecret).toHaveBeenCalledWith(mockASMSecretOpts);
      expect(mapSpies.setSpy).not.toHaveBeenCalled();
      expect(mockedCryptoClient.mockSign).toHaveBeenCalledWith(mockSecretKey, mockData);
    });

    it('should compute the sign of given data with caching', async function() {
      mockedASMClient = mockASMClient();
      mockedCryptoClient = mockCryptoClient();
      const signEngine = getSignEngineInstance();

      const result = await signEngine.getSign(mockData, mockSecretId, true);

      expect(result).toEqual(mockSignature);
      expect(mapSpies.getSpy).toHaveBeenCalledWith(mockSecretId);
      expect(mockedASMClient.mockGetSecret).toHaveBeenCalledWith(mockASMSecretOpts);
      expect(mapSpies.setSpy).toHaveBeenCalledWith(mockSecretId, mockSecretKey);
      expect(mockedCryptoClient.mockSign).toHaveBeenCalledWith(mockSecretKey, mockData);
    });

    it('should compute the sign of given data with cached key', async function() {
      mockedASMClient = mockASMClient();
      mockedCryptoClient = mockCryptoClient();
      mapSpies = getMapSpies(mockSecretKey);
      const signEngine = getSignEngineInstance();

      const result = await signEngine.getSign(mockData, mockSecretId, true);

      expect(result).toEqual(mockSignature);
      expect(mapSpies.getSpy).toHaveBeenCalledWith(mockSecretId);
      expect(mockedASMClient.mockGetSecret).not.toHaveBeenCalled();
      expect(mapSpies.setSpy).not.toHaveBeenCalled();
      expect(mockedCryptoClient.mockSign).toHaveBeenCalledWith(mockSecretKey, mockData);
    });

    it('should throw error for failure in fetching key from ASM', function() {
      mockedASMClient = mockASMClient(true);
      mockedCryptoClient = mockCryptoClient();
      const signEngine = getSignEngineInstance();

      const signCall = () => signEngine.getSign(mockData, mockSecretId, true);

      expect(signCall()).rejects.toEqual('some-error');
      expect(mapSpies.getSpy).toBeCalledWith(mockSecretId);
      expect(mockedASMClient.mockGetSecret).toBeCalledWith(mockASMSecretOpts);
      expect(mapSpies.setSpy).not.toBeCalled();
      expect(mockedCryptoClient.mockSign).not.toBeCalled();
    });

    it('should throw error for failure in computing signature', async function() {
      mockedASMClient = mockASMClient();
      mockedCryptoClient = mockCryptoClient(true);
      const signEngine = getSignEngineInstance();

      try {
        await signEngine.getSign(mockData, mockSecretId, true);
      } catch (err) {
        expect(err).toEqual('some-error');
        expect(mapSpies.getSpy).toHaveBeenCalledWith(mockSecretId);
        expect(mockedASMClient.mockGetSecret).toHaveBeenCalledWith(mockASMSecretOpts);
        expect(mapSpies.setSpy).toHaveBeenCalledWith(mockSecretId, mockSecretKey);
        expect(mockedCryptoClient.mockSign).toHaveBeenCalledWith(mockSecretKey, mockData);
      }
    });
  });

  describe('Signature verification tests', function() {
    it('should verify the sign of given data without caching', async function() {
      mockedASMClient = mockASMClient();
      mockedCryptoClient = mockCryptoClient();
      const signEngine = getSignEngineInstance();

      const result = await signEngine.verifySign(mockSignature, mockData, mockSecretId);

      expect(result).toBeTruthy();
      expect(mapSpies.getSpy).toHaveBeenCalledWith(mockSecretId);
      expect(mockedASMClient.mockGetSecret).toHaveBeenCalledWith(mockASMSecretOpts);
      expect(mapSpies.setSpy).not.toHaveBeenCalled();
      expect(mockedCryptoClient.mockVerify).toHaveBeenCalledWith(
        mockSecretKey,
        mockData,
        mockSignature
      );
    });

    it('should verify the sign of given data with caching', async function() {
      mockedASMClient = mockASMClient();
      mockedCryptoClient = mockCryptoClient();
      const signEngine = getSignEngineInstance();

      const result = await signEngine.verifySign(mockSignature, mockData, mockSecretId, true);

      expect(result).toBeTruthy();
      expect(mapSpies.getSpy).toHaveBeenCalledWith(mockSecretId);
      expect(mockedASMClient.mockGetSecret).toHaveBeenCalledWith(mockASMSecretOpts);
      expect(mapSpies.setSpy).toHaveBeenCalledWith(mockSecretId, mockSecretKey);
      expect(mockedCryptoClient.mockVerify).toHaveBeenCalledWith(
        mockSecretKey,
        mockData,
        mockSignature
      );
    });

    it('should verify the sign of given data with cached key', async function() {
      mockedASMClient = mockASMClient();
      mockedCryptoClient = mockCryptoClient();
      mapSpies = getMapSpies(mockSecretKey);
      const signEngine = getSignEngineInstance();

      const result = await signEngine.verifySign(mockSignature, mockData, mockSecretId, true);

      expect(result).toBeTruthy();
      expect(mapSpies.getSpy).toHaveBeenCalledWith(mockSecretId);
      expect(mockedASMClient.mockGetSecret).not.toHaveBeenCalled();
      expect(mapSpies.setSpy).not.toHaveBeenCalled();
      expect(mockedCryptoClient.mockVerify).toHaveBeenCalledWith(
        mockSecretKey,
        mockData,
        mockSignature
      );
    });

    it('should throw error for failure in fetching key from ASM', function() {
      mockedASMClient = mockASMClient(true);
      mockedCryptoClient = mockCryptoClient();
      const signEngine = getSignEngineInstance();

      const verifyCall = () => signEngine.verifySign(mockSignature, mockData, mockSecretId, true);

      expect(verifyCall()).rejects.toEqual('some-error');
      expect(mapSpies.getSpy).toBeCalledWith(mockSecretId);
      expect(mockedASMClient.mockGetSecret).toBeCalledWith(mockASMSecretOpts);
      expect(mapSpies.setSpy).not.toBeCalled();
      expect(mockedCryptoClient.mockVerify).not.toBeCalled();
    });

    it('should throw error for failure in verifying signature', async function() {
      mockedASMClient = mockASMClient();
      mockedCryptoClient = mockCryptoClient(true);
      const signEngine = getSignEngineInstance();

      try {
        await signEngine.verifySign(mockSignature, mockData, mockSecretId, true);
      } catch (err) {
        expect(err).toEqual('some-error');
        expect(mapSpies.getSpy).toHaveBeenCalledWith(mockSecretId);
        expect(mockedASMClient.mockGetSecret).toHaveBeenCalledWith(mockASMSecretOpts);
        expect(mapSpies.setSpy).toHaveBeenCalledWith(mockSecretId, mockSecretKey);
        expect(mockedCryptoClient.mockVerify).toHaveBeenCalledWith(
          mockSecretKey,
          mockData,
          mockSignature
        );
      }
    });
  });

  function getSignEngineInstance() {
    return new (require('../src').default)(mockEngineConfig);
  }
});
