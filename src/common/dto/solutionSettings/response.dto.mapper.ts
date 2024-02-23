import { Application, ApplicationUrl } from "src/shared/schemas/os1/developerportal/application/application.pb";
import { SolutionDTO } from "../solution/solution.dto";
import { SolutionSettingsDTO } from "./solutionSettings.dto";
import { ApplicationDTO, ApplicationUrlDTO } from "../application/application.dto";
import { PlatformRequestContext } from "@foxtrotplatform/developer-platform-core-lib";
import { SettingsMetaDTO } from "../common/common.dto";


export class SolutionSettingsResponseSchema {
    static mapSolutionSettingsDTO(solution: SolutionDTO): SolutionSettingsDTO {
        const response: SolutionSettingsDTO = {
            solutionId: solution.solutionId,
            solutionVersionId: solution.solutionVersionId,
            displayName: solution.displayName,
            version: solution.version,
            settings: solution.applications ? this.mapSettingsDTO(solution.applications) : []
        };
        return response;
    }

    static mapToApplicationUrlDTO(appUrls: ApplicationUrl[]): string {
        const settingUrl = appUrls.find((appUrl) => appUrl.name === "setting");
        if (settingUrl) {
            return settingUrl.url;
        }
        return "";
    }
    static mapSettingsDTO(applications: ApplicationDTO[]): SettingsMetaDTO[] {
        const applicationSettings = applications.map((application) => {
            const settingsUrl = SolutionSettingsResponseSchema.mapToApplicationUrlDTO(application.appUrls);

            if (settingsUrl !== "") {
                return {
                    displayName: application.listingName,
                    settingsUrl: settingsUrl,
                    icon: application?.icon?.fileUrl
                };
            }

            return null; // Skip applications without the "setting" appUrl
        }).filter(Boolean); // Remove null entries from the array

        return applicationSettings;
    }
}
