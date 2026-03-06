import { Router } from 'express';
import prisma from '../config/prisma.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

// GET /api/scheduled-posts
router.get('/', auth, admin, async (req, res) => {
  try {
    const posts = await prisma.scheduledPost.findMany({
      include: { product: true },
      orderBy: { date: 'desc' },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/scheduled-posts
router.post('/', auth, admin, async (req, res) => {
  try {
    const post = await prisma.scheduledPost.create({
      data: {
        productId: req.body.product || req.body.productId,
        time: req.body.time,
        status: req.body.status || 'pending',
        platforms: req.body.platforms || [],
        date: req.body.date,
      },
      include: { product: true },
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/scheduled-posts/:id
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.product) {
      data.productId = data.product;
      delete data.product;
    }
    const post = await prisma.scheduledPost.update({
      where: { id: req.params.id },
      data,
      include: { product: true },
    });
    res.json(post);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Post not found' });
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/scheduled-posts/:id
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await prisma.scheduledPost.delete({ where: { id: req.params.id } });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Post not found' });
    res.status(500).json({ message: err.message });
  }
});

export default router;
