import { ApiProperty } from '@nestjs/swagger';
import { ApplicationDTO } from '../application/application.dto';
import { SolutionDTO } from '../solution/solution.dto';

export class SubscriptionStatusDTO {
  @ApiProperty({
    description: `
Status of the subscription. Possible values are: Active, Inactive, Deleted
`,
    enum: ['Active', 'Inactive', 'Deleted'],
    example: 'Active',
  })
  status: string;
  @ApiProperty({
    description: `
Date and time when the subscription was requested. This will be present for all subscriptions.
`,
    example: '2020-12-01T00:00:00.000Z',
  })
  requestedAt: string;
  @ApiProperty({
    description: `
Date and time when the subscription was activated. This will be present for all subscriptions. This will not be present if failed to activate because of technical issues.
`,
    example: '2020-12-01T00:00:00.000Z',
  })
  activatedAt: string;
}

export class SubscriptionTierDTO {
  @ApiProperty({
    description: `
Name of the subscription tier. Example: DEVELOPER, TRIAL, PRODUCTION`,
    enum: ['DEVELOPER', 'TRIAL', 'PRODUCTION'],
    example: 'TRAIL',
  })
  displayName: string;
  @ApiProperty({
    description: `
Type of the subscription tier. Example: DEVELOPER, TRIAL, PRODUCTION`,
    enum: ['DEVELOPER', 'TRIAL', 'PRODUCTION'],
    example: 'TRIAL',
  })
  planType: string;
  periodInDays: number;
}

export class SubscriptionDTO {
  @ApiProperty({
    description: `
Subscription identifier for the subscription product. 
Application and solution subsctiptions on a organization unique subscription product`,
    example: 'subscription:5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
  })
  subscriptionId: string;
  @ApiProperty({
    description: `
List of applications associated with the subscription. This array will be present only for application subscriptions

**Note:** applications are defined as collection but one subscription will mostly have only one application. This is because, one subscription product can have only one application or solution associated with it.`,
    type: ApplicationDTO,
    isArray: true,
  })
  applications: Array<ApplicationDTO>;
  @ApiProperty({
    description: `
List of solutions associated with the subscription. This array will be present only for solution subscriptions. Under the solution, there can exist multiple application that are part of the solution.

**Note:** solutions are defined as collection but one subscription will mostly have only one solution. This is because, one subscription product can have only one application or solution associated with it.`,
    type: SolutionDTO,
    isArray: true,
  })
  solutions: Array<SolutionDTO>;
  @ApiProperty({
    description:
      'Status of the subscription. This will be present for all subscriptions and indicate if the subscription is active or not',
  })
  status: SubscriptionStatusDTO;
  @ApiProperty({
    description: `
This filed indicates the subscription tier. This will be present for all subscriptions. This will help to idetify the number of days in which the subscription is active or exired.`,
  })
  tier: SubscriptionTierDTO;
}

export class SubscriptionsResponseDTO {
  @ApiProperty({
    description: 'whether or not console settings is enabled for this tenant',
  })
  isSettingsAvailable: boolean;
  @ApiProperty({
    description: 'list of all subscriptions',
  })
  subscriptions: Array<SubscriptionDTO>;
}