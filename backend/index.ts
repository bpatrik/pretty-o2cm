import * as _express from 'express';
import * as _http from 'http';
import * as _path from 'path';
import * as _bodyParser from 'body-parser';
import {NextFunction, Request, Response} from 'express';
import * as request from 'request';


const app = _express();
const port = 8080;

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


app.post('/proxy', (req: Request, res: Response, next: NextFunction) => {
   const options = {
    url: req.body.url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: req.body.body
  };

  request.post(options, (error, response, body) => {
    if (error) {
      return next(error);
    }

    if (response.statusCode === 200) {
      res.send(body);
    } else {
      next('bad statusCode: ' + response.statusCode);
    }
  });
});

app.use('/', _express.static(_path.join(__dirname, '../dist')));

