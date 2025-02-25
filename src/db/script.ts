import { PrismaClient, Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();




export const findUser = async (options: { username: any; email: any }) => {
  const { username, email } = options;
  const user = await prisma.user
    .findUnique({
      where: {
        OR: [{ email: email }],
        username: username,
      },
    })
    .catch((error) => {
      console.log('Error getting user', error);
    })
    .finally(() => {
      prisma.$disconnect();
    });

  return user;
};

export const createUer = async (options: {
  username: string;
  email: string;
  password: string;
  name: string;
  isAdmin?: boolean;
  role?: Role;
}) => {
  const newUser = await prisma.user
    .create({
      data: {
        name: options.name ?? 'no name',
        password: options.password,
        username: options.username,
        email: options.email,
        isAdmin: options.isAdmin,
        role: options.role,
      },
    })
    .then((user) => {
      console.log('user created successfully!', user);
    })
    .catch((error) => {
      console.log('Error creating user', error);
    })
    .finally(() => {
      prisma.$disconnect();
    });

  return newUser;
};
