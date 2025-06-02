export class Job {
  _id: number;
  name: string;
  items: string[];

  constructor(_id: number = 0, name: string = '', items: string[] = []) {
    this._id = _id;
    this.name = name;
    this.items = items;
  }
}
