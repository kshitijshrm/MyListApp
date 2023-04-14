import { TestHelpers } from '../../test/test.helpers';
import { ApplicationResponseSchemaToDtoMapper } from './response.dto.mapper';

describe('response dto mapper tests', () => {
  test('empty/undefined arrays in application get set to empty array', () => {
    const application =
      TestHelpers.CreateGetApplicationByApplicationIdResponse();
    application.application.versions[0].appUrls = undefined;
    application.application.versions[0].displayImages = undefined;
    application.application.versions[0].appUrlOverrides = undefined;
    const appDTO = ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(
      application.application,
    );

    expect(appDTO.appUrls).toBeDefined();
    expect(appDTO.appUrls).toHaveLength(0);
    expect(appDTO.images).toBeDefined();
    expect(appDTO.images).toHaveLength(0);
    expect(appDTO.urlOverrides).toBeDefined();
    expect(appDTO.urlOverrides).toHaveLength(0);
  });
});
