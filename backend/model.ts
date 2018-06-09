import * as request from 'request';
import {DancerName} from '../frontend/app/services/IData';
import {IndividualParser} from '../common/o2cm-parser/IndividualParser';
import {Summary} from '../common/Summary';
import {ISummary} from '../frontend/app/services/ISummary';
import {LRUMemCache} from './cache/LRUMemCache';
import {FileCache} from './cache/FileCache';
import {LayeredCache} from './cache/LayeredCache';
import {DummyCache} from './cache/DummyCache';

const pageCache = new DummyCache<string>();
// new LayeredCache([new LRUMemCache(200),  new FileCache('/tmp/pages')]);
const summariesCache = new DummyCache<string>();// new FileCache('/tmp/summaries');


const shapeBody = (body: string) => {
  // remove dancers list
  const index = body.indexOf('id=selEnt');
  if (index !== -1) {
    const a = body.lastIndexOf('<SELECT', index);
    const b = body.lastIndexOf('<select', index);
    const selIndex = Math.max(a, b);
    if (selIndex !== -1) {
      const ae1 = body.indexOf('</SELECT>', selIndex);
      const ae2 = body.indexOf('</select>', selIndex);
      if (ae1 !== -1 && ae1 > ae2) {
        body = body.substring(0, selIndex) + body.substring(ae1 + 9);
      } else if (ae2 !== -1) {
        body = body.substring(0, selIndex) + body.substring(ae2 + 9);
      }
    }
  }
  return body;
};

export const getUrl = (url: string, body: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const key = url + '?body' + body;
      const c = await pageCache.get(key);
      if (c) {
        return resolve(c);
      }

      const options = {
        url: url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      };
      request.post(options, (error, response, resBody) => {
        if (error) {
          return reject(error);
        }
        if (response.statusCode === 200) {
          resBody = shapeBody(resBody);
          if (url.indexOf('event3.asp') !== -1) {
            pageCache.set(key, resBody).catch(console.error);
          }
          return resolve(resBody);
        } else {
          return reject('bad statusCode: ' + response.statusCode);
        }
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const summaries: { [key: string]: ISummary } = {};

export const getSummary = async (dancerName: DancerName) => {
  const key = dancerName.firstName + '_' + dancerName.lastName;
  if (!summaries[key]) {
    const summaryC = await summariesCache.get(key);
    if (summaryC) {
      summaries[key] = JSON.parse(summaryC);
    }
    if (!summaries[key]) {
      const person = await IndividualParser.parse(dancerName, {post: getUrl});
      summaries[key] = Summary.get(person);
      summariesCache.set(key, JSON.stringify(summaries[key])).catch(console.error);
    }
  }
  return summaries[key];

};
