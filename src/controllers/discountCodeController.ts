import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import { DiscountCode } from '../models/discountCodeModel'

/**-----------------------------------------------
 * @desc Add Discount Code
 * @route /api/discount-code
 * @method POST
 * @access private (Admin Only)
 -----------------------------------------------*/
export const addDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, discountPercentage, discountAmount, expirationDate } = req.body

    const discountCode = new DiscountCode({
      code,
      discountPercentage,
      discountAmount,
      expirationDate,
    })
    await discountCode.save()
    res
      .status(201)
      .json({ message: 'Discount code has been created successfully', payload: discountCode })
  } catch (error) {
    console.log(error)
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Delete Discount Code
 * @route /api/discount-code/:id
 * @method DELETE
 * @access private (Admin Only)
 -----------------------------------------------*/
export const deleteDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discountCodeId = req.params.id

    await DiscountCode.findByIdAndDelete(discountCodeId)

    res.status(200).json({ message: 'Discount code has been deleted successfully' })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Update Discount Code
 * @route /api/discount-code/:id
 * @method PUT
 * @access private (Admin Only)
 -----------------------------------------------*/
export const updateDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discountCodeId = req.params.id
    const { code, discountPercentage, discountAmount, expirationDate } = req.body

    const updatedDiscountCode = await DiscountCode.findByIdAndUpdate(
      discountCodeId,
      { code, discountPercentage, discountAmount, expirationDate },
      { new: true }
    )

    if (!updatedDiscountCode) {
      return next(ApiError.notFound('Discount code not found'))
    }

    res.status(200).json({ message: 'Discount code has been updated successfully' })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Get Discount Codes
 * @route /api/discount-code/
 * @method GET
 * @access private (Admin Only)
 -----------------------------------------------*/
export const getDiscountCodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discountCode = await DiscountCode.find()
    res
      .status(200)
      .json({ message: 'Discount codes have been returned successfully', payload: discountCode })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}
