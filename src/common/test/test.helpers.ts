import { faker } from '@faker-js/faker';
import { FileMetadataDTO } from '../dto/common/common.dto';
export class TestHelpers {

  static createApplicationDTO(
    hasSettings: boolean,
    hasIcon = true,
    hasDescription = true,
    appUrn?: string,
  ) {
    const applicationDTO = {
      appId: faker.datatype.uuid(),
      appVersionId: faker.datatype.uuid(),
      listingName: faker.random.words(),
      version: faker.system.semver(),
      urlPath: faker.random.word(),
      isPrivate: faker.datatype.boolean(),
      consoleCompatible: faker.datatype.boolean(),
      coreosUrn: appUrn ?? faker.datatype.uuid(),
      images: [],
      shortDescription: faker.lorem.sentence(),
      description: '',
      longDescription: '',
      applicationMenu: [],
      settingsIcon: hasIcon
        ? ({
            fileId: faker.datatype.uuid(),
            fileName: faker.system.fileName(),
            fileDescription: faker.system.mimeType(),
            fileUrl:
              'https://cdn.getos1.com/7adcf59e-c5df-418f-8645-e82f2a5231b6-default_icon.png',
          } as FileMetadataDTO)
        : undefined,
      settingPageRolesRequired: [],
    };

    return applicationDTO;
  }
}
