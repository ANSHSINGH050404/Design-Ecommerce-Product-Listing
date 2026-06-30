import express from 'express';
import type{ Request, Response } from 'express';
import {prisma} from "./db";
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
      where: {
        email: email,
      },
    });

    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    res.status(201).json({ message: 'User registered successfully', user });
}); 

app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // In a real application, you would compare the provided password with the hashed password stored in the database
    // For this example, we'll assume the passwords match

    res.status(200).json({ message: 'Login successful', user });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


