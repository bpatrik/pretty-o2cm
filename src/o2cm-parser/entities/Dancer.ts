import {DancerName} from '../../app/services/IData';


export class Dancer implements DancerName {
  public firstName: string;
  public lastName: string;


  constructor(public name: string) {
    const n = Dancer.getName(name);
    this.firstName = n.firstName;
    this.lastName = n.lastName;
  }

  static isTBA(dancer: DancerName): boolean {
    return dancer.firstName.toLowerCase() === 'tba' && dancer.lastName.toLowerCase() === 'tba';
  }
  public static getName(name: string): DancerName {
    name = name.trim();

    const space = name.indexOf(' ');
    let firstName = name;
    let lastName = '';
    if (space !== -1) {
      firstName = name.substring(0, space).trim();
      lastName = name.substring(space).trim();
    }
    return {
      firstName: firstName,
      lastName: lastName
    };
  }

  public static equals(that: DancerName, other: DancerName): boolean {
    return that.firstName.toLowerCase() === other.firstName.toLowerCase() && that.lastName.toLowerCase() === other.lastName.toLowerCase();
  }

  equals(other: DancerName): boolean {
    return Dancer.equals(this, other);
  }

  toJSONable(): DancerName {
    return {
      firstName: this.firstName,
      lastName: this.lastName
    };
  }

}
