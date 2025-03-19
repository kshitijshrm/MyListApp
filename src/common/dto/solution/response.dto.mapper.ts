import { FileMetadata } from 'src/shared/schemas/os1/core/file/file.pb';
import {
  Solution,
  SolutionConfiguration,
  SolutionDocumentMetadata,
  SolutionVersion,
  SolutionVersion_Application,
  solutionTypeToJSON
} from 'src/shared/schemas/os1/developerportal/solution/solution.pb';
import {
  ConfigurationMetadataDTO,
  DocumentMetadataDTO,
  FileMetadataDTO,
} from '../common/common.dto';
import { SolutionApplicationDTO, SolutionDTO, SolutionResponseDTO, SolutionVersionDTO } from './solution.dto';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { Inject } from '@nestjs/common';
import { PlatformRequestContext } from '@foxtrotplatform/developer-platform-core-lib';

export class SolutionResponseSchemaToDtoMapper {
  @Inject(SubscriptionService)
  private readonly subscriptionService: SubscriptionService;

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

  mapToSolutionResponseDTO(ctx: PlatformRequestContext, solution: Solution): SolutionResponseDTO {
    const solutionDTO: SolutionResponseDTO = {
      solutionId: solution.id.solutionId,
      productFamily: solution.productFamily,
      supportedCountries: solution.supportedCountries,
      solutionType: solutionTypeToJSON(solution.solutionType) as any,
      organizationId: solution.organization.organizationId,
      versions: [],
    };

    solution.version.forEach((version) => {
      solutionDTO.versions.push(
        this.mapToSolutionVersionDTO(ctx, version),
      );
    });
    return solutionDTO;
  }

  mapToSolutionVersionDTO(
    ctx: PlatformRequestContext,
    solution: SolutionVersion,
  ): SolutionVersionDTO {
    console.log('solution', solution);
    const response: SolutionVersionDTO = {
      solutionId: solution.id.solutionId,
      solutionVersionId: solution.id.solutionVersionId,
      displayName: solution.displayAttributes.displayName,
      version: solution.version,
      shortDescription: solution.displayAttributes.shortDescription,
      longDescription: solution.displayAttributes.longDescription,
      icon:
        solution.icons && solution.icons.length > 0
          ? SolutionResponseSchemaToDtoMapper.mapToFileMetadataDTO(
            solution.icons[0],
          )
          : undefined,
      images: solution.displayImages
        ? solution.displayImages.map(
          SolutionResponseSchemaToDtoMapper.mapToFileMetadataDTO,
        )
        : undefined,
      applications: solution.associatedApplications
        ? solution.associatedApplications.map(
          (application) => this.mapToSolutionApplicationDTO(ctx, application),
        )
        : undefined,
      isConsoleCompatible:
        solution.compatibility?.isConsoleCompatible,
      listingId: solution.listingId,
      createdAt: solution.recordAudit.createdAt,
      updatedAt: solution.recordAudit.updatedAt,
      updatedBy: solution.recordAudit.updatedBy,
      createdBy: solution.recordAudit.createdBy,
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

  mapToSolutionApplicationDTO(
    ctx: PlatformRequestContext,
    application: SolutionVersion_Application,
  ): SolutionApplicationDTO {
    console.log('application', application);
    console.log('subscriptionService', this.subscriptionService);
    const applicationDetails = this.subscriptionService.getApplicationDetails(ctx, application);
    console.log('applicationDetails', applicationDetails);
    const applicationDTO: SolutionApplicationDTO = {
      appId: application.id.appId,
      appVersionId: application.id.appVersionId,
      displayOrder: application.displayOrder,
      listingId: application.listingId,
      semver: application.semver,
    };
    return applicationDTO;
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
