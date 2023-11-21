import express from 'express'
import { addToCart, updateCartItems, getCartItems } from '../controllers/cartController';

const router = express.Router()

router.route("/").post(addToCart)
router.route("/:id").get(getCartItems).put(updateCartItems)




export default router;