export class User {
  _id: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  role: string;

  constructor(
    _id: number = 0,
    first_name: string = '',
    last_name: string = '',
    username: string = '',
    password: string = '12345678',
    role: string = 'EMPLOYEE'
  ) {
    this._id = _id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.username = username;
    this.password = password;
    this.role = role;
  }

  get fullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  get isAdmin() {
    return this.role === 'ADMIN';
  }

  get initial() {
    const first = this.first_name?.[0] || '';
    const last = this.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase();
  }
}

export interface UserToken {
  _id: number;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

// export class User2 {
//   _id: number;
//   first_name: string;
//   last_name: string;
//   username: string;
//   password: string;
//   role: string;

//   constructor(
//     _id: number = 0,
//     first_name: string = '',
//     last_name: string = '',
//     username: string = '',
//     password: string = '',
//     role: string = 'EMPLOYEE'
//   ) {
//     this._id = _id;
//     this.first_name = first_name;
//     this.last_name = last_name;
//     this.username = username;
//     this.password = password;
//     this.role = role;
//   }
// }
