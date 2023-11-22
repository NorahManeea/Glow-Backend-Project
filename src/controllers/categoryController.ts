import { Request, Response } from 'express'
import { Category } from '../models/categoryModel'
import ApiError from '../errors/ApiError'

export const createCategory = async (req: Request, res: Response, next: (arg0: ApiError) => void) => {
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

  export const getAllCategory = async (req: Request, res: Response) => {
    const categories = await Category.find()
  
    res.status(200).json(categories)
  }


  export const getCategoryById = async (req: Request, res: Response) => {
    const categoryId = req.params.categoryId
    const category = await Category.findById(categoryId)
  
    res.status(200).json(category)
  }

  export const updateCategory =  async (req: Request, res: Response) => {
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

export const deleteCategory =  async (req: Request, res: Response) => {
    const { categoryId } = req.params
  
    await Category.deleteOne({
      _id: categoryId,
    })
  
    res.status(204).send()
  }
