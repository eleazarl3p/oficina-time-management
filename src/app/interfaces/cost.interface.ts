import { CostOption } from '../enums/cost-option.enum';

export interface ICost {
  _id: number;
  name: string;
  type: CostOption;
}
