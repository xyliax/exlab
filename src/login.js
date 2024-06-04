// 20083743d PEI Yuxing
import express from 'express';
import multer from 'multer';
import { promises as fs } from 'fs';

const users = new Map();
const init_userdb = async () => {
  if (users.size !== 0) return;
  await fs
    .readFile('users.json')
    .then((data) => {
      JSON.parse(data).forEach((element) => {
        users.set(element.username, element);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const validate_user = async (username, password) => {
  try {
    const user = users.get(username);
    if (!user || user.password !== password) {
      return false;
    } else {
      return user;
    }
  } catch (err) {
    console.log(err);
  }
};

const route = express.Router();
const form = multer();
route.use(express.urlencoded({ extended: true }));
route.post('/login', form.none(), async (req, res) => {
  if (users.size === 0) await init_userdb();
  if (req.session.logged === true) req.session.logged = false;
  const user = await validate_user(req.body.username, req.body.password);
  if (user && user.enabled === false) {
    res.status(401).json({
      status: 'failed',
      message: `User '${user.username}' is currently disabled`,
    });
  }
  if (user && user.enabled === true) {
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.logged = true;
    req.session.timestamp = Date.now();
    res.json({
      status: 'success',
      user: {
        username: user.username,
        role: user.role,
      },
    });
  }
  if (!user) {
    res.status(401).json({
      status: 'failed',
      message: 'Incorrect username or password',
    });
  }
});

route.post('/logout', (req, res) => {
  if (req.session.logged === true) {
    req.session.destroy();
    res.end();
  } else {
    res.end({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
});

route.get('/me', async (req, res) => {
  if (req.session.logged === true) {
    const user = users.get(req.session.username);
    res.json({
      status: 'success',
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
});

export default route;
