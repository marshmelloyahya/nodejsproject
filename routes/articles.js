// articles crud
const express = require('express');
const router = express.Router();
// import prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const isAuth = require('../middlewares/isAuth');

router.post('/', isAuth, async (req, res) => {
  try {
	  console.log(req.body);
    const { title, content, categoryId, autoPublish } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }
    if (!categoryId) {
      var article = await prisma.article.create({
        data: {
          titre: title,
		  published: autoPublish,
          contenu: content,
          auteur: {
            connect: {
              id: req.user.id,
            },
          }
        }
      });
    } else {
      var article = await prisma.article.create({
        data: {
          titre: title,
          contenu: content,
		  published: autoPublish,
          auteur: {
            connect: {
              id: req.user.id,
            },
          },
          Category: {
            connect: {
              id: Number(categoryId)
            },
          },
        },
      });
    }
    res.status(201).json({
      message: 'Article created successfully',
      article: article,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.post('/publish/:id', isAuth, async (req, res) => {
	try {
		const {id} = req.params;
		const article = await prisma.article.findUnique({
			where: {
				id: Number(id)
			},
		});
		if (!article) {
			return res.status(404).json({
				message: 'Article not found',
			});
		}
		if (article.auteur.id !== req.user.id) {
			return res.status(403).json({
				message: 'You are not authorized to perform this action',
			});
		}
		const publishedArticle = await prisma.article.update({
			where: {
				id: Number(id)
			},
			data: {
				published: true,
			},
		});
		res.status(200).json({
			message: 'Article published successfully',
			article: publishedArticle,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
});

router.get('/', async (req, res) => {
	try {
		//get query params take and skip
		console.log(req.query);
		const { take, skip } = req.query;
		//get articles
		const articles = await prisma.article.findMany({
			take: take ? Number(take) : take,
			skip: skip ? Number(skip) : skip,
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				published: true
			},
			include: {
				auteur: {
					select: {
						id: true,
						nom: true,
						role: true,
					},
				},
				Category: true
			}
		});
		//send response
		res.status(200).json(articles);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
});

router.get('/:id', async (req, res) => {
	try {
		//get article id
		const { id } = req.params;
		//get article
		const article = await prisma.article.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				auteur: {
					select: {
						id: true,
						nom: true,
						role: true,
					},
				},
				Category: true
			}
		});
		//send response
		res.status(200).json(article);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
});

router.patch('/', isAuth, async (req, res) => {
	try {
		//get article id
		const { id } = req.body;
		//get article
		const article = await prisma.article.findUnique({
			where: {
				id: id,
			},
		});
		if (article.auteurId !== req.user.id) {
			return res.status(401).json({
				message: 'You are not authorized to edit this article',
			});
		}
		//update article
		const updatedArticle = await prisma.article.update({
			where: {
				id: id,
			},
			data: {
				titre: req.body.title,
				contenu: req.body.content,
				updatedAt: new Date(),
			},
		});
		//send response
		res.status(200).json(updatedArticle);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
});

router.delete('/:id', isAuth, async (req, res) => {
	try {
		const { id } = req.params;
		const article = await prisma.article.findUnique({
			where: {
				id: id,
			},
		});
		if (article.auteurId !== req.user.id) {
			return res.status(401).json({
				message: 'You are not authorized to delete this article',
			});
		}
		const deletedArticle = await prisma.article.delete({
			where: {
				id: id,
			},
		});
		res.status(200).json({message: 'Article deleted successfully'});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
});


//get my draft articles
router.get('/mydrafts', isAuth, async (req, res) => {
	try {
		const articles = await prisma.article.findMany({
			where: {
				auteurId: req.user.id,
				published: false,
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


module.exports = router;
