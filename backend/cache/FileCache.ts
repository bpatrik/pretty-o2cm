import * as fs from 'fs';
import * as path from 'path';
import {ICache} from './ICache';

export class FileCache implements ICache<string> {
  constructor(private dirPath: string) {

    try {
      if (!fs.existsSync(path.join(__dirname, '../', dirPath))) {
        fs.mkdirSync(path.join(__dirname, '../', dirPath));
      }
    } catch (e) {
      console.error(e);
    }

  }

  get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const pathStr = path.join(this.dirPath, key);
      if (key && key !== '' && fs.existsSync(pathStr)) {
        fs.readFile(pathStr, 'utf8', (err, resBody) => {
          if (err) {
            return reject(err);
          }
          return resolve(resBody);
        });
        return resolve(null);
      }
    });
  }

  set(key: string, value: string):Promise<void> {
    return new Promise((resolve, reject) => {
      const pathStr = path.join(this.dirPath, key);
      fs.writeFile(pathStr, value, 'utf8', (err) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve();
      });
    });
  }
}
