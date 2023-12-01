import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import {
  createNewCategory,
  findAllCategories,
  findCategory,
  removeCategory,
  updateCategory,
} from '../services/categoryService'

/**-----------------------------------------------
 * @desc Create Category 
 * @route /api/categories/
 * @method POST
 * @access private (Admin Only)
 -----------------------------------------------*/
export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await createNewCategory(req.body)
    res.status(201).json({ meassge: 'Category has been created successfuly', payload: category })
  }
)
/**-----------------------------------------------
 * @desc Get All Categories
 * @route /api/categories/
 * @method GET
 * @access public 
 -----------------------------------------------*/
export const getAllCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let pageNumber = Number(req.query.pageNumber)
    const limit = Number(req.query.limit)
    const searchText = req.query.searchText?.toString()
    const { categories, totalPages, currentPage } = await findAllCategories(
      pageNumber,
      limit,
      searchText
    )
    res
      .status(200)
      .json({ message: 'All products returned', payload: categories, totalPages, currentPage })
  }
)

/**-----------------------------------------------
 * @desc Get Category by Id
 * @route /api/categories/:id
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getCategoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await findCategory(req.params.id)
    res.status(200).json({ message: 'Single category returned successfully', payload: categories })
  }
)

/**-----------------------------------------------
 * @desc Update Category 
 * @route /api/categories/:id
 * @method PUT
 * @access private (Admin Only)
 -----------------------------------------------*/
export const updateCategoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedCategory = await updateCategory(req.params.id, req.body)
    res
      .status(200)
      .json({ message: 'Category has been updated successfully', payload: updatedCategory })
  }
)

/**-----------------------------------------------
 * @desc Delete Category 
 * @route /api/categories/:id
 * @method DELETE
 * @access private (Admin Only)
 -----------------------------------------------*/
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await removeCategory(req.params.id)
    res.status(200).json({ meassge: 'Category has been deleted Successfully', result: category })
  }
)
