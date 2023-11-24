import { NextFunction, Request, Response } from 'express'
import zod, { ZodError } from 'zod'
import ApiError from '../errors/ApiError'


const productSchema = zod.object({
  product: zod.string(), 
  quantityInStock: zod
  .number()
  .nonnegative({ message: 'Quantity in stock must be nonnegative number' }),
});
export function validateOrder(req: Request, res: Response, next: NextFunction) {
const orderSchema = zod.object({
  user: zod.string(), 
  orderDate: zod.date().default(() => new Date()),
  products: zod.array(productSchema),
  shippingInfo: zod.object({
    country: zod.string().nonempty(),
    city: zod.string().nonempty(),
    address: zod.string().nonempty(),
  }),
  orderStatus: zod.enum(['PENDING', 'PROCESSING', 'SHIPPED']), 
});

try {
    orderSchema.parse(req.body)
    next()
  } catch (error) {
    const err = error
    if (err instanceof ZodError) {
      next(ApiError.badRequestValidation(err.errors))
      return
    }

    next(ApiError.internal('Something went wrong'))
  }}