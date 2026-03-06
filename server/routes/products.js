import { Router } from 'express';
import prisma from '../config/prisma.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products (Admin)
router.post('/', auth, admin, async (req, res) => {
  try {
    const product = await prisma.product.create({ data: req.body });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id (Admin)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(product);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Product not found' });
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Product not found' });
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/products/:id/stock (Admin)
router.patch('/:id/stock', auth, admin, async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { stock: req.body.stock },
    });
    res.json(product);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Product not found' });
    res.status(400).json({ message: err.message });
  }
});

export default router;
