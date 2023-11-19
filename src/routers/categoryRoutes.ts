// src/routes/categoryRoutes.ts
import express, { Router } from 'express'
import { createCategory } from '../controllers/categoryController'

const router: Router = express.Router()

// Route for creating a category
router.post('/create-category', createCategory)

export default router
