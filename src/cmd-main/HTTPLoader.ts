declare var require;

export class HTTPLoader {
    public static async post(url: string, body: string): Promise<string> {
      return await this.postNode(url, body);
    }

    private static postNode(urlStr: string, body: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const request = require('request');
            let options = {
                url: urlStr,
                //   form: form,
                headers: {
                    /* "POST": "/event3.asp HTTP/1.1",
                     "Host": "results.o2cm.com",
                     "Connection": "keep-alive",
                     "Content-Length": "100",
                     "Pragma": "no-cache",
                     "Cache-Control": "no-cache",
                     "Origin": "http://results.o2cm.com",
                     "Upgrade-Insecure-Requests": "1",*/
                    "Content-Type": "application/x-www-form-urlencoded",
                    // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36",
                    //   "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,* /*;q=0.8",
                    // "Referer": "http://results.o2cm.com/event3.asp?selDiv=&selAge=&selSkl=AND+(uidheat&0xFF00)%3E%3E8+=40&selSty=&selEnt=&submit=OK&event=bub18",
                    // "Accept-Encoding": "gzip, deflate",
                    // "Accept-Language": "hu,en-US;q=0.9,en;q=0.8,de;q=0.7",
                    // "Cookie": "ASPSESSIONIDSCSBBCQB=DBFCBMICFNDOAOOCMBIBDAFB"
                },
                body: body
            };

            request.post(options, (error, response, body) => {
                if (error) {
                    return reject(error);
                }

                if (response.statusCode == 200) {
                    resolve(body)
                } else {
                    reject("bad statusCode: " + response.statusCode);
                }
            })
        });
    }
}
