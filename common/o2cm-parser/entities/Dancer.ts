import {DancerName, IDancer} from '../../../frontend/app/services/IData';


export class Dancer implements IDancer {
  public firstName: string;
  public lastName: string;
  public studio?: string;


  constructor(public name: string) {
    const n = Dancer.getName(name);
    this.firstName = n.firstName;
    this.lastName = n.lastName;
  }

  static isTBA(dancer: DancerName): boolean {
    return dancer.firstName.toLowerCase() === 'tba' && dancer.lastName.toLowerCase() === 'tba' ||
      dancer.firstName.toLowerCase() === '---' && dancer.lastName.toLowerCase() === 'tba' ||
      dancer.firstName.toLowerCase() === 'tbd' && dancer.lastName.toLowerCase() === 'tbd';
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


  static toKey(dancer: DancerName) {
    return dancer.firstName + '_' + dancer.lastName;
  }

  public static equals(that: DancerName, other: DancerName): boolean {
    return (that && other && that.firstName.toLowerCase() === other.firstName.toLowerCase()
      && that.lastName.toLowerCase() === other.lastName.toLowerCase()) || (that === other);
  }

  public static compare(that: DancerName, other: DancerName) {
    if (that.lastName < other.lastName) {
      return -1;
    }
    if (that.lastName > other.lastName) {
      return 1;
    }

    if (that.firstName < other.firstName) {
      return -1;
    }
    if (that.firstName > other.firstName) {
      return 1;
    }
    return 0;
  }

  equals(other: DancerName): boolean {
    return Dancer.equals(this, other);
  }

  toJSONable(): IDancer {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      studio: this.studio
    };
  }

}
