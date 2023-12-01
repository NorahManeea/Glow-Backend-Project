import express from 'express'
import { checkAuth, checkRole } from '../middlewares/verifyToken'
import { addDiscountCode, deleteDiscountCode, getDiscountCodes, getValidDiscountCodes, updateDiscountCode } from '../controllers/discountCodeController'

const router = express.Router()

router.get('/valid', getValidDiscountCodes)
router.post('/', checkAuth, checkRole('ADMIN'), addDiscountCode)
router.get('/', checkAuth, checkRole('ADMIN'), getDiscountCodes)
router.put('/:id', checkAuth,checkRole('ADMIN'), updateDiscountCode)
router.delete('/:id', checkAuth,checkRole('ADMIN'), deleteDiscountCode)

export default router
