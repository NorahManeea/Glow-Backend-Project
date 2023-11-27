import slugify from 'slugify'
import { Request, Response } from 'express'

import {
  removeProduct,
  findAllProducts,
  updateProduct,
  createNewProduct,
  findProduct,
} from '../services/productService'
import { ProductDocument } from '../types/types'
import { Product } from '../models/productModel'

/**-----------------------------------------------
 * @desc Get All Products
 * @route /api/products
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getAllProducts = async (req: Request, res: Response) => {
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
    res.status(500).json({ error: error })
  }
}

/**-----------------------------------------------
 * @desc Get Product By ID
 * @route /api/products/:productId
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await findProduct(req.params.id)
    res.status(200).json({ message: 'Single product returned', payload: product })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

/**-----------------------------------------------
 * @desc Delete Product by ID
 * @route /api/products/:productId
 * @method DELETE
 * @access private (admin Only)
 -----------------------------------------------*/
export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const product = await removeProduct(req.params.id)
    res.status(200).json({
      message: 'Product has been deleted Successfully',
      payload: product,
    })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

/**-----------------------------------------------
 * @desc Create Product
 * @route /api/products
 * @method POST
 * @access private (admin Only)
 -----------------------------------------------*/
 export const createProduct = async (req: Request, res: Response) => {
  const { productName, productDescription, productPrice, quantityInStock, category } = req.body;
  console.log(JSON.stringify(req.body));

  try {
    const newProduct = new Product({
      productName: productName,
      productDescription: productDescription,
      productPrice: productPrice,
      productImage: req.file?.path,
      quantityInStock: quantityInStock,
      category: category,
      slug: slugify(productName)
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product has been created successfully', payload: newProduct });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

/**-----------------------------------------------
 * @desc Update Product
 * @route /api/products/:id
 * @method PUT
 * @access private (admin Only)
 -----------------------------------------------*/
export const updateProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id
    if (req.body.productName) {
      req.body.slug = slugify(req.body.productName)
    }
    const updatedProduct = await updateProduct(productId, req.body)
    res
      .status(200)
      .json({ message: 'Product has been updated successfully', payload: updatedProduct })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}
