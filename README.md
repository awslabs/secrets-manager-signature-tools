## secrets-manager-signature-tools

[![codecov.io Code Coverage](https://img.shields.io/codecov/c/github/awslabs/secrets-manager-signature-tools.svg?maxAge=2592000)](https://codecov.io/github/awslabs/secrets-manager-signature-tools?branch=master)

A lightweight wrapper over NodeJS native crypto library for content signing and verification. This library interfaces with AWS Secrets Manager (ASM) to fetch stored secrets for the signature processes to reduce boilerplate secret management in your code.

You can use this library for code signing with AWS Secrets Manager in your JavaScript/TypeScript applications. For TS, you do not need separate typings package to be installed; you'd find the typings as part of this package itself.

### Installation

For installing this library in your project, you would need [aws-sdk](https://github.com/aws/aws-sdk-js) `>=2.225.0`. Use npm to install this library to your package:

```bash
npm i --save aws-sdk@2.225 secrets-manager-signature-tools
```

You can then start using this library in your code.

### Usage

You can use this library to pull secret signing keys from AWS Secrets Manager service and sign/verify data with the utilities provided. For this, you'd need programmatic credentials for your AWS account and the secrets you want to use from AWS Secrets Manager. You can read more about AWS credentials [here](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) and AWS Secrets Manager [here](https://aws.amazon.com/secrets-manager/).

In your code, you can create a config for creating a signature engine provided in this tool:

```typescript
// signature-engine-config.ts
import { SimpleSignEngineConfig } from 'secrets-manager-signature-tools';

// Export your config for use
export const config: SimpleSignEngineConfig = {
  // Config for the signing
  cryptoConfig: {
    signatureCipher: 'RSA-SHA256',
    signatureEncoding: 'base64'
  },

  // Config for ASM
  asmClientConfig: {
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'My-AWS-User-Access-Key-ID',
      secretAccessKey: 'My-AWS-User-Secret-Access-Key'
    }
  }
};
```

Then, you can consume this config to drive a sign engine and use it:

```typescript
// simple-sign-engine.ts
import { config } from './signature-engine-config';
import SimpleSignEngine from 'secrets-manager-signature-tools';

const signEngine = new SimpleSignEngine(config);
const myData = 'Sign me!';

// These are your secrets stored in ASM using which you can sign and verify data
const privateKeyIdInASM = 'my-private-key-in-ASM';
const publicKeyIdInASM = 'my-public-key-in-ASM';

// Sign and verify data with the engine
signEngine
  .getSign(myData, privateKeyIdInASM)
  .then((sign) => {
    console.log(`Sign generated is ${sign}`);
    console.log(`Verifying the signature now...`);
    console.log(
      `Original sign will be verified. Result: ${signEngine.verifySign(
        sign,
        myData,
        publicKeyIdInASM
      )}`
    );

    // Some fake base64 sign verification
    let fakeSign = 'YWJjZA0K';
    console.log(
      `Fake sign will be rejected. Result: ${signEngine.verifySign(
        fakeSign,
        myData,
        publicKeyIdInASM
      )}`
    );
  })
  .catch((err) => {
    // Some error handling here
  });
```

For some applications, network calls may be expensive (eg. mobile apps). In such cases, you can cache your signing keys in-memory by providing a flag to the `getSign` or `veifySign` methods. In either case, if the key exists in cache, the engine will use the key. Otherwise, the key is fetched, cached and then used.

```typescript
signEngine.getSign(myData, privateKeyIdInASM, true); // Implies the key would be cached in-memory
```

> NOTE: Caching of keys can be done during sign generation/verification but once cached, the same key is used for subsequent operations.

For more details, please read though code documentation in this library. Happy signing!

## License

This library is licensed under the Apache 2.0 License.
