import { faker } from '@faker-js/faker';
import { TestHelpers } from '../../test/test.helpers';
import { SolutionSettingsResponseSchema } from './response.dto.mapper';
import { ApplicationDTO, ApplicationUrlDTO } from '../application/application.dto';
import { SettingsMetaDTO } from '../common/common.dto';

describe('response dto mapper tests', () => {
    test('mapSolutionSettingsDTO should map SolutionDTO to SolutionSettingsDTO', () => {
        const solutionDTO = TestHelpers.createSolutionDTO(
          'Role:appA:setting-role',
        );
        const result = SolutionSettingsResponseSchema.mapSolutionSettingsDTO(
          solutionDTO,
          ['Role:appA:setting-role'],
        );

        expect(result).toEqual({
          solutionId: solutionDTO.solutionId,
          solutionVersionId: solutionDTO.solutionVersionId,
          displayName: solutionDTO.displayName,
          version: solutionDTO.version,
          settings: solutionDTO.applications
            ? SolutionSettingsResponseSchema.mapSettingsDTO(
                solutionDTO.applications,
                ['Role:appA:setting-role'],
              )
            : [],
          icon: solutionDTO.icon.fileUrl,
        });
    });

    test('mapToApplicationUrlDTO should map ApplicationUrl array to settings URL', () => {
        // Create an array of ApplicationUrls with a setting URL
        const appUrlsWithSetting: ApplicationUrlDTO[] = [
            {
                name: 'relativePath',
                url: `/analytics/${faker.random.word()}/`,
            },
            {
                name: 'setting',
                url: '/settings',
                description: "description"
            },
        ];

        const appUrlsWithSettingAndWithoutDescription: ApplicationUrlDTO[] = [
            {
                name: 'relativePath',
                url: `/analytics/${faker.random.word()}/`,
            },
            {
                name: 'setting',
                url: '/settings'
            },
        ];

        // Create an array of ApplicationUrls without a setting URL
        const appUrlsWithoutSetting: ApplicationUrlDTO[] = [
            {
                name: 'relativePath',
                url: `/analytics/${faker.random.word()}/`,
            },
        ];
        // Create an empty of ApplicationUrls
        const emptyAppUrl: ApplicationUrlDTO[] = [];

        // Test when there is an ApplicationUrl with the name 'setting'
        const resultWithSetting = SolutionSettingsResponseSchema.mapToApplicationUrlDTO(appUrlsWithSetting);
        expect(resultWithSetting.url).toBe('/settings');
        expect(resultWithSetting.description).toBe('description');

        // Test when there is an ApplicationUrl with the name 'setting'
        const resultWithSettingWithoutDescription = SolutionSettingsResponseSchema.mapToApplicationUrlDTO(appUrlsWithSettingAndWithoutDescription);
        expect(resultWithSettingWithoutDescription.url).toBe('/settings');
        expect(resultWithSettingWithoutDescription.description).toBe(undefined);

        // Test when there is no ApplicationUrl with the name 'setting'
        const resultWithoutSetting = SolutionSettingsResponseSchema.mapToApplicationUrlDTO(appUrlsWithoutSetting);
        expect(resultWithoutSetting.url).toBe('');


        // Test when there is no ApplicationUrl and it is empty
        const emptyArrayResult = SolutionSettingsResponseSchema.mapToApplicationUrlDTO(emptyAppUrl);
        expect(emptyArrayResult.url).toBe('');
    });
    describe('mapSettingsDTO', () => {
        test('should map ApplicationDTO array to SettingsMetaDTO array with a setting URL', () => {
            const applicationWithSetting: ApplicationDTO =
              TestHelpers.createApplicationDTO(
                true,
                true,
                undefined,
                'randomAppUrn',
              );

            const result = SolutionSettingsResponseSchema.mapSettingsDTO(
              [applicationWithSetting],
              ['randomAppUrn'],
            );

            expect(result).toEqual([
                {
                    displayName: applicationWithSetting.listingName,
                    settingsUrl: '/settings',
                    icon: 'https://cdn.getos1.com/7adcf59e-c5df-418f-8645-e82f2a5231b6-default_icon.png' ,
                    description: 'description',
                } as SettingsMetaDTO,
            ]);
        });

        test('should map ApplicationDTO array to SettingsMetaDTO array with a setting URL and description is not present', () => {
            const applicationWithSetting: ApplicationDTO =
              TestHelpers.createApplicationDTO(
                true,
                true,
                false,
                'randomAppUrn',
              );

            const result = SolutionSettingsResponseSchema.mapSettingsDTO(
              [applicationWithSetting],
              ['randomAppUrn'],
            );

            expect(result).toEqual([
                {
                    displayName: applicationWithSetting.listingName,
                    settingsUrl: '/settings',
                    icon: 'https://cdn.getos1.com/7adcf59e-c5df-418f-8645-e82f2a5231b6-default_icon.png' ,
                    description: undefined,
                } as SettingsMetaDTO,
            ]);
        });

        test('should map ApplicationDTO array to SettingsMetaDTO array with a setting URL', () => {
            const applicationWithSetting: ApplicationDTO =
              TestHelpers.createApplicationDTO(
                true,
                false,
                undefined,
                'randomAppUrn',
              );

            const result = SolutionSettingsResponseSchema.mapSettingsDTO(
              [applicationWithSetting],
              ['randomAppUrn'],
            );

            expect(result).toEqual([
                {
                    displayName: applicationWithSetting.listingName,
                    settingsUrl: '/settings',
                    icon: undefined ,
                    description: 'description'
                } as SettingsMetaDTO,
            ]);
        });

        test('should map ApplicationDTO array to empty SettingsMetaDTO array without a setting URL', () => {
            const applicationWithoutSetting: ApplicationDTO =
              TestHelpers.createApplicationDTO(
                false,
                undefined,
                undefined,
                'randomAppUrn',
              );

            const result = SolutionSettingsResponseSchema.mapSettingsDTO(
              [applicationWithoutSetting],
              ['randomAppUrn'],
            );

            expect(result).toEqual([]);
        });

        test('should map empty ApplicationDTO array to empty SettingsMetaDTO array', () => {
            const result = SolutionSettingsResponseSchema.mapSettingsDTO(
              [],
              [],
            );

            expect(result).toEqual([]);
        });
    });
});
