import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as cors from "cors";
import logger from "./winston-logger-config";
import { serverPort } from "./config";
import setRoutes from './routes';
import { RabbitMQ } from './rabbitmq/rabbitmq';

const log = logger();
const app = express();
const server = http.createServer(app);

const router = express.Router();
// Apply the routes to our application with the prefix /api
// Options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "*",
  preflightContinue: true,
};

// Use cors middleware
router.use(cors(options));

const port = normalizePort(process.env.PORT || serverPort);
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(options))


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val): boolean | number {
  const normalizedPort = parseInt(val, 10);
  if (isNaN(normalizedPort)) {
    // named pipe
    return val;
  }

  if (normalizedPort >= 0) {
    // port number
    return normalizedPort;
  }

  return false;
}

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


server.listen(app.get('port'), () => {
  const rabbitmq = new RabbitMQ();
  rabbitmq.init()
  setRoutes(app,rabbitmq);
  console.log(`Server started on port ${server.address().port} :)`);
});
server.on("error", onError);
server.on("listening", onListening);


/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      // tslint:disable-next-line
      log.error("%s requires elevated privileges", bind);
      process.exit(1);
      break;
    case "EADDRINUSE":
      // tslint:disable-next-line
      log.error("%s is already in use", bind);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
}

export { app };
