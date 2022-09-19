import { FileMetadata } from 'src/shared/schemas/os1/core/file/file.pb';
import { ApplicationVersionIdentifier } from 'src/shared/schemas/os1/developerportal/application/identifiers.pb';
import {
  Solution,
  SolutionConfiguration,
  SolutionDocumentMetadata,
  solutionPhaseToJSON,
} from 'src/shared/schemas/os1/developerportal/solution/solution.pb';
import {
  ConfigurationMetadataDTO,
  DocumentMetadataDTO,
  FileMetadataDTO,
} from '../common/common.dto';
import { SolutionResponseDTO } from './response.dto';
import { SolutionApplicaitonDTO, SolutionPhase } from './solution.dto';

export class SolutionResponseSchemaToDtoMapper {
  static mapToAppResponseDTO(solution: Solution): SolutionResponseDTO {
    const response: SolutionResponseDTO = {
      solutionId: solution.id.solutionId,
      solutionVersionId: solution.version[0].id.solutionVersionId,
      displayName: solution.version[0].displayAttributes.displayName,
      version: solution.version[0].version,
      shortDescription: solution.version[0].displayAttributes.shortDescription,
      longDescription: solution.version[0].displayAttributes.longDescription,
      categories: solution.version[0].classification
        ? solution.version[0].classification.categories
        : [],
      phase: SolutionPhase[solutionPhaseToJSON(solution.version[0].phase)],
      isCopyrightFree: solution.version[0].terms
        ? solution.version[0].terms.isCopyrightFree
        : undefined,
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
      documents: solution.version[0].documents
        ? solution.version[0].documents.map(
            SolutionResponseSchemaToDtoMapper.mapToDocumentMetadataDTO,
          )
        : undefined,
      configurations: solution.version[0].configurations
        ? solution.version[0].configurations.map(
            SolutionResponseSchemaToDtoMapper.mapToConfigurationMetadataDTO,
          )
        : undefined,
      applications: solution.version[0].applications
        ? solution.version[0].applications.map(
            SolutionResponseSchemaToDtoMapper.mapToSolutionApplicaitonDTO,
          )
        : undefined,
      isMarketplaceCompatible:
        solution.version[0].compatibility?.isMarketplaceCompatible,
      isConsoleCompatible:
        solution.version[0].compatibility?.isConsoleCompatible,
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

  static mapToSolutionApplicaitonDTO(
    application: ApplicationVersionIdentifier,
  ): SolutionApplicaitonDTO {
    const applicationDTO: SolutionApplicaitonDTO = {
      appId: application.appId,
      appVersionId: application.appVersionId,
    };
    return applicationDTO;
  }
}
