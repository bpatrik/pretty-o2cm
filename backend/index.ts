import * as _express from 'express';
import * as _http from 'http';
import * as _path from 'path';
import * as _bodyParser from 'body-parser';
import {NextFunction, Request, Response} from 'express';
import * as request from 'request';


const app = _express();
const port = process.env.PORT || 8080;

/**
 * Parse parameters in POST
 */
// for parsing application/json
app.use(_bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(_bodyParser.json({limit: '50mb'}));

// Get PORT from environment and store in Express.
app.set('port', port);

// Create HTTP server.
const server = _http.createServer(app);

server.listen(port);
server.on('error', (error: any) => {
  if (error.syscall !== 'listen') {
    console.error('Server error', error);
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen error with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
});

const FiFoCache: { key: string, body: string }[] = [];
const MAX_CACHE_SIZE = 120;
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

app.get('/proxy/:url', (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.params.url + '?body' + req.query.body;
    for (let i = 0; i < FiFoCache.length; i++) {
      if (FiFoCache[i].key === key) {
        return res.send(FiFoCache[i].body);
      }
    }
    const options = {
      url: req.params.url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: req.query.body
    };

    request.post(options, (error, response, body) => {
      if (error) {
        return next(error);
      }
      if (response.statusCode === 200) {
        body = shapeBody(body);
        FiFoCache.push({key: key, body: body});
        if (FiFoCache.length > MAX_CACHE_SIZE) {
          FiFoCache.shift();
        }
        res.send(body);
      } else {
        next('bad statusCode: ' + response.statusCode);
      }
    });
  } catch (err) {
    return next(err);
  }
});

app.use(['/'], _express.static(_path.join(__dirname, '../dist')));
app.use(['/list*', '/summary*', '/competitors*'], (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(_path.join(__dirname, '../dist', 'index.html'), {maxAge: 31536000});

});

