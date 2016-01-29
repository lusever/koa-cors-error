'use strict';

/**
 * Original code in koa/lib/context.js
 */

var statuses = require('statuses');

module.exports = function() {
  return function (ctx, next) {
    return next().catch(function(err){
      // don't do anything if there is no error.
      // this allows you to pass `this.onerror`
      // to node-style callbacks.
      if (null == err) return;
      
      if (!(err instanceof Error)) err = new Error(`non-error thrown: ${err}`);
      
      // delegate
      // lusever: not send duplicate error message
      // ctx.app.emit('error', err, ctx);
      
      // nothing we can do here other
      // than delegate to the app-level
      // handler and log.
      if (ctx.headerSent || !ctx.writable) {
      err.headerSent = true;
        return;
      }
      
      // unset all headers
      // lusever: no send duplicate error message
      // ctx.res._headers = {};
      
      // force text/plain
      ctx.type = 'text';
      
      // ENOENT support
      if ('ENOENT' == err.code) err.status = 404;
      
      // default to 500
      if ('number' != typeof err.status || !statuses[err.status]) err.status = 500;
      
      // respond
      const code = statuses[err.status];
      const msg = err.expose ? err.message : code;
      ctx.status = err.status;
      ctx.length = Buffer.byteLength(msg);
      ctx.res.end(msg);
      
      // lusever: break event loop in top
      throw err;
    });
  };
};
