// 20083743d PEI Yuxing
import express from 'express';
import session from 'express-session';
import route from './login.js';

const app = new express();

app.use(
  session({
    secret: '20083743d_eie4432_lab4',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
  })
);
app.get('/', (req, res) => {
  if (req.session.logged) {
    res.redirect('/index.html');
  } else {
    res.redirect('/login.html');
  }
});
app.use('/auth', route);
app.use('/', express.static('static'));
app.listen(8080, '0.0.0.0', () => {
  console.log(new Date().toLocaleString());
  console.log('Server started at 8080');
});
