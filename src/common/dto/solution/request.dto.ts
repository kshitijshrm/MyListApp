import { ApiProperty } from '@nestjs/swagger';
import {
  SolutionApplicaitonDTO,
  SolutionClassificationDTO,
  SolutionDisplayAttributesDTO,
  SolutionTermsDTO,
} from './solution.dto';

export class RegisterSolutionRequestDTO
  implements Partial<SolutionDisplayAttributesDTO>, SolutionClassificationDTO
{
  @ApiProperty()
  displayName: string;
  @ApiProperty()
  version: string;
  @ApiProperty()
  shortDescription: string;
  @ApiProperty()
  categories: Array<string>;
}

export class MutableSolutionAttributesDTO
  implements
    Partial<SolutionDisplayAttributesDTO>,
    Partial<SolutionClassificationDTO>,
    Partial<SolutionTermsDTO>
{
  @ApiProperty()
  displayName?: string;
  @ApiProperty()
  shortDescription?: string;
  @ApiProperty()
  longDescription?: string;
  @ApiProperty()
  categories?: Array<string>;
  @ApiProperty()
  isCopyrightFree?: boolean;
}

export class SolutionApplicaitonRequestDTO implements SolutionApplicaitonDTO {
  @ApiProperty()
  appId: string;
  @ApiProperty()
  appVersionId: string;
}
