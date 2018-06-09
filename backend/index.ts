import * as _express from 'express';
import * as _http from 'http';
import * as _path from 'path';
import * as _bodyParser from 'body-parser';
import {NextFunction, Request, Response} from 'express';
import * as request from 'request';
import {getSummary, getUrl} from './model';
import {QueryParams} from '../frontend/app/QueryParams';


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


app.get('/proxy/:url', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send(await getUrl(req.params.url, req.query.body));
  } catch (err) {
    return next(err);
  }
});

app.get('/api/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.send(await getSummary({
      firstName: req.query[QueryParams.name.firstName],
      lastName: req.query[QueryParams.name.lastName]
    }));
  } catch (err) {
    return next(err);
  }
});

app.use(['/'], _express.static(_path.join(__dirname, '../dist')));
app.use(['/list*', '/summary*', '/competitors*', '/event*', '/compare*', '/registration*'],
  (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(_path.join(__dirname, '../dist', 'index.html'), {maxAge: 31536000});

});

