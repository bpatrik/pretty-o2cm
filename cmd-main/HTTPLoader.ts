declare var require;

export class HTTPLoader {
  public static async post(url: string, body: string): Promise<string> {
    return await this.postNode(url, body);
  }

  private static postNode(urlStr: string, body: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const request = require('request');
      const options = {
        url: urlStr,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
      };

      request.post(options, (error, response, resBody) => {
        if (error) {
          return reject(error);
        }

        if (response.statusCode === 200) {
          resolve(resBody);
        } else {
          reject('bad statusCode: ' + response.statusCode);
        }
      });
    });
  }
}
