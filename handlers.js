const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const api = require('./api');
const knex = require('./db');
const { validatePassword } = require('./validation');
const jwt = require('./jwt');

const saltRounds = 10;

const errorFormatter = (code, type, message) => ({
  code,
  type,
  message,
});

const userListHandler = async (c, req, res) => {
  const {
    method, path, body, query, headers,
  } = req;
  const valid = api.validateRequest(
    {
      method,
      path,
      body,
      query,
      headers,
    },
  );
  if (valid.errors) {
    throw valid.errors;
  }
  try {
    const { q } = query;
    const userList = await knex
      .select(['id', 'name', 'email'])
      .from('users')
      .modify((qb) => {
        if (q) {
          qb.where('name', 'ILIKE', `%${q}%`);
        }
      });
    return res.status(200).json(userList);
  } catch (error) {
    // https://www.postgresql.org/docs/current/errcodes-appendix.html
    const { code } = error;
    switch (code) {
      default:
        return res.status(500).json(errorFormatter('99999', 'Unknown Error', 'Unknown Error'));
    }
  }
};

const userCreateHandler = async (c, req, res) => {
  const {
    method, path, body, query, headers,
  } = req;
  const valid = api.validateRequest(
    {
      method,
      path,
      body,
      query,
      headers,
    },
  );
  if (valid.errors) {
    throw valid.errors;
  }
  try {
    const { name, email, password } = body;
    if (!validatePassword(password)) {
      return res.status(400).json(errorFormatter('1', 'Bad Password', 'Your password should be: Minimum 12 characters, At least one upper-case alphabet, Contains at least one non-alphanumeric character'));
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdUser = await knex.table('users').insert({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
    }, ['id', 'name', 'email']);

    return res.status(201).json(createdUser);
  } catch (error) {
    // https://www.postgresql.org/docs/current/errcodes-appendix.html
    const { code } = error;
    switch (code) {
      case '23505':
        return res.status(400).json(errorFormatter('23505', 'Unique Constraint', 'Email/Name already in use'));
      default:
        return res.status(500).json(errorFormatter('99999', 'Unknown Error', 'Unknown Error'));
    }
  }
};

const userLoginHandler = async (c, req, res) => {
  const {
    method, path, body, query, headers,
  } = req;
  const valid = api.validateRequest(
    {
      method,
      path,
      body,
      query,
      headers,
    },
  );
  if (valid.errors) {
    throw valid.errors;
  }
  try {
    const { email, password } = body;
    const [user] = await knex.table('users').select('name', 'password').where('email', '=', email);
    if (!user) {
      return res.status(400).json(errorFormatter('2', 'Invalid login', 'The provided email/password is incorrect'));
    }
    const { password: userPass } = user;
    const result = await bcrypt.compare(password, userPass);

    if (result) {
      const accessToken = jwt.sign({
        name: user.name,
        email,
      });
      return res.status(200).json({
        message: 'Login Successful',
        accessToken,
      });
    }
    return res.status(400).json(errorFormatter('2', 'Invalid login', 'The provided email/password is incorrect'));
  } catch (error) {
    return res.status(500).json(errorFormatter('99999', 'Unknown Error', 'Unknown Error'));
  }
};

module.exports = {
  userListHandler, userCreateHandler, userLoginHandler,
};
