import { mockSecretKey, mockSignature } from '../resources/test-data';

export function mockASM(getSecretErr: any = null, getSecretRes: any = null) {
  jest.mock('aws-sdk');
  const mockAWS = require('aws-sdk');

  mockAWS.SecretsManager.prototype.getSecretValue = jest.fn((_opts: any) => {
    return {
      promise: () => {
        if (getSecretErr) {
          return Promise.reject(getSecretErr);
        }

        return Promise.resolve(getSecretRes);
      }
    };
  });

  return mockAWS.SecretsManager;
}

export function mockCrypto(mockSign = '', mockVerification = true) {
  jest.mock('crypto');
  const mockCrypto = require('crypto');

  const mockUpdateFn = jest.fn((_data: any) => null);
  const mockSignFn = jest.fn((_key: any, _encoding: any) => mockSign);
  const mockVerifyFn = jest.fn((_key: any, _sign: any, _encoding: any) => mockVerification);

  mockCrypto.createSign = jest.fn((_config: any) => ({
    update: mockUpdateFn,
    sign: mockSignFn
  }));

  mockCrypto.createVerify = jest.fn((_config: any) => ({
    update: mockUpdateFn,
    verify: mockVerifyFn
  }));

  return {
    mockUpdateFn,
    mockSignFn,
    mockVerifyFn
  };
}

export function mockASMClient(shouldThrowError = false) {
  jest.mock('../../src/services/aws-secrets-manager');
  const mockASMClient = require('../../src/services/aws-secrets-manager').default;

  const mockGetSecret = jest
    .spyOn(mockASMClient.prototype, 'getSecret')
    .mockImplementation(getPromiseResultOrErrorFn(shouldThrowError, mockSecretKey));
  return {
    mockGetSecret
  };
}

export function mockCryptoClient(shouldThrowError = false, verifyResult = true) {
  jest.mock('../../src/crypto');
  const mockCryptoClient = require('../../src/crypto').default;

  const mockSign = jest
    .spyOn(mockCryptoClient.prototype, 'sign')
    .mockImplementation(getPromiseResultOrErrorFn(shouldThrowError, mockSignature));
  const mockVerify = jest
    .spyOn(mockCryptoClient.prototype, 'verify')
    .mockImplementation(getPromiseResultOrErrorFn(shouldThrowError, verifyResult));

  return {
    mockSign,
    mockVerify
  };
}

export function getMapSpies(cachedResult?: any) {
  const setSpy = jest.spyOn(Map.prototype, 'set');
  const getSpy = jest.spyOn(Map.prototype, 'get').mockReturnValue(cachedResult);

  return {
    setSpy,
    getSpy
  };
}

function getPromiseResultOrErrorFn(shouldThrowError: boolean, result?: any) {
  return () => {
    if (shouldThrowError) {
      return Promise.reject('some-error');
    } else {
      return Promise.resolve(result);
    }
  };
}
