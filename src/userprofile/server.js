'use strict';

var fs = require('fs');
var Http = require('http');
var Express = require('express');
var BodyParser = require('body-parser');
var Swaggerize = require('swaggerize-express');
var Path = require('path');
var tediousExpress = require('express4-tedious');
var morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');
const promBundle = require("express-prom-bundle");
const metricsMiddleware = promBundle({
    includeMethod: true, 
    includePath: true, 
    promClient: {
    collectDefaultMetrics: {
      timeout: 1000
    }
  }
});

// Configuration and potential overrides
function getConfigValue(config) {
    var value = "";
    var name = config.name;
    var defaultValue = config.defaultValue || '';
    var required = config.required || false;

    if (process.env.CONFIG_FILES_PATH) {
        var filePath = Path.join(process.env.CONFIG_FILES_PATH, name);
        if (fs.existsSync(filePath)) { value = fs.readFileSync(filePath, 'utf8').trim(); }
        console.log("Config '%s' has %svalue set from file '%s'.", name, value ? '' : 'no ', filePath)
    }
    if (!value) {
        value = process.env[name];
        value = (value) ? value.trim() : '';
        console.log("Config '%s' has %svalue set from ENV '%s'.", name, value ? '' : 'no ', name)
    }
    if (!value) {
        value = defaultValue.trim();
        console.log("Config '%s' has %svalue set from default value.", name, value ? '' : 'no ')
    }
    if (!value && required) {
        throw new Error("Config '%s' is required and has no value.", name);
    }
    
    return value;
}
var port        = process.env.PORT || 80;
var sqlUser     = getConfigValue({ name:'SQL_USER', defaultValue:'sqladmin', required:true });
var sqlPassword = getConfigValue({ name:'SQL_PASSWORD', required:true });
var sqlServer   = getConfigValue({ name:'SQL_SERVER', required:true });
var sqlDBName   = getConfigValue({ name:'SQL_DBNAME', defaultValue:'mydrivingDB', required:true });

var App = Express();
var Server = Http.createServer(App);
var logger = morgan(':remote-addr [:date[web]] :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent :response-time ms');
App.use(logger);

var sqlConfig = {
    authentication: {
      type: "default",
      options: {
        userName: sqlUser,
        password: sqlPassword
      }
    },
    server: sqlServer,
    options: {
      database: sqlDBName
    }
};

App.use(metricsMiddleware);

App.use(function (req, res, next) {
    req.sql = tediousExpress(sqlConfig);
    next();
});

App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
    extended: true
}));

App.use(Swaggerize({
    api: Path.resolve('./config/swagger.json'),
    handlers: Path.resolve('./handlers')
}));
App.use('/api/docs/user', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

Server.listen(port, function () {
    App.swagger.api.host = this.address().address + ':' + this.address().port;
    /* eslint-disable no-console */
    console.log('App running on %s:%d', this.address().address, this.address().port);
    /* eslint-disable no-console */
});
