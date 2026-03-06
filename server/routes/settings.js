import { Router } from 'express';
import prisma from '../config/prisma.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

// GET /api/settings (public)
router.get('/', async (req, res) => {
  try {
    let settings = await prisma.businessSettings.findFirst();
    if (!settings) {
      settings = await prisma.businessSettings.create({ data: {} });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/settings (Admin)
router.put('/', auth, admin, async (req, res) => {
  try {
    let settings = await prisma.businessSettings.findFirst();
    if (!settings) {
      settings = await prisma.businessSettings.create({ data: req.body });
    } else {
      settings = await prisma.businessSettings.update({
        where: { id: settings.id },
        data: req.body,
      });
    }
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
