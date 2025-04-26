import Types from '../../../utils/types';

export default class User {
  private email: string;
  private name: string;
  private profile: Types;

  constructor(email: string, profile: Types, name: string) {
    this.email = email;
    this.profile = profile;
    this.name = name;
  }

  get Email(): string {
    return this.email;
  }

  get Profile(): Types {
    return this.profile;
  }

  get Name(): string {
    return this.name;
  }

  toJSON(): object {
    return {
      email: this.email,
      profile: this.profile,
      name: this.name
    }
  }
}