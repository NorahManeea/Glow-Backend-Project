import slugify from 'slugify'

import { Product } from '../models/productModel'
import { ProductDocument } from '../types/types'
import ApiError from '../errors/ApiError'

export const findAllProducts = async (
  pageNumber = 1,
  limit = 8,
  sortBy = '',
  searchText = '',
  category = ''
) => {
  const productCount = await Product.countDocuments()
  const totalPages = Math.ceil(productCount / limit)

  if (pageNumber > totalPages) {
    pageNumber = totalPages
  }
  const skip = (pageNumber - 1) * limit
  let sortQuery = {}

  if (sortBy === 'newest') {
    sortQuery = { createdAt: -1 }
  } else if (sortBy === 'lowestPrice') {
    sortQuery = { productPrice: 1 }
  } else if (sortBy === 'highestPrice') {
    sortQuery = { productPrice: -1 }
  }
  const products = await Product.find()
    .populate('category')
    .skip(skip)
    .limit(limit)
    .sort(sortQuery)
    .find(
      searchText
        ? {
            $or: [
              { productName: { $regex: searchText, $options: 'i' } },
              { productDescription: { $regex: searchText, $options: 'i' } },
            ],
          }
        : {}
    )
    .find(category ? { category: { $in: [category] } } : {})

  return { products, totalPages, currentPage: pageNumber }
}

export const findProduct = async (productId: string) => {
  const product = await Product.findById(productId)
  if (!product) {
    throw ApiError.notFound('Product not found with the entered ID')
  }
  return product
}

export const findHighestSoldProducts = async (limit = 8) => {
  const highestSoldProducts = await Product.find()
    .sort({ itemsSold: -1 })
    .limit(limit)
    .populate('category')

  return { highestSoldProducts }
}

export const removeProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id)
  if (!product) {
    throw ApiError.notFound('Product not found with the entered ID')
  }
  return product
}

export const updateProduct = async (
  productId: string,
  updatedProduct: ProductDocument,
  productImage: string | undefined
) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { ...updatedProduct, productImage: productImage },
    { new: true }
  )
  if (!product) {
    throw ApiError.notFound('Product not found with the entered ID')
  }
  return product
}

export const createNewProduct = async (newProduct: ProductDocument) => {
  const { productName } = newProduct
  const productExist = await Product.exists({ productName: productName })
  if (productExist) {
    throw ApiError.conflict(`Product already exists with this product name ${productName}`)
  }
  const product = await Product.create({
    ...newProduct,
    slug: slugify(productName),
  })
  return product
}
