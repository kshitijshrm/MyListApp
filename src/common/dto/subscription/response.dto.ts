import { ApplicationDTO } from '../application/application.dto';
import { SolutionDTO } from '../solution/solution.dto';

export interface SubscriptionsResponseDTO {
  solutions: Array<SolutionDTO>;
  applications: Array<ApplicationDTO>;
}
