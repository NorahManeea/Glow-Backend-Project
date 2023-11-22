import { Request, Response } from 'express'
import { Category } from '../models/categoryModel'
import ApiError from '../errors/ApiError'


/**-----------------------------------------------
 * @desc Create Category 
 * @route /api/categories/
 * @method POST
 * @access private (Admin Only)
 -----------------------------------------------*/
export const createCategory = async (
  req: Request,
  res: Response,
  next: (arg0: ApiError) => void
) => {
  const name = req.body.name

  if (!name) {
    next(ApiError.badRequest('Name is requried'))
    return
  }

  const category = new Category({
    name,
  })

  await category.save()

  res.status(201).json({
    category,
  })
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
  const categoryId = req.params.categoryId
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
  const newName = req.body.name
  const categoryId = req.params.categoryId
  const newCat = await Category.findByIdAndUpdate(
    categoryId,
    { name: newName },
    {
      new: true,
    }
  )
  res.json({
    category: newCat,
  })
}
/**-----------------------------------------------
 * @desc Delete Category 
 * @route /api/categories/:id
 * @method DELETE
 * @access private (Admin Only)
 -----------------------------------------------*/
export const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params
  await Category.deleteOne({
    _id: categoryId,
  })
  res.status(204).send()
}
