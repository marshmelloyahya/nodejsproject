var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    // validate data
    const { name, email, password, confirmPassword, role } = req.body;
    // validate if email is valid regex

    if ((!name || !email || !password || !confirmPassword, !role)) {
      return res.status(400).json({
        message: 'Please fill all fields',
      });
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).json({
        message: 'Invalid email'
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match',
      });
    }
    // check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }
    // create user
    const newUser = await prisma.user.create({
      data: {
        nom: name,
        email: email,
        password: bcrypt.hashSync(password, 10),
        role: role,
      },
    });
    // jwt
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return res.status(201).json({
      message: 'User created successfully',
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    // validate data
    const { email, password, remeberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please fill all fields',
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        message: 'Password is incorrect',
      });
    }
    // jwt
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: remeberMe ? '1d' : '365d',
    });
    return res.status(200).json({
      message: 'User logged in successfully',
      token: token,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
  // check if user exists
});

router.get('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { take, skip } = req.query;
    const articles = await prisma.article.findMany({
      take: take,
      skip: skip,
      where: {
        id: id,
      },
    });
    res.status(200).json(articles);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.params.id);
    const { id } = req.params;
    // filter password
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { take, skip } = req.query;
    if (take && skip)
      return next()
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { take, skip } = req.query;
    const users = await prisma.user.findMany({
      take: Number(take),
      skip: Number(skip),
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;
