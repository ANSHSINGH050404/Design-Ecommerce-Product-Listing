import express from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from "./db";
import { authenticate, type AuthRequest } from "./auth.middleware";

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.post('/register', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }

    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(201).json({ message: 'User registered successfully', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post('/register-admin', async (req: Request, res: Response) => {
    const { name, email, password, adminSecret } = req.body;

    if (!name || !email || !password || !adminSecret) {
      return res.status(400).json({ message: 'name, email, password, and adminSecret are required' });
    }

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid admin secret' });
    }

    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "ADMIN" },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(201).json({ message: 'Admin registered successfully', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(200).json({ message: 'Login successful', token, user });
});

app.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});


app.post('/products', authenticate, async (req: AuthRequest, res: Response) => {
      const role = req.user?.role;
      if (role !== 'ADMIN') {
          return res.status(403).json({ message: 'Not allowed to add products' });
      }

      const { name, description, price } = req.body;
      if (!name || !description || !price) {
        return res.status(400).json({ message: 'name, description, and price are required' });
      }

      const product = await prisma.product.create({
        data: { name, description, price },
      });

      return res.status(201).json({ message: 'Product added successfully', product });
});

app.get('/products', async (req: Request, res: Response) => {
      const products = await prisma.product.findMany();
      res.json({ products });
});

app.get('/products/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json({ product });
});

app.put('/products/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const role = req.user?.role;
  if (role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not allowed to add or edit products' });
  }

  const { id } = req.params;
  const { name, description, price } = req.body;

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: { name, description, price },
  });

  res.json({ message: 'Product updated successfully', product });
});

app.delete('/products/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const role = req.user?.role;
  if (role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not allowed to delete products' });
  }

  const { id } = req.params;

  await prisma.product.delete({
    where: { id: Number(id) },
  });

  res.json({ message: 'Product deleted successfully' });
}); 


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
