import { Request, Response } from 'express'
import { Product } from '../models/productModel'

/**-----------------------------------------------
 * @desc Get All Products
 * @route /api/products
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getAllProducts = async (req: Request, res: Response) => {
  const productPerPage: number = 8
  const { pageNumber, lowestPrice, highestPrice, newest } = req.query
  let products

  if (pageNumber) {
    const pageNum: number = +pageNumber
    products = await Product.find()
      .skip((pageNum - 1) * productPerPage)
      .limit(productPerPage)
      .sort({ createdAt: -1 })
  } else if (highestPrice) {
    products = await Product.find().sort({ price: -1 })
  } else if (lowestPrice) {
    products = await Product.find().sort({ price: 1 })
  } else if (newest) {
    products = await Product.find().sort({ createdAt: -1 })
  } else {
    products = await Product.find().sort({ createdAt: -1 })
  }
  res.status(200).json(products)
}

/**-----------------------------------------------
 * @desc Get Product By ID
 * @route /api/products/:id
 * @method GET
 * @access public
 -----------------------------------------------*/
export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(404).json({ message: 'product not found' })
  }
  res.status(200).json({ product })
}

/**-----------------------------------------------
 * @desc Delete Product by ID
 * @route /api/products/:id
 * @method DELETE
 * @access private (admin Only)
 -----------------------------------------------*/
export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  await Product.findByIdAndDelete(req.params.id)

  res.status(200).json({
    message: 'Product has been deleted Successfully',
    productID: product._id,
  })
}

export const createProduct = async (req: Request, res: Response) => {
  console.log("hi")
  try {
    const { productName, productDescription, productImage, quantityInStock, productPrice, category, variants, sizes } = req.body
    const product = await Product.create({
      productName: productName,
      productDescription: productDescription,
      productImage: productImage,
      quantityInStock: quantityInStock,
      productPrice: productPrice,
      category: category,
      variants: variants,
      sizes: sizes,
    })
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}
