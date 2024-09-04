import { FileMetadata } from 'src/shared/schemas/os1/core/file/file.pb';
import {
  Solution,
  SolutionConfiguration,
  SolutionDocumentMetadata,
} from 'src/shared/schemas/os1/developerportal/solution/solution.pb';
import {
  ConfigurationMetadataDTO,
  DocumentMetadataDTO,
  FileMetadataDTO,
} from '../common/common.dto';
import { SolutionDTO } from './solution.dto';

export class SolutionResponseSchemaToDtoMapper {
  static mapToSolutionDTO(solution: Solution): SolutionDTO {
    const response: SolutionDTO = {
      solutionId: solution.id.solutionId,
      solutionVersionId: solution.version[0].id.solutionVersionId,
      displayName: solution.version[0].displayAttributes.displayName,
      version: solution.version[0].version,
      shortDescription: solution.version[0].displayAttributes.shortDescription,
      longDescription: solution.version[0].displayAttributes.longDescription,
      icon:
        solution.version[0].icons && solution.version[0].icons.length > 0
          ? SolutionResponseSchemaToDtoMapper.mapToFileMetadataDTO(
              solution.version[0].icons[0],
            )
          : undefined,
      images: solution.version[0].displayImages
        ? solution.version[0].displayImages.map(
            SolutionResponseSchemaToDtoMapper.mapToFileMetadataDTO,
          )
        : undefined,
      applications: [],
      isMarketplaceCompatible:
        solution.version[0].compatibility?.isMarketplaceCompatible,
      isConsoleCompatible:
        solution.version[0].compatibility?.isConsoleCompatible,
      coreAppSettings: solution.version[0].systemAppSettings ?? [],
      landingPage: '',
      allowedRedirectUrls: [],
      productGuideUrl: solution.version[0].solutionUrls?.find(
        (url) => url.name === 'docs',
      )?.url,
    };
    return response;
  }

  static mapToFileMetadataDTO(file: FileMetadata): FileMetadataDTO {
    const fileMetadataDTO: FileMetadataDTO = {
      fileId: file.id.fileId,
      fileName: file.attributes.fileName,
      fileDescription: file.attributes.fileDescription,
      fileUrl: file.attributes.fileUrl,
    };
    return fileMetadataDTO;
  }

  static mapToDocumentMetadataDTO(
    document: SolutionDocumentMetadata,
  ): DocumentMetadataDTO {
    const documentDTO: DocumentMetadataDTO = {
      category: document.category,
      document: SolutionResponseSchemaToDtoMapper.mapToFileMetadataDTO(
        document.file,
      ),
    };
    return documentDTO;
  }

  static mapToConfigurationMetadataDTO(
    configuration: SolutionConfiguration,
  ): ConfigurationMetadataDTO {
    const configurationDTO: ConfigurationMetadataDTO = {
      category: configuration.category,
      configurationFile: SolutionResponseSchemaToDtoMapper.mapToFileMetadataDTO(
        configuration.configurationFile,
      ),
    };
    return configurationDTO;
  }
}
