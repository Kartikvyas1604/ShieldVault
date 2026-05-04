export interface CipherVault {
  version: string;
  name: string;
  instructions: Array<{
    name: string;
    accounts: Array<any>;
    args: Array<any>;
  }>;
}
