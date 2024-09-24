import { Banner } from 'src/shared/schemas/os1/core/coreosagent/banner.pb';
import {
  BannerDTO,
  BannerResponseDataDTO,
  SolutionBannerDTO,
  TenantSubscriptionMap,
} from './common.dto';

export class TenantBannersResponseSchemaToDtoMapper {
  static mapToBannerResponseDTO(
    banners: Banner[],
    tenantSubscriptionMap: TenantSubscriptionMap,
  ): BannerResponseDataDTO {
    const [foundation, solution] = banners.reduce(
      ([fb, sb], cv) => {
        if (cv.levelType === 'SOLUTION') {
          // solution
          tenantSubscriptionMap.map((item) => {
            if (cv.levelIds.includes(item.solutionId)) {
              sb.push({
                id: cv.id,
                title: cv.title,
                content: cv.content,
                activeFromTime: cv.startUtcIso,
                activeUntilTime: cv.endUtcIso,
                subscription: {
                  subscriptionId: item.subscriptionId,
                  solutionId: item.solutionId,
                },
              });
            }
          });
        } else {
          // foundation
          fb.push({
            id: cv.id,
            title: cv.title,
            content: cv.content,
            activeFromTime: cv.startUtcIso,
            activeUntilTime: cv.endUtcIso,
          });
        }
        return [fb, sb];
      },
      [[], []] as [Array<BannerDTO>, Array<SolutionBannerDTO>],
    );
    return {
      foundation,
      solution,
    };
  }
}
