import { ApplicationDTO } from '../application/application.dto';
import { SolutionDTO } from '../solution/solution.dto';

export interface SubscriptionDTO {
  subscriptionId: string;
  applications: Array<ApplicationDTO>;
  solutions: Array<SolutionDTO>;
  status: SubscriptionStatusDTO;
  tier: SubscriptionTierDTO;
}

export interface SubscriptionStatusDTO {
  status: string;
  requestedAt: string;
  activatedAt: string;
}

export interface SubscriptionTierDTO {
  displayName: string;
  planType: string;
  periodInDays: number;
}
