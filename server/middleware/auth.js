import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ message: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
