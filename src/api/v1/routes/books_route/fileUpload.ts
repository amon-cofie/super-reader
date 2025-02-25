import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient
export const uploadBook = async (bookDetails: any) => {
    const {title , authors, creatorId, blob} = bookDetails;
    const newBook = prisma.book.create({
        data: {
            title: title,
            authors: authors,
            creatorId: creatorId,
            bookBlob: blob
        }
    })

}

