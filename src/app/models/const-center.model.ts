export class CostCenter {
  constructor(
    public _id: number = 0,
    public code: string = '',
    public location: string = '',
    public department: string = '',
    public company_code: string = ''
  ) {}
}
