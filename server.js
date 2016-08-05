const http = require('http'),
      url = require('url'),
      moment = require('moment'),
      _ = require('lodash');

const users = [{
  id: 1,
  username: 'Andrei Markhel',
  email: 'kedius@outlook.com',
  password: 'qwaszx@1',
  date_of_birth: moment.utc('1990-12-10', 'YYYY-MM-DD').format(),
  avatar: 'https://scontent-amt2-1.xx.fbcdn.net/v/t1.0-1/c28.42.348.348/s160x160/267363_191904990872566_1244812_n.jpg?oh=9e3f318eb0b33c3a81a9e8be73b30400&oe=58131950',
  token: '0KHRitC10YjRjCDQtdGJ0ZEg0Y3RgtC40YUg0LzRj9Cz0LrQuNGFINGE0YDQsNC90YbRg9C30YHQutC40YUg0LHRg9C70L7Qug=='
}, {
  id: 2,
  username: 'User Example',
  email: 'user@example.com',
  password: '123456',
  date_of_birth: moment().format(),
  avatar: null,
  token: 'SGVsbG8gd29ybGQh'
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
      const user = _.find(users, user => user.email === req.body.email && user.password === req.body.password);
      if (user) {
        res.write(JSON.stringify(_.omit(user, ['password'])));
      } else {
        res.statusCode = 403;
        res.write(JSON.stringify({ error: 'Email or Password is incorrect'}));
      }
    });

    router.get('/login', (req, res) => {
      const user = _.find(users, user => user.token === req.query.accessToken);
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

server.listen(7001, 'localhost', () => {
  console.log(`Server running at http://localhost:7001/`);
});
