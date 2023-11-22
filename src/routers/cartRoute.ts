import express from 'express'
import { addToCart, updateCartItems, getCartItems , deleteCartItem} from '../controllers/cartController';

const router = express.Router()


router.post("/", addToCart )
router.put("/:id", updateCartItems)
router.get("/:id", getCartItems)
router.delete("/:id", deleteCartItem)



export default router;