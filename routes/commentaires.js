var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const isAuthLight = require('../middlewares/isAuthLight');
const isAuth = require('../middlewares/isAuth');

router.post('/', isAuthLight, async (req, res) => {
  try {
    var { email, content, articleId } = req.body;
	// valiadte email using regex
	var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!req.user && !emailRegex.test(email)) {
		return res.status(400).json({
			message: 'Please provide a valid email',
		});
	}
    if (req.user)
		email = req.user.email;
    if (!email || !content || !articleId) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }
    const commentaire = await prisma.commentaire.create({
      data: {
        email: email,
        contenu: content,
        article: {
          connect: {
            id: articleId,
          },
        },
      },
    });
    res.status(201).json({
      message: 'Commentaire created successfully',
      commentaire: commentaire,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.patch('/', isAuth, async (req, res) => {
  try {
    const { id, content } = req.body;
    if (!id || !content) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }
    // get commoentaire by id
    const commentaire = await prisma.commentaire.findUnique({
      where: {
        id: id,
      },
    });
    if (!commentaire) {
      return res.status(404).json({
        message: 'Commentaire not found',
      });
    }
    if (req.user.email !== commentaire.email) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
      });
    }
    const updatedCommentaire = await prisma.commentaire.update({
      where: {
        id: id,
      },
      data: {
        contenu: content,
      },
    });
    res.status(200).json({
      message: 'Commentaire updated successfully',
      commentaire: updatedCommentaire,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const commentaires = await prisma.commentaire.findMany({
      where: {
		articleId: Number(postId),
      },
    });
    res.status(200).json(commentaires);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
