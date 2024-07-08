import { Application, ApplicationUrl } from "src/shared/schemas/os1/developerportal/application/application.pb";
import { SolutionDTO } from "../solution/solution.dto";
import { SolutionSettingsDTO } from "./solutionSettings.dto";
import { ApplicationDTO, ApplicationUrlDTO } from "../application/application.dto";
import { PlatformRequestContext } from "@foxtrotplatform/developer-platform-core-lib";
import { SettingsMetaDTO } from "../common/common.dto";


export class SolutionSettingsResponseSchema {
  static mapSolutionSettingsDTO(
    solution: SolutionDTO,
    appsAssignedToUser: string[],
  ): SolutionSettingsDTO {
    const response: SolutionSettingsDTO = {
      solutionId: solution.solutionId,
      solutionVersionId: solution.solutionVersionId,
      displayName: solution.displayName,
      version: solution.version,
      settings: solution.applications
        ? this.mapSettingsDTO(solution.applications, appsAssignedToUser)
        : [],
      icon: solution?.icon?.fileUrl,
    };
    return response;
  }

  static mapToApplicationUrlDTO(appUrls: ApplicationUrl[]) {
    const settingUrl = appUrls.find((appUrl) => appUrl.name === 'setting');
    if (settingUrl) {
      return {
        url: settingUrl.url,
        description: settingUrl?.description,
      };
    }
    return {
      url: '',
      description: undefined,
    };
  }
  static mapSettingsDTO(
    applications: ApplicationDTO[],
    appsAssignedToUser: string[],
  ): SettingsMetaDTO[] {
    const applicationSettings = applications
      .map((application) => {
        const settingsUrl =
          SolutionSettingsResponseSchema.mapToApplicationUrlDTO(
            application.appUrls,
          );

        if (settingsUrl?.url && settingsUrl?.url !== '') {
          // app has a associated settings page
          if (
            appsAssignedToUser.includes(
              application.coreosUrn.split('-').slice(0, 1).join(''),
            )
          ) {
            // check if the user has access to the settings backend app
            return {
              displayName: application.listingName,
              settingsUrl: settingsUrl.url,
              icon: application?.settingsIcon?.fileUrl,
              description: settingsUrl?.description,
            };
          } else return null;
        }

        return null; // Skip applications without the "setting" appUrl
      })
      .filter((setting) => !!setting); // Remove null entries from the array

    return applicationSettings;
  }
}
