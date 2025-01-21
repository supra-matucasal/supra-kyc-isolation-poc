export interface SynapsKycSessionResponse {
  synapsSessionId: string;
}

export interface OnfidoKycSessionResponse {
  workflowId: string;
  applicantId: string;
}

export type ProviderKycSessionResponse =
  | SynapsKycSessionResponse
  | OnfidoKycSessionResponse;

export interface IKycProviderService {
  initiateKycSession(
    verificationId: number,
  ): Promise<ProviderKycSessionResponse>;
  getExistingKycSession(verification: any): Promise<ProviderKycSessionResponse>;
  handleWebhook(payload: any): Promise<void>;
}
