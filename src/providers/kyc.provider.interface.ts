export interface IKycProviderService {
  initiateToken(userId: number): Promise<string>;
  handleWebhook(payload: any): Promise<void>;
}
