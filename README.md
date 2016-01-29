# koa-cors-error

Module has fixed the [bug](https://github.com/evert0n/koa-cors/issues/17) when the system didn't send the 4xx or 5xx statuses through cross-domain requests.
koa `onerror` method have been completely replaced.


## Installation

```sh
$ npm install koa-cors-error
```


## Use
```javascript
var corsError = require('koa-cors-error');

app.use(cors());
app.use(corsError());

app.use(function(ctx, next) {
    ctx.throw(400);
});
```
