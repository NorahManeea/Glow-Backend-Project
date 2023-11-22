import { Request, Response } from 'express'
import { Category } from '../models/categoryModel'
import ApiError from '../errors/ApiError'

/**-----------------------------------------------
 * @desc Create Category 
 * @route /api/categories/
 * @method POST
 * @access private (Admin Only)
 -----------------------------------------------*/
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body
    const category = await Category.create({
      categoryName: categoryName,
    })
    await category.save()
    res.status(201).json(category)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}
/**-----------------------------------------------
 * @desc Get All Categories
 * @route /api/categories/
 * @method GET
 * @access public 
 -----------------------------------------------*/
export const getAllCategory = async (req: Request, res: Response) => {
  const categories = await Category.find()
  res.status(200).json(categories)
}
/**-----------------------------------------------
 * @desc Get Category by Id
 * @route /api/categories/:id
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getCategoryById = async (req: Request, res: Response) => {
  const categoryId = req.params.id
  const category = await Category.findById(categoryId)
  res.status(200).json(category)
}
/**-----------------------------------------------
 * @desc Update Category 
 * @route /api/categories/:id
 * @method PUT
 * @access private (Admin Only)
 -----------------------------------------------*/
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const newCategoryName = req.body.categoryName
    const categoryId = await Category.findById(req.params.id)
    if (!categoryId) {
      res.status(404).json({ message: 'Category Not Found' })
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        $set: {
          categoryName: newCategoryName,
        },
      },
      { new: true }
    )
    res.status(200).json(updatedCategory)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
/**-----------------------------------------------
 * @desc Delete Category 
 * @route /api/categories/:id
 * @method DELETE
 * @access private (Admin Only)
 -----------------------------------------------*/
export const deleteCategory = async (req: Request, res: Response) => {
  const categoryId = await Category.findById(req.params.id)
  try {
    if (!categoryId) {
      return res.status(404).json({ message: 'Category not found' })
    }
    await Category.deleteOne({
      _id: categoryId,
    })
    res.status(200).json({ meassge: 'Category deleted successfuly', result: categoryId })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}
