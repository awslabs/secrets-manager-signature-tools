import { CryptoConfig } from '../crypto/types/config';
import { ASMClientConfig } from '../services/aws-secrets-manager/types/config';

/**
 * Configuration interface for the signature engine powered by ASM.
 */
export interface EngineConfig {
  /**
   * Configuration for the crypto engine in the sign engine
   */
  cryptoConfig: CryptoConfig;

  /**
   * Configuration for the ASM service client in the sign engine
   */
  asmClientConfig: ASMClientConfig;
}
