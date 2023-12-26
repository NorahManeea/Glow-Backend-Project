import { Request, Response, NextFunction } from 'express'

import { DiscountCode } from '../models/discountCodeModel'
import {
  createNewDiscountCode,
  findACode,
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
export const addDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body
    const discountCode = new DiscountCode({
      code,
      discountPercentage,
      expirationDate,
    })
    const newDiscountCode = await createNewDiscountCode(discountCode)
    res
      .status(201)
      .json({ message: 'Discount code has been created successfully', payload: newDiscountCode })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Delete Discount Code
 * @route /api/discount-code/:discountCodeId
 * @method DELETE
 * @access private (Admin Only)
 -----------------------------------------------*/
export const deleteDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discounCode = await removeDiscountCode(req.params.discountCodeId)
    res
      .status(200)
      .json({ message: 'Discount code has been deleted successfully', paylod: discounCode })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Update Discount Code
 * @route /api/discount-code/:discountCodeId
 * @method PUT
 * @access private (Admin Only)
 -----------------------------------------------*/
export const updateDiscountCodeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discountCodeId = req.params.discountCodeId
    const updatedDiscountCode = await updateDiscountCode(discountCodeId, req.body)
    res.status(200).json({
      message: 'Discount code has been updated successfully',
      payload: updatedDiscountCode,
    })
  } catch (error) {
    next(error)
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
    const discountCode = await findAllDiscountCodes()
    res
      .status(200)
      .json({ message: 'Discount codes have been returned successfully', payload: discountCode })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Get Discount Codes
 * @route /api/discount-code/:discountCodeId
 * @method GET
 * @access private (Admin Only)
 -----------------------------------------------*/
export const getDiscountCodeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { discountCodeId } = req.params
    const discountCode = await findDiscountCode(discountCodeId)
    res
      .status(200)
      .json({ message: 'Discount code has been returned successfully', payload: discountCode })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Get Valid Codes
 * @route /api/discount-code/valid
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getValidDiscountCodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discountCode = await findValidDiscountCodes()
    res.status(200).json({
      message: 'Valid Discount codes have been returned successfully',
      payload: discountCode,
    })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Get Discount Code
 * @route /api/discount-code/:code
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.params.code;
    const discountCode = await findACode(code);
    
    res.status(200).json({
      message: 'Valid Discount code has been returned successfully',
      discountCode,
    });
  } catch (error) {
    next(error);
  }
};

