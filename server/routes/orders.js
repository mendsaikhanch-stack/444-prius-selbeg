import { Router } from 'express';
import prisma from '../config/prisma.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

// POST /api/orders (guest ok)
router.post('/', async (req, res) => {
  try {
    const { customer, phone, items, total, pay, delivery } = req.body;
    if (!customer || !phone || !items?.length) {
      return res.status(400).json({ message: 'Customer, phone, and items required' });
    }

    // Generate order ID
    const count = await prisma.order.count();
    const orderId = `ORD-${String(count + 1).padStart(3, '0')}`;

    // Decrement stock for each item
    for (const item of items) {
      if (item.product) {
        await prisma.product.update({
          where: { id: item.product },
          data: { stock: { decrement: item.qty } },
        });
      }
    }

    const order = await prisma.order.create({
      data: {
        orderId,
        customer,
        phone,
        items: items || [],
        total,
        pay: pay || 'qpay',
        date: new Date().toISOString().slice(0, 10),
        delivery: delivery || undefined,
      },
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders (Admin)
router.get('/', auth, admin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status (Admin)
router.put('/:id/status', auth, admin, async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json(order);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Order not found' });
    res.status(400).json({ message: err.message });
  }
});

export default router;
