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
  

  export type CastBody = {
      text: string,
      embeds: Array<any>,
      embedsDeprecated: Array<any>,
      mentions: Array<any>,
      mentionsPositions: Array<any>,
      parentUrl?: string,
  }

  export type User = {
    uid: number;
    fid: number;
    custody_address: string;
    recovery_address: string;
    following_count: number;
    follower_count: number;
    verifications: string[];
    bio: string;
    display_name: string;
    pfp_url: string;
    username: string
  }

  export type CastId = {
    fid: number;
    hash: string;
  }

  export type Embed = {
    url?: string;
    castId?: CastId
  }

  export type Reaction = {
    fid: number;
    fname: string;
  }

  export interface Reactions {
    likes: Reaction[], 
    recasts: Reaction[], 
    replies: {
      count: number;
    }
  }

  export type Cast = {
    fid: number;
    hash: string;
    short_hash: string;
    thread_hash?: string | null, 
    parent_hash?: string | null, 
    root_parent_url: string, 
    parent_author?: number
    author: User;
    content: string;
    timestamp: string;
    embeds: Embed[];
    reactions: Reactions, 
    mentioned_profiles?: User[]
  }