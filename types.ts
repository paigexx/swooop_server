export type FarcasterUser = {
    status: "approved" | "pending_approval" | "logged_out";
    signature: string;
    publicKey: string;
    privateKey: string;
    deadline: number;
    signerApprovalUrl?: string;
    token?: any;
    fid?: number;
  }; 

export type SignedKeyRequest = {
    deeplinkUrl: string;
    isSponsored: boolean;
    key: string;
    requestFid: number;
    state: string;
    token: string;
    userFid: number;
    signerUser?: object;
    signerUserMetadata?: object;
  }
  