import { PrismaClient, Book } from '@prisma/client';
import { Request, Response, Router } from 'express';
const multer = require('multer');
import path from 'path';
import { uploadBook } from './fileUpload';
import { ensureAuthenticated } from '../../middlewares/auth';
import { log } from 'console';

const booksRouter = Router();

const prisma = new PrismaClient();

const storageRAM = multer.memoryStorage();

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    console.log('enters this scope: destination');
    cb(null, './public/data/uploads/');
  },
  filename: function (req: any, file: any, cb: any) {
    console.log('enters this scope: filoename');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const uploadAlternate = multer({ storage: storageRAM });

booksRouter.use((req, res, next) => {
  console.log('Session Data:', req.session);
  console.log('Authenticated User:', req.user);
  next();
});

// get all books
booksRouter.get('/', async (req, res) => {
  const allBooks = prisma.book
    .findMany()
    .catch((error) => {
      // return res.status(500).json(TemplateJSONResponse.failure("Something went wrong"))
      return res.status(500).json({});
    })
    .finally(() => {
      prisma.$disconnect;
    });
  res.status(200).json({});
  // res.status(200).json(TemplateJSONResponse.success("", allBooks ))
});

// upload a book
booksRouter.post(
  '/upload',
  ensureAuthenticated,
  uploadAlternate.single('book'),
  async (req, res) => {
    console.log('recieved file is : ', req.file);

    if (!req.file) {
      res.status(406).json({ error: 'File not sent' });
    }

    // recieved file is :  {
    //   fieldname: 'book',
    //   originalname: '10813718_Amon-Cofie_Assign1.pdf',
    //   encoding: '7bit',
    //   mimetype: 'application/pdf',
    //   buffer: <Buffer 25 50 44 46 2d 31 2e 37 0a 0a 34 20 30 20 6f 62 6a 0a 28 49 64 65 6e 74 69 74 79 29 0a 65 6e 64 6f 62 6a 0a 35 20 30 20 6f 62 6a 0a 28 41 64 6f 62 65 ... 730263 more bytes>,
    //   size: 730313
    // }

    uploadBook({
      title: req.file?.originalname,
      authors: req.body?.authors,
      creatorId: req.user,
      blob: req.file?.buffer,
    });

    res.status(200).json(req.body);
  },
);

// get an individual book
booksRouter.get('/:id', ensureAuthenticated, (req: any, res: any) => {
  log(req.params);
  log('hello world');

  const requestedBook = prisma.book.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!requestedBook) {
    // return res.status(404).json(TemplateJSONResponse.failure("Book was not found"))
    return res.status(404).json({});
  }

  res.status(200).json({});
  // res.status(200).json(TemplateJSONResponse.success("Book found", requestedBook))
});

export default booksRouter;
