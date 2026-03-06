import { Router } from 'express';
import prisma from '../config/prisma.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/services/:id (Admin)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(service);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Service not found' });
    res.status(400).json({ message: err.message });
  }
});

export default router;
