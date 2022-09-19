import { CreateFileResponse } from 'src/shared/schemas/os1/core/file/response.pb';
import {
  Application,
  applicationPhaseToJSON,
  ApplicationPrivacy_Type,
  applicationTypeToJSON,
} from 'src/shared/schemas/os1/developerportal/application/application.pb';
import { AppStatus, AppType } from './application.dto';
import { AppResponseDTO, CreateFileResponseDTO } from './response.dto';

export class ApplicationResponseSchemaToDtoMapper {
  static mapToAppResponseDTO(application: Application): AppResponseDTO {
    const response: AppResponseDTO = {
      appId: application.id.appId,
      appVersionId: application.versions[0].id.appVersionId,
      listingName: application.versions[0].displayName,
      version: application.versions[0].version,
      clientId: application.clientCredentials.clientId,
      clientSecret: application.clientCredentials.clientSecretPlainText,
      urlPath: application.urlPath,
      appType:
        AppType[applicationTypeToJSON(application.appType).toLowerCase()],
      description: application.versions[0].description,
      isPrivate:
        application.versions[0].privacy.type ===
        ApplicationPrivacy_Type.PRIVATE,
      consoleCompatible:
        application.versions[0].applicationCompitablity.isConsoleCompatible,
      status:
        AppStatus[
          applicationPhaseToJSON(application.versions[0].applicationPhase)
        ],
    };
    return response;
  }
}
