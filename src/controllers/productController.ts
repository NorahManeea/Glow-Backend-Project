import { NextFunction, Request, Response } from 'express'

import {
  removeProduct,
  findAllProducts,
  updateProduct,
  createNewProduct,
  findProduct,
  findHighestSoldProducts,
  productCount,
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
    next(error)
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
    const product = await findProduct(req.params.productId)
    res.status(200).json({ message: 'Single product returned', payload: product })
  } catch (error) {
    next(error)
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
    const product = await removeProduct(req.params.productId)
    if (!product) {
      throw ApiError.notFound(`Product not found with ID: ${req.params.productId}`)
    }
    res.status(200).json({
      message: 'Product has been deleted successfully',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Create Product
 * @route /api/products
 * @method POST
 * @access private (admin Only)
 -----------------------------------------------*/
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, quantityInStock, categories, discount } =
      req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Image file not provided.' })
    }

    const product = new Product({
      name,
      description,
      price,
      image: req.file.originalname,
      quantityInStock,
      categories,
      discount,
    })

    const newProduct = await createNewProduct(product)
    res.status(201).json({ message: 'Product has been created successfully', payload: newProduct })
  } catch (error) {
    next(error)
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
    const updatedProduct = await updateProduct(
      req.params.productId,
      {
        ...req.body,
      },
      req.file?.path
    )
    res
      .status(200)
      .json({ message: 'Product has been updated successfully', payload: updatedProduct })
  } catch (error) {
    next(error)
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
    const highestSoldProducts = await findHighestSoldProducts()

    res.status(200).json({
      message: 'Highest Sold Products have been returned successfully',
      payload: highestSoldProducts,
    })
  } catch (error) {
    next(error)
  }
}

/** -----------------------------------------------
 * @desc Get Product Count
 * @route /api/products/count
 * @method GET
 * @access private
  -----------------------------------------------*/
export const getProductsCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productsCount = await productCount()
    res.status(200).json({ meassge: 'Products Count', payload: productsCount })
  } catch (error) {
    next(error)
  }
}
