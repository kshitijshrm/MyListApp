import { SolutionDTO } from '../solution/solution.dto';
import { ApplicationDTO } from './application.dto';

export interface SubscriptionsResponseDTO {
  solutions: Array<SolutionDTO>;
  applications: Array<ApplicationDTO>;
}
