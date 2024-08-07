import { ApiProperty } from '@nestjs/swagger';
import { SettingsMetaDTO } from '../common/common.dto';

export class SolutionSettingsDTO {
  @ApiProperty({
    description: 'Solution identifier in the OS1 platform',
    example: 'solution:5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
  })
  solutionId: string;
  @ApiProperty({
    description:
      'Identifier for the solution version whis is unique within the solution',
    example: 'solutionVersion:5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
  })
  solutionVersionId: string;
  @ApiProperty({
    description: 'Name of the solution to be displayed in the UI',
    example: 'My Solution',
  })
  displayName: string;
  @ApiProperty({
    description: 'Human readable semantic version of the solution',
    example: '1.0.0',
  })
  version: string;
  @ApiProperty({
    description:
      'Settings url associated with app',
    type: SettingsMetaDTO,
    example:
      [
        {
          "DisplayName": "My App",
          "settingsUrl": "/my-app/settings"
        }
      ],
  })
  settings: Array<SettingsMetaDTO>;
  @ApiProperty({
    description: 'Solution Icon Url',
    example: 'https://cdn.getos1.com/7adcf59e-c5df-418f-8645-e82f2a5231b6-default_icon.png',
  })
  icon?: string | undefined
}

export class CoreAppsSettingsDTO {
  @ApiProperty({
    description: 'Foundational apps identifier in the OS1 platform',
    example: 'platform:app:mts',
  })
  coreAppId: string;
  @ApiProperty({
    description: 'Name of the solution to be displayed in the UI',
    example: 'My Solution',
  })
  displayName: string;
  @ApiProperty({
    description: 'Settings URL',
    example: '/my-app/settings',
  })
  settingsUrl?: string | undefined;
  @ApiProperty({
    description: 'description of core apps setting',
    example: 'payment app for all solutions',
  })
  description?: string | undefined;
  @ApiProperty({
    description: 'icon url for the core app setting',
    example: '/my-app/settings-icon',
  })
  icon?: string | undefined;
}

export class SubscriptionSettings {
  @ApiProperty({
    description: 'Core apps identifier in the OS1 platform',
    example: [
      {
        coreAppId: 'platform:app:payments',
        displayName: 'Payments',
        settingsUrl: '/app/payments/settings',
      },
    ],
  })
  foundation: Array<CoreAppsSettingsDTO>;
  @ApiProperty({
    description: 'Contains all solution settings',
    example: [
      {
        solutionId: 'solution:5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
        solutionVersionId:
          'solutionVersion:5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
        displayName: 'My Solution',
        version: '1.0.0',
        settings: [
          {
            DisplayName: 'My App',
            settingsUrl: '/my-app/settings',
          },
        ],
      },
    ],
  })
  solutions: Array<SolutionSettingsDTO>;
}

