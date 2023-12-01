import { Request, Response, NextFunction } from 'express'
import { DiscountCode } from '../models/discountCodeModel'
import asyncHandler from 'express-async-handler'
import {
  createNewDiscountCode,
  findAllDiscountCodes,
  findDiscountCode,
  findValidDiscountCodes,
  removeDiscountCode,
  updateDiscountCode,
} from '../services/discounCodeService'

/**-----------------------------------------------
 * @desc Add Discount Code
 * @route /api/discount-code
 * @method POST
 * @access private (Admin Only)
 -----------------------------------------------*/
export const addDiscountCode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, discountPercentage, discountAmount, expirationDate } = req.body
    const discountCode = new DiscountCode({
      code,
      discountPercentage,
      discountAmount,
      expirationDate,
    })
    const newDiscountCode = await createNewDiscountCode(discountCode)
    res
      .status(201)
      .json({ message: 'Discount code has been created successfully', payload: newDiscountCode })
  }
)

/**-----------------------------------------------
 * @desc Delete Discount Code
 * @route /api/discount-code/:id
 * @method DELETE
 * @access private (Admin Only)
 -----------------------------------------------*/
export const deleteDiscountCode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const discounCode = await removeDiscountCode(req.params.id)
    res
      .status(200)
      .json({ message: 'Discount code has been deleted successfully', paylod: discounCode })
  }
)

/**-----------------------------------------------
 * @desc Update Discount Code
 * @route /api/discount-code/:id
 * @method PUT
 * @access private (Admin Only)
 -----------------------------------------------*/
export const updateDiscountCodeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const discountCodeId = req.params.id
    const updatedDiscountCode = await updateDiscountCode(discountCodeId, req.body)
    res.status(200).json({ message: 'Discount code has been updated successfully', payload: updatedDiscountCode })
  }
)

/**-----------------------------------------------
 * @desc Get Discount Codes
 * @route /api/discount-code/
 * @method GET
 * @access private (Admin Only)
 -----------------------------------------------*/
export const getDiscountCodes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const discountCode = await findAllDiscountCodes()
    res
      .status(200)
      .json({ message: 'Discount codes have been returned successfully', payload: discountCode })
  }
)

/**-----------------------------------------------
 * @desc Get Discount Codes
 * @route /api/discount-code/:id
 * @method GET
 * @access private (Admin Only)
 -----------------------------------------------*/
export const getDiscountCodeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { discountCodeId } = req.params
    const discountCode = await findDiscountCode(discountCodeId)
    res
      .status(200)
      .json({ message: 'Discount code has been returned successfully', payload: discountCode })
  }
)

/**-----------------------------------------------
 * @desc Get Valid Codes
 * @route /api/discount-code/valid
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getValidDiscountCodes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const discountCode = await findValidDiscountCodes()
    res.status(200).json({
      message: 'Valid Discount codes have been returned successfully',
      payload: discountCode,
    })
  }
)
