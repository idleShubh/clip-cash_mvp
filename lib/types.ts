export type Platform = "tiktok" | "reels";

export type CampaignStatus = "draft" | "live" | "closed";

export type Campaign = {
  id: string;
  name: string;
  brief: string;
  budget: number;
  cpv: number;
  platforms: Platform[];
  minFollowers: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  createdAt: string;
};

export type SubmissionState =
  | "pending_views"
  | "pending_approval"
  | "approved"
  | "disputed";

export type Submission = {
  id: string;
  campaignId: string;
  creatorHandle: string;
  postUrl: string;
  platform: Platform;
  views: number;
  state: SubmissionState;
  disputeReason?: string;
  submittedAt: string;
};
