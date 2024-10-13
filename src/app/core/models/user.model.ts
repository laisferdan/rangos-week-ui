export default class User {
    name: string = '';
    email: string = '';
    senha: string = '';
    _id: string = '';
    permission: string = '';
  
    constructor(name: string, email: string, password: string,  id: string) {
      this.name = name;
      this.email = email;
      this.senha = password;
      this._id = id;
    }
}