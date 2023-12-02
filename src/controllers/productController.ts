import { NextFunction, Request, Response } from 'express'

import {
  removeProduct,
  findAllProducts,
  updateProduct,
  createNewProduct,
  findProduct,
  findHighestSoldProducts,
} from '../services/productService'
import { Product } from '../models/productModel'
import ApiError from '../errors/ApiError'

/**-----------------------------------------------
 * @desc Get All Products
 * @route /api/products
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let pageNumber = Number(req.query.pageNumber)
    const limit = Number(req.query.limit)
    const sortBy = req.query.sortBy?.toString()
    const searchText = req.query.searchText?.toString()
    const category = req.query.category?.toString()
    const { products, totalPages, currentPage } = await findAllProducts(
      pageNumber,
      limit,
      sortBy,
      searchText,
      category
    )
    res
      .status(200)
      .json({ message: 'All products returned', payload: products, totalPages, currentPage })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Get Product By ID
 * @route /api/products/:productId
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await findProduct(req.params.id)
    res.status(200).json({ message: 'Single product returned', payload: product })
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error)
    }
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Delete Product by ID
 * @route /api/products/:productId
 * @method DELETE
 * @access private (admin Only)
 -----------------------------------------------*/
export const deleteProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id

    const product = await removeProduct(productId)
    if (!product) {
      throw ApiError.notFound('Product not found with the entered ID')
    }

    res.status(200).json({
      message: 'Product has been deleted successfully',
      payload: product,
    })
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error)
    }
    next(ApiError.internal('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Create Product
 * @route /api/products
 * @method POST
 * @access private (admin Only)
 -----------------------------------------------*/
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const {
    productName,
    productDescription,
    productPrice,
    quantityInStock,
    category,
    discount,
    sizes,
    variants,
  } = req.body

  try {
    const product = new Product({
      productName,
      productDescription,
      productPrice,
      productImage: req.file?.path,
      quantityInStock,
      category,
      discount,
      sizes,
      variants,
    })

    const newProduct = await createNewProduct(product)
    res.status(201).json({ message: 'Product has been created successfully', payload: newProduct })
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error)
    }
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Update Product
 * @route /api/products/:id
 * @method PUT
 * @access private (admin Only)
 -----------------------------------------------*/
export const updateProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id
    const updatedProduct = await updateProduct(productId, req.body, req.file?.path)
    res
      .status(200)
      .json({ message: 'Product has been updated successfully', payload: updatedProduct })
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error)
    }
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Get HighestSold Product
 * @route /api/products/highest-sold
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getHighestSoldProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Number(req.query.limit)
    const highestSoldProducts = await findHighestSoldProducts(limit)
    res.status(200).json({
      message: 'Highest Sold Products have been returned successfully',
      payload: highestSoldProducts,
    })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}
