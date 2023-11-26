import { Request } from 'express'
import multer from 'multer'

//interface MulterFile extends Express.Multer.File {}

//type MulterCallback<T> = (error: Error | null, result: T) => void;

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/products')
  },
  filename: function (req: Request, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

// const imageUpload = multer({
//   storage: productStorage,
//   fileFilter: function (req: Request, file: MulterFile, cb: MulterCallback<boolean>) {
//     if (file.mimetype.startsWith('image')) {
//       cb(null, true)
//     } else {
//       cb(new Error('Unsupported file format'), false)
//     }
//   },
//   limits: { fileSize: 1024 * 1024 }, // 1 megabyte
// })

export const upload = multer({ storage: productStorage })
