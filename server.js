const http = require('http')
      crypto = require('crypto'),
      url = require('url'),
      moment = require('moment'),
      _ = require('lodash');

var users = [{
  id: 1,
  username: 'Andrei Markhel',
  email: 'kedius@outlook.com',
  password: 'a08fd7e3e716e1ac864b633551e8d66bdaff32c2723bde1a181a33daff55ec1d', //qwaszx@1
  date_of_birth: moment.utc('1990-12-10', 'YYYY-MM-DD').format(),
  avatar: 'https://scontent-amt2-1.xx.fbcdn.net/v/t1.0-1/c28.42.348.348/s160x160/267363_191904990872566_1244812_n.jpg?oh=9e3f318eb0b33c3a81a9e8be73b30400&oe=58131950',
}, {
  id: 2,
  username: 'User Example',
  email: 'user@example.com',
  password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', //123456
  date_of_birth: moment.utc('1970-01-01', 'YYYY-MM-DD').format(),
  avatar: null
}];

const Router = function(req, res) {
  this.routeNotFound = true;
  this.req = req;
  this.res = res;

  this.res.setHeader('Content-Type', 'application/json');

  this.get = (route, next) => {
    if (this.req.method === 'GET' && this._getRoutePattern(route).test(this.req.url)) {
      this.routeNotFound = false;
      this.res.statusCode = 200;
      this.req.query = url.parse(this.req.url, true).query;
      next(this.req, this.res);
      this.res.end();
    }
  };

  this.post = (route, next) => {
    if (this.req.method === 'POST' && this.req.url === route) {
      this.routeNotFound = false;
      var body = '';
      this.res.statusCode = 200;
      this.req.on('data', data => body += data);
      this.req.on('end', () => {
        this.req.body = JSON.parse(body);
        next(this.req, this.res);
        this.res.end();
      });
    }
  };

  this.notFound = () => {
    if (this.routeNotFound) {
      this.res.statusCode = 404;
      this.res.write(JSON.stringify({
        error: 'Page not found'
      }));
      this.res.end();
    }
  };

  this._getRoutePattern = route => {
    return new RegExp(`^${route.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")}(\\?.*)?$`);
  }
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
  } else {
    const router = new Router(req, res);

    router.post('/login', (req, res) => {
      const user = _.find(users, user => {
        return user.email === req.body.email
          && user.password === crypto.createHash('sha256').update(req.body.password).digest('hex');
      });

      if (user) {
        user.token = (Math.random() * Date.now()).toString();
        res.write(JSON.stringify(_.omit(user, ['password'])));
      } else {
        res.statusCode = 403;
        res.write(JSON.stringify({ error: 'Email or Password is incorrect'}));
      }
    });

    router.get('/login', (req, res) => {
      const user = _.find(users, user => {
        return user.token && user.token === req.query.accessToken;
      });

      if (user) {
        res.write(JSON.stringify(_.omit(user, ['password'])));
      } else {
        res.statusCode = 403;
        res.write(JSON.stringify({ error: 'Access Token is incorrect'}));
      }
    });

    router.notFound();
  }
});

server.listen(process.env.PORT || 7001, 'localhost', () => {
  console.log(
    '\x1b[32m%s\x1b[0m \x1b[44m\x1b[37m%s\x1b[0m',
    'Server started on',
    `http://localhost:${process.env.PORT || 7001}/`
  );
});
