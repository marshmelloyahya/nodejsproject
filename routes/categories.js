var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const isAuth = require('../middlewares/isAuth');

router.post('/', isAuth, async (req, res) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
      });
    }
    // check if category already exists
    const category = await prisma.category.findUnique({
      where: {
        nom: name,
      },
    });
    if (category) {
      return res.status(400).json({
        message: 'Category already exists',
      });
    }
    // create category
    const newCategory = await prisma.category.create({
      data: {
        nom: name,
      },
    });
    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { take, skip } = req.query;
    // include number of articles in each category
    const categories = await prisma.category.findMany({
      take: take,
      skip: skip,
      orderBy: {
        nom: 'asc',
      },
      include: {
		_count: {
			select: { Article: true },
		  },
	  }
    });
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    //get posts by category
    const articles = await prisma.article.findMany({
      where: {
	    published: true,
        Category: {
          some: {
            id: Number(id),
          },
        },
      },
      include: {
        Category: true,
		auteur: {
			select: {
				id: true,
				nom: true,
				role: true,
			}
		}
      },
    });
    res.status(200).json(articles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.patch('/', async (req, res) => {
  try {
    const { id, name } = req.body;
    const category = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        nom: name,
      },
    });
    res.status(200).json({
      message: 'Category updated successfully',
      category: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/', async (req, res) => {
  try {
    // check if there are articles associated with this category
    const articles = await prisma.article.findMany({
      where: {
        category: {
          id: req.body.id,
        },
      },
    });
    if (articles.length > 0) {
      return res.status(400).json({
        message:
          'Cannot delete category because it has articles associated with it',
      });
    }
    const category = await prisma.category.delete({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
