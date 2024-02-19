import { faker } from '@faker-js/faker';
import { TestHelpers } from '../../test/test.helpers';
import { SolutionSettingsResponseSchema } from './response.dto.mapper';
import { ApplicationDTO, ApplicationUrlDTO } from '../application/application.dto';
import { SettingsMetaDTO } from '../common/common.dto';

describe('response dto mapper tests', () => {
    test('mapSolutionSettingsDTO should map SolutionDTO to SolutionSettingsDTO', () => {
        const solutionDTO = TestHelpers.createSolutionDTO()
        const result = SolutionSettingsResponseSchema.mapSolutionSettingsDTO(solutionDTO);

        expect(result).toEqual({
            solutionId: solutionDTO.solutionId,
            solutionVersionId: solutionDTO.solutionVersionId,
            displayName: solutionDTO.displayName,
            version: solutionDTO.version,
            settings: solutionDTO.applications ? SolutionSettingsResponseSchema.mapSettingsDTO(solutionDTO.applications) : [],
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
        expect(resultWithSetting).toBe('/settings');

        // Test when there is no ApplicationUrl with the name 'setting'
        const resultWithoutSetting = SolutionSettingsResponseSchema.mapToApplicationUrlDTO(appUrlsWithoutSetting);
        expect(resultWithoutSetting).toBe('');


        // Test when there is no ApplicationUrl and it is empty
        const emptyArrayResult = SolutionSettingsResponseSchema.mapToApplicationUrlDTO(emptyAppUrl);
        expect(emptyArrayResult).toBe('');
    });
    describe('mapSettingsDTO', () => {
        test('should map ApplicationDTO array to SettingsMetaDTO array with a setting URL', () => {
            const applicationWithSetting: ApplicationDTO = TestHelpers.createApplicationDTO(true);

            const result = SolutionSettingsResponseSchema.mapSettingsDTO([applicationWithSetting]);

            expect(result).toEqual([
                {
                    displayName: applicationWithSetting.listingName,
                    settingsUrl: '/settings',
                } as SettingsMetaDTO,
            ]);
        });

        test('should map ApplicationDTO array to empty SettingsMetaDTO array without a setting URL', () => {
            const applicationWithoutSetting: ApplicationDTO = TestHelpers.createApplicationDTO(false);

            const result = SolutionSettingsResponseSchema.mapSettingsDTO([applicationWithoutSetting]);

            expect(result).toEqual([]);
        });

        test('should map empty ApplicationDTO array to empty SettingsMetaDTO array', () => {
            const result = SolutionSettingsResponseSchema.mapSettingsDTO([]);

            expect(result).toEqual([]);
        });
    });
});
