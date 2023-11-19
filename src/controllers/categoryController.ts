// src/controllers/categoryController.ts
import { Request, Response } from 'express'
import Category from '../models/category'

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body

    // Validate that the 'name' field is present in the request body
    if (!name) {
      res.status(400).json({ error: 'Name is required for a category' })
      return
    }

    // Create a new category
    const newCategory = new Category({ name })
    await newCategory.save()

    // Send a success response
    res.status(201).json({ message: 'Category created successfully', category: newCategory })
  } catch (error) {
    // Handle any errors that occur during the category creation process
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
