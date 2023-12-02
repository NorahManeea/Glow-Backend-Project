import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/products')
  },
  filename: function (req: Request, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  try {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      throw new Error('Unsupported file format')
    }
  } catch (error) {}
}
export const uploadImage = multer({ storage: productStorage, fileFilter })
