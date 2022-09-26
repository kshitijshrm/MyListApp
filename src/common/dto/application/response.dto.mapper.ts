import { FileMetadata } from 'src/shared/schemas/os1/core/file/file.pb';
import {
  Application,
  ApplicationPrivacy_Type,
  applicationTypeToJSON,
  ApplicationUrl,
  ApplicationUrlOverride,
  DocumentMetadata,
} from 'src/shared/schemas/os1/developerportal/application/application.pb';
import { DocumentMetadataDTO } from '../common/common.dto';
import {
  ApplicationDTO,
  ApplicationUrlDTO,
  AppType,
  FileMetadataDTO,
  UrlOverrideDTO,
} from './application.dto';

export class ApplicationResponseSchemaToDtoMapper {
  static mapToApplicationDTO(application: Application): ApplicationDTO {
    const response: ApplicationDTO = {
      appId: application.id.appId,
      appVersionId: application.versions[0].id.appVersionId,
      listingName: application.versions[0].displayName,
      version: application.versions[0].version,
      urlPath: application.urlPath,
      appType:
        AppType[applicationTypeToJSON(application.appType).toLowerCase()],
      description: application.versions[0].description,
      isPrivate:
        application.versions[0].privacy.type ===
        ApplicationPrivacy_Type.PRIVATE,
      consoleCompatible:
        application.versions[0].applicationCompitablity.isConsoleCompatible,
      appUrls: application.versions[0].appUrls
        ? application.versions[0].appUrls.map(
            ApplicationResponseSchemaToDtoMapper.mapToApplicationUrlDTO,
          )
        : undefined,
      urlOverrides: application.versions[0].appUrlOverrides
        ? application.versions[0].appUrlOverrides.map(
            ApplicationResponseSchemaToDtoMapper.mapToUrlOverrideDTO,
          )
        : undefined,
      icon:
        application.versions[0].appIcons &&
        application.versions[0].appIcons.length > 0
          ? ApplicationResponseSchemaToDtoMapper.mapToFileMetadataDTO(
              application.versions[0].appIcons[0],
            )
          : undefined,
      images: application.versions[0].displayImages
        ? application.versions[0].displayImages.map(
            ApplicationResponseSchemaToDtoMapper.mapToFileMetadataDTO,
          )
        : undefined,
      shortDescription: application.versions[0].shortDescription ?? undefined,
      longDescription: application.versions[0].longDescription ?? undefined,
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
    document: DocumentMetadata,
  ): DocumentMetadataDTO {
    const documentDTO: DocumentMetadataDTO = {
      category: document.category,
      document: ApplicationResponseSchemaToDtoMapper.mapToFileMetadataDTO(
        document.appDocument,
      ),
    };
    return documentDTO;
  }

  static mapToApplicationUrlDTO(appUrl: ApplicationUrl): ApplicationUrlDTO {
    return {
      name: appUrl.name,
      url: appUrl.url,
    };
  }

  static mapToUrlOverrideDTO(override: ApplicationUrlOverride): UrlOverrideDTO {
    return {
      stackId: override.stackId,
      url: override.url,
    };
  }
}
