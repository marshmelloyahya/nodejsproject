const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const isAuth =  async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: 'Unauthenticated',
    });
  }
};

module.exports =  isAuth;