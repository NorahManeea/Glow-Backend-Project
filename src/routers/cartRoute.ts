import express from 'express'
import { addToCart, updateCartItems, getCartItems , deleteCartItem} from '../controllers/cartController';

const router = express.Router()

router.route("/").post(addToCart)
router.route("/:id").get(getCartItems).put(updateCartItems).delete(deleteCartItem)


export default router;