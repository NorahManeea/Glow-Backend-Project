import slugify from 'slugify'
import { Request, Response } from 'express'
import {
  removeProduct,
  getProducts,
  updateProduct,
  createNewProduct,
  findProduct,
} from '../services/productService'

/**-----------------------------------------------
 * @desc Get All Products
 * @route /api/products
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // const { lowestPrice, highestPrice, newest, searchText, categoryId } = req.query
    let pageNumber = Number(req.query.pageNumber)
    const limit = Number(req.query.limit)
    const { products, totalPages, currentPage } = await getProducts(pageNumber, limit)
    res
      .status(200)
      .json({ message: 'All products returned', payload: products, totalPages, currentPage })
  } catch (error) {
    res.status(500).json({ message: error })
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
    res.status(500).json({ message: error })
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
    res.status(500).json({ message: error })
  }
}

/**-----------------------------------------------
 * @desc Create Product
 * @route /api/products
 * @method POST
 * @access private (admin Only)
 -----------------------------------------------*/
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await createNewProduct(req.body)
    res.status(201).json({ meassge: 'Product created successfuly', payload: product })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

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
    res.status(200).json({ message: 'Product updated successfully', payload: updatedProduct })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}
