/**
 * Credential pair type for programmatically accessing services in AWS. You can configure these
 * credentials for a given account/federated identity on AWS.
 */
export interface AWSCredentialPair {
  /**
   * AWS Access Key ID. This identified the accessing user for the current session.
   */
  accessKeyId: string;

  /**
   * AWS secret access key. This is the secret associated with your access ID.
   */
  secretAccessKey: string;

  /**
   * AWS session token to optionally identify an ongoing session.
   */
  sessionToken?: string;
}
